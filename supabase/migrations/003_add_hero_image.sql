-- Add hero_image_url column to blog_posts
-- Stores a Supabase Storage public URL or any https:// image URL.
-- NULL / empty string means no hero image — post displays without one.
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS hero_image_url TEXT DEFAULT NULL;
