-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- daily_scores
CREATE TABLE IF NOT EXISTS daily_scores (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date               DATE UNIQUE NOT NULL,
  health_score       INTEGER NOT NULL CHECK (health_score >= 0 AND health_score <= 100),
  status_label       TEXT NOT NULL,
  reasoning          JSONB NOT NULL DEFAULT '[]',
  dprime             NUMERIC(6,2) NOT NULL,
  drtscilm           NUMERIC(6,2) NOT NULL,
  drtscis            NUMERIC(6,2) NOT NULL,
  t10y2y             NUMERIC(6,2) NOT NULL,
  icsa               INTEGER NOT NULL,
  busappwnsaus       INTEGER NOT NULL,
  busapp_trending_up BOOLEAN NOT NULL DEFAULT FALSE,
  created_at         TIMESTAMPTZ DEFAULT now(),
  updated_at         TIMESTAMPTZ DEFAULT now()
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

-- Row Level Security
ALTER TABLE daily_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_scores"   ON daily_scores FOR SELECT TO anon USING (true);
CREATE POLICY "service_write_scores" ON daily_scores FOR ALL   TO service_role USING (true);

CREATE POLICY "public_read_posts"    ON blog_posts   FOR SELECT TO anon USING (true);
CREATE POLICY "service_write_posts"  ON blog_posts   FOR ALL   TO service_role USING (true);
