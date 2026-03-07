"""
CrewAI task definitions for the daily funding score pipeline.
"""

from datetime import datetime

from crewai import Task

from agents import data_fetcher_agent, economist_agent, writer_agent

CATEGORIES = ["Trucking", "Retail", "SBA Loans", "Macro", "Staffing"]

# High-CPC keywords by category
CATEGORY_KEYWORDS = {
    "Trucking": "invoice factoring for trucking companies",
    "Retail": "merchant cash advance for retail businesses",
    "SBA Loans": "SBA loan eligibility requirements 2026",
    "Macro": "small business funding conditions 2026",
    "Staffing": "invoice factoring for staffing agencies",
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
    keyword = CATEGORY_KEYWORDS[category]
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

    writer_task = Task(
        description=(
            f"Write a 600+ word blog post for US small business owners in the {category} sector. "
            f"Today's Business Funding Climate Score is described in:\n\n{score_json}\n\n"
            f"Target keyword: '{keyword}'\n"
            f"Publication date: {today}\n"
            f"Slug: {slug}\n\n"
            "Structure: (1) Catchy SEO headline using the target keyword, "
            "(2) Today's score and label, (3) What the economic indicators mean for "
            f"{category} businesses, (4) The current lending environment context. "
            "CRITICAL RULES — strictly follow these:\n"
            "- Do NOT recommend specific financial products or services.\n"
            "- Do NOT advise the reader to take any specific financial action.\n"
            "- Do NOT make direct investment or lending recommendations.\n"
            "- Describe conditions and implications only.\n"
            "- Cite at least two of the six economic indicators by name.\n"
            "- Write in a professional, authoritative tone.\n\n"
            "Output a JSON object with these exact keys: "
            "title (string), slug (string, use the slug provided above), "
            "content (string, full markdown body 600+ words), "
            "meta_description (string, max 160 chars)."
        ),
        expected_output=(
            "A JSON object with keys: title, slug, content (600+ word markdown), meta_description."
        ),
        agent=writer_agent,
    )

    return fetch_task, economist_task, writer_task
