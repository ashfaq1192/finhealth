# Quickstart: US Business Funding Climate Dashboard

**Branch**: `001-funding-health-dashboard` | **Date**: 2026-03-07

---

## Prerequisites

Before starting, ensure you have:
- [ ] FRED API key (free at fred.stlouisfed.org/docs/api/api_key.html)
- [ ] Groq API key (free at console.groq.com)
- [ ] Supabase project created (free at supabase.com) — get URL + anon key + service_role key
- [ ] Cloudflare Pages project linked to this GitHub repo
- [ ] Node.js 20+ and Python 3.11+ installed locally

---

## Step 1 — Database Setup (Supabase)

Run the migration in your Supabase SQL editor:

```
supabase/migrations/001_initial_schema.sql
```

Verify in Supabase dashboard: two tables (`daily_scores`, `blog_posts`) with
RLS enabled. Anon role can SELECT; only service_role can INSERT/UPDATE.

---

## Step 2 — Backend Local Test

```bash
cd backend
cp .env.example .env
# Fill in FRED_API_KEY, GROQ_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY

pip install -r requirements.txt
python crew.py
```

Expected output: JSON logged to stdout with score, label, reasoning, and blog post.
Verify a row appears in `daily_scores` and `blog_posts` in Supabase dashboard.

---

## Step 3 — Frontend Local Dev

```bash
cd frontend
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

npm install
npm run dev
```

Open `http://localhost:3000`. The homepage MUST show the score you inserted in Step 2.

---

## Step 4 — GitHub Actions Secrets

In GitHub repo settings → Secrets and variables → Actions, add:

| Secret name | Value |
|---|---|
| `FRED_API_KEY` | Your FRED API key |
| `GROQ_API_KEY` | Your Groq API key |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_KEY` | Your Supabase **service_role** key (NOT anon key) |

(No `CF_DEPLOY_HOOK` needed — edge runtime refreshes on each request.)

---

## Step 5 — Cloudflare Pages Deploy

1. In Cloudflare Pages dashboard, connect your GitHub repo.
2. Set build command: `npx @cloudflare/next-on-pages`
3. Set output directory: `.vercel/output/static`
4. Add environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy. Visit your `*.pages.dev` URL and confirm the score appears.

---

## Step 6 — Verify Automation

The GitHub Actions cron runs daily at **14:00 UTC (09:00 AM EST)**.

To test immediately without waiting:
1. Go to GitHub repo → Actions tab → "Daily Score Update" workflow
2. Click "Run workflow" → Run workflow
3. After ~2 minutes, confirm new rows in Supabase and updated score on live site.

---

## Validation Checklist

- [ ] `daily_scores` table has at least one row
- [ ] `blog_posts` table has at least one row with 600+ word content
- [ ] Homepage shows score + label + 3 reasoning bullets above fold
- [ ] Homepage loads in under 3 seconds (test with browser DevTools)
- [ ] Blog listing shows posts in reverse-chronological order
- [ ] Sticky disclaimer visible at bottom of every page
- [ ] Site renders without horizontal scroll at 375px viewport width
- [ ] GitHub Actions workflow is scheduled and enabled
- [ ] Repo is set to **Public** (required for unlimited Actions minutes)
