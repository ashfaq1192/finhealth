---
id: "0020"
title: CrewAI debug — Groq test, traceback, stdout flush
stage: green
date: 2026-04-17
surface: agent
model: claude-sonnet-4-6
feature: 001-funding-health-dashboard
branch: master
user: ashfaq1192
command: "fix CrewAI kickoff failure — empty exception + buffered stdout"
labels: ["debugging","crewai","groq","github-actions","logging"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .github/workflows/main.yml
  - backend/crew.py
tests:
  - manual GitHub Actions run (workflow_dispatch)
---

## Prompt

User ran daily workflow after previous session's fixes; blog post still failed with "An unknown error occurred" × 3 with blank error details. Root causes identified: (1) python stdout fully buffered — all output flushed at exit making real-time logs useless; (2) CrewAI exception wrapper has empty `__str__()` so `{exc}` prints nothing; (3) GEMINI_API_KEY missing from workflow env; (4) no direct Groq connectivity test so a bad API key or rate limit produces silent failures.

## Response snapshot

Four targeted fixes applied:

1. **workflow**: `python backend/crew.py` → `python -u backend/crew.py` (unbuffered stdout)
2. **workflow**: Added `GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}` to env section
3. **crew.py**: Added `import traceback`; changed exception handler to `repr(exc)` fallback + `traceback.print_exc(file=sys.stderr)`; all key `print()` calls now have `flush=True`
4. **crew.py**: Added Step 0b — direct Groq API ping before FRED fetch; fails fast with full traceback if Groq is unreachable

## Outcome

- ✅ Impact: Next workflow run will show real-time logs AND the actual exception causing CrewAI failures
- 🧪 Tests: Trigger via GitHub Actions workflow_dispatch
- 📁 Files: 2 files modified
- 🔁 Next prompts: Analyse next run's logs to identify root cause; may need backfill of April 15-17 posts
- 🧠 Reflection: Empty `__str__` on exception wrappers is a common CrewAI gotcha — always use `repr()` fallback in except blocks

## Evaluation notes (flywheel)

- Failure modes observed: Buffered stdout + opaque exception wrapper made 3 failures completely invisible in GH Actions logs
- Graders run and results (PASS/FAIL): n/a — diagnostic changes only
- Prompt variant (if applicable): n/a
- Next experiment: If Groq ping passes but CrewAI still fails, check whether crewai version pinned in requirements.txt matches what was working before commit 52a650d
