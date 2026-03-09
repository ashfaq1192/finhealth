---
id: "0008"
title: ai-generated-image-per-blog-post
stage: green
date: 2026-03-08
surface: agent
model: claude-sonnet-4-6
feature: 001-funding-health-dashboard
branch: 001-funding-health-dashboard
user: ashfaq
command: (conversational)
labels: ["image-generation","pollinations-ai","crewai","editor-agent","pipeline","blog","visual-content"]
links:
  spec: specs/001-funding-health-dashboard/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - backend/tasks.py
  - backend/crew.py
tests:
  - null
---

## Prompt

Please read @last_session.md and re-visit your strategy of adding five static images that can hurt through repetitive signal to user and google. With our free stack is that possible we can add one more agent in our flow who's job is to read the final blog and then craft a perfect prompt for image creation for our blog post and generates image with nano banana or any other free tool and then embed that image to the appropriate place in the blog post? Or you have any other strategy for injecting the perfect image in our state of the art blog post?

(Follow-up): yes implement please with your expertise and giving reader a visually appealling and strong visual message that forces the reader to read the full blog post.

## Response

Implemented automated per-post image generation using Pollinations.ai (free, no API key, URL-based) via two surgical edits:

**Strategy:** Instead of a 6th agent (extra Groq tokens + latency), added `image_prompt` as a new required JSON field to the existing editor agent's output. The editor already has full article context — asking it for a 20-25 word image prompt adds zero extra LLM calls.

**Image philosophy:** The prompt guidance instructs the editor to produce a cinematic, photorealistic scene that makes the reader feel *seen* — their exact financial stress mirrored back at them (e.g., "stressed owner-operator reviewing loan denial letter in semi-truck cab at dusk"). Not generic money/laptop stock art.

**Injection point:** Between the intro paragraphs and the first H2 heading — maximum emotional impact. Reader is hooked by text, image cements the feeling before the data begins.

**Changes:**
1. `backend/tasks.py` — Editor task OUTPUT RULES: added `image_prompt` field with gold-standard examples per industry, construction rules, and the explicit goal of making the reader feel seen. Updated `expected_output`.
2. `backend/crew.py` — Added `import urllib.parse`. Added Step 3b: extracts `image_prompt` from `post_data`, URL-encodes it, builds `https://image.pollinations.ai/prompt/{encoded}?width=1200&height=628&nologo=true&model=flux`, injects as markdown image before first `\n## ` in content. Non-fatal — pipeline continues if injection fails.

**Cost:** $0. Pollinations.ai is free with no account or API key. Image URL is embedded in the `content` markdown field — no DB schema changes, no storage, no frontend changes needed.
