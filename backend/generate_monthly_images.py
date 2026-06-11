"""
Monthly content calendar generator + batch image creator.

Usage:
    python backend/generate_monthly_images.py              # generates for next calendar month
    python backend/generate_monthly_images.py --month 2026-06
    python backend/generate_monthly_images.py --dry-run    # plan only, no Modal / no DB writes

What it does:
  1. Calculates which dates need content for the target month
  2. Calls Groq once to generate all topics + image prompts as JSON
  3. Calls Modal.com Flux endpoint for each image (sequential in one session → one cold start)
  4. Uploads each image to Supabase Storage bucket 'blog-images'
  5. Upserts rows into content_calendar (safe to re-run; skips already-generated dates)

Required secrets (env vars / GitHub Actions secrets):
    GROQ_API_KEY
    SUPABASE_URL
    SUPABASE_SERVICE_KEY
    MODAL_FLUX_URL          e.g. https://muhammad-ashfaq-2302042--localyt-flux-fluxservice-generate.modal.run
    MODAL_TOKEN_ID          from modal.com/settings/tokens  (leave blank if endpoint is public)
    MODAL_TOKEN_SECRET      same token pair
"""

import argparse
import base64
import calendar
import json
import os
import sys
import time
from datetime import date, timedelta

import requests
from dotenv import load_dotenv
from json_repair import repair_json
from supabase import create_client

load_dotenv()

# ── Import category rotation from tasks.py without pulling in crewai ──────────
sys.path.insert(0, os.path.dirname(__file__))
from tasks import CATEGORIES, CATEGORY_SEO


# ─── Category-specific FLUX composition guides ────────────────────────────────
# These fix the "headless person" FLUX artifact by specifying exact framing.
# Rules: full faces always visible, people shown from at least waist up, no edge crops.

CATEGORY_COMPOSITION = {
    "Trucking": (
        "a truck driver in a high-visibility jacket standing confidently in front of their "
        "semi-truck at a freight depot, full figure visible from head to toe, wide shot, "
        "face clearly visible, industrial background"
    ),
    "Retail": (
        "a small retail store owner smiling behind a shop counter, full face and upper body "
        "clearly visible, shelves of merchandise visible in background, warm interior lighting, "
        "medium shot framed from chest up"
    ),
    "SBA Loans": (
        "a small business owner and a bank loan officer seated across a desk reviewing "
        "documents, both people shown from the waist up with faces clearly visible, "
        "professional office setting, natural window lighting"
    ),
    "Macro": (
        "wide establishing shot of a busy American main street with small business storefronts "
        "and signage, golden hour lighting, sharp focus on building facades, "
        "no close-up people required, slight depth of field"
    ),
    "Staffing": (
        "an HR manager in business attire sitting across from a job candidate at an office "
        "desk, both people shown from the waist up with faces clearly visible, "
        "professional office with natural light, medium wide shot"
    ),
}


# ─── Config ───────────────────────────────────────────────────────────────────

MODAL_FLUX_URL = os.getenv(
    "MODAL_FLUX_URL",
    "https://muhammad-ashfaq-2302042--localyt-flux-fluxservice-generate.modal.run",
)
MODAL_TOKEN_ID     = os.getenv("MODAL_TOKEN_ID", "")
MODAL_TOKEN_SECRET = os.getenv("MODAL_TOKEN_SECRET", "")

IMAGE_WIDTH  = 1200
IMAGE_HEIGHT = 628
FLUX_STEPS   = 4      # FLUX.1-schnell sweet spot
SUPABASE_BUCKET = "blogs-images"


# ─── Helpers ──────────────────────────────────────────────────────────────────

def _category_for_date(d: date) -> str:
    """Same deterministic rotation used by crew.py / tasks.py."""
    day_of_year = d.timetuple().tm_yday
    return CATEGORIES[day_of_year % len(CATEGORIES)]


