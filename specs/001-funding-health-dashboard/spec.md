# Feature Specification: US Business Funding Climate Dashboard

**Feature Branch**: `001-funding-health-dashboard`
**Created**: 2026-03-07
**Status**: Draft

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Check Today's Funding Climate Score (Priority: P1)

A US small business owner, freelancer, or trucker visits the site to instantly
understand whether current economic conditions favor seeking a loan, line of credit,
or invoice factoring arrangement. They see a prominently displayed score (0-100) with
a plain-English label (e.g., "Moderate — Proceed with caution") and a brief summary
of the three key reasons driving that score today.

**Why this priority**: This is the core value proposition — without a visible,
interpretable score the site has no purpose. Every other feature supports this moment.

**Independent Test**: Open the homepage. A score between 0 and 100 MUST be visible
without scrolling on a desktop browser. A label MUST accompany the score. Three
reasoning bullets MUST appear below the score. The page MUST load in under 3 seconds.

**Acceptance Scenarios**:

1. **Given** a visitor lands on the homepage, **When** the page loads, **Then** a
   numerical score (0-100) and a corresponding status label are visible above the fold.
2. **Given** the score is displayed, **When** the visitor reads the reasoning section,
   **Then** exactly three plain-English bullets explain the key economic factors driving
   the current score.
3. **Given** the page has loaded, **When** the visitor reads the score label,
   **Then** the label is one of: "Optimal", "Moderate", "Risky", or "Critical".
4. **Given** no new data has been published yet today, **When** the page loads,
   **Then** the most recent available score is displayed with its corresponding date.

---

### User Story 2 - Read Economic Context Blog Post (Priority: P2)

A visitor wants to understand the broader economic context behind the score. They
navigate to the blog section and find a freshly published article (600+ words) that
explains what today's economic indicators mean for US small business financing, with
actionable guidance tailored to their situation (trucking, staffing, retail, etc.).

**Why this priority**: Blog content drives organic search traffic from high-value
finance keywords, enables AdSense revenue, and reinforces the site's E-E-A-T
authority. It is the primary revenue driver.

**Independent Test**: Navigate to the blog listing. At least one post MUST exist,
published within the last 7 days. Open the post — it MUST be at least 600 words,
contain a reference to the current score, and include actionable advice for US
business owners. A disclaimer MUST be visible.

**Acceptance Scenarios**:

1. **Given** a visitor visits the blog page, **When** they view the listing,
   **Then** posts are displayed in reverse-chronological order with title, category,
   and publication date visible.
2. **Given** a visitor opens a blog post, **When** they read it,
   **Then** it references the current funding climate score, cites at least two
   economic indicators by name, and provides actionable financing advice.
3. **Given** a visitor views any page, **When** they scroll to the bottom,
   **Then** a sticky disclaimer is visible stating the score is AI-generated for
   educational purposes and is not financial advice.
4. **Given** a visitor views a blog post, **When** they look at the category tag,
   **Then** it is one of: Trucking, Retail, SBA Loans, Macro, or Staffing.

---

### User Story 3 - View Score Trend Over Time (Priority: P3)

A returning visitor wants to understand whether conditions have been improving or
deteriorating over the past month. They view a chart showing the funding climate score
plotted over the last 30 days, allowing them to judge whether now is better or worse
than recent weeks.

**Why this priority**: Trend data adds depth and encourages return visits, but the
site is fully usable without it. Score history is only meaningful once at least a
few weeks of data have been collected.

**Independent Test**: On the homepage, a line chart is visible showing score values
across at least 7 historical dates. Hovering over a data point reveals the score and
date. The chart is readable on mobile.

**Acceptance Scenarios**:

1. **Given** at least 7 days of score history exist, **When** a visitor views the
   homepage, **Then** a trend chart displays the score over those dates.
2. **Given** fewer than 7 days of history exist, **When** a visitor views the homepage,
   **Then** available data points are shown without error, and a message explains that
   the chart fills in daily.
3. **Given** the trend chart is visible, **When** viewed on a mobile device,
   **Then** the chart is fully readable without horizontal scrolling.

---

### User Story 4 - Automated Daily Data Refresh (Priority: P1)

Every morning, without any manual intervention, the system fetches the latest
available economic indicators, recalculates the funding climate score, generates a
new blog post, and publishes everything to the live site. The business owner has
zero operational burden once the system is live.

**Why this priority**: Without automation the site becomes stale within days, losing
both search ranking and user trust. This is the operational backbone of the product.

**Independent Test**: Disable any manual triggers. Wait for the scheduled run time.
Confirm a new score record and blog post exist in the database dated today. Confirm
the live site reflects the new score without any manual action.

**Acceptance Scenarios**:

1. **Given** the automation is configured, **When** the scheduled time each morning
   arrives, **Then** the system automatically fetches economic data, calculates a new
   score, and stores it without manual intervention.
2. **Given** the score has been calculated, **When** the automated run completes,
   **Then** a new blog post referencing today's score is also generated and stored.
3. **Given** the automated run completes, **When** the live site is accessed,
   **Then** it reflects the newly generated score and post without requiring a manual
   redeploy.
4. **Given** an economic data source is temporarily unavailable, **When** the
   automated run executes, **Then** the system uses the most recently available value
   for that indicator and logs the fallback event rather than failing completely.

---

### Edge Cases

- What happens when all economic data sources return stale data?
  For up to 3 consecutive days without fresh data, the site MUST display the most
  recent score with a visible "as of [date]" label. After 3 days, the site MUST
  replace the score display with a "Data temporarily unavailable — check back soon"
  notice and suppress AdSense zones on that state.
