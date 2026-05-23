---
name: gemini-fallback-groq-rate-limit
description: Fix alternating blog post failures caused by Groq daily token cap — add Gemini fallback for writer and editor agents
metadata:
  type: general
  stage: green
  date: 2026-05-23
  surface: agent
  model: claude-sonnet-4-6
  feature: 001-funding-health-dashboard
  branch: master
  labels: ["bug-fix", "groq", "gemini", "rate-limit", "fallback", "blog-pipeline"]
---

## Prompt

yes find and fix

(Context: user asked to verify the website, color schema, and daily blog posting. Verification found that blog posts were alternating success/failure every other day since May 13. Root cause traced to Groq free-tier daily token cap being exhausted by a successful run, causing the next day's writer/editor LLM calls to hit HTTP 429.)

## Response

**Root cause identified:** Groq free-tier `llama-3.3-70b-versatile` has a daily token cap. A successful pipeline run (writer: 5,000 tokens + editor: 5,500 tokens ≈ 10,500 tokens) exhausts the day's budget. The next day's 1-token precheck ping passes (within budget), but the writer's full 5,000-token request fails with 429. All 3 retries fail → `writer_output` stays empty → no blog post → exit code 1. Perfect alternating pattern confirmed.

**Fix applied across 4 files:**

1. `backend/agents.py` — Added `gemini_llm()` factory using `gemini/gemini-2.0-flash` (GEMINI_API_KEY already in GitHub Secrets). Converted `economist_agent`, `writer_agent`, `editor_agent` from module-level instances to factory functions `make_economist()`, `make_writer()`, `make_editor()` that accept an optional LLM override. Kept backward-compatible module-level instances.

2. `backend/tasks.py` — Added optional `economist`, `writer` params to `build_tasks()` and optional `editor` param to `build_editor_task()`. Defaults to module-level Groq agents when not provided.

3. `backend/crew.py` — Added `_is_rate_limit(exc)` helper (detects "429", "rate limit", "quota_exceeded", "resource exhausted", "daily limit"). Changed precheck: rate-limit errors now set `groq_ok=False` instead of returning 1. Crew1 and Crew2 kickoffs now try Groq first; on rate-limit failure, automatically retry with Gemini agents (no 75s TPM sleep needed for Gemini).

4. `backend/requirements.txt` — Added `litellm>=1.0.0` (required by crewai 1.x for Groq), `google-generativeai>=0.8.0` (for Gemini), `groq>=0.9.0` (explicit pin).

## Files Modified

 - backend/agents.py
 - backend/tasks.py
 - backend/crew.py
 - backend/requirements.txt
