# US Business Funding Climate Index

**Live site:** [usfundingclimate.com](https://usfundingclimate.com)

A daily AI-powered dashboard that tells small business owners whether today is a good or bad day to seek funding.

## What It Does

Every day at 9 AM EST, the pipeline automatically:

1. Pulls live data from the US Federal Reserve (FRED API)
2. Calculates a **Funding Climate Score** (0–100) using 6 economic indicators
3. Publishes an AI-written analysis explaining what's driving the score

### Scoring Indicators
| Indicator | FRED Series | Signal |
|---|---|---|
| Prime Rate | `DPRIME` | Daily |
| C&I Lending Standards (large firms) | `DRTSCILM` | Quarterly |
| C&I Lending Standards (small firms) | `DRTSCIS` | Quarterly |
| Treasury Yield Spread (10Y–2Y) | `T10Y2Y` | Daily |
| Initial Jobless Claims | `ICSA` | Weekly |
| Business Applications | `BUSAPPWNSAUS` | Weekly |

### Score Labels
| Range | Label |
|---|---|
| 80–100 | Optimal |
| 60–79 | Moderate |
| 40–59 | Risky |
| 0–39 | Critical |

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 15+ (App Router) + Tailwind CSS |
| Hosting | Cloudflare Pages |
| Database | Supabase (Free Tier) |
| AI Orchestration | CrewAI + Groq (llama-3.3-70b-versatile) |
| Data | FRED API |
| Automation | GitHub Actions (public repo — unlimited free minutes) |

## Project Structure

```
finhealth/
├── frontend/          # Next.js app (Cloudflare Pages)
├── backend/           # Python pipeline (CrewAI + FRED)
│   ├── crew.py        # Main orchestration
│   ├── agents.py      # CrewAI agent definitions
│   ├── tasks.py       # CrewAI task definitions
│   ├── scorer.py      # Funding Climate Score logic
│   └── digest.py      # Daily email digest (Resend API)
├── supabase/
│   └── migrations/    # DB schema
├── .github/
│   └── workflows/     # Daily pipeline + deploy
└── specs/             # SDD artifacts (spec, plan, tasks)
```

## GitHub Secrets Required

| Secret | Purpose |
|---|---|
| `FRED_API_KEY` | FRED data API |
| `GROQ_API_KEY` | LLM inference |
| `SUPABASE_URL` | Database connection |
| `SUPABASE_KEY` | Database auth |
| `RESEND_API_KEY` | Email digest |
| `SITE_URL` | Used in digest emails |

## Status

**COMPLETE & LIVE** — All 30 tasks implemented. Deployed to Cloudflare Pages. Pipeline running daily.

Built with [Spec-Driven Development](https://github.com/speckit) methodology.
