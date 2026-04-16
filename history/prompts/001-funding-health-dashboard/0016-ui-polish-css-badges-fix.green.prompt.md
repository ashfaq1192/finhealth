---
name: UI Polish — CSS Badge Fix for All Pages
description: Fixed Tailwind dynamic class scanning issue causing colored icon badges to render as blank boxes on contact, about, and advertise pages. Replaced dynamic color variable pattern with hardcoded static classes.
type: green
stage: green
date: 2026-04-16
feature: 001-funding-health-dashboard
branch: master
surface: agent
model: claude-sonnet-4-6
---

## Prompt

Have you make sure that the UI of each page/section/functionality is allegent and perfect?

## Context

Previous session had replaced emoji icons (which render as blank boxes in headless Chrome on Linux) with CSS colored badge divs. However those badges used a Tailwind dynamic class pattern (`className={\`${color} w-9 h-9...\`}`) which Tailwind's JIT scanner cannot detect — so the background colors were not included in the generated CSS bundle. Result: styled divs with no visible background color (appeared as blank outlines).

## Changes Made

### Root Cause
Tailwind CSS JIT scans source files statically for complete class names. When a class like `bg-blue-600` only appears as a value in a JavaScript data array (e.g., `color: "bg-blue-600"`), it is never included in the CSS output.

### Fix Applied

**`frontend/app/contact/page.tsx`**
- Removed data array + `.map()` pattern for contact reason cards
- Replaced with 4 hardcoded card divs with statically-present Tailwind classes:
  - D = `bg-blue-600` (Data Corrections)
  - M = `bg-purple-600` (Media & Press)
  - P = `bg-green-600` (Advertising & Partnerships)
  - Q = `bg-slate-600` (General Questions)

**`frontend/app/about/page.tsx`**
- Replaced `.map()` in "How We Build It" section with 4 hardcoded step rows:
  - 1 = `bg-blue-600`, 2 = `bg-purple-600`, 3 = `bg-green-600`, 4 = `bg-orange-500`

**`frontend/app/advertise/page.tsx`**
- Removed `AD_OPTIONS` data array entirely
- Replaced `AD_OPTIONS.map()` with 4 hardcoded cards (E/S/T/A letter badges):
  - E = `bg-blue-600` Email Digest (blue pill: `bg-blue-100 text-blue-700`)
  - S = `bg-green-600` Sponsored Content (green pill: `bg-green-100 text-green-700`)
  - T = `bg-purple-600` Tool Co-Branding (purple pill: `bg-purple-100 text-purple-700`)
  - A = `bg-orange-500` Affiliate Partnership (orange pill: `bg-orange-100 text-orange-700`)

### Also Completed in Session

- Cash flow runway chart: `h-20` → `h-36`, bars `72px` → `100px` max, dollar labels above bars
- Loan comparison winner banner: solid `bg-green-600` with white text (was pale green)
- Cheapest loan card: `ring-2 ring-green-400 ring-offset-2 shadow-lg shadow-green-100`
- Tools hub loan comparison badge: `bg-slate-100` → `bg-indigo-100 text-indigo-700`
- Tools hub pillar grid: `sm:grid-cols-2` → `sm:grid-cols-3` with colored `border-t-4` tops and "Read guide →" CTAs

## Tests
- TypeScript: `npx tsc --noEmit` → EXIT:0
- Visual: Puppeteer screenshots confirmed all 3 pages now render colored badges correctly
- DOM verification: `querySelector('[class*="bg-blue-600"]')` returns the element with correct computed background

## Files Modified
- frontend/app/contact/page.tsx
- frontend/app/about/page.tsx
- frontend/app/advertise/page.tsx
- frontend/app/tools/cash-flow-runway/page.tsx
- frontend/app/tools/loan-comparison/page.tsx
- frontend/app/tools/page.tsx
