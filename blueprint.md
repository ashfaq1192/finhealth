# Project Blueprint: "US Business Funding Health Auditor"

## 1. Product Concept & Vision

**Product:** A high-authority B2B financial dashboard providing a "Business Funding Climate Score" for US small businesses — updated whenever new economic data arrives (framed as "Current Score", not "Daily Score", since source data is quarterly/weekly).

**Target Audience:** US-based small business owners, freelancers, and truckers seeking capital (loans, factoring, lines of credit).

**Revenue Hook:** High-CPC AdSense (Finance/Lending niche) + B2B affiliate lead generation.

**Author Authority:** Backed by M.Phil Economics reasoning for E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness).

---

## 2. Technical Stack (Lean-Profit Architecture — $0-$5/month)

| Layer | Choice | Notes |
|---|---|---|
| Frontend | Next.js 15+ (App Router) + Tailwind CSS | Use latest stable Next.js |
| Hosting | Cloudflare Pages (Free) | NOT Vercel — Vercel Hobby ToS prohibits commercial/revenue use |
| Database | Supabase (PostgreSQL) — Free Tier | 500MB DB, 10GB bandwidth — sufficient |
| Orchestration | CrewAI (Python) | Explicitly configure LLM — do not rely on OPENAI_API_KEY fallback |
| LLM | Groq — llama-3.3-70b-versatile | Free: 500K tokens/day, 6K tokens/min |
| Data Source | FRED API (Federal Reserve Economic Data) — Free | API key obtained |
| Automation | GitHub Actions (Cron Job) | Keep repo PUBLIC — unlimited free minutes on public repos |
| Domain | Custom US-oriented .com | ~$10-12/year (~$1/month) |
| MCP Servers | Use where needed for tooling/integrations | |

**Total Estimated Cost: ~$1/month (domain only)**

---

## 3. FRED API Data Sources (Verified Series IDs)

> CRITICAL: The original blueprint had wrong/non-existent FRED series IDs. Use only these verified IDs:

| Indicator | Correct FRED Series ID | Frequency | Purpose |
|---|---|---|---|
| Bank Prime Loan Rate | `DPRIME` | Daily | Core rate indicator (NOT `PRIME` — that is event-based only) |
| Tightening Standards — Large Firms | `DRTSCILM` | Quarterly | Fed SLOOS; published Jan/Apr/Jul/Oct (NOT `DRSRECL` — does not exist) |
| Tightening Standards — Small Firms | `DRTSCIS` | Quarterly | Same SLOOS survey; use alongside DRTSCILM |
| Business Applications | `BUSAPPWNSAUS` | Weekly | (NOT `BUSAPPWDNS` — does not exist) |
| 10-2yr Treasury Yield Spread | `T10Y2Y` | Daily | Recession signal; provides daily score movement |
| Initial Jobless Claims | `ICSA` | Weekly | Labour market signal; provides weekly movement |

**Why 6 indicators:** DRTSCILM/DRTSCIS are quarterly — without T10Y2Y and ICSA the score would be static for 3 months.

---

## 4. Database Schema (Supabase)

### Table: `daily_scores`

| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary Key |
| date | Date | Unique |
| prime_rate | Float | From DPRIME |
| tightening_large | Float | From DRTSCILM |
| tightening_small | Float | From DRTSCIS |
| treasury_spread | Float | From T10Y2Y |
| jobless_claims | Integer | From ICSA |
| business_apps | Integer | From BUSAPPWNSAUS |
| health_score | Integer | 0-100 |
| status_label | Text | "Optimal" / "Moderate" / "Risky" / "Critical" |
| reasoning | JSONB | Array of 3 LLM-generated reasoning bullets |

### Table: `blog_posts`

| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary Key |
| title | Text | |
| slug | Text | Unique |
| content | Text | Markdown/HTML |
| meta_description | Text | |
| category | Text | "Trucking", "Retail", "SBA Loans", "Macro" |
| created_at | Timestamp | |

---

## 5. The Agentic Crew (CrewAI + Groq)

