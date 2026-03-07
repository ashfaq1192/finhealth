---
description: "Task list for US Business Funding Climate Dashboard"
---

# Tasks: US Business Funding Climate Dashboard

**Input**: Design documents from `/specs/001-funding-health-dashboard/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/data-access.md, research.md
**Tests**: Not requested — no test tasks generated.
**Organization**: Tasks follow constitution build order (DB → backend → automation → frontend).

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1–US4)

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Create project skeletons and shared config so all subsequent tasks have a home.

- [x] T001 Create directory structure: `backend/`, `frontend/`, `supabase/migrations/`, `.github/workflows/`
- [x] T002 [P] Initialize Next.js 15 frontend in `frontend/` — run `npx create-next-app@latest frontend --typescript --tailwind --app --no-src-dir --import-alias "@/*"` then install extras: `recharts @supabase/supabase-js date-fns @cloudflare/next-on-pages`
- [x] T003 [P] Create `backend/requirements.txt` with: `crewai langchain-groq requests supabase python-dotenv`
- [x] T004 [P] Create `.gitignore` at repo root including: `.env`, `.env.local`, `__pycache__/`, `node_modules/`, `.next/`, `.vercel/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database schema and shared clients MUST exist before any user story code runs.

**CRITICAL**: No user story work can begin until this phase is complete.

- [x] T005 Create Supabase SQL migration `supabase/migrations/001_initial_schema.sql` — copy exact SQL from `specs/001-funding-health-dashboard/data-model.md` (daily_scores table, blog_posts table, indexes, RLS policies for anon SELECT and service_role ALL)
- [x] T006 [P] Create `frontend/lib/supabase.ts` — initialise Supabase JS anon client using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` env vars; export a single `supabase` client instance
- [x] T007 [P] Create `frontend/.env.local.example` with keys: `NEXT_PUBLIC_SUPABASE_URL=`, `NEXT_PUBLIC_SUPABASE_ANON_KEY=`
- [x] T008 [P] Create `backend/.env.example` with keys: `FRED_API_KEY=`, `GROQ_API_KEY=`, `SUPABASE_URL=`, `SUPABASE_SERVICE_KEY=`

**Checkpoint**: Run migration in Supabase SQL editor. Confirm both tables exist with RLS enabled.

---

## Phase 3: User Story 4 — Automated Daily Data Refresh (Priority: P1)

**Goal**: The complete backend pipeline that fetches FRED data, scores it, writes to Supabase,
and generates a blog post — runnable manually and triggered daily by GitHub Actions.

**Independent Test**: Run `python backend/crew.py` manually. Confirm a row in `daily_scores`
and a row in `blog_posts` appear in Supabase for today's date. Re-run and confirm the rows
are overwritten (upserted), not duplicated.

### Implementation for User Story 4

- [x] T009 [P] [US4] Create `backend/fred.py` — implement `fetch_all_indicators()` function that calls FRED API v2 for all 6 series (DPRIME, DRTSCILM, DRTSCIS, T10Y2Y, ICSA, BUSAPPWNSAUS) using `requests`; each series fetched with `sort_order=desc&limit=5`; returns dict with latest non-null value for each series plus `busapp_trending_up` boolean (current avg of 4 most recent vs 5th observation)
- [x] T010 [P] [US4] Create `backend/scoring.py` — implement `calculate_score(indicators: dict) -> dict` as a pure function (no CrewAI dependency); apply scoring formula from plan.md (baseline 100, deductions for DPRIME/DRTSCILM/DRTSCIS/T10Y2Y/ICSA, bonuses for BUSAPPWNSAUS trend and T10Y2Y); clamp to 0-100; map to status_label; return `{health_score, status_label}`
- [x] T011 [P] [US4] Create `backend/agents.py` — define three CrewAI Agent instances each with explicit `llm=ChatGroq(model="groq/llama-3.3-70b-versatile", temperature=0.3)`: (1) `data_fetcher_agent` role="Financial Data Analyst", (2) `economist_agent` role="Senior Macroeconomist with M.Phil Economics", (3) `writer_agent` role="US B2B Finance Journalist"
- [x] T012 [US4] Create `backend/tasks.py` — define three CrewAI Task instances: (1) fetch task (calls `fred.fetch_all_indicators()`, outputs JSON), (2) economist task (calls `scoring.calculate_score()`, produces score + 3 reasoning bullets as JSON), (3) writer task (generates 600+ word blog post for today's category using `(datetime.utcnow().timetuple().tm_yday % 5)` rotation: `['Trucking','Retail','SBA Loans','Macro','Staffing']`; targets one high-CPC keyword per category; include negative guardrail in writer task description: "Describe economic conditions and their implications only. Do NOT recommend specific financial products, advise the reader to borrow, or make any direct investment or lending recommendation."; outputs `{title, slug, content, meta_description}`)
- [x] T013 [US4] Create `backend/crew.py` — main entry point; loads env vars via `python-dotenv`; instantiates `Crew(agents=[...], tasks=[...], verbose=True)`; runs crew; extracts output; upserts score record to `daily_scores` and blog post to `blog_posts` via supabase-py service_role client using `.upsert(data, on_conflict="date")`; prints run summary to stdout; exits with code 1 on full failure
- [x] T014 [US4] Create `.github/workflows/main.yml` — cron trigger `0 14 * * *` (14:00 UTC / 09:00 AM EST); steps: checkout, setup-python@v5 (python 3.11), `pip install -r backend/requirements.txt`, `python backend/crew.py`; secrets used: `FRED_API_KEY`, `GROQ_API_KEY`, `SUPABASE_URL`, `SUPABASE_KEY`; set `GROQ_API_KEY` env var for langchain-groq; add `workflow_dispatch` trigger for manual runs; GitHub's built-in failure notification satisfies FR-013 email alert

**Checkpoint**: Run `python backend/crew.py` locally. Verify Supabase has today's score + blog post. Re-run and verify upsert (not duplicate).

---

## Phase 4: User Story 1 — Homepage Score Display (Priority: P1)

**Goal**: Homepage showing today's funding climate score (0-100), status label, "as of [date]",
3 reasoning bullets, and compliance disclaimer. No chart yet (US3).

**Independent Test**: Open `http://localhost:3000`. Score MUST be visible above fold, label MUST
match one of 4 values, "as of [date]" MUST be present, 3 bullets MUST appear. Load in <3 seconds.
Test staleness states by temporarily inserting a `daily_scores` row dated 5 days ago.

