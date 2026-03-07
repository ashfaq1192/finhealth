"""
CrewAI agent definitions.
Each agent has an explicit llm= to avoid OPENAI_API_KEY fallback (Constitution Principle V).
"""

import os

from crewai import Agent
from langchain_groq import ChatGroq


def _llm() -> ChatGroq:
    """Create a ChatGroq LLM instance. Called fresh for each agent."""
    return ChatGroq(
        model="groq/llama-3.3-70b-versatile",
        temperature=0.3,
        max_tokens=2048,
        groq_api_key=os.environ["GROQ_API_KEY"],
    )


data_fetcher_agent = Agent(
    role="Financial Data Analyst",
    goal=(
        "Fetch and validate the latest US economic indicator values from the Federal "
        "Reserve FRED database. Return clean, structured JSON."
    ),
    backstory=(
        "You are a quantitative analyst specialising in US macroeconomic data. "
        "You retrieve real-time economic series from the Federal Reserve and ensure "
        "data quality before analysis."
    ),
    llm=_llm(),
    verbose=False,
    allow_delegation=False,
)

economist_agent = Agent(
    role="Senior Macroeconomist with M.Phil Economics",
    goal=(
        "Apply the Business Funding Climate Score formula to the provided economic "
        "indicators and produce a score (0-100), a status label, and exactly three "
        "plain-English reasoning bullets explaining the key drivers."
    ),
    backstory=(
        "You hold an M.Phil in Economics and specialise in US small business credit "
        "markets. You translate complex macroeconomic signals into clear, authoritative "
        "assessments that small business owners can act on."
    ),
    llm=_llm(),
    verbose=False,
    allow_delegation=False,
)

writer_agent = Agent(
    role="US B2B Finance Journalist",
    goal=(
        "Write a 600+ word SEO-optimised blog post for US small business owners "
        "explaining today's Business Funding Climate Score and its economic context. "
        "Target high-CPC finance keywords. "
        "IMPORTANT: Describe economic conditions and their implications only. "
        "Do NOT recommend specific financial products, advise the reader to borrow, "
        "or make any direct investment or lending recommendation."
    ),
    backstory=(
        "You are a finance journalist with 10 years covering US small business lending, "
        "SBA loans, invoice factoring, and merchant cash advances. Your writing is "
        "authoritative, clear, and optimised for Google search."
    ),
    llm=_llm(),
    verbose=False,
    allow_delegation=False,
)
