---
id: "0007"
title: add-chief-editor-seo-agent
stage: green
date: 2026-03-08
surface: agent
model: claude-sonnet-4-6
feature: 001-funding-health-dashboard
branch: 001-funding-health-dashboard
user: ashfaq
command: (conversational)
labels: ["crewai","editor-agent","seo","content-quality","pipeline","groq"]
links:
  spec: specs/001-funding-health-dashboard/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - backend/agents.py
  - backend/tasks.py
  - backend/crew.py
tests:
  - null
---

## Prompt

I am saying with reference to our last session that if we put static videos only for categories
then it might give repetitive impression to both google and users. what you say? Should we go
without image then? or we should rotate image for each image separately... I think it will
increase our work and we are moving away from automate website. The second thing i want to
discuss with you that what if we add one more agent in our crew flow that will be chief
editor/SEO Expert for our blog? I mean the job of that agent will be only to
proofread/edit/improve the blog to make it state of the art in terms of US based content, SEO
and verification of info and catching user attention from start to end? or no need for that agent?

(Follow-up): yes please go ahead and do your best with excellent prompting in the editor agent.

## Response

Decided: No images (static category images are repetitive, per-post images break automation).
Finance authority sites run text-only — content and data carry the weight.

Added `editor_agent` as the 4th and final step in the CrewAI pipeline:

**agents.py:**
- `_editor_llm()` — dedicated LLM config: temperature=0.2, max_tokens=4500 (higher budget for
  outputting full polished article)
- `editor_agent` — persona: Editorial Director at Bloomberg/Forbes, 20yr experience, E-E-A-T
  focused, trained to spot the 4 killers of finance content

**tasks.py:**
- `editor_task` with 9-point editorial checklist wired with `context=[writer_task]` so it
  automatically receives the writer's draft:
  1. Opening Hook — rewrites cliché openers, must create immediate urgency
  2. Fact Verification — cross-checks all numbers against score_json ground truth
  3. American English Sweep — zero tolerance for British spelling/idioms
  4. Sentence Quality — eliminates vague/generic/padded sentences
  5. SEO Precision — enforces keyword placement in 4 positions, meta description rules
  6. Readability — active voice, bold terms, 3-sentence paragraph limit
  7. FAQ Quality — answers must cite current indicator values, not be generic
  8. Compliance — removes any specific product recommendations or financial advice
  9. Word Count — enforces 900+ words, expands weakest section if short

**crew.py:**
- Editor agent and task added to crew (4 agents, 4 tasks, sequential)
- `editor_output` parsed from `tasks_output[3]`
- `post_data` uses editor output with fallback to raw writer output if editor parse fails
- Pipeline docstring updated to 5 steps

## Outcome

Pipeline now: DataFetcher → Economist → Writer → Editor → Supabase
Each blog post gets a full editorial pass before publication. Zero manual work added.
The editor's `context=[writer_task]` ensures it always operates on the writer's actual output.
