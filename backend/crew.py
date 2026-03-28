"""
Main entry point for the daily Business Funding Climate Score pipeline.
Run: python crew.py

Pipeline:
  1. Fetch FRED indicators (fred.py)
  2. Calculate score (scoring.py)
  3. Generate reasoning bullets + blog post (CrewAI + Groq)
  4. Polish blog post through Chief Editor agent (CrewAI + Groq)
  5. Upsert results to Supabase (daily_scores + blog_posts tables)

Exits with code 1 on full failure (triggers GitHub Actions failure notification).
"""

import json
import os
import re
import sys
import time
from datetime import datetime, timezone
from typing import Any, Callable, TypeVar

_T = TypeVar("_T")

from json_repair import repair_json

from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

from fred import fetch_all_indicators
from scoring import calculate_score
from tasks import build_tasks, get_todays_category

from crewai import Crew, Process
from agents import data_fetcher_agent, economist_agent, writer_agent, editor_agent
from digest import send_daily_digest


def _truncate_meta(text: str, max_len: int = 150) -> str:
    """Truncate meta description at a natural boundary — never mid-clause."""
    text = text.strip()
    if len(text) <= max_len:
        # Still ensure it ends on a complete sentence if possible
        for punct in (".", "!", "?"):
            if text.endswith(punct):
                return text
        # Ends mid-clause even within limit — find last sentence end
        for punct in (". ", "! ", "? "):
            idx = text.rfind(punct)
            if idx > 60:
                return text[: idx + 1]
        return text

    candidate = text[:max_len]
    # 1. Prefer full sentence boundary
    for punct in (". ", "! ", "? "):
        idx = candidate.rfind(punct)
        if idx > 60:
            return candidate[: idx + 1]
    # 2. Fall back to last comma (still a natural pause)
    idx = candidate.rfind(", ")
    if idx > 80:
        return candidate[:idx] + "."
    # 3. Last resort: word boundary at 130 chars (conservative)
    short = text[:130]
    idx = short.rfind(" ")
    return short[:idx] + "." if idx > 60 else short


def _retry(fn: Callable[[], _T], *, attempts: int, delays: list[int], label: str) -> _T:
    """
    Call fn() up to `attempts` times with progressive delays between failures.

    delays: seconds to wait before each subsequent attempt (len == attempts - 1).
            The last delay is reused if fewer delays are provided than needed.

    Raises the last exception if every attempt fails.
    """
    last_exc: Exception | None = None
    for i in range(attempts):
        try:
            return fn()
        except Exception as exc:
            last_exc = exc
            if i < attempts - 1:
                wait = delays[min(i, len(delays) - 1)]
                print(
                    f"[retry] {label} — attempt {i + 1}/{attempts} failed: {exc}. "
                    f"Retrying in {wait}s...",
                    file=sys.stderr,
                )
                time.sleep(wait)
    raise last_exc  # type: ignore[misc]


