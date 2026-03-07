# Implementation Plan: US Business Funding Climate Dashboard

**Branch**: `001-funding-health-dashboard` | **Date**: 2026-03-07
**Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-funding-health-dashboard/spec.md`

---

## Summary

Build a publicly accessible B2B financial dashboard displaying a "Business Funding
Climate Score" (0-100) for US small business owners. A Python CrewAI pipeline runs
automatically each morning via GitHub Actions, fetches 6 FRED economic indicators,
calculates the score, generates a 600+ word SEO blog post, and persists both to
Supabase. A Next.js 15 frontend on Cloudflare Pages reads from Supabase and
displays the score, trend chart, and blog. Revenue via AdSense and affiliate lead
generation. Total infrastructure cost: ~$1/month (domain only).

---

## Technical Context

**Language/Version**: Python 3.11+ (backend), TypeScript / Node.js 20+ (frontend)

**Primary Dependencies**:
- Backend: `crewai`, `langchain-groq`, `requests`, `supabase`, `python-dotenv`
- Frontend: `next@15`, `tailwindcss`, `recharts`, `@supabase/supabase-js`, `date-fns`, `@cloudflare/next-on-pages`

**Storage**: PostgreSQL via Supabase free tier — 2 tables: `daily_scores`, `blog_posts`

**Testing**: None required at this stage (Constitution Principle VI — minimal viable change)

**Target Platform**: Cloudflare Pages (frontend, edge runtime) + GitHub Actions (automation cron)

**Performance Goals**: Homepage score visible in <3 seconds (SC-002)

**Constraints**: $0–$5/month; public GitHub repo; free tier services only; no auth required

**Scale/Scope**: Single-operator; low traffic initially; ~1 DB write/day + public read traffic

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked post-design below.*

| Principle | Requirement | Status |
|---|---|---|
| I. Zero-Cost | Cloudflare Pages + Supabase free + Groq free + public GitHub Actions | PASS |
| II. Verified Data | Canonical IDs: DPRIME, DRTSCILM, DRTSCIS, T10Y2Y, ICSA, BUSAPPWNSAUS | PASS |
| III. E-E-A-T | Blog cites 2+ indicators; sticky disclaimer; no investment recommendations | PASS |
| IV. Automation-First | GitHub Actions cron sole DB writer; edge runtime refreshes on request | PASS |
| V. No Hardcoded Secrets | All keys in GitHub secrets; ChatGroq explicit; anon/service keys separated | PASS |
| VI. Minimal Change | No auth, no admin panel, no i18n, no test framework at this stage | PASS |

All gates PASS.

*Post-design re-check*: All principles maintained throughout design. No violations.

---

## Project Structure

### Documentation (this feature)

```text
specs/001-funding-health-dashboard/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 research decisions
├── data-model.md        # Database schema + entity definitions
├── quickstart.md        # Setup and validation guide
├── contracts/
│   └── data-access.md   # Supabase query contracts (frontend + backend)
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
backend/
├── crew.py              # Main entry point — runs the CrewAI crew
├── agents.py            # Three agent definitions (Fetcher, Economist, Writer)
├── tasks.py             # Task definitions for each agent
├── scoring.py           # Economic scoring formula (pure function, no CrewAI dep)
├── fred.py              # FRED API fetch functions (6 series via requests)
├── requirements.txt
└── .env.example

frontend/
├── app/
│   ├── layout.tsx       # Root layout — includes sticky Disclaimer footer
│   ├── page.tsx         # Homepage — ScoreCard + TrendChart
│   └── blog/
│       ├── page.tsx     # Blog listing page
│       └── [slug]/
│           └── page.tsx # Individual blog post page
├── components/
│   ├── ScoreCard.tsx    # Score + label + "as of [date]" + 3 reasoning bullets
│   ├── TrendChart.tsx   # Recharts LineChart (last 30 data points)
│   ├── BlogList.tsx     # Listing with title, category tag, date
│   ├── Disclaimer.tsx   # Sticky footer text
│   └── AdSlot.tsx       # Conditional AdSense zone (hidden when unavailable)
├── lib/
│   └── supabase.ts      # Supabase anon client initialisation
├── .env.local.example
├── next.config.ts       # CF Pages adapter config
├── tailwind.config.ts
└── package.json

supabase/
└── migrations/
    └── 001_initial_schema.sql

.github/
└── workflows/
    └── main.yml         # Daily cron 14:00 UTC — runs backend pipeline

