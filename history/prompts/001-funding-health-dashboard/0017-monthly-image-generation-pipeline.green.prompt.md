---
name: Monthly Image Generation Pipeline
description: Pre-generate 30 blog hero images per month via Modal.com Flux, store in Supabase Storage, consume automatically in daily crew.py pipeline.
type: green
stage: green
date: 2026-04-17
feature: 001-funding-health-dashboard
branch: master
surface: agent
model: claude-sonnet-4-6
---

## Prompt

User has Modal.com Flux deployment (FLUX.1-schnell, L4 GPU). Wants to batch-generate 30 blog images per month in one session to amortize cold-start cost. Images stored in Supabase Storage, daily pipeline picks correct image automatically.

Modal endpoint: https://muhammad-ashfaq-2302042--localyt-flux-fluxservice-generate.modal.run

## Architecture

```
MONTHLY (28th of each month via GitHub Actions + manual trigger):
  Groq → 30 topics + image_prompts (one API call)
  Modal Flux → 30 images sequentially (one cold start amortized)
  Supabase Storage → upload each image → public URL
  content_calendar table → upsert 30 rows

DAILY (existing crew.py):
  Step 0: query content_calendar for today's date
  Step 3: pass topic_override to build_tasks → writer uses pre-planned topic
  Step 4: include hero_image_url in blog_posts upsert
          mark content_calendar row as used=True
```

## Files Created / Modified

### New
- `supabase/migrations/004_content_calendar.sql`
  Table: id, scheduled_date UNIQUE, category, topic, seo_keyword, image_prompt,
  image_url, image_status (pending|generated|failed), used BOOL, created_at

- `backend/generate_monthly_images.py`
  - CLI: `python backend/generate_monthly_images.py [--month YYYY-MM] [--dry-run]`
  - Handles both Modal response formats: raw bytes (Content-Type: image/jpeg) and JSON base64
  - Skips dates already in DB with image_status=generated (safe to re-run)
  - 2s pause between Modal calls to avoid rate limits
  - Seed derived from date string for reproducible re-generation

- `.github/workflows/monthly-content-calendar.yml`
  - Cron: 0 10 28 * * (28th of each month, 10:00 UTC)
  - workflow_dispatch with month + dry_run inputs
  - Required new GitHub secrets: MODAL_FLUX_URL, MODAL_TOKEN_ID, MODAL_TOKEN_SECRET

### Modified
- `backend/tasks.py`: `build_tasks(indicators_json, score_json, topic_override=None)`
  - topic_override injects "SPECIFIC TOPIC: ..." directive before industry context
  - Fully backward-compatible (default=None keeps existing behaviour)

- `backend/crew.py`:
  - `_fetch_calendar_entry()` helper — queries content_calendar, returns None on any error
  - Supabase client created in Step 0 (not Step 4) — avoids duplicate instantiation
  - calendar_entry passed into `build_tasks(topic_override=...)` 
  - `hero_image_url` added to post_row when image_status=generated
  - calendar row marked used=True after successful blog_posts upsert

## Required GitHub Secrets
```
MODAL_FLUX_URL      = https://muhammad-ashfaq-2302042--localyt-flux-fluxservice-generate.modal.run
MODAL_TOKEN_ID      = (from modal.com/settings/tokens)
MODAL_TOKEN_SECRET  = (same token pair)
```

## Image Prompt Strategy
Groq generates prompts in format:
"Professional editorial business photography, [subject relevant to topic], natural lighting, sharp focus, clean background, 8k resolution"

Flux Schnell @ 4 steps handles this style well. Seed = int(YYYYMMDD) % 2147483647.
Images stored at: Supabase Storage / blog-images / blog/YYYY-MM-DD-category.jpg
Dimensions: 1200×628 (OG image aspect ratio)

## Fallback behaviour
- If content_calendar has no row for today: crew.py runs exactly as before (category rotation, no hero image)
- If Modal fails for some dates: those rows get image_status=failed; daily pipeline skips them gracefully
- If generate_monthly_images.py fails entirely: GitHub Actions job fails + notifies; daily pipeline unaffected
