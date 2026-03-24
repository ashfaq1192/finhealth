---
id: "0015"
title: Animated Score Reveal Slot Machine
stage: green
date: 2026-03-24
surface: agent
model: claude-sonnet-4-6
feature: 001-funding-health-dashboard
branch: master
user: ashfaq
command: chat
labels: ["animation","engagement","ux","client-component","sessionStorage"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/components/ScoreCard.tsx
  - frontend/components/ContextStatsPanel.tsx
  - frontend/app/page.tsx
tests:
  - npm run build (passed, no type errors)
---

## Prompt

can we make our dashboard/frontend more engaging? I mean what if when a user visits our homepage and instead of seeing a static score he sees that a counter runs(like lucky draw etc) and then in the end score appears on dashboard and remains static after that i mean for that session only. If he visits again after some minutes then he again sees that a counter runs and then financial health score is displayed? Same behaviour for all user? is that possible to implement? I think it will be really helpful for engaging users and if we can do similar things for other stats as well? any idea?

## Response snapshot

Implemented slot-machine animation for the Business Funding Climate Score and count-up animations for CPI/NFIB stats:

1. **ScoreCard.tsx** → converted to `"use client"`. Added `useSlotMachineScore` hook: Phase 1 (1.2s) cycles random numbers 0-100 every 75ms (lucky draw feel); Phase 2 (1s) uses easeOutCubic to settle on real value. Progress bar marker also animates. Key drivers hidden behind pulsing skeleton placeholders during animation, revealed on completion.

2. **ContextStatsPanel.tsx** → new client component. Extracts CPI % and NFIB index cards from page.tsx. Uses `useCountUp` hook (count from 0 with easeOut over 1.4s). Card background colors also transition from grey → colored on completion.

3. **page.tsx** → replaces inline CPI/NFIB JSX with `<ContextStatsPanel cpi_yoy={...} nfib_optimism={...} />`.

**Session logic:** Single key `fh_score_anim_v1` in sessionStorage. All components check the same key at mount (before any marks it done) — so all animate on first visit. After any component calls `markAnimationPlayed()`, key is written with current timestamp. 30-minute TTL: animation replays if user returns after 30 min.

## Outcome

- ✅ Impact: Homepage score reveal is now a "lucky draw" slot-machine experience, significantly boosting engagement and perceived data freshness. CPI and NFIB numbers count up from zero with color transitions.
- 🧪 Tests: npm run build passed cleanly, no TypeScript errors
- 📁 Files: Modified ScoreCard.tsx, created ContextStatsPanel.tsx, updated page.tsx
- 🔁 Next prompts: Could also animate FOMCCountdown days counter, or add a confetti burst when score lands in Optimal zone
- 🧠 Reflection: Shared session key across components ensures all stats animate together without needing a context provider. easeOutCubic for Phase 2 gives a satisfying "settling" feel.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): build — PASS
- Prompt variant (if applicable): null
- Next experiment: Add subtle sound effect or haptic feedback on score land (mobile)