### Implementation for User Story 1

- [x] T015 [P] [US1] Create `frontend/components/Disclaimer.tsx` — render the exact disclaimer text from constitution: "Disclaimer: This score is an AI-generated economic indicator for educational purposes only. We are not a financial institution. Always consult a licensed financial advisor before making borrowing decisions." — sticky footer, full width, small text, accessible contrast
- [x] T016 [P] [US1] Create `frontend/components/AdSlot.tsx` — accepts `visible: boolean` prop; when `visible=true` renders a `<div>` placeholder with correct `data-ad-*` attributes for AdSense and `aria-label="Advertisement"`; when `visible=false` renders `null`; no AdSense script loaded here
- [x] T017 [P] [US1] Create `frontend/components/ScoreCard.tsx` — accepts `score: number | null`, `label: string | null`, `date: string | null`, `reasoning: string[]`, `state: 'current'|'stale'|'unavailable'|'cold-start'` props; renders: (current/stale) large gauge number + colour-coded label badge + "as of [date]" + 3 reasoning bullets; (unavailable) "Data temporarily unavailable — check back soon"; (cold-start) "Launching soon — check back tomorrow"; apply colour: Optimal=green, Moderate=amber, Risky=orange, Critical=red
- [x] T018 [US1] Create `frontend/app/layout.tsx` — root layout with `<html lang="en">`; import Tailwind globals; include `<Disclaimer />` as sticky footer; set default metadata title "US Business Funding Climate Score" and description for SEO
- [x] T019 [US1] Create `frontend/app/page.tsx` — Next.js 15 Server Component with `export const runtime = 'edge'`; fetch Q1 (latest score) and Q2 (last 30 scores) from Supabase using queries from `contracts/data-access.md`; compute `ScoreState` using staleness logic (diff > 3 days = unavailable); render `<ScoreCard>` above fold + `<AdSlot visible={state !== 'unavailable' && state !== 'cold-start'}>` below ScoreCard; leave a placeholder `{/* TrendChart added in US3 */}` comment where chart will go

