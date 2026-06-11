"""
One-time consolidation of duplicate blog posts.

Problem this fixes: the daily pipeline published ~14 near-identical posts per
category keyword under dated slugs (sba-loan-eligibility-requirements-20260611,
-20260527, ...). Google treats that as scaled content abuse and suppresses the
whole domain.

What it does:
  1. Backs up ALL blog_posts rows to backend/backups/blog_posts_<timestamp>.json
  2. For each category, keeps the NEWEST post and renames its slug to the
     canonical evergreen slug from tasks.CANONICAL_SLUGS
  3. Deletes every other post in that category
  4. Writes frontend/lib/blog-redirects.json mapping every removed/renamed slug
     to its canonical slug — the blog page issues permanent redirects from it

Usage:
    python backend/consolidate_posts.py --dry-run   # show the plan, change nothing
    python backend/consolidate_posts.py             # execute
"""

import argparse
import json
import os
import sys
from datetime import datetime, timezone

from dotenv import load_dotenv
from supabase import create_client

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

sys.path.insert(0, os.path.dirname(__file__))
from tasks import CANONICAL_SLUGS

BACKUP_DIR = os.path.join(os.path.dirname(__file__), "backups")
REDIRECTS_PATH = os.path.join(
    os.path.dirname(__file__), "..", "frontend", "lib", "blog-redirects.json"
)


def run(dry_run: bool) -> int:
    supabase = create_client(
        os.environ["SUPABASE_URL"],
        os.environ["SUPABASE_SERVICE_KEY"],
    )

    posts = (
        supabase.table("blog_posts")
        .select("*")
        .order("date", desc=True)
        .execute()
        .data
        or []
    )
    print(f"[consolidate] {len(posts)} posts in blog_posts")

    # 1. Backup everything before touching anything
    os.makedirs(BACKUP_DIR, exist_ok=True)
    ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    backup_path = os.path.join(BACKUP_DIR, f"blog_posts_{ts}.json")
    if not dry_run:
        with open(backup_path, "w") as f:
            json.dump(posts, f, indent=2, default=str)
        print(f"[consolidate] Backup written: {backup_path}")

    # 2. Group by category, keep newest per category
    by_category: dict[str, list[dict]] = {}
    for p in posts:
        by_category.setdefault(p["category"], []).append(p)

    redirects: dict[str, str] = {}
    to_delete: list[dict] = []
    to_rename: list[tuple[dict, str]] = []

    for category, rows in by_category.items():
        canonical = CANONICAL_SLUGS.get(category)
        if not canonical:
            print(f"[consolidate] WARNING: no canonical slug for category {category!r} "
                  f"({len(rows)} posts) — skipping")
            continue
        rows.sort(key=lambda r: str(r["date"]), reverse=True)
        keep, rest = rows[0], rows[1:]
        print(f"\n[{category}] keeping {keep['slug']} ({keep['date']}) → /blog/{canonical}")
        if keep["slug"] != canonical:
            redirects[keep["slug"]] = canonical
            to_rename.append((keep, canonical))
        for r in rest:
            if r["slug"] != canonical:
                redirects[r["slug"]] = canonical
            to_delete.append(r)
        print(f"[{category}] deleting {len(rest)} duplicates")

    print(f"\n[consolidate] Plan: rename {len(to_rename)}, delete {len(to_delete)}, "
          f"{len(redirects)} redirect entries")

    if dry_run:
        for old, new in sorted(redirects.items()):
            print(f"  /blog/{old}  →  /blog/{new}")
        print("[consolidate] DRY RUN — nothing changed.")
        return 0

    # 3. Apply renames first (canonical slug must not collide with a row pending delete)
    # Delete duplicates BEFORE renaming, in case a duplicate already owns the canonical slug.
    for r in to_delete:
        supabase.table("blog_posts").delete().eq("id", r["id"]).execute()
    print(f"[consolidate] Deleted {len(to_delete)} rows")

    for keep, canonical in to_rename:
        supabase.table("blog_posts").update({"slug": canonical}).eq("id", keep["id"]).execute()
        print(f"[consolidate] Renamed {keep['slug']} → {canonical}")

    # 4. Write the redirect map for the frontend
    os.makedirs(os.path.dirname(REDIRECTS_PATH), exist_ok=True)
    with open(REDIRECTS_PATH, "w") as f:
        json.dump(dict(sorted(redirects.items())), f, indent=2)
    print(f"[consolidate] Redirect map written: {os.path.abspath(REDIRECTS_PATH)}")

    remaining = supabase.table("blog_posts").select("slug, date, category").execute().data
    print(f"\n[consolidate] Done. {len(remaining)} posts remain:")
    for r in sorted(remaining, key=lambda x: x["category"]):
        print(f"  {r['category']:10} | {r['date']} | /blog/{r['slug']}")
    return 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Consolidate duplicate blog posts")
    parser.add_argument("--dry-run", action="store_true", help="Show plan, change nothing")
    args = parser.parse_args()
    sys.exit(run(dry_run=args.dry_run))
