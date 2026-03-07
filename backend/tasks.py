"""
CrewAI task definitions for the daily funding score pipeline.

Blog strategy: evergreen keyword-first content.
Each post targets a high-CPC search term and uses today's score as supporting
data — not the headline topic. This makes posts rank for months, not one day.
"""

from datetime import datetime

from crewai import Task

from agents import data_fetcher_agent, economist_agent, writer_agent

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


def build_tasks(indicators_json: str, score_json: str) -> tuple[Task, Task, Task]:
    """
    Build the three CrewAI tasks for a pipeline run.
    Returns (fetch_task, economist_task, writer_task).
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
            "Write exactly THREE plain-English reasoning bullets that explain the main "
            "drivers of today's Business Funding Climate Score to a US small business owner. "
            "Each bullet should be one sentence, specific to the indicator values provided. "
            "Format: a JSON array of exactly 3 strings."
        ),
        expected_output=(
            'A JSON array of exactly 3 strings, e.g. ["Bullet 1.", "Bullet 2.", "Bullet 3."]'
        ),
        agent=economist_agent,
    )

    import json as _json
    score_data = _json.loads(score_json)
    score_val = score_data.get("health_score", "N/A")
    score_label = score_data.get("status_label", "N/A")

    writer_task = Task(
        description=(
            f"Write a 750+ word EVERGREEN SEO blog post for US small business owners.\n\n"
            f"INDUSTRY: {category}\n"
            f"PRIMARY KEYWORD: \"{seo['primary']}\"\n"
            f"SECONDARY KEYWORDS: {seo['secondary']}\n"
            f"SLUG: {slug}\n\n"
            f"INDUSTRY CONTEXT:\n{seo['industry_context']}\n\n"
            f"SCORE DATA (use as supporting evidence, not the main topic):\n{score_json}\n\n"
            "CONTENT STRUCTURE — follow this exactly:\n"
            f"1. TITLE: Evergreen, keyword-rich. No dates. Example format: "
            f"\"[Primary Keyword]: What [Label] Funding Conditions Mean for [Industry] Businesses\"\n"
            f"2. INTRO (2 paragraphs): Open with the reader's problem. "
            f"In paragraph 2, introduce the Business Funding Climate Score "
            f"({score_val} — {score_label}) as a macro indicator context.\n"
            f"3. H2: Current Economic Conditions for {category} Businesses\n"
            "   Explain what today's FRED indicators mean specifically for this sector.\n"
            "4. H2: Key Indicators Driving the Score\n"
            "   Explain 2-3 of the 6 indicators (prime rate, yield curve, C&I tightening, "
            "   jobless claims) and their sector-specific impact. Be specific with numbers.\n"
            f"5. H2: Practical Implications for {category} Business Owners\n"
            "   What should business owners understand about their funding environment? "
            "   Describe conditions and context — no specific product recommendations.\n"
            "6. H2: Frequently Asked Questions\n"
            f"   Answer each of these 3 questions in 3-4 sentences:\n"
            + "\n".join(f"   - {q}" for q in seo["faq"]) + "\n\n"
            "WRITING STYLE RULES:\n"
            "- Write all economic indicator names in plain English ONLY:\n"
            "  Use 'the prime rate' not `dprime`, 'the yield curve spread' not `t10y2y`,\n"
            "  'initial jobless claims' not `icsa`, 'business applications' not `busappwnsaus`,\n"
            "  'C&I lending standards' not `drtscilm` or `drtscis`.\n"
            "- Do NOT use backticks around any words or variable names in the content.\n"
            "- Do NOT include a References section or list raw indicator values.\n"
            "- Do NOT include the article title as an H1 at the top of the content — "
            "  start the content directly with the first paragraph.\n"
            "- Use clear section headings (H2 only, not H1) for each content section.\n\n"
            "SEO RULES:\n"
            "- Use primary keyword in first paragraph, one H2, and meta description\n"
            "- Write for someone who searched the keyword, not someone who knows this site\n"
            "- Avoid time-sensitive phrases in the title (no 'today', 'March 2026' etc.)\n"
            "- The score is mentioned as context data, not the article's main subject\n\n"
            "COMPLIANCE RULES (mandatory — no exceptions):\n"
            "- Describe economic conditions and their implications ONLY\n"
            "- Do NOT recommend specific lenders, financial products, or services\n"
            "- Do NOT advise the reader to borrow, invest, or take any financial action\n"
            "- Do NOT make direct lending or investment recommendations\n\n"
            "OUTPUT: A single JSON object with exactly these keys:\n"
            "  title: string (SEO-optimized, no date)\n"
            "  slug: string (use the slug provided above exactly)\n"
            "  content: string (full markdown, 750+ words, NO H1, NO backticks, NO References section)\n"
            "  meta_description: string (max 160 chars, include primary keyword)\n"
        ),
        expected_output=(
            "A JSON object with keys: title, slug, content (750+ word evergreen markdown), "
            "meta_description."
        ),
        agent=writer_agent,
    )

    return fetch_task, economist_task, writer_task
