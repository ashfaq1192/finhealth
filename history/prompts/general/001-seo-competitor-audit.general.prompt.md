---
id: 001
title: SEO & Competitor Deep Research Audit
stage: general
date: 2026-05-18
surface: agent
model: claude-sonnet-4-6
feature: none
branch: master
user: ashfaq1192
command: seo-audit skill + competitor research
labels: ["seo", "competitors", "research", "optimization", "content-strategy"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - history/prompts/general/001-seo-competitor-audit.general.prompt.md
tests:
  - null
---

## Prompt

please do some deep research on the competetors of our website/blog and see that how we can optimize/improve/enhance
our system so that it gain top rank in the google and users eye...if you need to visualize some or our website, you
may take screenshots so that we can have state of the art website.

## Response snapshot

Full SEO audit + competitive analysis delivered covering:

1. **Competitor Landscape**
   - Direct: Experian Small Business Index (0–100 monthly), Equifax Small Business Lending Index, Biz2Credit Lending Index
   - Content: CrestmontCapital (dominates statistics keywords with 5,800w pillar pages + FAQPage schema)
   - Authority: Nav.com, NerdWallet (DR 70+, cannot compete head-on)
   - Key finding: usfundingclimate.com is THE ONLY daily-updated funding conditions score — defensible moat

2. **Critical Issues Found**
   - site:usfundingclimate.com returns 0 results — potential indexation failure
   - Blog sitemap uses changefreq:never — limits recrawl
   - No BreadcrumbList schema (visual breadcrumbs exist, no JSON-LD)
   - No SoftwareApplication schema on 6 calculator pages
   - No FAQPage schema on SBA Loans / Invoice Factoring pillar pages
   - Organization sameAs: [] is empty — no LinkedIn disambiguation
   - Author LinkedIn not linked — E-E-A-T gap on YMYL finance site
   - dateModified always equals datePublished — no freshness signal on edits

3. **Content Gaps vs Competitors**
   - No historical score archive page (Experian's moat = 19 years of data)
   - No monthly funding climate report published yet
   - No statistics pillar page targeting CrestmontCapital's keywords
   - No state-level funding conditions page

4. **Prioritized Action Plan**
   - Week 1: Google Search Console verification, BreadcrumbList + SoftwareApplication + FAQPage schema, LinkedIn in sameAs
   - Week 2: Meta descriptions, dateModified fix, author sameAs
   - Month 1: /score-history page, April 2026 Monthly Report, first Tier 1 cornerstone post
   - Month 2–3: Statistics pillar page, state-level page, HARO outreach

5. **Highest-Leverage Single Change**
   - Build /score-history page with interactive chart — unique daily data no competitor can replicate, eligible for Dataset schema

## Outcome

- ✅ Impact: Comprehensive audit with competitor benchmarking and 19-item prioritized action plan
- 🧪 Tests: N/A (research/analysis task)
- 📁 Files: Research artifacts only — no code changed
- 🔁 Next prompts: Implement BreadcrumbList schema, SoftwareApplication schema on calculators, fix sitemap changefreq, build /score-history page
- 🧠 Reflection: The daily-update moat is genuinely unique vs all identified competitors. Indexation must be verified first before any SEO work matters. Schema gaps are the fastest wins.

## Evaluation notes (flywheel)

- Failure modes observed: site: search operator returned null — could be search tool limitation vs actual deindex
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment: Verify indexation in GSC, then implement Week 1 schema fixes and measure rich snippet eligibility via Rich Results Test