def _modal_auth_header() -> dict:
    if MODAL_TOKEN_ID and MODAL_TOKEN_SECRET:
        creds = base64.b64encode(f"{MODAL_TOKEN_ID}:{MODAL_TOKEN_SECRET}".encode()).decode()
        return {"Authorization": f"Basic {creds}"}
    return {}


def _generate_image_bytes(prompt: str, seed: int) -> bytes:
    """Call Modal Flux endpoint and return raw JPEG/PNG bytes."""
    payload = {
        "prompt": prompt,
        "width": IMAGE_WIDTH,
        "height": IMAGE_HEIGHT,
        "num_steps": FLUX_STEPS,
        "seed": seed,
    }
    headers = {**_modal_auth_header(), "Content-Type": "application/json"}

    resp = requests.post(MODAL_FLUX_URL, json=payload, headers=headers, timeout=120)
    resp.raise_for_status()

    ct = resp.headers.get("content-type", "")
    if "image/" in ct:
        # Modal returned raw bytes directly
        return resp.content

    # JSON response — look for base64 image under common key names
    data = resp.json()
    for key in ("image", "image_base64", "result", "output", "data"):
        val = data.get(key)
        if isinstance(val, str) and len(val) > 100:
            # Strip data URI prefix if present
            if "," in val:
                val = val.split(",", 1)[1]
            return base64.b64decode(val)
        if isinstance(val, list) and val:
            # Some endpoints return a list with one base64 string
            v = val[0]
            if isinstance(v, str):
                if "," in v:
                    v = v.split(",", 1)[1]
                return base64.b64decode(v)

    raise ValueError(f"Cannot parse image from Modal response. Keys: {list(data.keys())}")


def _upload_to_supabase(supabase, image_bytes: bytes, filename: str) -> str:
    """Upload bytes to Supabase Storage and return the public URL."""
    try:
        # upsert=true so re-runs overwrite cleanly
        supabase.storage.from_(SUPABASE_BUCKET).upload(
            path=filename,
            file=image_bytes,
            file_options={"content-type": "image/jpeg", "upsert": "true"},
        )
    except Exception as exc:
        # Already exists with same content — not a real error
        if "already exists" not in str(exc).lower():
            raise
    return supabase.storage.from_(SUPABASE_BUCKET).get_public_url(filename)


def _qa_image_gemini(
    image_bytes: bytes,
    category: str,
    topic: str,
) -> tuple[bool, str]:
    """
    Use Gemini Flash vision to evaluate a generated image before saving to Supabase.
    Passes image bytes directly as base64 — no re-fetch needed.
    Returns (passed, reason).
    """
    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key:
        print("[qa] GEMINI_API_KEY not set — skipping visual QA", file=sys.stderr)
        return True, "skipped (no API key)"

    rubric = (
        "You are a photo editor for a professional US business finance website. "
        "Evaluate this blog hero image for publication quality.\n\n"
        f"Category: {category} | Topic: {topic}\n\n"
        "REJECT (pass: false) if ANY of these are true:\n"
        "1. Any person's head, face, or major body part is cut off at the frame edge\n"
        "2. AI artifacts: extra or fused fingers, melted skin, distorted faces, double limbs\n"
        "3. Text, logos, watermarks, or UI elements are visible\n"
        "4. The scene has zero relevance to business, commerce, or workplace\n"
        "5. Image is blurry, heavily noisy, or visually broken\n"
        "6. Style is cartoon, illustration, fantasy, or surreal (must be photorealistic)\n\n"
        "APPROVE (pass: true) if: realistic professional photo, all subjects fully visible "
        "within the frame, clean composition, relevant to the category.\n\n"
        'Respond ONLY with valid JSON on a single line: '
        '{"pass": true, "reason": "brief reason"} or {"pass": false, "reason": "brief reason"}'
    )

    img_b64 = base64.b64encode(image_bytes).decode()
    payload = {
        "contents": [{"parts": [
            {"text": rubric},
            {"inline_data": {"mime_type": "image/jpeg", "data": img_b64}},
        ]}],
        "generationConfig": {"temperature": 0.1, "maxOutputTokens": 80},
    }
    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"gemini-2.0-flash:generateContent?key={api_key}"
    )
    try:
        resp = requests.post(url, json=payload, timeout=30)
        resp.raise_for_status()
        text = resp.json()["candidates"][0]["content"]["parts"][0]["text"].strip()
        # Strip markdown fences if model wraps response
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
            text = text.strip()
        result = json.loads(repair_json(text))
        passed = bool(result.get("pass", True))
        reason = result.get("reason", "")
        return passed, reason
    except Exception as exc:
        print(f"[qa] Gemini QA error: {exc} — approving by default", file=sys.stderr)
        return True, f"qa-error: {exc}"


