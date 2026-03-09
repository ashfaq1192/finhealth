"""
CrewAI task definitions for the daily funding score pipeline.

Blog strategy: evergreen keyword-first content.
Each post targets a high-CPC search term and uses today's score as supporting
data — not the headline topic. This makes posts rank for months, not one day.
"""

from datetime import datetime

from crewai import Task

from agents import data_fetcher_agent, economist_agent, writer_agent, editor_agent

CATEGORIES = ["Trucking", "Retail", "SBA Loans", "Macro", "Staffing"]

# Primary keyword + secondary (long-tail) per category
CATEGORY_SEO = {
    "Trucking": {
        "primary": "invoice factoring for trucking companies",
        "secondary": "freight broker funding, owner operator cash flow",
        "industry_context": (
            "Owner-operators and small fleets are highly sensitive to prime rate changes "
            "because fuel financing and equipment loans are variable-rate. Tight C&I lending "
            "standards disproportionately affect trucking companies that lack hard collateral."
        ),
        "faq": [
            "Is invoice factoring a good option for trucking companies right now?",
            "How does the prime rate affect trucking business loans?",
            "What credit score do I need for a trucking business loan?",
        ],
    },
    "Retail": {
        "primary": "merchant cash advance for retail businesses",
        "secondary": "retail business funding options, small retail store financing",
        "industry_context": (
            "Retail businesses rely heavily on revolving credit and merchant cash advances "
            "tied to daily card sales. Rising prime rates directly increase the cost of "
            "inventory financing and lines of credit for small retailers."
        ),
        "faq": [
            "Is a merchant cash advance worth it for a retail business?",
            "How do rising interest rates affect small retail store financing?",
            "What are the best funding options for a retail business with seasonal revenue?",
        ],
    },
    "SBA Loans": {
        "primary": "SBA loan eligibility requirements",
        "secondary": "SBA 7a loan rates today, small business administration loan approval",
        "industry_context": (
            "SBA loan rates are directly tied to the prime rate — most SBA 7(a) loans are "
            "variable at prime plus a spread. When C&I lending standards tighten, banks "
            "become more selective about SBA applications, increasing time-to-approval."
        ),
        "faq": [
            "What credit score do I need to qualify for an SBA loan?",
            "How long does SBA loan approval take in the current environment?",
            "Are SBA loan rates going up or down right now?",
        ],
    },
    "Macro": {
        "primary": "small business funding conditions",
        "secondary": "is now a good time for a business loan, business credit market outlook",
        "industry_context": (
            "The overall macro environment affects every small business seeking capital. "
            "The yield curve, jobless claims, and prime rate together signal whether banks "
            "are in an expansionary or contractionary lending posture toward small businesses."
        ),
        "faq": [
            "Is now a good time to get a small business loan?",
            "How do I know if credit conditions are tight for small businesses?",
            "What economic indicators should small business owners watch for funding decisions?",
        ],
    },
    "Staffing": {
        "primary": "invoice factoring for staffing agencies",
        "secondary": "staffing company financing, payroll funding for staffing firms",
        "industry_context": (
            "Staffing agencies face a unique cash flow challenge: they must meet weekly "
            "payroll before clients pay their invoices (typically net-30 to net-60). "
            "Invoice factoring rates for staffing firms are closely tied to the prime rate "
            "and overall credit market conditions."
        ),
        "faq": [
            "How does invoice factoring work for staffing agencies?",
            "What are typical invoice factoring rates for staffing companies?",
            "How can a staffing agency manage payroll during tight credit conditions?",
        ],
    },
}


def get_todays_category() -> str:
    """Derive today's blog category from day-of-year — deterministic, no DB state."""
    day_of_year = datetime.utcnow().timetuple().tm_yday
    return CATEGORIES[day_of_year % len(CATEGORIES)]


