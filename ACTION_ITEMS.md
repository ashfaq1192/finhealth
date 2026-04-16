# Action Items — usfundingclimate.com
**Last updated:** April 2026

These are tasks that require your manual input and cannot be automated.

---

## 🔴 High Priority (Do This Week)

### 1. Add LinkedIn URL to About page
**File:** `frontend/app/about/page.tsx`
**What to do:** Find the line `const LINKEDIN_URL = ""` near the top and replace the empty string with your LinkedIn profile URL.
```ts
const LINKEDIN_URL = "https://www.linkedin.com/in/your-profile-here";
```
**Why it matters:** The LinkedIn button only renders when this is set. Google quality raters look for this on YMYL author pages.

---

### 2. Submit sitemap to Google Search Console
**URL to submit:** `https://usfundingclimate.com/sitemap.xml`
**Where:** Google Search Console → Sitemaps → Add a new sitemap
**Why it matters:** New pages (/tools/*, /sba-loans, /invoice-factoring, /cash-flow-management, /advertise) need to be crawled and indexed. GSC is also where you'll see which pages have been indexed, and catch any crawl errors.

---

### 3. Write (or heavily edit) your first Tier 1 cornerstone post
**What this means:** Pick any upcoming blog post from the pipeline and add one paragraph of genuine personal analysis before it publishes. Example:

> *"My read on this: the C&I tightening numbers this quarter suggest banks are responding to
> deteriorating collateral values more than rising default risk — which means businesses with
> real assets (equipment, receivables) are in a better position than the headline score suggests.
> Watch the Q3 SLOOS release for confirmation."*

**Why it matters:** This is the single most important signal for AdSense YMYL approval. One paragraph per week transforms the site from "AI content farm" to "economist-curated publication" in Google's quality rater guidelines.

---

## 🟡 Medium Priority (Do This Month)

### 4. Replace affiliate placeholder links in AffiliateCTA component
**File:** `frontend/components/AffiliateCTA.tsx`
**What to do:** Sign up for these programs and replace the `href="#"` placeholders with your real affiliate tracking links:

| Program | Sign-up | Payout |
|---|---|---|
| **Lendio** | lendio.com/affiliate | $50–$150 per lead |
| **National Business Capital** | nationalbusinesscapital.com | $100–$300 per lead |
| **Kapitus** (formerly Kabbage) | kapitus.com/partners | $100–$200 per lead |

**Search for:** `href="#"` inside `AffiliateCTA.tsx` — each one is a placeholder link to replace.

---

### 5. Resubmit Google AdSense
**When:** End of May 2026 — after you have published at least 4 human-reviewed cornerstone posts (one per week through May).
**Checklist before resubmitting:**
- [ ] LinkedIn URL added to About page
- [ ] 4+ Tier 1 posts published with your personal analysis paragraph
- [ ] Sitemap submitted and indexed in GSC
- [ ] All new pages (Tools, Pillar pages) confirmed indexed in GSC
- [ ] No crawl errors in GSC

---

## 🟢 Lower Priority (Month 3+)

### 6. Write the April 2026 Monthly Data Report
**What:** A 2,000–3,000 word synthesis of the 30 daily scores from April — what moved, why, what it means for small business owners.
**Why it matters:** Original data nobody else has. Pure E-E-A-T gold for Google. Gets cited and linked.
**Suggested title:** *"April 2026 Business Funding Climate Report: What a Month of Fed Data Says About Small Business Credit"*

### 7. Update the contact/sender address in digest.py
**File:** `backend/digest.py`
**What:** Once your Resend domain is verified, update the `_FROM` sender address constant from the placeholder to your verified domain address (e.g., `digest@usfundingclimate.com`).

### 8. Begin outreach for sponsored content partnerships
Once you have 10+ published cornerstone posts and consistent traffic, reach out to:
- SBA lenders and brokers (Lendio, SmartBiz, Funding Circle)
- Invoice factoring companies (OTR Capital, RTS Financial, Riviera Finance)
- Business finance tools (Relay, Brex, Ramp)

**Rate to quote:** $150–$500 per sponsored post. Direct to your `/advertise` page.

### 9. Gate the Monthly Data Report behind email capture
Once the April report is written, add an email gate: show the first 500 words, then show the EmailCapture component, and unlock the rest on subscribe.

---

## Notes
- All 6 free calculators are live: Invoice Factoring, MCA, Break-Even, Cash Flow Runway, SBA Payment, Loan Comparison
- All 3 pillar pages are live: /sba-loans, /invoice-factoring, /cash-flow-management
- AffiliateCTA component is built — just needs real affiliate links (item #4 above)
- Advertise / media kit page is live at /advertise
