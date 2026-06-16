# Action Items — usfundingclimate.com
**Last updated:** June 2026

These are tasks that require your manual input and cannot be automated.

---

## 🔴 High Priority (Do This Week)

### 0a. Unblock AI crawlers in Cloudflare (added June 2026)
**Problem:** Cloudflare's "Block AI bots" managed setting is injecting rules into your
robots.txt that block GPTBot, ClaudeBot, CCBot, Google-Extended, and meta-externalagent.
Your articles are written with AI-citation optimization (ChatGPT, Perplexity, AI Overviews),
but those engines are forbidden from reading the site — the optimization is wasted until this is flipped.
**Where:** Cloudflare dashboard → your zone (usfundingclimate.com) → **AI Crawl Control**
(formerly "Block AI bots" under Security → Bots). Set it to **allow** AI crawlers
(or at minimum allow: GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot).
**Tradeoff:** allowing these bots means AI companies may train on your content. For a
traffic-dependent content site, citation visibility is worth far more than content protection.

### 0a2. Fix Cloudflare Pages not deploying from GitHub (added June 2026)
**Problem:** Commits pushed to master on GitHub (since June 12) are NOT being deployed to Cloudflare Pages.
The live site still serves old code (broken robots.txt Sitemap URL, no 301 redirects for old blog slugs).
**Diagnose in the Cloudflare dashboard:**
1. Go to Cloudflare → Pages → `usfundingclimate` → **Deployments** tab
2. Check if any deployment was triggered after June 12. If not, the GitHub integration webhook is broken.
3. If there are failed deployments, click the failed build to see the error log.
**Fix options:**
- If no deployments after June 12: disconnect and reconnect the GitHub repository in Pages → Settings → Builds & Deployments → Branch and Build Settings
- If builds are failing: read the Cloudflare build log (it's different from the local build) for the specific error
- Alternatively: use the **Manage deployment** → **Retry deployment** button to manually trigger a new build from the latest commit
**Note:** Local build (`npx @cloudflare/next-on-pages`) passes cleanly — the code is correct. The issue is the deploy trigger, not the code.

### 0b. Verify the broken Sitemap line in robots.txt is gone (added June 2026)
**Problem found:** live robots.txt served `Sitemap: https://usfundingclimate.com           /sitemap.xml`
(invalid URL — the `NEXT_PUBLIC_SITE_URL` env var in Cloudflare Pages has trailing whitespace).
**Fixed in code:** `robots.ts` now trims the env var. After the next deploy, check
`https://usfundingclimate.com/robots.txt` ends with a single clean
`Sitemap: https://usfundingclimate.com/sitemap.xml`.
**Better fix:** also edit the env var itself in Cloudflare Pages → Settings →
Environment variables → `NEXT_PUBLIC_SITE_URL` → remove the trailing whitespace/newline.

### 0c. Google Search Console — request removal-from-index for old duplicate URLs (added June 2026)
The 68 duplicate posts were consolidated into 5 evergreen pages on 2026-06-12; old URLs
now 301-redirect. In GSC:
1. Confirm the property is verified (if not, do item 2 below first).
2. Submit the sitemap again (it now lists only the 5 canonical posts).
3. Use **URL Inspection** on the 5 canonical URLs → Request indexing.
4. Do NOT bulk-remove the old URLs — the 301s pass their equity; Google will fold them in
   within a few weeks.

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
