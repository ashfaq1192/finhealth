# Data Model: US Business Funding Climate Dashboard

**Branch**: `001-funding-health-dashboard` | **Date**: 2026-03-07

---

## Entities

### 1. `daily_scores` — Funding Climate Score Record

One record per calendar date. Upserted on re-run (unique on `date`).

| Column           | Type         | Constraints              | Notes |
|------------------|--------------|--------------------------|-------|
| `id`             | `uuid`       | PK, default gen_random_uuid() | |
| `date`           | `date`       | UNIQUE, NOT NULL         | UTC calendar date of the run |
| `health_score`   | `integer`    | NOT NULL, CHECK 0-100    | Final clamped score |
| `status_label`   | `text`       | NOT NULL                 | "Optimal" / "Moderate" / "Risky" / "Critical" |
| `reasoning`      | `jsonb`      | NOT NULL                 | Array of exactly 3 strings |
| `dprime`         | `numeric(6,2)` | NOT NULL               | Bank Prime Loan Rate (%) |
| `drtscilm`       | `numeric(6,2)` | NOT NULL               | C&I tightening — large firms (%) |
| `drtscis`        | `numeric(6,2)` | NOT NULL               | C&I tightening — small firms (%) |
| `t10y2y`         | `numeric(6,2)` | NOT NULL               | 10-2yr Treasury spread (%) |
| `icsa`           | `integer`    | NOT NULL                 | Initial jobless claims (count) |
| `busappwnsaus`   | `integer`    | NOT NULL                 | Business applications (weekly count) |
| `busapp_trending_up` | `boolean` | NOT NULL               | True if above 4-week average |
| `created_at`     | `timestamptz` | DEFAULT now()           | Run timestamp |
| `updated_at`     | `timestamptz` | DEFAULT now()           | Last upsert timestamp |

**Unique constraint**: `UNIQUE (date)`
**Check constraint**: `CHECK (health_score >= 0 AND health_score <= 100)`
**Index**: `CREATE INDEX ON daily_scores (date DESC)` — for fast latest-record queries

**`reasoning` JSON shape**:
```json
[
  "Prime rate at 7.5% is 2.5% above baseline, reducing affordability",
  "Yield curve remains inverted, signalling recession risk",
  "Business applications up 3% vs 4-week average, a positive signal"
]
```

---

### 2. `blog_posts` — Generated Blog Article

One post per calendar date. Upserted on re-run (unique on `date`).

| Column             | Type         | Constraints              | Notes |
|--------------------|--------------|--------------------------|-------|
| `id`               | `uuid`       | PK, default gen_random_uuid() | |
| `date`             | `date`       | UNIQUE, NOT NULL         | Matches daily_scores.date |
| `title`            | `text`       | NOT NULL                 | SEO-optimised headline |
| `slug`             | `text`       | UNIQUE, NOT NULL         | URL-safe, e.g. `2026-03-07-trucking-outlook` |
| `content`          | `text`       | NOT NULL                 | Full markdown body (600+ words) |
| `meta_description` | `text`       | NOT NULL                 | Max 160 chars, for SEO |
| `category`         | `text`       | NOT NULL                 | One of: Trucking, Retail, SBA Loans, Macro, Staffing |
| `score_id`         | `uuid`       | FK → daily_scores.id     | Links post to its score record |
| `created_at`       | `timestamptz` | DEFAULT now()           | |
| `updated_at`       | `timestamptz` | DEFAULT now()           | Last upsert timestamp |

**Unique constraints**: `UNIQUE (date)`, `UNIQUE (slug)`
**Foreign key**: `score_id REFERENCES daily_scores(id)`
**Index**: `CREATE INDEX ON blog_posts (date DESC)` — blog listing query
**Index**: `CREATE INDEX ON blog_posts (slug)` — post lookup by URL

**Category rotation** (derived, not stored separately):
`CATEGORIES[(day_of_year % 5)]` where `CATEGORIES = ['Trucking', 'Retail', 'SBA Loans', 'Macro', 'Staffing']`

---

## Relationships

```
daily_scores (1) ──── (1) blog_posts
  date [unique]            date [unique]
  id [pk]  ◄────────────── score_id [fk]
```

One-to-one relationship per calendar date. A score record may exist without a
blog post (partial failure mode), but a blog post MUST have a score record.

---

## Row-Level Security (Supabase RLS)

| Table | Policy | Role | Effect |
|---|---|---|---|
| `daily_scores` | `SELECT` | `anon` | Allow — public read |
| `daily_scores` | `INSERT/UPDATE` | `anon` | Deny |
| `daily_scores` | `INSERT/UPDATE` | `service_role` | Allow — backend only |
| `blog_posts` | `SELECT` | `anon` | Allow — public read |
| `blog_posts` | `INSERT/UPDATE` | `anon` | Deny |
| `blog_posts` | `INSERT/UPDATE` | `service_role` | Allow — backend only |

The frontend uses the **anon key** (public read only).
The Python backend uses the **service_role key** (full write access).
This satisfies Constitution Principle V (no hardcoded secrets; keys differ by role).

---

## State Transitions

### Score Record Lifecycle
```
[Not exists] → INSERT (first daily run) → [exists, date=today]
[exists, date=today] → UPSERT (re-run) → [exists, updated values]
```

### Staleness State (frontend logic only, not persisted)
```
max(daily_scores.date) vs today:
  diff ≤ 0 days  → "Current" state  — show score normally
  diff 1-3 days  → "Stale" state    — show score with "as of [date]" warning
  diff > 3 days  → "Unavailable"    — show notice, suppress AdSense
```

---

## SQL Migration

File: `supabase/migrations/001_initial_schema.sql`

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- daily_scores
CREATE TABLE IF NOT EXISTS daily_scores (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date           DATE UNIQUE NOT NULL,
  health_score   INTEGER NOT NULL CHECK (health_score >= 0 AND health_score <= 100),
  status_label   TEXT NOT NULL,
  reasoning      JSONB NOT NULL DEFAULT '[]',
  dprime         NUMERIC(6,2) NOT NULL,
  drtscilm       NUMERIC(6,2) NOT NULL,
  drtscis        NUMERIC(6,2) NOT NULL,
  t10y2y         NUMERIC(6,2) NOT NULL,
  icsa           INTEGER NOT NULL,
  busappwnsaus   INTEGER NOT NULL,
  busapp_trending_up BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_daily_scores_date ON daily_scores (date DESC);

-- blog_posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date             DATE UNIQUE NOT NULL,
  title            TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  content          TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  category         TEXT NOT NULL,
  score_id         UUID REFERENCES daily_scores(id),
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts (date DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts (slug);

-- RLS
ALTER TABLE daily_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_scores" ON daily_scores FOR SELECT TO anon USING (true);
CREATE POLICY "service_write_scores" ON daily_scores FOR ALL TO service_role USING (true);

CREATE POLICY "public_read_posts" ON blog_posts FOR SELECT TO anon USING (true);
CREATE POLICY "service_write_posts" ON blog_posts FOR ALL TO service_role USING (true);
```
