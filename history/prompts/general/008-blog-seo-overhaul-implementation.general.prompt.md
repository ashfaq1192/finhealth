---
id: 008
title: Blog SEO overhaul implementation
stage: general
date: 2026-06-12
surface: agent
model: claude-fable-5
feature: none
branch: master
user: ashfaq1192
command: none
labels: ["seo", "blog", "consolidation", "redirects", "pipeline", "content-calendar"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/app/robots.ts (trim NEXT_PUBLIC_SITE_URL — fixes malformed Sitemap line)
  - frontend/app/blog/[slug]/page.tsx (title de-dup; permanent redirects for old slugs)
  - frontend/lib/blog-redirects.json (generated — 69 old slugs → 5 canonical)
  - backend/tasks.py (CANONICAL_SLUGS; category/keyword overrides; topic-specific FAQs)
  - backend/crew.py (already-published early-exit; evergreen upsert on slug; dateless calendar slugs)
  - backend/generate_monthly_images.py (unique long-tail topic planner; avoid-list; --retopic)
  - backend/consolidate_posts.py (new — one-time consolidation with backup)
  - .github/workflows/main.yml (20:00 UTC retry cron)
  - ACTION_ITEMS.md (Cloudflare AI-bot unblock; GSC steps)
tests:
  - frontend: npx tsc --noEmit (pass), next build (pass)
  - backend: ast syntax checks (pass); build_tasks override assertions (pass)
  - consolidate_posts.py --dry-run verified before live run
---

## Prompt

yes fix each and everything you pointed out.
continue..

## Response

Implemented the full fix set from the audit (PHR 007):

1. Consolidated 73 duplicate posts → 5 canonical evergreen posts (live DB; backup at
   backend/backups/blog_posts_20260612*.json). 69 old slugs now permanent-redirect via
   frontend/lib/blog-redirects.json.
2. Pipeline model change: days without a content_calendar topic now REFRESH the category's
   canonical evergreen page (upsert on slug) instead of minting a dated duplicate URL.
   Calendar-topic days publish new posts with dateless unique slugs.
3. Calendar planner rewritten: topics must each target a distinct long-tail keyword, never
   the 5 cornerstone keywords, never reword published topics (avoid-list passed to Groq).
   --retopic mode re-planned June 13–30 (18/18 unique keywords) reusing existing hero images.
4. Calendar category + seo_keyword now flow into writer/editor prompts (was always the
   5 fixed primaries). Topic posts get topic-specific FAQ questions.
5. Reliability: second daily cron at 20:00 UTC + crew.py early-exit when already published.
6. robots.ts trims env var (fixes malformed Sitemap URL); blog titles no longer duplicate
   site name; ACTION_ITEMS.md documents Cloudflare AI Crawl Control unblock + GSC steps.