.gitignore               # Includes .env, .env.local
```

**Structure Decision**: Web application with separate `backend/` (Python) and
`frontend/` (Next.js 15) directories. No monorepo tooling. Shared only through
Supabase as the data layer.

---

## Phase 0: Research Findings

All decisions documented in `research.md`. Key resolutions:

1. **FRED fetch**: Direct `requests` HTTP calls — no extra client library needed
2. **Category rotation**: `CATEGORIES[(day_of_year % 5)]` — pure date function, no DB state
3. **CrewAI + Groq**: Explicit `llm=ChatGroq(...)` on every agent — no OPENAI_API_KEY fallback
4. **Supabase upsert**: `.upsert(data, on_conflict="date")` for both tables
5. **CF Pages hosting**: Edge runtime via `@cloudflare/next-on-pages` — no deploy hook needed
6. **Failure alert**: GitHub's built-in workflow failure email — zero implementation cost
7. **Staleness**: Frontend date diff — `> 3 days` switches to unavailable notice; AdSense suppressed

No NEEDS CLARIFICATION items remain.

---

## Phase 1: Architecture & Design

### Architecture Overview

```
GitHub Actions (cron 14:00 UTC daily)
  │
  └─► backend/crew.py
        ├─► fred.py        → FRED API (6 series, latest values)
        ├─► scoring.py     → score (0-100) + label + 3 reasoning bullets
        └─► Supabase (service_role key)
              ├─► daily_scores  UPSERT on_conflict=date
              └─► blog_posts    UPSERT on_conflict=date

Browser Request
  │
  └─► Cloudflare Pages (edge runtime)
        └─► Next.js 15 Server Component
              └─► Supabase JS (anon key — read-only via RLS)
                    ├─► Q1: latest score record
                    ├─► Q2: last 30 score records (trend)
                    ├─► Q3: blog post listing (paginated)
                    └─► Q4: single post by slug
```

### Key Design Decisions

**No custom API server**: Frontend reads Supabase directly. RLS policies enforce
security (anon role = SELECT only). Eliminates an infrastructure layer.

**Edge runtime for data freshness**: Every Cloudflare Pages request fetches live
data from Supabase. No rebuild or deploy hook needed after each cron run.

**Scoring as pure function**: `scoring.py` takes raw FRED values, returns score +
label + reasoning. No CrewAI dependency — independently verifiable by pasting
numbers in and checking output.

**Category rotation as date math**: `(day_of_year % 5)` → category index.
Deterministic, idempotent on re-runs, no state to manage.

**Blog slug format**: `f"{date}-{category.lower().replace(' ', '-')}"` e.g.
`2026-03-07-trucking` — unique by construction since date is unique and category
is derived from date.

### Non-Functional Design

| Concern | Approach |
|---|---|
| Performance | Edge Server Components; Supabase indexed on `date DESC` |
| Reliability | Upsert idempotency; FRED fetches last 5 obs, uses first non-null |
| Observability | GitHub Actions job summary on every run; built-in email on full failure |
| Security | Anon key (read-only) in frontend env; service key only in GitHub secrets |
| Compliance | Sticky disclaimer in root layout; AdSlot hidden when state = unavailable |
| Budget | All free tiers; repo public; no paid services |

### Scoring Formula

```
Baseline: 100

Deductions:
  - 5 pts per 0.25% DPRIME exceeds 5.0%
  - 1 pt per 1% DRTSCILM (large firm tightening)
  - 0.5 pts per 1% DRTSCIS (small firm tightening)
  - 3 pts if T10Y2Y < 0 (inverted yield curve)
  - 1 pt per 10K ICSA above 250K baseline

Bonuses:
  + 5 pts if BUSAPPWNSAUS trending up vs prior 4-week average
  + 3 pts if T10Y2Y > 1.0

Final: clamp(round(score), 0, 100)

Labels: 80-100 Optimal | 60-79 Moderate | 40-59 Risky | 0-39 Critical
```

---

## Complexity Tracking

No constitution violations. No complexity justification needed.

---

## ADR Suggestions

📋 Architectural decision detected: **Edge runtime (Cloudflare Pages) vs Static SSG + deploy hook** — document freshness trade-offs? Run `/sp.adr edge-runtime-vs-static-ssg`

📋 Architectural decision detected: **Direct Supabase access from frontend (no API gateway)** — document RLS security model? Run `/sp.adr direct-supabase-frontend-access`