def _plan_calendar(dates: list[date], existing_topics: list[str] | None = None) -> list[dict]:
    """
    Ask Groq to generate one topic + image_prompt per date.
    Returns list of dicts with keys: date, category, topic, seo_keyword, image_prompt

    existing_topics: titles/topics already published or scheduled — the planner must
    not duplicate or reword any of them. Topic uniqueness is the core defense against
    the keyword cannibalization that suppressed the site's rankings.
    """
    from groq import Groq  # lazily imported so dry-run doesn't need it

    entries = []
    for d in dates:
        cat = _category_for_date(d)
        entries.append({
            "date": d.isoformat(),
            "category": cat,
        })

    # The 5 cornerstone keywords are owned by permanently-refreshed evergreen pages.
    # Calendar topics must NEVER target them — that recreates the duplication problem.
    cornerstone_keywords = "\n".join(
        f'  - "{seo["primary"]}"' for seo in CATEGORY_SEO.values()
    )
    avoid_list = "\n".join(f"  - {t}" for t in (existing_topics or [])[:120])

    # Build the composition reference table so Groq knows exact framing per category
    composition_table = "\n".join(
        f"  {cat}: {desc}" for cat, desc in CATEGORY_COMPOSITION.items()
    )

    system = (
        "You are an SEO content strategist for a US small business finance website. "
        "Return ONLY a valid JSON array. No markdown fences. No explanation."
    )
    user = f"""Generate a content calendar entry for each item below.

For each entry output a JSON object with these exact keys:
- date          (copy from input, YYYY-MM-DD)
- category      (copy from input)
- topic         (a specific long-tail article topic, 6-12 words — follow TOPIC RULES below)
- seo_keyword   (the exact long-tail search query the article targets, 3-7 words)
- image_prompt  (FLUX image generation prompt — follow the IMAGE PROMPT RULES below exactly)

TOPIC RULES (critical — violations cause Google duplicate-content penalties):
1. Every entry must target a DIFFERENT search query. No two entries may share a
   seo_keyword or be rewordings of each other.
2. NEVER target these cornerstone keywords — dedicated evergreen pages already own them:
{cornerstone_keywords}
3. Do NOT reuse or reword any topic in the ALREADY PUBLISHED list at the bottom.
4. Vary the angle across the month. Rotate through: costs and rates, qualification
   requirements, how-to guides, comparisons (X vs Y), mistakes to avoid, specific
   questions (how long does X take, what credit score for X, how much does X cost),
   and niche sub-audiences (owner-operators, franchisees, seasonal retailers,
   food trucks, medical staffing, e-commerce sellers).
5. Target informational queries a US small business owner actually types into Google.
   Good: "how long does SBA loan approval take after underwriting"
   Good: "factoring vs line of credit for staffing agency payroll"
   Bad:  "SBA Loan Eligibility Requirements and Application Process" (generic, duplicative)

IMAGE PROMPT RULES (critical — violations cause published images with cropped heads):
1. Start from the COMPOSITION GUIDE for the entry's category (listed below).
2. All human subjects MUST be fully visible — no head, face, or limb cut off at the frame edge.
3. Framing: for people, use medium or wide shot (chest-up minimum). Never extreme close-up.
4. End every prompt with: "photorealistic, professional photography, natural lighting, sharp focus, 8k resolution"
5. Do NOT mention: text, logos, watermarks, UI elements, or brand names.
6. Length: 25-40 words total.

COMPOSITION GUIDES BY CATEGORY:
{composition_table}

Input:
{json.dumps(entries, indent=2)}

ALREADY PUBLISHED (do not duplicate or reword):
{avoid_list or "  (none)"}

Return a JSON array of {len(entries)} objects.
"""
    client = Groq(api_key=os.environ["GROQ_API_KEY"])
    resp = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
        temperature=0.7,
        max_tokens=4096,
    )
    raw = resp.choices[0].message.content or ""

    # Strip markdown fences if present
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("```", 2)[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    planned = json.loads(repair_json(raw))
    if not isinstance(planned, list):
        raise ValueError(f"Expected JSON array from Groq, got: {type(planned)}")
    return planned


# ─── Main ─────────────────────────────────────────────────────────────────────

def run(target_month: str | None = None, dry_run: bool = False, retopic: bool = False) -> int:
    # Determine target month
    today = date.today()
    if target_month:
        year, month = map(int, target_month.split("-"))
    else:
        # Default: next calendar month
        if today.month == 12:
            year, month = today.year + 1, 1
        else:
            year, month = today.year, today.month + 1

    _, days_in_month = calendar.monthrange(year, month)
    all_dates = [date(year, month, d) for d in range(1, days_in_month + 1)]

    print(f"[calendar] Target month: {year}-{month:02d} ({len(all_dates)} days)")

    # Connect to Supabase — needed to skip already-generated dates and to build
    # the duplicate-avoidance list for the topic planner.
    supabase = None
    existing_rows: dict[str, dict] = {}
    existing_topics: list[str] = []
    if not dry_run:
        supabase = create_client(
            os.environ["SUPABASE_URL"],
            os.environ["SUPABASE_SERVICE_KEY"],
        )
        resp = (
            supabase.table("content_calendar")
            .select("scheduled_date, image_url, image_status, used")
            .gte("scheduled_date", f"{year}-{month:02d}-01")
            .lte("scheduled_date", f"{year}-{month:02d}-{days_in_month}")
            .execute()
        )
        existing_rows = {row["scheduled_date"]: row for row in (resp.data or [])}

        # Avoid-list: every published post title + every already-used calendar topic
        posts_resp = supabase.table("blog_posts").select("title").execute()
        existing_topics = [r["title"] for r in (posts_resp.data or []) if r.get("title")]
        used_resp = (
            supabase.table("content_calendar").select("topic").eq("used", True).execute()
        )
        existing_topics += [r["topic"] for r in (used_resp.data or []) if r.get("topic")]

    if retopic:
        # Re-plan topics for future, unused dates — images are kept if already generated.
        today_d = date.today()
        dates_to_process = [
            d for d in all_dates
            if d > today_d and not existing_rows.get(d.isoformat(), {}).get("used")
        ]
    else:
        dates_to_process = [
            d for d in all_dates
            if existing_rows.get(d.isoformat(), {}).get("image_status") != "generated"
        ]
    if not dates_to_process:
        print("[calendar] Nothing to do for this month.")
        return 0

    print(f"[calendar] {len(dates_to_process)} dates to process "
          f"(retopic={retopic}, {len(existing_rows)} rows already exist)")

    # ── Step 1: Generate topics + image prompts via Groq ──────────────────────
    print("[calendar] Generating topics and image prompts via Groq...")
    if dry_run:
        planned = [
            {
                "date": d.isoformat(),
                "category": _category_for_date(d),
                "topic": f"[DRY RUN] Topic for {d.isoformat()}",
                "seo_keyword": "small business funding",
                "image_prompt": "Professional business owner reviewing financial documents at a modern desk, natural lighting, sharp focus, clean background, 8k resolution",
            }
            for d in dates_to_process
        ]
    else:
        planned = _plan_calendar(dates_to_process, existing_topics=existing_topics)

    if dry_run:
        print(f"[calendar] Planned {len(planned)} entries (dry run — Groq not called)")
    else:
        print(f"[calendar] Groq returned {len(planned)} entries")

    # ── Step 2 + 3: Generate images + upload ──────────────────────────────────
    results = []
    for i, entry in enumerate(planned):
        d_str = entry["date"]
        cat   = entry["category"]
        topic = entry["topic"]
        prompt = entry["image_prompt"]

        print(f"[{i+1}/{len(planned)}] {d_str} | {cat} | {topic[:50]}...")
        print(f"          Prompt: {prompt[:80]}")

        image_url = None
        image_status = "pending"

        prior = existing_rows.get(d_str, {})
        if not dry_run and prior.get("image_status") == "generated" and prior.get("image_url"):
            # Retopic mode: keep the already-generated (and QA-passed) hero image.
            image_url = prior["image_url"]
            image_status = "generated"
            print(f"          → reusing existing image: {image_url[:80]}")
        elif not dry_run:
            try:
                seed = int(d_str.replace("-", "")) % 2147483647
                img_bytes = _generate_image_bytes(prompt, seed=seed)

                # Visual QA via Gemini Flash — runs before upload so reason is logged
                qa_passed, qa_reason = _qa_image_gemini(img_bytes, cat, topic)
                if qa_passed:
                    print(f"          ✓ QA passed: {qa_reason or 'looks good'}")
                else:
                    print(
                        f"          ✗ QA FAILED: {qa_reason}",
                        file=sys.stderr,
                    )

                # Always upload — failed images go to Supabase for manual review
                filename = f"blog/{d_str}-{cat.lower().replace(' ', '-')}.jpg"
                image_url = _upload_to_supabase(supabase, img_bytes, filename)
                image_status = "generated" if qa_passed else "failed_qa"
                status_label = "uploaded" if qa_passed else "uploaded (failed_qa — won't be used)"
                print(f"          → {status_label}: {image_url[:80]}")
            except Exception as exc:
                print(f"          ✗ FAILED: {exc}", file=sys.stderr)
                image_status = "failed"

            # Small pause between images — avoids hammering Modal
            if i < len(planned) - 1:
                time.sleep(2)
        else:
            image_url = f"https://example.com/dry-run/{d_str}.jpg"
            image_status = "generated"

        results.append({
            "scheduled_date": d_str,
            "category":       cat,
            "topic":          topic,
            "seo_keyword":    entry.get("seo_keyword", ""),
            "image_prompt":   prompt,
            "image_url":      image_url,
            "image_status":   image_status,
        })

    # ── Step 4: Upsert into content_calendar ──────────────────────────────────
    if not dry_run and results:
        print(f"[calendar] Upserting {len(results)} rows into content_calendar...")
        supabase.table("content_calendar").upsert(
            results, on_conflict="scheduled_date"
        ).execute()
        print("[calendar] Done.")
    else:
        print("[calendar] DRY RUN — would insert:")
        for r in results:
            print(f"  {r['scheduled_date']} | {r['category']} | {r['topic'][:60]}")

    generated  = sum(1 for r in results if r["image_status"] == "generated")
    failed_qa  = sum(1 for r in results if r["image_status"] == "failed_qa")
    failed     = sum(1 for r in results if r["image_status"] == "failed")
    print(
        f"\n[calendar] Summary: {generated} generated (QA passed), "
        f"{failed_qa} failed QA (uploaded for review), "
        f"{failed} failed entirely — out of {len(results)}"
    )
    return 1 if (failed > 0 or failed_qa > 0) else 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate monthly content calendar + blog images")
    parser.add_argument(
        "--month",
        type=str,
        default=None,
        metavar="YYYY-MM",
        help="Target month (default: next calendar month)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Plan topics only — no Modal calls, no DB writes",
    )
    parser.add_argument(
        "--retopic",
        action="store_true",
        help="Re-plan topics for future unused dates, reusing already-generated images",
    )
    args = parser.parse_args()
    sys.exit(run(target_month=args.month, dry_run=args.dry_run, retopic=args.retopic))
