-- Add 'failed_qa' as a valid image_status value in content_calendar.
-- generate_monthly_images.py sets this when Gemini visual QA rejects an image —
-- the image is still uploaded to Supabase Storage for manual review but will not
-- be picked up by the daily crew.py pipeline (which only reads 'generated' rows).

-- Add a CHECK constraint to make valid states explicit and self-documenting.
-- The ALTER drops any implicit NOT NULL that excluded new values.
ALTER TABLE content_calendar
  DROP CONSTRAINT IF EXISTS content_calendar_image_status_check;

ALTER TABLE content_calendar
  ADD CONSTRAINT content_calendar_image_status_check
  CHECK (image_status IN ('pending', 'generated', 'failed', 'failed_qa'));
