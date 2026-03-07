---
id: "0005"
title: Artifact Consistency Analysis
stage: misc
date: 2026-03-07
surface: agent
model: claude-sonnet-4-6
feature: 001-funding-health-dashboard
branch: 001-funding-health-dashboard
user: ashfaq
command: /sp.analyze
labels: ["analyze", "consistency", "constitution", "coverage-gap", "security"]
links:
  spec: specs/001-funding-health-dashboard/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - none (read-only analysis)
tests:
  - none
---

## Prompt

/sp.analyze (no arguments — active feature 001-funding-health-dashboard)

## Response snapshot

Read-only cross-artifact analysis of spec.md, plan.md, tasks.md, constitution.md.
9 findings: 1 CRITICAL, 2 HIGH, 3 MEDIUM, 3 LOW.

CRITICAL (C1): Constitution Principle IV mandates Cloudflare Pages deploy hook in workflow,
but plan eliminated it (edge runtime = no deploy hook needed). Constitution not updated.
Fix: amend constitution Principle IV + run /sp.adr edge-runtime-vs-static-ssg.

HIGH (H1): SC-004 (search indexing within 7 days) has zero task coverage — no sitemap.xml,
robots.txt, or OpenGraph meta tasks in tasks.md.

HIGH (H2): T022 uses dangerouslySetInnerHTML without specifying a sanitisation library.
AI-generated markdown → raw HTML is an XSS vector. Fix: add dompurify.

MEDIUM: (M1) email alert depends on GitHub account settings not code; (M2) writer agent
lacks negative prompt guardrail against direct recommendations; (M3) AdSense script tag
not in any task (only placement div).

Coverage: FR 14/14 (2 partial), SC 6/7 (SC-004 zero), 28/28 tasks mapped.

## Outcome

- ✅ Impact: 9 actionable findings; 1 CRITICAL blocks constitution compliance; 2 HIGH should
  be resolved before /sp.implement
- 🧪 Tests: none (analysis only)
- 📁 Files: none modified (read-only)
- 🔁 Next prompts: fix C1 (amend constitution) + fix H1/H2 in tasks.md, then /sp.implement
- 🧠 Reflection: The constitution vs plan conflict (C1) was introduced when we decided on
  edge runtime during /sp.plan but didn't loop back to update the constitution. This is a
  typical SDD drift pattern — architecture decisions must propagate to the constitution.

## Evaluation notes (flywheel)

- Failure modes observed: constitution drift after architectural decision change
- Graders run and results (PASS/FAIL): 20/21 requirements covered (95%); C1 = constitution FAIL
- Prompt variant (if applicable): no arguments
- Next experiment (smallest change to try): amend constitution Principle IV (single sentence
  removal), add sitemap/robots tasks to Phase 7, add dompurify note to T022
