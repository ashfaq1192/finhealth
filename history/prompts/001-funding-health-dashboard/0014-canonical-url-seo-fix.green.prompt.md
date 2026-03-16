---
id: 0014
title: Canonical URL SEO Fix
stage: green
date: 2026-03-17
surface: agent
model: claude-sonnet-4-6
feature: 001-funding-health-dashboard
branch: master
user: ashfaq
command: canonical URL fix for Google Search Console duplicate errors
labels: ["seo","canonical","metadata","next.js"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/app/layout.tsx
  - frontend/app/page.tsx
  - frontend/app/blog/page.tsx
  - frontend/app/about/page.tsx
  - frontend/app/methodology/page.tsx
  - frontend/app/legal/page.tsx
  - frontend/app/blog/[slug]/page.tsx
tests:
  - none
---

## Prompt

Google Search Console is reporting 'Duplicate without user-selected canonical' errors. Please:

Update the metadata in our Next.js layout.tsx or SEO component.

Add a dynamic canonical URL tag to the <head> of every page that points to https://usfundingclimate.com/[page-path].

Ensure we are consistently using non-www and no trailing slashes.

## Response snapshot

Added `metadataBase: new URL("https://usfundingclimate.com")` to `layout.tsx` — this is the Next.js App Router foundation that resolves all relative canonical paths.

Added `alternates: { canonical: "/" }` to layout.tsx and a new `metadata` export on `page.tsx` (homepage had none).

Added `alternates: { canonical: "/blog" | "/about" | "/methodology" | "/legal" }` to each static page's existing `metadata` object.

Added `alternates: { canonical: \`/blog/${slug}\` }` to `generateMetadata` in `app/blog/[slug]/page.tsx` — uses relative path so `metadataBase` resolves it to the full non-www URL.

Next.js emits `<link rel="canonical" href="https://usfundingclimate.com/...">` in the rendered `<head>` for every page. No trailing slashes, no www.

## Outcome

- ✅ Impact: All 7 pages now emit a correct canonical `<link>` tag pointing to `https://usfundingclimate.com/[path]`
- 🧪 Tests: No automated tests; verify in browser DevTools after deploy
- 📁 Files: 7 files modified (layout + 6 pages)
- 🔁 Next prompts: Deploy to Cloudflare Pages and re-submit affected URLs in Google Search Console
- 🧠 Reflection: `metadataBase` in layout.tsx is the single source of truth — relative paths in `alternates.canonical` everywhere else keeps it DRY

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): n/a
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): verify rendered HTML on staging before submitting to GSC
