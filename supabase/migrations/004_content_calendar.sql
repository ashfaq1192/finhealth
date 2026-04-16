-- Content calendar: pre-planned topics + pre-generated hero images for daily blog posts.
-- Populated monthly by generate_monthly_images.py; consumed daily by crew.py.

CREATE TABLE IF NOT EXISTS content_calendar (
  id              BIGSERIAL PRIMARY KEY,
  scheduled_date  DATE        NOT NULL UNIQUE,
  category        TEXT        NOT NULL,
  topic           TEXT        NOT NULL,
  seo_keyword     TEXT,
  image_prompt    TEXT        NOT NULL,
  image_url       TEXT,                          -- Supabase Storage public URL; NULL until generated
  image_status    TEXT        NOT NULL DEFAULT 'pending',  -- pending | generated | failed
  used            BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_calendar_date   ON content_calendar (scheduled_date);
CREATE INDEX IF NOT EXISTS idx_content_calendar_unused ON content_calendar (used, scheduled_date)
  WHERE used = FALSE;