**Checkpoint**: Homepage shows score card above fold on desktop. Staleness states render correctly. Disclaimer visible at bottom. Page loads in <3s.

---

## Phase 5: User Story 2 — Blog Section (Priority: P2)

**Goal**: Blog listing page and individual post pages showing AI-generated daily economic updates.

**Independent Test**: Navigate to `/blog`. At least one post listed. Click a post — content MUST
be 600+ words, show category tag, show score reference. Category tag MUST match one of 5 values.

### Implementation for User Story 2

- [x] T020 [P] [US2] Create `frontend/components/BlogList.tsx` — accepts `posts: {date, title, slug, category, meta_description}[]` prop; renders list of post cards each with: title (linked to `/blog/[slug]`), category badge, publication date (formatted as "March 7, 2026"), excerpt from `meta_description`; reverse-chronological order (data already ordered by query)
- [x] T021 [US2] Create `frontend/app/blog/page.tsx` — Server Component with `export const runtime = 'edge'`; fetch Q3 (blog listing, 10 most recent) from Supabase; render `<BlogList posts={data} />`; include page `<title>` "Business Funding News & Analysis" and meta description
- [x] T022 [US2] Create `frontend/app/blog/[slug]/page.tsx` — Server Component with `export const runtime = 'edge'`; fetch Q4 (single post by slug) from Supabase; if not found return `notFound()`; render: `<h1>` title, category badge, date, markdown content rendered as sanitised HTML (convert markdown with `marked`, sanitise output with `DOMPurify` before passing to `dangerouslySetInnerHTML` — this is mandatory to prevent XSS from AI-generated content); `<AdSlot visible={true} />` between title and content; set `<title>` and `<meta name="description">` from post data

**Checkpoint**: `/blog` lists posts. `/blog/2026-03-07-trucking` renders full post with category, date, 600+ word content, ad slot visible.

---

## Phase 6: User Story 3 — Score Trend Chart (Priority: P3)

**Goal**: 30-day score trend line chart on homepage, readable on mobile.

**Independent Test**: On homepage, line chart renders with data points. Hover shows score + date.
At 375px viewport width, chart scrolls or scales without breaking layout.

### Implementation for User Story 3

- [x] T023 [P] [US3] Create `frontend/components/TrendChart.tsx` — `'use client'` component (recharts requires browser); accepts `data: {date: string, health_score: number}[]` prop; renders recharts `<LineChart>` with `<Line>` for health_score, `<XAxis>` formatted as short date, `<YAxis>` domain [0,100], `<Tooltip>` showing score + date, `<ResponsiveContainer width="100%" height={200} />`; if `data.length < 2` render "Chart fills in daily as scores are recorded"
- [x] T024 [US3] Update `frontend/app/page.tsx` — replace the `{/* TrendChart added in US3 */}` comment with `<TrendChart data={trendData} />` where `trendData` is the Q2 result already fetched; import TrendChart with `dynamic(() => import('@/components/TrendChart'), { ssr: false })` to avoid SSR issues with recharts

**Checkpoint**: Homepage shows score card AND trend chart. Chart is visible at 375px viewport. Hovering data points shows tooltips.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Cloudflare Pages adapter config, mobile verification, final wiring.

