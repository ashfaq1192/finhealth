---
id: "0009"
title: eeeat-pages-fomc-schema-internal-links
stage: green
date: 2026-03-08
surface: agent
model: claude-sonnet-4-6
feature: 001-funding-health-dashboard
branch: 001-funding-health-dashboard
user: ashfaq
command: (conversational)
labels: ["eeeat","about-page","methodology","legal","fomc","schema-markup","internal-linking","adsense","seo"]
links:
  spec: specs/001-funding-health-dashboard/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - frontend/app/about/page.tsx
  - frontend/app/methodology/page.tsx
  - frontend/app/legal/page.tsx
  - frontend/components/FOMCCountdown.tsx
  - frontend/components/Header.tsx
  - frontend/components/Disclaimer.tsx
  - frontend/app/page.tsx
  - frontend/app/blog/[slug]/page.tsx
  - backend/tasks.py
tests:
  - npx tsc --noEmit (passes clean)
---

## Prompt

yes please implement:
1. Build About + Methodology + Legal pages — blocks AdSense without these
2. Add FOMC countdown widget — small build, real user value, drives return visits
3. Add schema markup to blog posts — free ranking boost
4. Add internal linking logic to the writer agent's task — instruct it to reference older posts by topic

Also provided Gemini's detailed About page blueprint (E-E-A-T strategy, M.Phil credentials framing, mission statement copy, trust bar suggestion).

## Response

Implemented all 4 items across 9 files. TypeScript passes clean (tsc --noEmit).

**1. Static E-E-A-T Pages (3 new pages):**
- `frontend/app/about/page.tsx` — Founder bio with M.Phil credentials, mission statement blockquote, 4-pillar technical edge section, trust bar (6 indicators / Daily / Free), contact section. Constants at top for easy name/email update.
- `frontend/app/methodology/page.tsx` — Full scoring formula in code block (dark theme), all 6 FRED series IDs with exact series codes (DPRIME, DRTSCILM, DRTSCIS, T10Y2Y, ICSA, BUSAPPWNSAUS), AI transparency note, data lag disclosure.
- `frontend/app/legal/page.tsx` — Financial disclaimer (red highlight, non-advice statement), affiliate/AdSense disclosure, data sources, AI content disclosure, full CCPA/GDPR privacy policy.

**2. FOMC Countdown Widget:**
- `frontend/components/FOMCCountdown.tsx` — Client component with hardcoded FOMC decision dates (2025–2026). Color-coded urgency: normal (white) → approaching ≤21d (amber) → imminent ≤7d (red). Shows "Today" on decision day with live alert. Zero-render until hydrated (no SSR mismatch).
- Added to homepage sidebar in `frontend/app/page.tsx`.

**3. JSON-LD Schema Markup:**
- `frontend/app/blog/[slug]/page.tsx` — `BlogPosting` schema injected via `<script type="application/ld+json">` in a React fragment. Fields: headline, description, datePublished, dateModified, url, mainEntityOfPage, author (Person + /about URL), publisher (Organization), articleSection, keywords, image (extracted from first markdown image via regex).
- Also fixed `sanitizeHtml()` to allow `img` tags and `https://` src — required for Pollinations images to render.

**4. Internal Linking in Writer Agent:**
- `backend/tasks.py` writer task — Added mandatory internal links section: 2 links required per post. Link 1: `/blog?category={category}` with natural anchor text (topical authority). Link 2: `/` homepage score dashboard. Both are evergreen, never go stale.

**Navigation:**
- `frontend/components/Header.tsx` — Added Methodology and About nav links.
- `frontend/components/Disclaimer.tsx` — Expanded footer with About / Methodology / Legal links, responsive flex layout.
