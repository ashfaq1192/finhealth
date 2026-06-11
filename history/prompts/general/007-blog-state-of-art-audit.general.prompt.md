---
id: 007
title: Blog state of art audit
stage: general
date: 2026-06-12
surface: agent
model: claude-fable-5
feature: none
branch: master
user: ashfaq1192
command: none
labels: ["seo", "blog", "audit", "agents", "content-strategy"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - backend/agents.py (inspected)
  - backend/tasks.py (inspected)
  - backend/crew.py (inspected)
  - frontend/app/sitemap.ts (inspected)
  - frontend/app/robots.ts (inspected)
  - frontend/app/blog/[slug]/page.tsx (inspected)
tests:
  - none (audit only)
---

## Prompt

hi see either our blog is perfect and state of the art? publishing daily? if yes, then why we are not getting views on our blog and website? either our agents and instructions/prompts for agents are wll enough to run a state of the art blog? you need serious considerations on these things.

## Response

Honest audit verdict: the per-article agent prompts are good, but the system is not state of the art and is actively self-sabotaging:

1. **Keyword cannibalization at scale (the #1 reason for zero views):** 73 posts target only 5 fixed primary keywords from CATEGORY_SEO. Live sitemap shows ~14 near-identical posts per keyword (e.g. sba-loan-eligibility-requirements-20260611 / -20260527 / -20260522 / ...), several with byte-identical title tags. This matches Google's "scaled content abuse" spam pattern and suppresses the whole domain.
2. **Not actually publishing daily:** gaps on May 28-31, June 1, 3, 6-8.
3. **robots.txt sitemap URL is malformed** (`Sitemap: https://usfundingclimate.com           /sitemap.xml`) — robots.ts does not .trim() NEXT_PUBLIC_SITE_URL while sitemap.ts does.
4. **Contradiction:** writer prompt has "AI SEO & CITATION RULES" for ChatGPT/Perplexity citations, but Cloudflare-managed robots.txt blocks GPTBot, ClaudeBot, CCBot, Google-Extended, meta-externalagent.
5. **Duplicate site name in every blog title** (page.tsx appends suffix already added by layout.tsx title template).
6. CONTENT_STRATEGY.md (April 2026) already diagnosed daily-AI-only posting as the problem; the 3-tier model was never implemented — content_calendar exists in crew.py but June slugs show it is not driving topic variety.

Recommended priority: consolidate duplicate posts (301 to one canonical evergreen URL per keyword), make the content calendar generate unique long-tail topics, fix robots.ts trim bug, resolve AI-bot blocking contradiction, fix title duplication, add E-E-A-T (bylines), add distribution beyond SEO.
