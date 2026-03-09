---
id: "0010"
title: pipeline-retry-logic
stage: green
date: 2026-03-08
surface: agent
model: claude-sonnet-4-6
feature: 001-funding-health-dashboard
branch: 001-funding-health-dashboard
user: ashfaq
command: (conversational)
labels: ["reliability","retry","groq","fred","supabase","crewai","pipeline","resilience"]
links:
  spec: specs/001-funding-health-dashboard/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - backend/crew.py
tests:
  - null
---

## Prompt

Have you implemented retries if one agent or task is failed how many retries before failure? Because this is multi agent framework and data is coming from different sources and we have to post just once in the morning, so it is better that we have generous cap of retries with wider gap of time so that our retries did not blocked by server/api and we get the best result/blog/image on our website. what you think?

## Response

Implemented a `_retry(fn, attempts, delays, label)` helper in `backend/crew.py`. No new dependencies — pure stdlib (`time`). Applied to all 4 network-touching steps:

| Step | Attempts | Delays | Rationale |
|---|---|---|---|
| FRED fetch | 3 | 10s, 30s | Government API — slow responses, occasional 503s |
| CrewAI/Groq kickoff | 3 | 60s, 120s | Free-tier rate limits reset in ~60s windows |
| Supabase score upsert | 3 | 5s, 15s | Reliable but network blips happen |
| Supabase blog post upsert | 3 | 5s, 15s | Same |

**Key design decision:** The CrewAI retry calls `build_tasks()` fresh each attempt, creating completely new Task + Crew objects. No stale state from a failed run bleeds into the next attempt.

**Worst-case total runtime:** ~13 minutes (all 3 retries on every step). Well within GitHub Actions defaults.

**Score 2 stays non-fatal:** If CrewAI fails all 3 attempts, the score is still saved without a blog post (existing behavior preserved).
