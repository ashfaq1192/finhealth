---
name: 002-blog-table-of-contents
description: Implement sticky auto-generated Table of Contents in blog article sidebar
metadata:
  type: general
  stage: general
  date: 2026-05-19
  surface: agent
  model: claude-sonnet-4-6
  feature: none
  branch: master
  user: ashfaq1192
  command: chat
  labels: ["blog", "frontend", "ux", "table-of-contents", "scroll-spy"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
---

## Prompt (verbatim)

"this is the last session: Everything Implemented [...] I have pasted the linkedin url, next see how we can make our blog state of the art from the frontend and functionality wise."

User selected: **Table of Contents (sticky sidebar)** from a set of options (TOC, reading progress bar, featured hero post, prev/next navigation).

## Response

Implemented a sticky auto-generated Table of Contents for blog article pages.

### Files created
- `frontend/components/TableOfContents.tsx` — Client component with scroll-spy using `window.scroll` listener. Highlights the active heading as the user scrolls. H3s are indented with a left border. Hidden when fewer than 2 headings exist.

### Files modified
- `frontend/app/blog/[slug]/page.tsx`:
  - Added `slugify()` utility to generate URL-safe IDs from heading text
  - Added `processHeadings()` that injects `id` attributes into H2/H3 tags in the sanitized HTML and returns the heading list (runs after sanitize-html to avoid stripping)
  - Added `h2: ["id"]` and `h3: ["id"]` to sanitize-html allowedAttributes
  - Changed `safeHtml` pipeline: `sanitizeHtml()` → `processHeadings()` → `{ html: safeHtml, headings }`
  - Imported `TableOfContents` and placed it at top of sidebar
  - TypeScript check passed with zero errors

## Outcome

TOC renders in the sticky sidebar on desktop. Active section highlighted in blue as user scrolls. Renders only when ≥2 headings are found. H3 items are visually indented relative to H2s.
