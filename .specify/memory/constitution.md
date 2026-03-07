<!--
SYNC IMPACT REPORT
==================
Version change: 1.0.0 → 1.0.1  (patch — remove deploy hook mandate; edge runtime adopted)
Modified principles:
  - IV. Automation-First: removed "deploy hook" bullet (superseded by edge runtime decision)
  - V. Security: removed CF_DEPLOY_HOOK from required secrets list
Technical Constraints:
  - Build Order step 5 removed (no deploy hook needed)
Deferred TODOs:
  - RATIFICATION_DATE confirmed: 2026-03-07
  - Domain name not yet registered — placeholder in blueprint.md
Rationale: /sp.plan adopted Cloudflare Pages edge runtime (Next.js Server Components fetch
  Supabase on every request). A deploy hook rebuild is no longer needed or correct.
  ADR pending: /sp.adr edge-runtime-vs-static-ssg
-->

# FinHealth Constitution

## Core Principles

### I. Zero-Cost Architecture (NON-NEGOTIABLE)

All infrastructure choices MUST fit within a $0–$5/month operating budget.

- Hosting MUST use Cloudflare Pages (free tier, commercial use permitted).
  Vercel Hobby plan is PROHIBITED — its ToS forbids commercial/revenue-generating use.
- Database MUST use Supabase free tier (500 MB DB, 10 GB bandwidth).
- LLM inference MUST use Groq free tier (llama-3.3-70b-versatile; 500 K tokens/day limit).
- Automation MUST use GitHub Actions on a PUBLIC repository to retain unlimited free minutes.
- Any new dependency or service MUST be evaluated against the budget cap before adoption.

### II. Verified Data Only (NON-NEGOTIABLE)

All economic indicators MUST be sourced from verified, publicly accessible FRED series IDs.
Invented, assumed, or unverified series IDs are PROHIBITED.

Canonical FRED series IDs for this project:

| Indicator                         | FRED ID        | Frequency |
|-----------------------------------|----------------|-----------|
| Bank Prime Loan Rate (daily)      | `DPRIME`       | Daily     |
| C&I Tightening — Large Firms      | `DRTSCILM`     | Quarterly |
| C&I Tightening — Small Firms      | `DRTSCIS`      | Quarterly |
| Business Applications             | `BUSAPPWNSAUS` | Weekly    |
| 10-2yr Treasury Yield Spread      | `T10Y2Y`       | Daily     |
| Initial Jobless Claims            | `ICSA`         | Weekly    |

Any change to these series MUST be verified on fred.stlouisfed.org before implementation
and documented in an ADR.

### III. E-E-A-T Content Integrity

All AI-generated content MUST meet Google's E-E-A-T standards
(Experience, Expertise, Authoritativeness, Trustworthiness).

- Every blog post MUST reference the current score and at least two FRED data points.
- The M.Phil Economics authority framing MUST be consistent across all content.
- The compliance disclaimer MUST appear as a sticky footer on every page:
  > "Disclaimer: This score is an AI-generated economic indicator for educational purposes
  > only. We are not a financial institution. Always consult a licensed financial advisor
  > before making borrowing decisions."
- Content MUST NOT make direct investment or lending recommendations.

### IV. Automation-First (No Manual Data Entry)

Every data fetch, score calculation, and blog post generation MUST be triggered
automatically via GitHub Actions cron (daily at 14:00 UTC / 09:00 AM EST).

- The Python CrewAI pipeline MUST be the sole writer to Supabase `daily_scores`
  and `blog_posts` tables.
- Manual edits to score data in the database are PROHIBITED during normal operation.
- The frontend MUST use Cloudflare Pages edge runtime so that every page request
  fetches fresh data from Supabase without requiring a rebuild or deploy hook.

### V. Security — No Hardcoded Secrets

Secrets MUST NEVER appear in source code or committed files.

- All API keys and credentials MUST be stored in GitHub Actions secrets and loaded
  as environment variables at runtime.
- Required secrets: `FRED_API_KEY`, `GROQ_API_KEY`, `SUPABASE_URL`, `SUPABASE_KEY`.
- The `.env` file MUST be listed in `.gitignore`.
- CrewAI agents MUST have the LLM set explicitly via `llm=ChatGroq(...)`.
  Relying on `OPENAI_API_KEY` environment variable fallback is PROHIBITED.

### VI. Minimal Viable Change

Every implementation task MUST be the smallest change that satisfies the requirement.

- Do not add features, abstractions, or error-handling paths not specified in the
  current task.
- Do not refactor unrelated code during a feature implementation.
- Prefer editing existing files over creating new ones.
- Three similar lines of code are acceptable — premature abstraction is not.

---

## Technical Constraints

### Approved Stack

| Layer        | Technology                              | Version   |
|--------------|-----------------------------------------|-----------|
| Frontend     | Next.js (App Router) + Tailwind CSS     | 15+       |
| Hosting      | Cloudflare Pages                        | Free tier |
| Database     | Supabase (PostgreSQL)                   | Free tier |
| Orchestration| CrewAI + langchain-groq                 | Latest    |
| LLM          | Groq — llama-3.3-70b-versatile          | Current   |
| Data         | FRED API                                | v2        |
| Automation   | GitHub Actions                          | Current   |

### Prohibited Choices

- Vercel (commercial ToS violation on Hobby plan)
- OpenAI API (cost — Groq free tier is sufficient)
- Any paid database tier during initial phase
- Private GitHub repo (loses free Actions minutes)

### Build Order (must be followed)

1. Supabase schema SQL migrations
2. Python CrewAI backend (`/backend/crew.py`)
3. GitHub Actions workflow (`.github/workflows/main.yml`)
4. Next.js 15 frontend (gauge dashboard + blog) with edge runtime

---

## Content & Compliance Standards

- Score MUST be framed as "Business Funding Climate Score" — NOT "Daily Score",
  because source data (DRTSCILM/DRTSCIS) is quarterly.
- Score labels MUST follow this mapping:
  - 80–100: Optimal
  - 60–79: Moderate
  - 40–59: Risky
  - 0–39:  Critical
- Blog posts MUST be 600+ words, targeting high-CPC US finance keywords.
- AdSense placement MUST NOT interfere with primary content readability.
- All pages MUST be accessible (WCAG 2.1 AA minimum) and mobile-responsive.

---

## Governance

- This constitution supersedes all other project documentation on matters of
  architecture, stack choice, and compliance.
- Amendments require: (a) documented rationale, (b) version bump per semver rules,
  (c) update to MEMORY.md and blueprint.md, (d) ADR if architecturally significant.
- Version bump rules:
  - MAJOR: Principle removal, hosting platform change, LLM provider change.
  - MINOR: New principle or section added.
  - PATCH: Clarifications, wording, non-semantic fixes.
- All PRs MUST verify compliance with Principles I–VI before merge.
- Constitution is reviewed when any new external service or dependency is proposed.

**Version**: 1.0.1 | **Ratified**: 2026-03-07 | **Last Amended**: 2026-03-07
