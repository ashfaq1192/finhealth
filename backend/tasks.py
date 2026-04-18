"""
CrewAI task definitions for the daily funding score pipeline.

Blog strategy: evergreen keyword-first content.
Each post targets a high-CPC search term and uses today's score as supporting
data — not the headline topic. This makes posts rank for months, not one day.
"""

from datetime import datetime, timezone

from crewai import Task

from agents import economist_agent, writer_agent, editor_agent

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
            "SBA loan rates are directly tied to the prime rate: most SBA 7(a) loans are "
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
    day_of_year = datetime.now(timezone.utc).timetuple().tm_yday
    return CATEGORIES[day_of_year % len(CATEGORIES)]


def build_tasks(
    indicators_json: str,
    score_json: str,
    topic_override: str | None = None,
) -> tuple[Task, Task]:
    """
    Build the two CrewAI tasks for a pipeline run.
    Returns (economist_task, writer_task).

    Two-task design keeps total token usage well within Groq free-tier limits:
      economist (8b): ~1,300 tokens   writer (70b): ~3,000 tokens

    topic_override: when set (from content_calendar), the writer is directed to
                    write about this specific pre-planned topic instead of a generic category post.
    """
    today = datetime.now(timezone.utc).date().isoformat()
    category = get_todays_category()
    seo = CATEGORY_SEO[category]

    economist_task = Task(
        description=(
            f"Using the scoring results for {today}:\n\n{score_json}\n\n"
            f"INDICATOR VALUES — cite these EXACT numbers in your bullets (do NOT invent or estimate values):\n{indicators_json}\n\n"
            "Write exactly SIX reasoning bullets for the Business Funding Climate Score. "
            "Each bullet covers one of the six FRED indicators: prime rate (dprime), "
            "yield curve spread (t10y2y), C&I standards large firms (drtscilm), "
            "C&I standards small firms (drtscis), jobless claims (icsa), "
            "business applications (busappwnsaus).\n\n"
            "MANDATORY STRUCTURE for each bullet (2 sentences, max 55 words):\n"
            "  Sentence 1: State the indicator's current value with unit and direction.\n"
            "  Sentence 2: Trace the TRANSMISSION CHAIN — explain the specific economic "
            "  mechanism by which this number affects small business loan approval rates, "
            "  borrowing costs, or credit availability. Name the mechanism, not the outcome.\n\n"
            "TRANSMISSION CHAIN examples by indicator:\n"
            "  prime rate → variable-rate loan floor → monthly repayment cost on SBA 7(a)\n"
            "  t10y2y negative → bank net interest margin compression → risk appetite falls → "
            "  tighter underwriting on small business lines of credit\n"
            "  drtscilm tightening → large-firm credit crowding out → banks reallocate "
            "  remaining capital to lower-risk large borrowers, squeezing small firm allocations\n"
            "  icsa rising → consumer spending signal → retail/service small business "
            "  revenue projections fall → lender cash-flow coverage ratios tighten\n\n"
            "REJECT any bullet that:\n"
            "  - Says only what is happening without explaining the mechanism\n"
            "  - Uses vague language: 'lenders are cautious', 'conditions are challenging'\n"
            "  - Omits the numeric value and unit\n\n"
            "Output: a JSON array of exactly 6 strings."
        ),
        expected_output=(
            "A JSON array of exactly 6 strings. Each string is a 2-sentence, max-55-word "
            "causal bullet: sentence 1 states the indicator value with unit, sentence 2 "
            "names the transmission mechanism connecting it to small business credit access."
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

    topic_directive = (
        f"SPECIFIC TOPIC (pre-planned — write EXACTLY about this): \"{topic_override}\"\n"
        f"The title, intro, and H2 headings must all centre on this specific topic.\n\n"
        if topic_override else ""
    )

    writer_task = Task(
        description=(
            f"Write a 1,200+ word EVERGREEN SEO blog post for stressed US small business owners.\n\n"
            f"READER PERSONA: A 40-year-old US business owner worried about cash flow. "
            f"They have 5 minutes. They scan before they read. They want facts, not reassurance.\n\n"
            + topic_directive
            + f"INDUSTRY: {category}\n"
            f"PRIMARY KEYWORD: \"{seo['primary']}\"\n"
            f"SECONDARY KEYWORDS: {seo['secondary']}\n\n"
            f"INDUSTRY CONTEXT:\n{seo['industry_context']}\n\n"
            f"ECONOMIC INDICATORS (cite exact values in the article):\n{indicators_json}\n\n"
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
            "   - **[Indicator name]:** [current value with unit]: [1-sentence explanation of "
            "     what this means for the sector, citing the real-world mechanism, not just the direction]\n"
            "   Then add a Pro-Tip callout as a blockquote:\n"
            "   > **Pro Tip:** [1-2 sentence actionable context for a business owner: "
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
            "- Avoid time-sensitive phrases in the title (no 'today', 'March 2026', etc.).\n\n"
            "AI SEO & CITATION RULES (optimize for Google AI Overviews, ChatGPT, Perplexity):\n"
            "- SELF-CONTAINED ANSWERS: Every key claim should work as a standalone statement "
            "that an AI can extract and cite without the surrounding context.\n"
            "- STATISTIC CITATION FORMAT: When citing data, use: 'According to Federal Reserve data, "
            "[statistic]. This means [plain-English takeaway for a business owner].'\n"
            "- EVIDENCE SANDWICH: In the 'Key Indicators' section, structure as: "
            "opening claim → 2-3 specific data points with values → one-sentence takeaway. "
            "This structure gets cited 40% more often by AI systems.\n"
            "- SNIPPET LENGTH: Keep the first sentence of each section under 60 words — "
            "this is the optimal length for featured snippet and AI Overview extraction.\n"
            "- FINANCIAL DOMAIN AUTHORITY: Reference institutions by name: "
            "the Federal Reserve (the Fed), the SBA, the FDIC, the CFPB, FRED (Federal "
            "Reserve Economic Data). Never write 'the government' or 'a federal agency' "
            "when you can name the specific institution.\n"
            "- KEYWORD DENSITY: Use the primary keyword naturally 3-5 times total. "
            "Keyword stuffing actively REDUCES AI visibility by 10% and hurts traditional SEO.\n"
            "- HEADING MATCH: Write H2/H3 headings that match how people phrase search queries. "
            "Example: 'What credit score do I need for an SBA loan?' is better than 'Credit Requirements'.\n"
            "- ORIGINAL DATA: Every number should be specific to today's score data. "
            "AI systems prioritize content with original, specific data over generic summaries.\n"
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
            "  slug: string (derived from the title — lowercase, hyphens only, no dates, "
            "no stop words, max 60 chars, e.g. 'sba-loan-eligibility-tight-credit-conditions')\n"
            "  content: string (full markdown, 900+ words, NO H1, NO backticks, NO References)\n"
            "  meta_description: string — STRICT RULES: (1) exactly ONE complete sentence, "
            "(2) ends with a period, (3) includes the primary keyword, "
            "(4) maximum 140 characters, (5) NO commas after the main clause. "
            "Example: 'Learn how SBA loan eligibility requirements are affected by "
            "rising interest rates and tighter lending standards in today's market.'\n"
        ),
        expected_output=(
            "A JSON object with keys: title, slug, content (1200+ word evergreen markdown), "
            "meta_description."
        ),
        agent=writer_agent,
        context=[economist_task],
    )

    return economist_task, writer_task


def build_editor_task(
    writer_draft: str,
    score_json: str,
    category: str,
    primary_keyword: str,
) -> Task:
    """
    Build the editor task for Crew 2, with the writer's draft embedded directly.
    Runs in a separate Crew call (after a 75s TPM-reset sleep) to avoid 70b rate limits.

    The editor has exactly 6 non-negotiable checks. The instructions are precise
    and bounded so the 70b model stays on task without producing a summary.
    """
    import json as _json
    score_data = _json.loads(score_json)
    score_val = score_data.get("health_score", "N/A")
    score_label = score_data.get("status_label", "N/A")

    return Task(
        description=(
            "You are the final editorial gate before this article goes live. "
            "Below is the writer's draft JSON (title, slug, meta_description, content). "
            "Apply the six checks below in order. Fix every failure you find. "
            "Return ONLY the improved JSON — no commentary, no code fences, no preamble.\n\n"
            f"GROUND TRUTH (fact-check all numbers against this):\n{score_json}\n"
            f"  Score: {score_val} ({score_label})\n\n"
            f"PRIMARY KEYWORD: \"{primary_keyword}\"\n"
            f"INDUSTRY: {category}\n\n"
            "━━━ CHECK 1 — OPENING HOOK (highest priority) ━━━\n"
            "The first two sentences must create immediate urgency for a small business owner.\n"
            "REWRITE the opener if it begins with ANY of these patterns:\n"
            "  'In today's...' / 'As a small business owner...' / 'In the current...'\n"
            "  'In an era...' / 'Navigating...' / Any rhetorical question opener\n"
            "Good example: 'Getting approved for a trucking loan just got harder, "
            "and the prime rate is only part of the story.'\n\n"
            "━━━ CHECK 2 — ANTI-AI LANGUAGE ━━━\n"
            "Find and replace EVERY instance of these throughout the article:\n"
            "  Banned verbs: delve→explore, leverage→use, navigate→handle,\n"
            "    bolster→strengthen, facilitate→help, foster→build,\n"
            "    streamline→simplify, underscore→highlight, enhance→improve.\n"
            "  Banned adjectives: robust→strong, comprehensive→complete,\n"
            "    pivotal→key, seamless→smooth, holistic→complete,\n"
            "    vital/crucial→important, transformative→significant.\n"
            "  Banned transitions: furthermore/moreover→also,\n"
            "    'that being said'→but, 'it is worth noting that'→(delete, state directly),\n"
            "    'in conclusion'→(delete, end on the FAQ).\n"
            "  Em dashes (—): replace EVERY one with a comma or colon.\n"
            "  Filler: delete 'absolutely', 'essentially', 'simply', 'truly', 'ultimately',\n"
            "    'undoubtedly' wherever they add no meaning.\n\n"
            "━━━ CHECK 3 — FACT ACCURACY ━━━\n"
            "Every number in the article must match the ground truth data exactly.\n"
            "Every number must have its unit (%, basis points, $, count) AND\n"
            "a one-sentence plain-English explanation of what it means for a business owner.\n"
            "Example: '6.75%, the prime rate as of today, raises the floor on every "
            "variable-rate SBA loan by the same amount.'\n\n"
            "━━━ CHECK 4 — WORD COUNT ━━━\n"
            "The content field must be 1,100-1,500 words.\n"
            "If UNDER 1,100 words: expand each FAQ answer to 4-5 sentences citing at least "
            "one specific indicator value. Expand the Practical Implications section with "
            "one additional short paragraph.\n"
            "If OVER 1,500 words: cut the most generic sentence from each body section.\n"
            "NEVER write the word count in the output.\n\n"
            "━━━ CHECK 5 — AMERICAN ENGLISH ━━━\n"
            "Fix: labour→labor, analyse→analyze, colour→color, centre→center,\n"
            "  whilst→while, realise→realize, optimise→optimize, 'high street'→'Main Street'.\n\n"
            "━━━ CHECK 6 — STRUCTURE & SEO ━━━\n"
            "Confirm all of these are present. Fix anything missing:\n"
            "  - Title: PRESERVE the writer's title if it already contains the primary keyword "
            "AND is under 65 chars. Only rewrite if: (a) it contains a year/date/'today', "
            "(b) it exceeds 65 chars, OR (c) the primary keyword is completely absent.\n"
            "  - Meta description: exactly one sentence, ends with period, max 140 chars, "
            "    primary keyword present.\n"
            "  - Slug: lowercase, hyphens only, no dates, max 60 chars.\n"
            "  - Primary keyword appears in: first 50 words, one H2 heading, meta description, "
            "    final paragraph.\n"
            "  - At least 2 internal links present in the content.\n"
            "  - 3 FAQ H3 questions present, each answered in 3-5 sentences.\n"
            "  - No H1 in content (title is rendered separately by the CMS).\n\n"
            "━━━ OUTPUT FORMAT ━━━\n"
            "Output ONLY a valid JSON object. Zero code fences. Zero commentary.\n"
            "Exactly 4 keys in this order: title, slug, meta_description, content.\n\n"
            f"━━━ WRITER'S DRAFT ━━━\n{writer_draft}"
        ),
        expected_output=(
            "A valid JSON object with exactly 4 keys: "
            "title (evergreen, under 65 chars, primary keyword), "
            "slug (lowercase hyphens, no dates, max 60 chars), "
            "meta_description (one sentence, period, max 140 chars, primary keyword), "
            "content (1,100-1,500 word publication-ready markdown, no H1, no code fences)."
        ),
        agent=editor_agent,
    )
