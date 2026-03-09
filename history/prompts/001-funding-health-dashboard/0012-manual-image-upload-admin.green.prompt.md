---
id: "0012"
title: Manual image upload via admin edit panel
stage: green
date: 2026-03-09
surface: agent
model: claude-sonnet-4-6
feature: 001-funding-health-dashboard
branch: 001-funding-health-dashboard
user: ashfaq
command: chat
labels: ["image-upload","admin","supabase-storage","blog","ux"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - supabase/migrations/003_add_hero_image.sql
  - frontend/app/api/admin/upload/route.ts
  - frontend/app/api/admin/save/route.ts
  - frontend/app/admin/edit/[slug]/page.tsx
  - frontend/app/blog/[slug]/page.tsx
tests:
  - manual: upload image in admin edit, verify hero appears on blog post
  - manual: save without image, verify clean post with no broken placeholder
  - manual: replace existing image, verify new image shown
---

## Prompt

Hi i think auto injection of our image through Pollinations is not working well. We need to change our strategy. My rough sketch in mind is that we have the edit option as an admin. What if we click on edit there appears a placeholder for uploading an image from my local pc and i upload the image and then click on save changes and image is displayed on blog successfully. I think it's 5 minute task which i can perform daily and even when i am busy and not feeling well and i did not click on edit the blog will be remain intact posted just without placeholder and clean blog post that is like crafted without image. How i will generate image? I will copy the blog post and will ask the gemini to create the prompt for image and gemini will give me image and i will download it and save my pc and then click on edit button of blog post and there will appear an empty placeholder for the image and also a an upload image button which i will click and will upload the image and then click on save changes. The updated blog post will be displayed perfectly. Good idea? what's your expert verdict on this? because pollination not working and you have not any other viable substitute.

## Response snapshot

Endorsed the approach fully. Built 5-file implementation:
1. DB migration adds `hero_image_url TEXT` column to blog_posts
2. New `/api/admin/upload` route uploads file to Supabase Storage bucket `blog-images`, returns public URL
3. Updated `/api/admin/save` to persist `hero_image_url`
4. Rewrote admin edit page with image preview box, file picker, upload-then-save flow, remove button
5. Updated blog post page: prefers `hero_image_url` over markdown-extracted image; posts without image render cleanly

## Outcome

- ✅ Impact: Replaces unreliable Pollinations auto-injection with reliable manual upload workflow. Zero ongoing cost (Supabase Storage free tier). Posts display cleanly without image when none uploaded.
- 🧪 Tests: Manual testing required — upload image, save, verify hero appears; save without image, verify clean render
- 📁 Files: 5 files modified/created
- 🔁 Next prompts: Run migration 003; create Supabase Storage bucket `blog-images` (public); deploy; test upload flow
- 🧠 Reflection: Manual image workflow is more resilient than AI-generated images. Gemini → download → upload is a solid 5-minute daily ritual that gives full quality control.

## Evaluation notes (flywheel)

- Failure modes observed: none yet
- Graders run and results (PASS/FAIL): not run
- Prompt variant (if applicable): none
- Next experiment: consider adding drag-and-drop to the upload area
