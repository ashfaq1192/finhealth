---
id: "0011"
title: cpi-nfib-email-og-sitemap
stage: green
date: 2026-03-08
surface: agent
model: claude-sonnet-4-6
feature: 001-funding-health-dashboard
branch: 001-funding-health-dashboard
user: ashfaq
command: (conversational)
labels: ["cpi","nfib","email","resend","og-image","sitemap","social-sharing","indicators","newsletter"]
links:
  spec: specs/001-funding-health-dashboard/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - supabase/migrations/002_add_cpi_nfib_subscribers.sql
  - backend/fred.py
  - backend/digest.py
  - backend/crew.py
  - backend/tasks.py
  - backend/.env.example
  - backend/requirements.txt
  - frontend/app/blog/[slug]/page.tsx
  - frontend/app/sitemap.ts
  - frontend/app/page.tsx
  - frontend/components/EmailCapture.tsx
  - frontend/app/api/subscribe/route.ts
  - frontend/app/api/unsubscribe/route.ts
tests:
  - npx tsc --noEmit → exit 0 (clean)
---

## Prompt

Yes Implement all these with your perfection:
1. OG image meta — 15 minutes, immediate social sharing improvement
2. Dynamic sitemap — 30 minutes, unblocks Google indexing of all posts
3. CPI panel on homepage + in writer context — 1 hour, closes the "why" gap
4. NFIB widget — 1 hour, unique credibility differentiator
5. Email capture — 2-3 hours, the most important for long-term business resilience

## Response

Implemented all 5 features across 13 files. TypeScript exits clean (exit 0).

**1. OG Image Meta** — `frontend/app/blog/[slug]/page.tsx`
Modified `generateMetadata()` to add `openGraph` (type:article, publishedTime, url, siteName, 1200×628 image) and `twitter` (summary_large_image card) using `extractFirstImage()` on the post's Pollinations image. Every shared link on LinkedIn/Twitter now shows the cinematic article image.

**2. Dynamic Sitemap** — `frontend/app/sitemap.ts`
Blog posts were already dynamic. Added About (monthly/0.6), Methodology (monthly/0.6), Legal (yearly/0.3) to complete the sitemap. All pages now discoverable by Google.

**3. CPI YoY Panel** — `backend/fred.py`, `backend/tasks.py`, `frontend/app/page.tsx`
- `fred.py`: added `_compute_cpi_yoy()` fetching CPIAUCSL (15 obs, sorts desc, computes (latest/12mo_ago-1)*100). Non-fatal — logs warning if insufficient data.
- `tasks.py`: CPI and NFIB injected into writer task as "ADDITIONAL MACRO CONTEXT" block (conditional — only if values are present).
- `crew.py`: `cpi_yoy` and `nfib_optimism` added to `score_row` dict.
- `page.tsx`: Color-coded CPI card (red >4%, amber 2-4%, green <2%) with Fed target context.
- Schema: `supabase/migrations/002_add_cpi_nfib_subscribers.sql` adds both columns as nullable NUMERIC.

**4. NFIB Widget** — same files as CPI
- `fred.py`: added `_fetch_nfib()` fetching NFIBSCIB (monthly, SA). Non-fatal.
- `page.tsx`: Color-coded NFIB card (red <90, amber 90-98, green ≥98) with neutral baseline context. Grid shows alongside CPI.

**5. Email Capture + Daily Digest** — 5 new files + crew.py
- `components/EmailCapture.tsx`: client component with success/error states, "idle → loading → success/error" flow.
- `app/api/subscribe/route.ts`: edge POST, validates email, upserts to `subscribers` table (ignoreDuplicates).
- `app/api/unsubscribe/route.ts`: edge GET+POST (RFC 8058 one-click), deletes by `unsubscribe_token`, redirects to `/?unsubscribed=1`.
- `backend/digest.py`: Resend API sender. Table-based HTML email with score, color-coded by label, reasoning bullets, CPI/NFIB context, article link, CTA button, RFC 8058 List-Unsubscribe header. Caps at 100/day (free tier limit).
- `crew.py` Step 5: fetches confirmed subscribers from Supabase, calls `send_daily_digest()`. Non-fatal.
- New GitHub secrets needed: `RESEND_API_KEY`, `SITE_URL`.
- `subscribers` table has `unsubscribe_token UUID` column for secure one-click unsubscribe.
