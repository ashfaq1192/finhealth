# Research: US Business Funding Climate Dashboard

**Branch**: `001-funding-health-dashboard` | **Date**: 2026-03-07

---

## 1. FRED API Data Fetching Pattern

**Decision**: Use direct `requests` HTTP calls to the FRED v2 REST API.

**Rationale**: The `fredapi` PyPI package adds an unnecessary dependency. Direct
`requests` calls are simpler, more transparent, and easier to mock in testing.
FRED API v2 is stable and free with an API key.

**Fetch pattern** for each series (latest value):
```
GET https://api.stlouisfed.org/fred/series/observations
  ?series_id={SERIES_ID}
  &api_key={FRED_API_KEY}
  &sort_order=desc
  &limit=5
  &file_type=json
```
Take the first non-null `value` from `observations`. The `limit=5` guard covers
weekends/holidays when no new daily value is published — we fall back to the
most recent available observation.

**BUSAPPWNSAUS 4-week trend**: Fetch `limit=5` observations, compute simple average
of the 4 most recent values, compare to the 5th (oldest). If average > oldest,
trend is upward.

**Alternatives considered**:
- `fredapi` PyPI package — rejected (extra dep, no benefit for 6 series)
- pandas-datareader — rejected (heavyweight, pulls in pandas)

---

## 2. Blog Category Rotation

**Decision**: Derive category from `(ISO day-of-year) % 5` mapped to a fixed list.

**Rationale**: Pure function of date — no state management, no DB column needed,
deterministic and reproducible. If the pipeline re-runs on the same day it gets
the same category, which is correct for the upsert behavior.

**Mapping** (0-indexed):
```
0 → Trucking
1 → Retail
2 → SBA Loans
3 → Macro
4 → Staffing
```

**Alternatives considered**:
- Storing a counter in the DB — rejected (adds schema complexity for zero benefit)
- Counting blog posts mod 5 — rejected (breaks if posts are ever deleted or missed)

---

## 3. CrewAI + Groq Integration Pattern

**Decision**: Use `langchain-groq` `ChatGroq` class passed explicitly to each
CrewAI `Agent` via the `llm=` parameter.

**Rationale**: CrewAI defaults to OpenAI if no LLM is set. Setting `llm=` explicitly
on every agent is required by Constitution Principle V. This also makes agent
behaviour reproducible across environments.

**Pattern**:
```python
from langchain_groq import ChatGroq
from crewai import Agent

llm = ChatGroq(
    model="groq/llama-3.3-70b-versatile",
    temperature=0.3,
    max_tokens=2048,
)

agent = Agent(role="...", goal="...", llm=llm)
```

**Token budget** (Groq free tier: 500K/day):
- Agent 1 (fetch): ~200 tokens (prompt only, no LLM reasoning)
- Agent 2 (scoring): ~800 tokens
- Agent 3 (blog 600+ words): ~1,200 tokens
- Total per run: ~2,200 tokens → well within 500K/day limit

**Alternatives considered**:
- LiteLLM proxy — rejected (unnecessary complexity)
- OpenAI API — rejected (cost, prohibited by constitution)

---

## 4. Supabase Upsert Pattern

**Decision**: Use `supabase-py` client with `.upsert()` and `on_conflict` set to
the `date` column (unique constraint).

**Rationale**: Satisfies FR-007 clarification (upsert on re-run). Single call,
atomic, no need for select-then-insert logic.

**Pattern**:
```python
from supabase import create_client

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

supabase.table("daily_scores").upsert(
    {
        "date": "2026-03-07",
        "health_score": 72,
        ...
    },
    on_conflict="date"
).execute()
```

**Alternatives considered**:
- Raw psycopg2 — rejected (requires connection string management, supabase-py is simpler)
- `INSERT ... ON CONFLICT` via raw SQL — rejected (supabase-py upsert is idiomatic)

---

## 5. Frontend Hosting on Cloudflare Pages (Next.js 15)

**Decision**: Deploy Next.js 15 App Router with `@cloudflare/next-on-pages` adapter,
using edge runtime for server components that query Supabase.

**Rationale**:
- Edge runtime on Cloudflare Pages means data is always fresh on request — no
  deploy hook needed after each cron run.
- `@cloudflare/next-on-pages` is the official Cloudflare adapter for Next.js.
- Static ISR is not needed because the cron runs once per day — edge rendering
  is fast enough and simpler.

**Build command**: `npx @cloudflare/next-on-pages`
**Output directory**: `.vercelout` (managed by adapter)

**Data flow**:
- Server Components fetch from Supabase using the anon key (public read)
- No API routes needed — Supabase JS client reads directly from the DB
- Charts (recharts) rendered client-side with data passed as props

**Alternatives considered**:
- Vercel — rejected (ToS violation for commercial use on Hobby plan)
- Static SSG + deploy hook — rejected (edge runtime is simpler, no webhook to manage)
- Netlify — considered but Cloudflare Pages has better global edge performance

---

## 6. Failure Email Alert from GitHub Actions

**Decision**: Use GitHub's built-in workflow failure notification (no extra config).

**Rationale**: GitHub automatically emails the repository owner when a workflow
run fails (configurable in GitHub notification settings). This satisfies FR-013
at zero cost and zero implementation effort.

**Additional**: Add a final `if: failure()` step in the workflow that writes a
GitHub Actions job summary with failure details — visible in the Actions UI.

**Alternatives considered**:
- SendGrid / Mailgun API call — rejected (unnecessary complexity and a new dependency)
- Slack webhook — rejected (operator has no Slack; email is sufficient per spec)

---

## 7. Staleness Detection (3-Day Threshold)

**Decision**: Compute staleness on the frontend by comparing `MAX(date)` from
`daily_scores` to today's UTC date. If `(today - max_date) > 3 days`, show the
"data unavailable" notice instead of the score.

**Rationale**: Simple date arithmetic, no backend change needed, deterministic.

**Suppress AdSense on stale state**: Conditionally render ad placement components
only when score is available. When showing the notice, do not render ad zones
(avoids AdSense policy issues with empty/error pages).

---

## 8. Scoring Formula Implementation

All deductions/bonuses computed in Python (Agent 2). Formula from blueprint:

```
score = 100

# Deductions
score -= 5 * max(0, (dprime - 5.0) / 0.25)        # per 0.25% above 5%
score -= 1 * max(0, drtscilm)                       # per 1% tightening (large)
score -= 0.5 * max(0, drtscis)                      # per 1% tightening (small)
score -= 3 if t10y2y < 0 else 0                     # inverted yield curve
score -= 1 * max(0, (icsa - 250000) / 10000)        # per 10K above 250K baseline

# Bonuses
score += 5 if busappwnsaus_trending_up else 0
score += 3 if t10y2y > 1.0 else 0

score = max(0, min(100, round(score)))               # clamp to 0-100
```

**Label mapping**:
- 80-100 → Optimal
- 60-79 → Moderate
- 40-59 → Risky
- 0-39  → Critical