def build_tasks(indicators_json: str, score_json: str) -> tuple[Task, Task, Task, Task]:
    """
    Build the four CrewAI tasks for a pipeline run.
    Returns (fetch_task, economist_task, writer_task, editor_task).
    """
    today = datetime.utcnow().date().isoformat()
    category = get_todays_category()
    seo = CATEGORY_SEO[category]
    slug = f"{today}-{category.lower().replace(' ', '-')}"

    fetch_task = Task(
        description=(
            f"The economic indicators have already been fetched from FRED for {today}. "
            f"Here is the raw data JSON:\n\n{indicators_json}\n\n"
            "Validate that all six indicators are present: dprime, drtscilm, drtscis, "
            "t10y2y, icsa, busappwnsaus. Output the validated JSON unchanged."
        ),
        expected_output=(
            "A JSON object containing the six FRED indicator values for today, "
            "validated and ready for economic analysis."
        ),
        agent=data_fetcher_agent,
    )

    economist_task = Task(
        description=(
            f"Using the scoring results for {today}:\n\n{score_json}\n\n"
            "Write exactly THREE reasoning bullets for the Business Funding Climate Score. "
            "CRITICAL RULES:\n"
            "- Each bullet MUST explain WHY an indicator is moving and what mechanism "
            "  connects it to small business credit access — not just WHAT it is doing.\n"
            "- Never repeat the same observation in different words across bullets.\n"
            "- Always include the actual numeric value with its unit (%, basis points, etc.).\n"
            "- Each bullet is one sentence of max 25 words.\n\n"
            "GOOD example: 'The prime rate at 8.5% — 350 basis points above its 5-year "
            "average — is raising variable-rate loan costs for small businesses that lack "
            "fixed-rate alternatives.'\n"
            "BAD example: 'Lenders are becoming more cautious about lending to businesses.'\n\n"
            "Format: a JSON array of exactly 3 strings."
        ),
        expected_output=(
            'A JSON array of exactly 3 strings, each a specific causal sentence with '
            'indicator values and units, e.g. ["Bullet 1.", "Bullet 2.", "Bullet 3."]'
        ),
        agent=economist_agent,
    )

    import json as _json
    score_data = _json.loads(score_json)
    score_val = score_data.get("health_score", "N/A")
    score_label = score_data.get("status_label", "N/A")
    indicators_data = _json.loads(indicators_json)
    cpi_yoy = indicators_data.get("cpi_yoy")
    nfib_optimism = indicators_data.get("nfib_optimism")

    writer_task = Task(
        description=(
            f"Write a 900+ word EVERGREEN SEO blog post for stressed US small business owners.\n\n"
            f"READER PERSONA: A 40-year-old US business owner worried about cash flow. "
            f"They have 5 minutes. They scan before they read. They want facts, not reassurance.\n\n"
            f"INDUSTRY: {category}\n"
            f"PRIMARY KEYWORD: \"{seo['primary']}\"\n"
            f"SECONDARY KEYWORDS: {seo['secondary']}\n"
            f"SLUG: {slug}\n\n"
            f"INDUSTRY CONTEXT:\n{seo['industry_context']}\n\n"
            f"SCORE DATA (use as supporting evidence, not the main topic):\n{score_json}\n\n"
            "CONTENT STRUCTURE — follow this exactly:\n"
            f"1. TITLE: Evergreen, keyword-rich. No dates.\n"
            f"2. INTRO (2 short paragraphs): Open with the reader's problem. Use the primary "
            f"keyword in the FIRST 50 WORDS. In paragraph 2, introduce the Business Funding "
            f"Climate Score ({score_val} — {score_label}) as macro context.\n"
            f"3. H2: Current Economic Conditions for {category} Businesses\n"
            "   2-3 short paragraphs. Bold the first mention of each key economic term "
            "   (e.g. **prime rate**, **C&I lending standards**, **yield curve**).\n"
            "4. H2: Key Indicators Driving the Score\n"
            "   After a short intro sentence, show a bullet list of 3-4 indicators:\n"
            "   - **[Indicator name]:** [current value with unit] — [1-sentence explanation of "
            "     what this means for the sector, citing the real-world mechanism, not just the direction]\n"
            "   Then add a Pro-Tip callout as a blockquote:\n"
            "   > **Pro Tip:** [1-2 sentence actionable context for a business owner — "
            "     describe what to watch for, not what to do]\n"
            f"5. H2: Practical Implications for {category} Business Owners\n"
            "   Use 2-3 short paragraphs OR a bullet list. No generic statements. "
            "   Every sentence must be specific to current conditions.\n"
            "6. H2: What to Watch Next\n"
            "   2 short paragraphs. Explain which 1-2 indicators would signal improvement "
            "   or deterioration. End with: 'Track the daily Business Funding Climate Score "
            "   at the top of this site to monitor how conditions evolve.'\n"
            "   This section must USE the primary keyword one more time.\n"
            "7. H2: Frequently Asked Questions\n"
            "   Write each FAQ item as an H3 heading (the question) followed immediately "
            "   by a paragraph answer. No Q:/A: labels, no bullets. Format:\n\n"
            "   ### [question text here]\n\n"
            "   [Answer in 3-4 sentences. Be specific. Cite current conditions.]\n\n"
            "   Repeat for all 3 questions:\n"
            + "\n".join(f"   - {q}" for q in seo["faq"]) + "\n\n"
            "US LANGUAGE RULES (mandatory — you are writing for a US audience):\n"
            "- American English spelling ONLY: 'labor' not 'labour', 'analyze' not 'analyse',\n"
            "  'optimize' not 'optimise', 'color' not 'colour', 'favor' not 'favour'.\n"
            "- Use US financial jargon: FICO score, SBA 7(a) loan, Fed funds rate, "
            "  prime rate, basis points, accounts receivable, invoice factoring, MCA, "
            "  lines of credit, net-30 terms, FDIC-insured, brick-and-mortar.\n"
            "- Use American idioms: 'Main Street', 'mom-and-pop shop', 'bottom line', "
            "  'ballpark figure' — never British equivalents.\n"
            "- Reference US institutions: the Federal Reserve (the Fed), the SBA, the FDIC, "
            "  the CFPB — not generic 'central bank' or 'government agency'.\n"
            "- Monetary references: US dollars ($) only.\n\n"
            "WRITING STYLE RULES:\n"
            "- Max 2-3 sentences per paragraph. Short sentences. Active voice.\n"
            "- Bold key economic terms on first mention: **prime rate**, **yield curve**, etc.\n"
            "- Every number MUST include its unit AND a plain-English explanation of what "
            "  it means. Never write '5.3' alone — write '5.3 percentage points, meaning...'\n"
            "- Write all indicator names in plain English ONLY:\n"
            "  'the prime rate' not dprime, 'the yield curve spread' not t10y2y,\n"
            "  'initial jobless claims' not icsa, 'C&I lending standards' not drtscilm.\n"
            "- Do NOT repeat the same observation in different words across sections.\n"
            "- Do NOT use backticks around any words.\n"
            "- Do NOT include a References section.\n"
            "- Do NOT include the article title as H1 — start directly with the first paragraph.\n"
            "- H2 headings only for main sections. H3 only for FAQ questions.\n\n"
            "SEO RULES:\n"
            "- Primary keyword in: first 50 words, one H2 heading, meta description, last paragraph.\n"
            "- Write for someone who searched the keyword, not someone who knows this site.\n"
            "- Avoid time-sensitive phrases in the title (no 'today', 'March 2026', etc.).\n"
            + (
                f"ADDITIONAL MACRO CONTEXT (weave these in naturally where relevant):\n"
                f"- US Inflation (CPI YoY): {cpi_yoy}% — Fed's 2.0% target; "
                f"above target keeps the Fed hawkish and rates elevated.\n"
                f"- NFIB Small Business Optimism Index: {nfib_optimism} — "
                f"monthly survey of US small business owners; neutral baseline ≈ 98.\n\n"
                if cpi_yoy is not None or nfib_optimism is not None else ""
            )
            + "- INTERNAL LINKS (mandatory — 2 links minimum, worked in naturally):\n"
            "  Include exactly these two internal links somewhere in the body, using natural anchor text:\n"
            f"  1. More analysis for this sector: [anchor text](/blog?category={category.replace(' ', '+')})\n"
            "     Example: '...see our full [trucking funding analysis](/blog?category=Trucking) for context.'\n"
            "  2. The live score dashboard: [anchor text](/)\n"
            "     Example: '...track the daily [US Business Funding Climate Score](/) to monitor shifts.'\n"
            "  Rules: anchor text must be descriptive and natural — never 'click here' or bare URLs.\n\n"
            "COMPLIANCE RULES (mandatory — no exceptions):\n"
            "- Describe economic conditions and their implications ONLY.\n"
            "- Do NOT recommend specific lenders, financial products, or services.\n"
            "- Do NOT advise the reader to borrow, invest, or take any financial action.\n\n"
            "OUTPUT: A single JSON object with exactly these keys:\n"
            "  title: string (SEO-optimized, evergreen, no date)\n"
            "  slug: string (use the slug provided above exactly)\n"
            "  content: string (full markdown, 900+ words, NO H1, NO backticks, NO References)\n"
            "  meta_description: string — STRICT RULES: (1) exactly ONE complete sentence, "
            "(2) ends with a period, (3) includes the primary keyword, "
            "(4) maximum 140 characters, (5) NO commas after the main clause. "
            "Example: 'Learn how SBA loan eligibility requirements are affected by "
            "rising interest rates and tighter lending standards in today's market.'\n"
        ),
        expected_output=(
            "A JSON object with keys: title, slug, content (750+ word evergreen markdown), "
            "meta_description."
        ),
        agent=writer_agent,
    )

    editor_task = Task(
        description=(
            "You are the final editorial gate before this article is published. "
            "The writer has produced a draft blog post (JSON: title, slug, content, "
            "meta_description). Apply every check below. Fix every failure. "
            "Return the same JSON structure — polished and publication-ready.\n\n"
            f"GROUND TRUTH DATA (use this to fact-check all numbers in the draft):\n"
            f"{score_json}\n\n"
            f"INDUSTRY: {category}\n"
            f"PRIMARY KEYWORD: \"{seo['primary']}\"\n"
            f"TARGET READER: 40-year-old US small business owner, stressed about cash flow, "
            "5 minutes to read, scans before reading deeply.\n\n"
            "━━━ EDITORIAL CHECKLIST ━━━\n\n"
            "CHECK 1 — OPENING HOOK (highest priority)\n"
            "  The first two sentences determine whether the reader stays or leaves. "
            "  They must create immediate urgency or ask a question the reader desperately "
            "  wants answered. Rewrite the opening if it:\n"
            "  - Starts with a cliché: 'In today's economic climate', 'As a small business "
            "    owner', 'If you're a small business owner', 'In the current landscape'\n"
            "  - Opens with a definition or textbook statement\n"
            "  - Takes more than one sentence to get to the reader's problem\n"
            "  GOOD opening examples:\n"
            "  ✓ 'Getting approved for a trucking business loan just got harder — and the "
            "    prime rate is only part of the story.'\n"
            "  ✓ 'If your SBA loan application is sitting with an underwriter right now, "
            "    here is what the current numbers actually mean for your approval odds.'\n"
            "  ✓ 'Payroll is due Friday. Your biggest client pays net-60. This is the "
            "    funding reality for staffing agencies when credit markets tighten.'\n\n"
            "CHECK 2 — FACT VERIFICATION\n"
            "  Cross-reference every numeric claim in the article against the ground truth "
            "  data above. Fix any number that is wrong, missing a unit, or missing a "
            "  plain-English explanation of what it means for a business owner.\n"
            "  Rule: never write a number alone — always pair it with its unit AND impact.\n"
            "  BAD: 'The prime rate is at 7.5.'\n"
            "  GOOD: 'The prime rate stands at 7.5% — meaning variable-rate business loan "
            "  costs have risen in lockstep with every Fed hike since 2022.'\n\n"
            "CHECK 3 — AMERICAN ENGLISH (zero tolerance)\n"
            "  Correct every instance of British spelling and idioms:\n"
            "  Spelling: labour→labor, analyse→analyze, optimise→optimize, favour→favor, "
            "  colour→color, programme→program, centre→center, whilst→while, "
            "  amongst→among, realise→realize, organisation→organization, "
            "  practise→practice (verb), recognise→recognize, prioritise→prioritize\n"
            "  Idioms: 'high street'→'Main Street', 'current account'→'checking account', "
            "  'solicitor'→'attorney', 'pension'→'retirement account', "
            "  'redundancy'→'layoff', 'fortnight'→'two weeks'\n\n"
            "CHECK 4 — SENTENCE QUALITY\n"
            "  Rewrite any sentence that is vague, generic, or padded. Tests:\n"
            "  - Could this sentence have been written without the score data? → Rewrite it.\n"
            "  - Does it tell the reader something they couldn't figure out themselves? "
            "    → If no, cut it or replace it.\n"
            "  SENTENCES TO ELIMINATE:\n"
            "  ✗ 'Lenders are becoming more cautious about small business lending.'\n"
            "  ✗ 'Economic conditions present both challenges and opportunities.'\n"
            "  ✗ 'It's important to understand the current financial landscape.'\n"
            "  ✗ 'Now more than ever, small businesses need to be prepared.'\n"
            "  Also: Break up any paragraph longer than 3 sentences.\n\n"
            "CHECK 5 — SEO PRECISION\n"
            f"  Primary keyword '{seo['primary']}' must appear:\n"
            "  - In the first 50 words of the article body\n"
            "  - In at least one H2 heading (can be a natural variation, not forced exact match)\n"
            "  - In the meta description\n"
            "  - Naturally in the final section\n"
            "  Meta description rules (enforce strictly):\n"
            "  - Exactly one complete sentence\n"
            "  - Ends with a period\n"
            "  - Contains the primary keyword\n"
            "  - Maximum 140 characters (count carefully)\n"
            "  - No commas after the main clause\n"
            "  Title rules:\n"
            "  - Evergreen — no year, no month, no 'today', no 'current'\n"
            "  - Contains the primary keyword or a close natural variation\n"
            "  - Under 65 characters for full Google SERP display\n\n"
            "CHECK 6 — READABILITY\n"
            "  - Active voice throughout. Rewrite passive constructions.\n"
            "  - Bold the first mention of each key economic term if not already bolded: "
            "    prime rate, yield curve, C&I lending standards, jobless claims, "
            "    invoice factoring, merchant cash advance, SBA loan, etc.\n"
            "  - Max 2-3 sentences per paragraph — hard limit.\n"
            "  - If any section reads like a textbook or a press release, rewrite it "
            "    in direct, plain American business English.\n\n"
            "CHECK 7 — FAQ QUALITY\n"
            "  Each FAQ answer must:\n"
            "  - Be specific to current conditions (cite at least one real indicator value)\n"
            "  - Be 3-4 sentences. Not a bullet list.\n"
            "  - NOT be answerable by a generic Google search — it must reflect TODAY's data.\n"
            "  BAD FAQ answer: 'SBA loans typically require a credit score of 680 or higher.'\n"
            "  GOOD FAQ answer: 'With the prime rate at [X]%, SBA 7(a) loan rates are "
            "  currently sitting at [prime + spread]%. Lenders have also tightened their "
            "  requirements: C&I lending standards for small firms tightened by [X]% last "
            "  quarter, meaning underwriters are scrutinizing cash flow more carefully than "
            "  they were a year ago. A FICO score above 700 gives you a meaningfully better "
            "  shot in this environment.'\n\n"
            "CHECK 8 — COMPLIANCE (non-negotiable)\n"
            "  Remove any language that:\n"
            "  - Recommends a specific lender, product, or financial service by name\n"
            "  - Directly advises the reader to borrow, invest, or take a financial action\n"
            "  - Could be construed as personalized financial advice\n"
            "  Keep: descriptions of how products work, what current conditions mean for "
            "  eligibility, what indicators signal. Remove: 'you should apply for X', "
            "  'the best option for you is Y', 'we recommend Z'.\n\n"
            "CHECK 9 — WORD COUNT AND STRUCTURE\n"
            "  The final content must be 900–1100 words. Hard maximum: 1100 words.\n"
            "  If short: expand 'Practical Implications' or 'What to Watch Next' only.\n"
            "  If over 1100 words: cut. Remove the weakest paragraphs first.\n"
            "  The article MUST END after the FAQ section. Do NOT add any sections after FAQ:\n"
            "  no 'Conclusion', no 'Final Thoughts', no 'The Future of...', no 'Additional Insights',\n"
            "  no 'The Importance of Staying Informed', no 'The Role of Technology'.\n"
            "  The FAQ is the last section. Period.\n"
            "  CRITICAL: Do NOT write the word count anywhere in the output.\n\n"
            "━━━ OUTPUT RULES ━━━\n"
            "Output ONLY a valid JSON object. No preamble, no code fences, no commentary.\n"
            "The JSON must have EXACTLY these 4 keys in this order:\n"
            "  1. title         — evergreen, SEO-optimized, under 65 chars\n"
            "  2. slug          — IDENTICAL to the writer's slug, do not alter\n"
            "  3. meta_description — one sentence, ends with period, max 140 chars\n"
            "  4. content       — full markdown, 900-1100 words, ends at FAQ, no H1\n"
        ),
        expected_output=(
            "A valid JSON object with exactly 4 keys in this order: title "
            "(evergreen, under 65 chars), slug (unchanged), meta_description "
            "(one sentence, period, primary keyword, max 140 chars), content "
            "(900-1100 word publication-ready evergreen markdown, ends after FAQ, no H1)."
        ),
        agent=editor_agent,
        context=[writer_task],
    )

    return fetch_task, economist_task, writer_task, editor_task
