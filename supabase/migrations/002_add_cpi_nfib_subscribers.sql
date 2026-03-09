-- Migration 002: Add CPI/NFIB context columns + subscriber table
-- Run this in Supabase SQL Editor before deploying backend changes

-- ─── Context indicators on daily_scores ─────────────────────────────────────
-- cpi_yoy: CPI year-over-year % change (CPIAUCSL, monthly, computed from raw index)
-- nfib_optimism: NFIB Small Business Optimism Index (NFIBSCIB, monthly, 0–200 scale)
ALTER TABLE daily_scores ADD COLUMN IF NOT EXISTS cpi_yoy NUMERIC(5, 2);
ALTER TABLE daily_scores ADD COLUMN IF NOT EXISTS nfib_optimism NUMERIC(6, 2);

-- ─── Email subscriber list ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscribers (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email              TEXT UNIQUE NOT NULL,
  unsubscribe_token  TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  confirmed          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at         TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers (email);
CREATE INDEX IF NOT EXISTS idx_subscribers_token ON subscribers (unsubscribe_token);

-- RLS: only service_role can read/write subscribers (never exposed to anon)
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_write_subscribers" ON subscribers FOR ALL TO service_role USING (true);
