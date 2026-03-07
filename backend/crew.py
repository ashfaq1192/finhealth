"""
Main entry point for the daily Business Funding Climate Score pipeline.
Run: python crew.py

Pipeline:
  1. Fetch FRED indicators (fred.py)
  2. Calculate score (scoring.py)
  3. Generate reasoning bullets + blog post (CrewAI + Groq)
  4. Upsert results to Supabase (daily_scores + blog_posts tables)

Exits with code 1 on full failure (triggers GitHub Actions failure notification).
"""

import json
import os
import sys
from datetime import datetime, timezone

from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

from fred import fetch_all_indicators
from scoring import calculate_score
from tasks import build_tasks, get_todays_category

from crewai import Crew, Process
from agents import data_fetcher_agent, economist_agent, writer_agent


def _parse_json_output(raw: str) -> dict | list:
    """Extract JSON from CrewAI output which may include surrounding text."""
    raw = raw.strip()
    # Find first { or [ and last } or ]
    start = min(
        (raw.find("{") if "{" in raw else len(raw)),
        (raw.find("[") if "[" in raw else len(raw)),
    )
    if raw.find("{") != -1 and (raw.find("[") == -1 or raw.find("{") <= raw.find("[")):
        end = raw.rfind("}") + 1
    else:
        end = raw.rfind("]") + 1
    if start < end:
        return json.loads(raw[start:end])
    return json.loads(raw)


def run() -> int:
    """Execute the full pipeline. Returns 0 on success, 1 on failure."""
    today = datetime.now(timezone.utc).date().isoformat()
    print(f"[crew] Starting pipeline for {today}")

    # Step 1: Fetch FRED indicators
    try:
        indicators = fetch_all_indicators()
        print(f"[crew] FRED indicators fetched: dprime={indicators['dprime']}, "
              f"t10y2y={indicators['t10y2y']}, icsa={indicators['icsa']}")
    except Exception as exc:
        print(f"[crew] FATAL: Could not fetch FRED indicators: {exc}", file=sys.stderr)
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
    try:
        fetch_task, economist_task, writer_task = build_tasks(indicators_json, score_json)

        crew = Crew(
            agents=[data_fetcher_agent, economist_agent, writer_agent],
            tasks=[fetch_task, economist_task, writer_task],
            process=Process.sequential,
            verbose=False,
        )
        result = crew.kickoff()

        # Parse reasoning bullets from economist task output
        economist_output = economist_task.output.raw if hasattr(economist_task, "output") else ""
        try:
            reasoning = _parse_json_output(economist_output)
            if not isinstance(reasoning, list):
                reasoning = [str(reasoning)]
            reasoning = reasoning[:3]
            while len(reasoning) < 3:
                reasoning.append("Economic conditions are being monitored.")
        except Exception:
            reasoning = [
                f"Prime rate stands at {indicators['dprime']}%, affecting borrowing costs.",
                f"Treasury yield spread at {indicators['t10y2y']}% signals credit conditions.",
                f"Weekly jobless claims at {indicators['icsa']:,} reflect labour market health.",
            ]

        # Parse blog post from writer task output
        writer_output = writer_task.output.raw if hasattr(writer_task, "output") else ""
        try:
            post_data = _parse_json_output(writer_output)
        except Exception:
            post_data = None

    except Exception as exc:
        print(f"[crew] CrewAI pipeline error: {exc}", file=sys.stderr)
        # Continue — score can be saved without the blog post
        reasoning = [
            f"Prime rate stands at {indicators['dprime']}%, affecting borrowing costs.",
            f"Treasury yield spread at {indicators['t10y2y']}% signals credit conditions.",
            f"Weekly jobless claims at {indicators['icsa']:,} reflect labour market health.",
        ]
        post_data = None

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
            "icsa": indicators["icsa"],
            "busappwnsaus": indicators["busappwnsaus"],
            "busapp_trending_up": indicators.get("busapp_trending_up", False),
            "updated_at": now_iso,
        }
        supabase.table("daily_scores").upsert(score_row, on_conflict="date").execute()
        print(f"[crew] Score upserted to daily_scores for {today}")
        score_saved = True
    except Exception as exc:
        print(f"[crew] ERROR: Failed to save score: {exc}", file=sys.stderr)

    post_saved = False
    if post_data and score_saved:
        try:
            # Fetch the score record id
            score_resp = (
                supabase.table("daily_scores")
                .select("id")
                .eq("date", today)
                .single()
                .execute()
            )
            score_id = score_resp.data["id"]

            now_iso = datetime.now(timezone.utc).isoformat()
            post_row = {
                "date": today,
                "title": post_data.get("title", f"Business Funding Climate: {today}"),
                "slug": post_data.get("slug", f"{today}-{get_todays_category().lower().replace(' ', '-')}"),
                "content": post_data.get("content", ""),
                "meta_description": post_data.get("meta_description", "")[:160],
                "category": get_todays_category(),
                "score_id": score_id,
                "updated_at": now_iso,
            }
            supabase.table("blog_posts").upsert(post_row, on_conflict="date").execute()
            print(f"[crew] Blog post upserted to blog_posts for {today}")
            post_saved = True
        except Exception as exc:
            print(f"[crew] ERROR: Failed to save blog post: {exc}", file=sys.stderr)

    # Determine exit code
    if not score_saved:
        print("[crew] FULL FAILURE: Score not saved. Exiting with code 1.", file=sys.stderr)
        return 1

    if not post_saved:
        print("[crew] PARTIAL SUCCESS: Score saved, blog post failed. Logged above.")

    print(f"[crew] Pipeline complete. Score={score_result['health_score']} "
          f"({score_result['status_label']}), BlogPost={'saved' if post_saved else 'failed'}")
    return 0


if __name__ == "__main__":
    sys.exit(run())
