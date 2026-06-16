---
id: 009
title: Pipeline recovery writer draft fallback
stage: general
date: 2026-06-16
surface: agent
model: claude-fable-5
feature: none
branch: master
user: ashfaq1192
command: none
labels: ["pipeline", "groq", "gemini", "fallback", "cloudflare-pages", "backfill"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - backend/crew.py (writer-draft fallback when editor truncates + Gemini quota exhausted)
  - .github/workflows/main.yml (workflow_dispatch inputs: backfill_date, force_regenerate)
  - ACTION_ITEMS.md (added 0a0: Gemini billing; 0a2: Cloudflare Pages deploy fix)
tests:
  - python3 ast.parse(crew.py) — syntax OK
  - npx @cloudflare/next-on-pages — build succeeded locally (exit 0, 81s)
  - next build — passed (exit 0)
  - gh workflow run "Daily Score Update" --field backfill_date=2026-06-15 — triggered
---

## Prompt

resume

## Response snapshot

Resumed and diagnosed two failures:

1. **Pipeline failure (June 15 × 2):** Groq 70b editor truncated output to 370 words (below
   900-word QA gate). Gemini fallback returned HTTP 429 with `limit: 0` — the free-tier quota
   is permanently exhausted on the Google project that owns the key. The pipeline discarded the
   blog post and exited 1.

2. **Cloudflare Pages not deploying:** Live site still serves old code (broken Sitemap URL in
   robots.txt, no 301 redirects for old slugs) despite the June 12 git push succeeding.
   Local `next build` and `npx @cloudflare/next-on-pages` both pass cleanly. The GitHub
   integration webhook isn't triggering Cloudflare Pages builds.

**Fixes deployed:**

- `crew.py`: Added writer-draft QA fallback. When the editor truncates AND Gemini is
  unavailable, the pipeline now parses and QA-checks the raw writer draft. If it passes
  the 900-word / 2-H2 / 1-H3 gate, it publishes unedited rather than failing entirely.

- `main.yml`: Added `workflow_dispatch` inputs — `backfill_date` (YYYY-MM-DD string) and
  `force_regenerate` (boolean). This lets the user manually trigger backfills from the GitHub
  Actions UI without editing YAML.

- `ACTION_ITEMS.md`: Added items `0a0` (fix Gemini billing / replace key) and `0a2`
  (diagnose Cloudflare Pages not deploying — check deployments tab, reconnect GitHub repo).

**Triggered backfill:** `gh workflow run "Daily Score Update" --field backfill_date=2026-06-15`
— run #27605154960 started.

## Outcome

- ✅ Impact: Pipeline now has 3-tier fallback: Groq editor → Gemini editor → writer draft. June 15 post backfill triggered.
- 🧪 Tests: ast.parse crew.py OK; next build OK; @cloudflare/next-on-pages build OK
- 📁 Files: backend/crew.py, .github/workflows/main.yml, ACTION_ITEMS.md
- 🔁 Next prompts: Verify June 15 backfill succeeded; verify Cloudflare Pages deploys after reconnect; add Gemini billing
- 🧠 Reflection: Root cause of Gemini limit=0 is unclear — could be free-tier revocation, paid project with no billing card, or account-level restriction. Writer-draft fallback is the right defense regardless.

## Evaluation notes (flywheel)

- Failure modes observed: Groq 70b TPM truncation (produces ~370 words instead of 900+); Gemini free tier permanently exhausted; Cloudflare Pages GitHub integration silently not triggering
- Graders run and results (PASS/FAIL): ast.parse PASS; next build PASS; @cloudflare/next-on-pages PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Lower editor max_tokens to reduce TPM pressure, or split editor prompt into two calls (structural check + prose polish)