def _parse_json_output(raw: str) -> dict | list:
    """Extract and repair JSON from CrewAI output which may include surrounding text."""
    raw = raw.strip()
    # Strip markdown code fences if present
    if raw.startswith("```"):
        raw = raw.split("```", 2)[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()
    # Find first { or [
    start = min(
        (raw.find("{") if "{" in raw else len(raw)),
        (raw.find("[") if "[" in raw else len(raw)),
    )
    if raw.find("{") != -1 and (raw.find("[") == -1 or raw.find("{") <= raw.find("[")):
        end = raw.rfind("}") + 1
    else:
        end = raw.rfind("]") + 1
    candidate = raw[start:end] if start < end else raw
    # Use json_repair to handle control characters and minor malformations
    return json.loads(repair_json(candidate))


def run() -> int:
    """Execute the full pipeline. Returns 0 on success, 1 on failure."""
    today = datetime.now(timezone.utc).date().isoformat()
    print(f"[crew] Starting pipeline for {today}")

    # Step 1: Fetch FRED indicators — 3 attempts, 10s / 30s gaps
    # FRED is a public government API; occasional 503s or slow responses are the typical failure.
    try:
        indicators = _retry(
            fetch_all_indicators,
            attempts=3,
            delays=[10, 30],
            label="FRED fetch",
        )
        print(f"[crew] FRED indicators fetched: dprime={indicators['dprime']}, "
              f"t10y2y={indicators['t10y2y']}, icsa={indicators['icsa']}")
    except Exception as exc:
        print(f"[crew] FATAL: Could not fetch FRED indicators after 3 attempts: {exc}", file=sys.stderr)
        return 1

    # Step 2: Calculate score (pure function — no LLM needed)
    try:
        score_result = calculate_score(indicators)
        print(f"[crew] Score calculated: {score_result['health_score']} "
              f"({score_result['status_label']})")
    except Exception as exc:
        print(f"[crew] FATAL: Score calculation failed: {exc}", file=sys.stderr)
        return 1

    indicators_json = json.dumps(indicators, indent=2)
    score_json = json.dumps(score_result, indent=2)

    # Step 3: Run CrewAI for reasoning bullets + blog post
    # 3 attempts with 60s / 120s gaps — Groq free-tier rate limits reset in ~60s windows.
    # Each retry builds a completely fresh Crew + Task objects so no stale state is carried over.
    try:
        _crew_result: dict[str, Any] = {}

        def _kickoff_crew() -> None:
            ft, et, wt, edt = build_tasks(indicators_json, score_json)
            c = Crew(
                agents=[data_fetcher_agent, economist_agent, writer_agent, editor_agent],
                tasks=[ft, et, wt, edt],
                process=Process.sequential,
                verbose=False,
            )
            _crew_result["output"] = c.kickoff()
            _crew_result["tasks"] = (ft, et, wt, edt)

        _retry(_kickoff_crew, attempts=3, delays=[60, 120], label="CrewAI/Groq kickoff")

        result = _crew_result["output"]
        fetch_task, economist_task, writer_task, editor_task = _crew_result["tasks"]

        # In CrewAI 1.x, task outputs are in result.tasks_output list
        tasks_output = getattr(result, "tasks_output", [])
        economist_output = tasks_output[1].raw if len(tasks_output) > 1 else ""
        writer_output = tasks_output[2].raw if len(tasks_output) > 2 else ""
        editor_output = tasks_output[3].raw if len(tasks_output) > 3 else ""

        # Fallback: try direct task.output attribute (older CrewAI compat)
        if not economist_output:
            economist_output = getattr(getattr(economist_task, "output", None), "raw", "") or ""
        if not writer_output:
            writer_output = getattr(getattr(writer_task, "output", None), "raw", "") or ""
        if not editor_output:
            editor_output = getattr(getattr(editor_task, "output", None), "raw", "") or ""

        print(f"[crew] Economist output preview: {economist_output[:120]}")
        print(f"[crew] Writer output preview: {writer_output[:120]}")
        print(f"[crew] Editor output preview: {editor_output[:120]}")

        # Parse reasoning bullets from economist task output
        try:
            reasoning = _parse_json_output(economist_output)
            if not isinstance(reasoning, list):
                reasoning = [str(reasoning)]
            reasoning = reasoning[:6]
            while len(reasoning) < 6:
                reasoning.append("Economic conditions are being monitored.")
        except Exception:
            reasoning = [
                f"Prime rate stands at {indicators['dprime']}%, affecting small business borrowing costs.",
                f"Treasury yield spread at {indicators['t10y2y']}% signals credit market conditions.",
                f"Weekly jobless claims at {int(indicators['icsa']):,} reflect labour market health.",
                f"C&I tightening for large firms at {indicators['drtscilm']}% tightens overall credit supply.",
                f"C&I tightening for small firms at {indicators['drtscis']}% directly constrains small business lending.",
                f"Business applications at {int(indicators['busappwnsaus']):,} indicate entrepreneur activity levels.",
            ]

        # Parse blog post from editor output (preferred), fall back to writer output
        post_data = None
        if editor_output:
            try:
                post_data = _parse_json_output(editor_output)
                print("[crew] Using editor-polished blog post.")
            except Exception as exc:
                print(f"[crew] WARNING: Could not parse editor output: {exc}", file=sys.stderr)
        if post_data is None and writer_output:
            try:
                post_data = _parse_json_output(writer_output)
                print("[crew] Fallback: using raw writer output (editor parse failed).")
            except Exception as exc:
                print(f"[crew] WARNING: Could not parse writer output either: {exc}", file=sys.stderr)

    except Exception as exc:
        print(f"[crew] CrewAI pipeline error: {exc}", file=sys.stderr)
        # Continue — score can be saved without the blog post
        reasoning = [
            f"Prime rate stands at {indicators['dprime']}%, affecting small business borrowing costs.",
            f"Treasury yield spread at {indicators['t10y2y']}% signals credit market conditions.",
            f"Weekly jobless claims at {int(indicators['icsa']):,} reflect labour market health.",
            f"C&I tightening for large firms at {indicators['drtscilm']}% tightens overall credit supply.",
            f"C&I tightening for small firms at {indicators['drtscis']}% directly constrains small business lending.",
            f"Business applications at {int(indicators['busappwnsaus']):,} indicate entrepreneur activity levels.",
        ]
        post_data = None

    # Step 3a: Strip AI-generated word count line before saving (safety net)
    if post_data:
        raw_content = post_data.get("content", "")
        post_data["content"] = re.sub(
            r"\n*[Tt]he word count for this content is \d[\d,]* words\.?\s*$",
            "",
            raw_content,
        ).rstrip()

    # Step 4: Upsert to Supabase
    supabase = create_client(
        os.environ["SUPABASE_URL"],
        os.environ["SUPABASE_SERVICE_KEY"],
    )

    score_saved = False
    try:
        now_iso = datetime.now(timezone.utc).isoformat()
        score_row = {
            "date": today,
            "health_score": score_result["health_score"],
            "status_label": score_result["status_label"],
            "reasoning": reasoning,
            "dprime": indicators["dprime"],
            "drtscilm": indicators["drtscilm"],
            "drtscis": indicators["drtscis"],
            "t10y2y": indicators["t10y2y"],
            "icsa": int(indicators["icsa"]),
            "busappwnsaus": int(indicators["busappwnsaus"]),
            "busapp_trending_up": indicators.get("busapp_trending_up", False),
            # Optional context indicators — None if FRED fetch failed
            "cpi_yoy": indicators.get("cpi_yoy"),
            "nfib_optimism": indicators.get("nfib_optimism"),
            "updated_at": now_iso,
        }
        _retry(
            lambda: supabase.table("daily_scores").upsert(score_row, on_conflict="date").execute(),
            attempts=3,
            delays=[5, 15],
            label="Supabase score upsert",
        )
        print(f"[crew] Score upserted to daily_scores for {today}")
        score_saved = True
    except Exception as exc:
        print(f"[crew] ERROR: Failed to save score after 3 attempts: {exc}", file=sys.stderr)

    post_saved = False
    if post_data and score_saved:
        try:
            # Fetch the score record id
            score_resp = _retry(
                lambda: supabase.table("daily_scores").select("id").eq("date", today).single().execute(),
                attempts=3,
                delays=[5, 15],
                label="Supabase score id fetch",
            )
            score_id = score_resp.data["id"]

            now_iso = datetime.now(timezone.utc).isoformat()
            raw_slug = post_data.get("slug", "")
            # Sanitize AI-generated slug: lowercase, hyphens only, max 60 chars base
            sanitized_slug = re.sub(r"[^a-z0-9-]", "", raw_slug.lower().replace(" ", "-"))
            sanitized_slug = re.sub(r"-{2,}", "-", sanitized_slug).strip("-")[:60]
            if not sanitized_slug:
                title = post_data.get("title", "")
                sanitized_slug = re.sub(r"[^a-z0-9-]", "", title.lower().replace(" ", "-"))
                sanitized_slug = re.sub(r"-{2,}", "-", sanitized_slug).strip("-")[:60]
            if not sanitized_slug:
                sanitized_slug = f"{get_todays_category().lower().replace(' ', '-')}-funding-conditions"
            # Append date to guarantee uniqueness across repeated category cycles
            today_compact = today.replace("-", "")
            sanitized_slug = f"{sanitized_slug}-{today_compact}"
            post_row = {
                "date": today,
                "title": post_data.get("title", f"Business Funding Climate: {today}"),
                "slug": sanitized_slug,
                "content": post_data.get("content", ""),
                "meta_description": _truncate_meta(post_data.get("meta_description", "")),
                "category": get_todays_category(),
                "score_id": score_id,
                "updated_at": now_iso,
            }
            _retry(
                lambda: supabase.table("blog_posts").upsert(post_row, on_conflict="date").execute(),
                attempts=3,
                delays=[5, 15],
                label="Supabase blog post upsert",
            )
            print(f"[crew] Blog post upserted to blog_posts for {today}")
            post_saved = True
        except Exception as exc:
            print(f"[crew] ERROR: Failed to save blog post after 3 attempts: {exc}", file=sys.stderr)

    # Determine exit code
    if not score_saved:
        print("[crew] FULL FAILURE: Score not saved. Exiting with code 1.", file=sys.stderr)
        return 1

    if not post_saved:
        print("[crew] PARTIAL SUCCESS: Score saved, blog post failed. Logged above.")

    print(f"[crew] Pipeline complete. Score={score_result['health_score']} "
          f"({score_result['status_label']}), BlogPost={'saved' if post_saved else 'failed'}")

    # Step 5: Send daily email digest to subscribers (non-fatal)
    if score_saved:
        try:
            subs_resp = _retry(
                lambda: supabase.table("subscribers")
                    .select("email, unsubscribe_token")
                    .eq("confirmed", True)
                    .execute(),
                attempts=2,
                delays=[5],
                label="Supabase subscribers fetch",
            )
            subscribers = subs_resp.data or []
            site_url = os.environ.get("SITE_URL", "https://yourdomain.com")
            post_title = post_data.get("title", "Today's Funding Analysis") if post_data else "Today's Funding Analysis"
            post_url = f"{site_url}/blog/{post_data.get('slug', '')}" if post_data else site_url
            send_daily_digest(
                score=score_result["health_score"],
                label=score_result["status_label"],
                reasoning=reasoning,
                post_title=post_title,
                post_url=post_url,
                cpi_yoy=indicators.get("cpi_yoy"),
                nfib_optimism=indicators.get("nfib_optimism"),
                site_url=site_url,
                subscribers=subscribers,
            )
        except Exception as exc:
            print(f"[crew] Email digest failed (non-fatal): {exc}", file=sys.stderr)

    return 0


if __name__ == "__main__":
    sys.exit(run())
