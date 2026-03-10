---
id: "0013"
title: Add reply_to address to digest email
stage: green
date: 2026-03-11
surface: agent
model: claude-sonnet-4-6
feature: 001-funding-health-dashboard
branch: master
user: ashfaq
command: inline chat
labels: ["email","digest","resend","cloudflare-email-routing"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - backend/digest.py
tests:
  - none
---

## Prompt

I have set up Cloudflare Email Routing for info@usfundingclimate.com to forward to my Gmail.

Please update backend/digest.py to use info@usfundingclimate.com as the reply_to address.

Ensure the FROM_EMAIL is still digest@usfundingclimate.com.

Verify that the daily email automation is ready for the next run.

## Response snapshot

Added `"reply_to": "info@usfundingclimate.com"` to the Resend API JSON payload in `send_daily_digest()`. The `from` field remains `US Funding Climate <digest@usfundingclimate.com>`. Provided a readiness checklist confirming GitHub Actions secrets and schedule are in place.

## Outcome

- ✅ Impact: Subscribers who reply to digest emails will now reach info@usfundingclimate.com → forwarded to Gmail via Cloudflare Email Routing
- 🧪 Tests: none — single-line addition, low risk
- 📁 Files: backend/digest.py (1 line added)
- 🔁 Next prompts: none required
- 🧠 Reflection: Resend supports `reply_to` as a top-level field in the API payload; no other changes needed

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): none
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none