### Agent 1: Data Fetcher (Researcher)
- **Role:** Financial Data Scraper
- **Task:** Fetch `DPRIME`, `DRTSCILM`, `DRTSCIS`, `T10Y2Y`, `ICSA`, `BUSAPPWNSAUS` from FRED API using `requests` library
- **Output:** Clean JSON with all 6 indicators for current date

### Agent 2: Economic Logic Agent (The Economist)
- **Role:** Senior Macroeconomist (M.Phil Economics authority)
- **Scoring Logic:**
  - Baseline: 100 points
  - Deduct 5 pts for every 0.25% DPRIME exceeds 5.0%
  - Deduct 1 pt for every 1% increase in DRTSCILM
  - Deduct 0.5 pts for every 1% increase in DRTSCIS
  - Deduct 3 pts if T10Y2Y is negative (inverted yield curve)
  - Deduct 1 pt for every 10K ICSA above 250K baseline
  - Add 5 pts if BUSAPPWNSAUS trending up vs prior 4-week average
  - Add 3 pts if T10Y2Y > 1.0 (healthy spread)
- **Score Labels:** 80-100 Optimal | 60-79 Moderate | 40-59 Risky | 0-39 Critical
- **Output:** Score + 3 reasoning bullets

### Agent 3: Content Strategist (SEO Writer)
- **Role:** US B2B Finance Journalist
- **Task:** Write 600+ word blog post
- **Target Keywords:** "Invoice Factoring for Staffing", "SBA Loan Eligibility 2026", "Merchant Cash Advance Risks", "Business Line of Credit Requirements"
- **Structure:** Headline → Current Score → Why it changed → Actionable advice for US business owners

**CrewAI LLM Config (important):**
```python
from langchain_groq import ChatGroq
llm = ChatGroq(model="groq/llama-3.3-70b-versatile")
# Pass llm= explicitly to each Agent — never rely on OPENAI_API_KEY fallback
```

---

## 6. Automated Workflow (GitHub Actions)

File: `.github/workflows/main.yml`

- **Trigger:** Daily cron at `0 14 * * *` UTC (09:00 AM EST)
- **Steps:**
  1. Checkout repo
  2. Set up Python 3.11+
  3. Install: `crewai langchain-groq requests supabase`
  4. Run CrewAI script
  5. Push results to Supabase
  6. Trigger Cloudflare Pages rebuild via deploy hook webhook

**Required GitHub Secrets:**
`FRED_API_KEY`, `GROQ_API_KEY`, `SUPABASE_URL`, `SUPABASE_KEY`, `CF_DEPLOY_HOOK`

---

## 7. Frontend Requirements (Cloudflare Pages / Next.js 15)

- **Homepage:** Gauge/Speedometer chart — current score (`recharts` or `react-gauge-chart`)
- **Trend Chart:** Line graph — score over last 30 days (`recharts`)
- **Blog Section:** Fast-loading list with category filters
- **AdSense Placement:** Above-fold banner, sidebar, between blog paragraphs
- **Compliance Footer (sticky):**
  > "Disclaimer: This score is an AI-generated economic indicator for educational purposes only. We are not a financial institution. Always consult a licensed financial advisor before making borrowing decisions."

---

## 8. Environment Variables (.env)

```
FRED_API_KEY=your_fred_key
GROQ_API_KEY=your_groq_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key   # Python backend only
```

---

## 9. Pre-Build Checklist (Manual Steps)

- [x] Get FRED API Key
- [ ] Register .com domain
- [ ] Get Groq API Key
- [ ] Create free Supabase project + run schema migrations
- [ ] Create Cloudflare Pages project + connect GitHub repo
- [ ] Set all GitHub Actions secrets

---

## 10. Build Order

1. Supabase schema (SQL migrations)
2. Python CrewAI backend (`/backend/crew.py`)
3. GitHub Actions workflow (`.github/workflows/main.yml`)
4. Next.js 15 frontend (homepage gauge + blog)
5. Cloudflare Pages deploy hook + webhook trigger in workflow

---

## 11. Status

**Phase:** Blueprint finalized — pre-implementation. No code written yet.
**Last reviewed:** 2026-03-07
**Next step:** Run `/sp.specify` to generate formal feature spec, then `/sp.plan`, then `/sp.tasks`, then `/sp.implement`
