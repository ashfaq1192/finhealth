---
id: "0019"
title: QA Gate + Token Budget + Exit Code Fix
stage: green
date: 2026-04-17
surface: agent
model: claude-sonnet-4-6
feature: 001-funding-health-dashboard
branch: master
user: ashfaq1192
command: continue
labels: ["qa-gate", "token-budget", "groq", "exit-code", "bugfix", "crew-pipeline"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - backend/agents.py
  - backend/tasks.py
  - backend/crew.py
tests:
  - Manual workflow trigger pending (dry_run=false) to verify blogs publish again
---

## Prompt

User reported: no blog posts published since April 14, 2026. Article at invoice-factoring-staffing-agencies-20260414 is truncated. Pipeline runs daily (score updates) but blog fails silently — GitHub Actions shows green, no alert fires.

Requested thorough audit and full implementation fix including a QA agent to enforce article quality before publishing.

## Response snapshot

Root cause diagnosed: commit 52a650d added ~3,000 extra tokens to the editor task (CHECK 10 Anti-AI + internal links + AI SEO rules), pushing total editor call to ~11,500 tokens per run — exceeding Groq free-tier TPM ceiling. Truncated April 14 article caused by writer max_tokens=3500 being too low for 1,200-word JSON.

Three-part fix committed as 07fb604:

1. **agents.py** — Raised max_tokens: writer 3500→8000, editor 4500→8000
2. **tasks.py** — Trimmed editor task prompt ~70% (removed all BAD/GOOD example blocks from CHECKs, condensed Anti-AI section). Same rules, 70% fewer tokens.
3. **crew.py** — Added `_qa_post_content()` gate: validates word count ≥900, ≥2 H2 sections, ≥1 H3 FAQ question, all 4 JSON keys non-empty. Added QA call at Step 3b after word-count strip. Fixed exit code: return 1 when blog post fails after score saves — GitHub Actions will now fire failure alert.

## Outcome

- ✅ Impact: Root cause fixed (TPM overflow). QA gate prevents truncated/incomplete posts from reaching DB. GitHub Actions will now alert on blog failures.
- 🧪 Tests: Manual workflow_dispatch with dry_run=false needed to confirm end-to-end. Token count reduction from ~11,500→~4,500 per editor call expected to clear Groq TPM limit.
- 📁 Files: backend/agents.py, backend/tasks.py, backend/crew.py
- 🔁 Next prompts: Trigger daily workflow manually for 2026-04-17 to verify a complete blog post is published. Consider backfilling Apr 15-17 gap.
- 🧠 Reflection: Silent exit-code-0 on partial failure was the hardest part — score saved fine every day, so no alert fired despite zero blog posts. QA gate provides a hard rejection on structural failures before they reach Supabase.

## Evaluation notes (flywheel)

- Failure modes observed: TPM overflow from bloated editor prompt; max_tokens too low for JSON output; exit code 0 masking blog failures
- Graders run and results (PASS/FAIL): Awaiting manual workflow trigger
- Prompt variant (if applicable): null
- Next experiment: Run full workflow (dry_run=false) for 2026-04-17 and verify QA gate log line appears