- What happens when the score calculation would produce a value below 0 or above 100?
  The score MUST be clamped to the 0-100 range.
- What happens when a blog post fails to generate?
  The score record MUST still be saved; the blog post failure MUST be logged separately
  without blocking score publication.
- What happens when a visitor accesses the site before the first automated run has
  completed?
  A clear "Launching soon — check back tomorrow" message MUST be shown instead of
  an empty or broken dashboard.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display a funding climate score (0-100) on the homepage,
  visible above the fold without scrolling on desktop. The score MUST always include
  an "as of [date]" label regardless of freshness.
- **FR-002**: The system MUST display a plain-English status label alongside the score
  ("Optimal", "Moderate", "Risky", or "Critical").
- **FR-003**: The system MUST display exactly three reasoning bullets below the score
  explaining the key economic factors.
- **FR-004**: The system MUST display a trend chart of score history covering the last
  30 available data points (or all available if fewer than 30).
- **FR-005**: The system MUST provide a blog section listing articles in
  reverse-chronological order, each tagged with a category. Exactly one blog post
  MUST be generated per calendar day. The category MUST rotate in a fixed daily
  sequence: Trucking → Retail → SBA Loans → Macro → Staffing → repeat.
- **FR-006**: Each blog post MUST be at least 600 words and reference the current
  score and at least two economic indicators.
- **FR-007**: The system MUST automatically refresh score data and generate a new blog
  post once per calendar day without manual intervention. If a score record for the
  current date already exists (e.g., from a prior run or manual retry), the system
  MUST overwrite (upsert) it with the latest calculated values rather than skipping
  or appending a duplicate.
- **FR-008**: The system MUST persist all score records and blog posts in a database
  so that historical data is never lost between deployments.
- **FR-009**: Every page MUST display a compliance disclaimer identifying the content
  as AI-generated, educational, and not financial advice.
- **FR-010**: The site MUST be publicly accessible without any login or authentication.
- **FR-011**: The site MUST be mobile-responsive and readable on screens 375px wide
  and above.
- **FR-012**: The scoring formula MUST incorporate at minimum: a lending rate indicator,
  a bank credit tightening indicator, a business formation trend indicator, a yield
  curve indicator, and a labour market indicator.
- **FR-013**: The system MUST log automation run outcomes (success, partial failure,
  full failure) for operational monitoring. On a full failure (score not saved and
  blog post not generated), the system MUST send an email alert to the operator so
  a manual re-run can be triggered the same day.
- **FR-014**: AdSense-compatible ad placement zones MUST be present on the homepage
  and blog post pages without obscuring primary content.

### Key Entities

- **Funding Climate Score Record**: Represents one calculated score for a given date.
  Attributes: date, score value (0-100), status label, reasoning bullets (3 items),
  values for each economic indicator used in the calculation.
- **Blog Post**: An article generated from a score record. Attributes: title, URL slug,
  body content, meta description, category tag, publication date. Linked to the
  score record that inspired it.
- **Economic Indicator Snapshot**: The raw values fetched from data sources on a given
  run. Attributes: indicator name, raw value, fetch date, source. Embedded within
  each Score Record.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new score and blog post are published automatically every calendar day
  without manual action, with 95%+ reliability over any 30-day window.
- **SC-002**: The homepage score and label are visible to a visitor within 3 seconds
  of page load on a standard broadband connection.
- **SC-003**: The site is operational on a budget of $0-$5/month in infrastructure
  costs, verified against actual monthly invoices.
- **SC-004**: Blog posts achieve indexing by major search engines within 7 days of
  publication, confirming the site is crawlable and content meets basic quality
  signals.
- **SC-005**: The site renders correctly and all primary content is accessible on
  mobile devices (375px minimum width) without horizontal scrolling.
- **SC-006**: The score changes at least once per week on average, driven by fresh
  economic data, so returning visitors see meaningful updates.
- **SC-007**: In the event of a partial data outage (one indicator unavailable), the
  system continues publishing a score using the most recent available value, with
  zero manual intervention required.

---

## Clarifications

### Session 2026-03-07

- Q: If automation runs twice in one day, should it overwrite the existing score record or skip? → A: Upsert — overwrite today's record and blog post with the freshest available data.
- Q: How many days of stale data is acceptable before showing a "data unavailable" notice? → A: 3 days — publish with stale data (showing "as of [date]") for up to 3 days, then switch to a notice.
- Q: How many blog posts should automation generate per day, and how is the category chosen? → A: One post per day; category rotates in fixed sequence: Trucking → Retail → SBA Loans → Macro → Staffing → repeat.
- Q: Should a full automation failure trigger an active alert or log-only? → A: Email alert to operator on full failure (score not saved + blog post not generated).
- Q: Should the score always display its date, or only when stale? → A: Always show "as of [date]" on every score display regardless of freshness.

---

## Assumptions

- Economic data is fetched from US Federal Reserve public data sources, which are
  freely available and do not require a paid subscription.
- The site targets US English-speaking visitors only; no internationalisation is
  required at this stage.
- No user accounts, logins, or personalisation features are in scope.
- The blog content is generated entirely by an AI language model; no human editorial
  review step is required before publication.
- A single author/operator manages the site; no multi-user admin panel is needed.
- The compliance disclaimer language satisfies standard educational-content safe
  harbour requirements; no legal review has been conducted.
- AdSense approval is the operator's responsibility; the site only needs to expose
  appropriate placement zones.