- [x] T025 Update `frontend/next.config.ts` — add `@cloudflare/next-on-pages` plugin: `import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev'; if (process.env.NODE_ENV === 'development') { await setupDevPlatform(); }` and set `experimental: { runtime: 'edge' }` if required by adapter version
- [x] T026 [P] Add markdown and sanitisation packages to `frontend/package.json` — run `npm install marked @types/marked dompurify @types/dompurify`; both packages are required: `marked` converts markdown to HTML, `dompurify` sanitises the output before `dangerouslySetInnerHTML` in T022
- [x] T027 [P] Create `frontend/app/sitemap.ts` — Next.js 15 App Router sitemap; export default async function that queries Supabase for all `blog_posts` slugs and dates; returns array of `{url, lastModified}` entries including homepage and `/blog`; this is required for SC-004 (search engine indexing within 7 days)
- [x] T028 [P] Create `frontend/app/robots.ts` — Next.js 15 App Router robots; export default function returning `{rules: {userAgent: '*', allow: '/'}, sitemap: '<domain>/sitemap.xml'}`; use `NEXT_PUBLIC_SITE_URL` env var for the domain; add `NEXT_PUBLIC_SITE_URL=` to `frontend/.env.local.example`
- [x] T029 [P] Verify mobile responsiveness — open each page at 375px viewport in browser DevTools; confirm no horizontal scroll on homepage, blog listing, and blog post; add Tailwind responsive classes where needed (no new components)
- [x] T030 Run quickstart.md validation checklist — manually tick each item; confirm all checklist items pass before marking implementation complete

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately; T002/T003/T004 in parallel
- **Foundational (Phase 2)**: Depends on Phase 1 — T005 first (schema), then T006/T007/T008 in parallel
- **US4 Backend (Phase 3)**: Depends on Phase 2 — T009/T010/T011 in parallel, then T012, then T013, then T014
- **US1 Frontend (Phase 4)**: Depends on Phase 2 (DB) and Phase 3 (data to display) — T015/T016/T017 in parallel, then T018, then T019
- **US2 Blog (Phase 5)**: Depends on Phase 4 (layout and Supabase client) — T020 parallel with T021, then T022
- **US3 Chart (Phase 6)**: Depends on Phase 4 (page.tsx exists) — T023 parallel, then T024
- **Polish (Phase 7)**: Depends on all phases complete — T025/T026/T027/T028/T029 in parallel, then T030

### Within Each Phase

- Models/pure functions before services
- Shared components before pages
- Pages after all their components exist
- Workflow after backend script is tested

### Parallel Opportunities

```bash
# Phase 1 — run together:
T002: Init Next.js frontend
T003: Create requirements.txt
T004: Create .gitignore

# Phase 2 — after T005:
T006: supabase.ts client
T007: frontend .env.local.example
T008: backend .env.example

# Phase 3 — run together first:
T009: fred.py
T010: scoring.py
T011: agents.py

# Phase 4 — run together first:
T015: Disclaimer.tsx
T016: AdSlot.tsx
T017: ScoreCard.tsx
```

---

## Implementation Strategy

### MVP (US4 + US1 only — Phases 1-4)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (run SQL migration in Supabase)
3. Complete Phase 3: US4 — test backend pipeline manually
4. Complete Phase 4: US1 — homepage score display
5. **STOP and VALIDATE**: Does the site show a score? Does automation write to Supabase?
6. Deploy to Cloudflare Pages. **MVP is live.**

### Incremental Delivery

1. MVP (US4 + US1) → live site with score
2. Add US2 (blog) → search traffic and AdSense revenue begins
3. Add US3 (chart) → returning visitor retention improves
4. Polish phase → production-ready

### Single Developer Sequence (Recommended)

Day 1 morning: Phase 1 + Phase 2 (setup + DB)
Day 1 afternoon: Phase 3 US4 (backend pipeline — test manually)
Day 2 morning: Phase 4 US1 (homepage)
Day 2 afternoon: Phase 5 US2 (blog)
Day 3: Phase 6 US3 (chart) + Phase 7 (polish + deploy)

---

## Notes

- `[P]` tasks operate on different files — safe to execute simultaneously
- Each user story phase is independently deployable and testable
- No test framework tasks — spec did not request TDD
- Supabase migration MUST be run manually in Supabase dashboard SQL editor before any backend run
- Repo MUST be public (Constitution Principle I) — verify before enabling GitHub Actions
- Never commit `.env` or `.env.local` files — verified by T004 (.gitignore)
