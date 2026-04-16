export const runtime = "edge";

import type { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AffiliateCTA from "@/components/AffiliateCTA";

export const metadata: Metadata = {
  title: "SBA Loans: Eligibility, Rates & How to Apply | US Business Funding Climate Score",
  description:
    "Complete guide to SBA loan eligibility requirements, current 7(a) rates, application process, and how today's Federal Reserve data affects your approval odds.",
  alternates: { canonical: "/sba-loans" },
  openGraph: {
    title: "SBA Loans: Eligibility, Rates & How to Apply",
    description:
      "Everything a US small business owner needs to know about SBA 7(a) loans — eligibility, current rates tied to the prime rate, documentation, and timing.",
    type: "article",
  },
};

async function getLiveScore() {
  const { data } = await supabase
    .from("daily_scores")
    .select("health_score, status_label, date, dprime")
    .order("date", { ascending: false })
    .limit(1)
    .single();
  return data;
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "SBA Loans: Eligibility, Rates & How to Apply",
  description:
    "Complete guide to SBA loan eligibility, current rates, and application process for US small business owners.",
  url: "https://usfundingclimate.com/sba-loans",
  author: {
    "@type": "Person",
    name: "M. Ashfaq",
    url: "https://usfundingclimate.com/about",
    jobTitle: "M.Phil Economics",
  },
  publisher: {
    "@type": "Organization",
    name: "US Business Funding Climate Score",
    url: "https://usfundingclimate.com",
  },
};

export default async function SbaLoansPage() {
  const score = await getLiveScore();
  const primeRate = score?.dprime ?? 7.5;
  const sba7aRate = primeRate + 2.75;
  const sba7aRateLarge = primeRate + 2.25;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-400 mb-6 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-600">Home</Link>
          <span>›</span>
          <span>SBA Loans</span>
        </nav>

        {/* Live rate banner */}
        {score && (
          <div className="bg-blue-950 text-white rounded-2xl p-4 mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold tracking-widest text-blue-400 uppercase mb-0.5">Live Rate — Updated Daily</p>
              <p className="text-sm text-slate-200">
                Today's prime rate: <strong className="text-white">{primeRate.toFixed(2)}%</strong>
                {" "}· Current SBA 7(a) rate: <strong className="text-yellow-300">{sba7aRate.toFixed(2)}%</strong>
                {" "}· Funding Climate: <strong className={score.status_label === "Optimal" ? "text-green-400" : score.status_label === "Moderate" ? "text-yellow-300" : "text-red-400"}>{score.status_label}</strong>
              </p>
            </div>
            <Link href="/" className="text-xs font-semibold text-blue-300 hover:text-white transition-colors whitespace-nowrap">
              Full Score →
            </Link>
          </div>
        )}

        <div className="mb-6">
          <p className="text-xs font-bold tracking-widest text-green-600 uppercase mb-2">Complete Guide</p>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            SBA Loans: Eligibility, Rates &amp; How to Apply
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            SBA loans are the lowest-cost financing most US small businesses can access. This guide
            covers everything you need to know — eligibility requirements, current rates, loan types,
            documentation, and how today's Federal Reserve data affects your approval odds.
          </p>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[10px] font-bold">A</span>
            </div>
            <p className="text-xs text-slate-400">
              By <Link href="/about" className="font-semibold text-slate-600 hover:text-blue-600">M. Ashfaq</Link>
              <span className="text-slate-300"> · M.Phil Economics · Last reviewed April 2026</span>
            </p>
          </div>
        </div>

        {/* TOC */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-7">
          <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-3">In This Guide</p>
          <ol className="space-y-1.5 text-sm">
            {[
              ["#what-is", "What is an SBA loan?"],
              ["#types", "SBA 7(a) vs SBA 504: which is right for you?"],
              ["#rates", "Current SBA loan rates"],
              ["#eligibility", "Eligibility requirements"],
              ["#documents", "Documentation checklist"],
              ["#timeline", "How long does approval take?"],
              ["#climate", "How today's Fed data affects your odds"],
              ["#faq", "Frequently asked questions"],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="text-blue-600 hover:underline">{label}</a>
              </li>
            ))}
          </ol>
        </div>

        {/* Content sections */}
        <div className="prose prose-slate max-w-none prose-h2:text-xl prose-h2:font-bold prose-h2:text-slate-900 prose-h2:mt-10 prose-h2:mb-4 prose-p:text-slate-700 prose-p:leading-7 prose-li:text-slate-700 prose-strong:text-slate-900 space-y-0">

          <h2 id="what-is">What Is an SBA Loan?</h2>
          <p>
            An SBA loan is a small business loan <strong>partially guaranteed by the US Small Business
            Administration</strong>. The SBA does not lend money directly — instead, it guarantees a
            portion (typically 75–85%) of the loan made by an approved bank or credit union. That
            guarantee reduces the lender's risk, which is why SBA loans offer lower rates and longer
            terms than most conventional business loans.
          </p>
          <p>
            The SBA 7(a) program is the most common. In fiscal year 2023, the SBA guaranteed over
            57,000 loans worth more than $27 billion. For most Main Street businesses, it is the
            cheapest debt financing available outside of a conventional bank loan — and the
            qualification bar is lower than conventional.
          </p>

          <h2 id="types">SBA 7(a) vs SBA 504: Which Is Right for You?</h2>

          <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-5">
            {[
              {
                title: "SBA 7(a)",
                color: "border-t-green-500",
                badge: "Most common",
                badgeColor: "bg-green-100 text-green-700",
                points: [
                  "Max loan: $5 million",
                  "Use: working capital, equipment, real estate, debt refinancing",
                  `Current rate: prime + 2.25–2.75% = ${sba7aRate.toFixed(2)}%`,
                  "Terms: up to 10 years (25 years for real estate)",
                  "Guarantee: up to 85%",
                ],
              },
              {
                title: "SBA 504",
                color: "border-t-blue-500",
                badge: "Real estate & equipment",
                badgeColor: "bg-blue-100 text-blue-700",
                points: [
                  "Max loan: $5.5 million (SBA portion)",
                  "Use: commercial real estate, major equipment only",
                  "Rate: fixed, below-market (tied to 10-year Treasury)",
                  "Terms: 10, 20, or 25 years",
                  "Requires: 10% down payment from borrower",
                ],
              },
            ].map((loan) => (
              <div key={loan.title} className={`bg-white rounded-2xl border border-slate-200 border-t-4 ${loan.color} p-5`}>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-base font-bold text-slate-900">{loan.title}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${loan.badgeColor}`}>{loan.badge}</span>
                </div>
                <ul className="space-y-1.5">
                  {loan.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h2 id="rates">Current SBA Loan Rates</h2>
          <p>
            SBA 7(a) loan rates are <strong>variable and tied directly to the prime rate</strong>.
            The prime rate is set by major US banks in response to the Federal Reserve's federal
            funds rate target. When the Fed raises rates, your SBA loan rate rises too — often
            within weeks.
          </p>

          <div className="not-prose bg-white border border-slate-200 rounded-2xl overflow-hidden my-5">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
              <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">Current SBA 7(a) Rate Table</p>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                ["Loans $50K–$250K (up to 7 years)", `Prime + 2.75% = ${sba7aRate.toFixed(2)}%`],
                ["Loans $50K–$250K (over 7 years)", `Prime + 3.25% = ${(primeRate + 3.25).toFixed(2)}%`],
                ["Loans over $250K (up to 7 years)", `Prime + 2.25% = ${sba7aRateLarge.toFixed(2)}%`],
                ["Loans over $250K (over 7 years)", `Prime + 2.75% = ${sba7aRate.toFixed(2)}%`],
              ].map(([loan, rate]) => (
                <div key={loan} className="flex items-center justify-between px-5 py-3">
                  <span className="text-xs text-slate-600">{loan}</span>
                  <span className="text-xs font-bold text-red-600 tabular-nums">{rate}</span>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 px-5 py-2.5 border-t border-blue-100">
              <p className="text-[10px] text-blue-600">
                Prime rate today: <strong>{primeRate.toFixed(2)}%</strong> · Updated from Federal Reserve FRED data ·{" "}
                <Link href="/methodology" className="underline">How we track this</Link>
              </p>
            </div>
          </div>

          <h2 id="eligibility">SBA Loan Eligibility Requirements</h2>
          <p>
            The SBA sets minimum requirements, but individual lenders add their own criteria.
            Meeting the SBA minimums does not guarantee approval — it means you are eligible
            to apply.
          </p>

          <div className="not-prose space-y-3 my-5">
            {[
              {
                req: "Business size",
                detail: "Must meet SBA size standards (industry-specific, typically under 500 employees for most service businesses, under $7.5M annual revenue for retail).",
                icon: "🏢",
              },
              {
                req: "For-profit US business",
                detail: "Must operate for profit in the United States. Nonprofits, passive businesses, and most financial companies are ineligible.",
                icon: "🇺🇸",
              },
              {
                req: "Owner equity investment",
                detail: "Owners must have invested their own money and time in the business. The SBA will not be the first source of financing.",
                icon: "💰",
              },
              {
                req: "Credit score",
                detail: `Most lenders require a personal FICO score of 650–680 minimum. In the current tightening environment (${score?.status_label ?? "Risky"} conditions), many lenders are requiring 700+.`,
                icon: "📊",
              },
              {
                req: "Time in business",
                detail: "Typically 2+ years in operation. Startups can qualify under SBA programs but face stricter scrutiny.",
                icon: "📅",
              },
              {
                req: "Debt service coverage",
                detail: "Lenders require DSCR of 1.25x — your net operating income must be 125% of annual loan payments. Use the break-even calculator to check yours.",
                icon: "⚖️",
              },
              {
                req: "No delinquent federal debt",
                detail: "Cannot have outstanding delinquent government loans (including prior SBA loans, student loans, federal taxes).",
                icon: "🚫",
              },
            ].map(({ req, detail, icon }) => (
              <div key={req} className="flex gap-3 bg-white border border-slate-200 rounded-xl p-4">
                <span className="text-xl flex-shrink-0">{icon}</span>
                <div>
                  <p className="text-sm font-bold text-slate-800">{req}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{detail}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 id="documents">Documentation Checklist</h2>
          <p>
            Incomplete documentation is the #1 reason SBA applications get delayed.
            Have these ready before applying:
          </p>

          <div className="not-prose bg-white border border-slate-200 rounded-2xl p-5 my-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { section: "Business documents", items: ["2–3 years business tax returns", "Year-to-date P&L statement", "Current balance sheet", "Business bank statements (6–12 months)", "Business licenses and registrations", "Articles of incorporation / operating agreement"] },
                { section: "Personal documents", items: ["2–3 years personal tax returns", "Personal financial statement (SBA Form 413)", "Government-issued ID", "Resume (for startups)", "Personal bank statements (3 months)", "List of any outstanding debts"] },
              ].map(({ section, items }) => (
                <div key={section}>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{section}</p>
                  <ul className="space-y-1.5">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-slate-600">
                        <span className="text-slate-300 mt-0.5 flex-shrink-0">☐</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <h2 id="timeline">How Long Does SBA Loan Approval Take?</h2>
          <p>
            Standard SBA 7(a) approval takes <strong>30–90 days</strong> from application to funding.
            SBA Express loans (up to $500K) have a 36-hour SBA response time, but total funding
            still typically takes 2–4 weeks. Preferred Lender Program (PLP) banks can approve
            in-house without SBA review, cutting time to 1–3 weeks.
          </p>
          <p>
            In tighter credit environments — like the current{" "}
            <strong>{score?.status_label ?? "Risky"}</strong> conditions — underwriting scrutiny
            increases and timelines extend. Apply at least 60–90 days before you need the funds.
          </p>

          <h2 id="climate">How Today's Fed Data Affects Your Approval Odds</h2>
          <p>
            The <Link href="/" className="text-blue-600 hover:underline">US Business Funding Climate Score</Link>{" "}
            tracks six Federal Reserve indicators that directly affect your SBA loan application:
          </p>

          <div className="not-prose space-y-2 my-4">
            {[
              { name: "Prime Rate", impact: `${primeRate.toFixed(2)}% — sets your interest rate floor`, color: "text-red-600 bg-red-50" },
              { name: "C&I Lending Standards", impact: "Measures how strict banks are being right now", color: "text-orange-600 bg-orange-50" },
              { name: "Yield Curve (T10Y2Y)", impact: "Inverted = banks compress margins, tighten criteria", color: "text-purple-600 bg-purple-50" },
              { name: "Jobless Claims", impact: "Rising claims = lenders expect more defaults, tighten", color: "text-amber-600 bg-amber-50" },
            ].map(({ name, impact, color }) => (
              <div key={name} className={`flex items-start gap-3 rounded-xl p-3 ${color}`}>
                <span className="text-sm font-bold w-40 flex-shrink-0">{name}</span>
                <span className="text-xs leading-relaxed">{impact}</span>
              </div>
            ))}
          </div>

          <h2 id="faq">Frequently Asked Questions</h2>

          <div className="not-prose space-y-4 my-5">
            {[
              {
                q: "What credit score do I need for an SBA loan?",
                a: `Most SBA lenders currently require a personal FICO score of 650–700 minimum. With the prime rate at ${primeRate.toFixed(2)}% and C&I lending standards tighter than pre-2022, many lenders have quietly raised their informal floor to 700+. A score above 720 puts you in a meaningfully stronger position — not just for approval, but for negotiating terms.`,
              },
              {
                q: "Are SBA loan rates going up or down right now?",
                a: `SBA 7(a) rates move directly with the prime rate, which currently sits at ${primeRate.toFixed(2)}%. That puts standard SBA 7(a) rates at ${sba7aRate.toFixed(2)}% — significantly above the pre-2022 baseline of around 5.5–6.0%. Whether rates go up or down depends entirely on the Federal Reserve's next moves. Track the daily score to monitor the prime rate direction.`,
              },
              {
                q: "How long does SBA loan approval take in the current environment?",
                a: "Standard SBA 7(a) approval takes 30–90 days. In the current tighter credit environment, underwriting is more thorough, which tends to add 2–4 weeks to the process. If you use a Preferred Lender Program (PLP) bank, they can approve without SBA review and cut total time to 2–4 weeks. Apply at least 60–90 days before you need the funds.",
              },
              {
                q: "What's the difference between SBA 7(a) and a merchant cash advance?",
                a: `The cost difference is the key distinction. An SBA 7(a) loan at ${sba7aRate.toFixed(2)}% is the annual rate on the outstanding balance — expensive, but manageable. A merchant cash advance typically has an effective APR of 40–150% when you run the numbers. Use the MCA True Cost Calculator to see the full comparison for your specific terms.`,
              },
            ].map(({ q, a }) => (
              <div key={q} className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-sm font-bold text-slate-900 mb-2">{q}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        <AffiliateCTA variant="sba" className="my-6" />

        {/* Related tools */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-5">
          <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4">Related Tools</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { href: "/#prime-rate-calculator", label: "SBA Payment Calculator", desc: "Estimate your monthly payment at today's rate" },
              { href: "/tools/break-even-calculator", label: "Break-Even Calculator", desc: "Check your DSCR before applying" },
              { href: "/tools/cash-flow-runway", label: "Cash Flow Runway", desc: "How long can you wait for approval?" },
            ].map(({ href, label, desc }) => (
              <Link key={href} href={href} className="bg-slate-50 rounded-xl border border-slate-200 p-3.5 hover:border-green-300 hover:bg-green-50 transition-colors group">
                <p className="text-xs font-bold text-slate-700 group-hover:text-green-700 mb-1">{label}</p>
                <p className="text-[11px] text-slate-400">{desc}</p>
              </Link>
            ))}
          </div>
        </div>

        <p className="text-[10px] text-slate-400 text-center leading-relaxed">
          Rate information based on Federal Reserve FRED data. SBA loan terms vary by lender.{" "}
          <Link href="/disclaimer" className="underline">Not financial advice.</Link>{" "}
          <Link href="/methodology" className="underline">See our methodology.</Link>
        </p>
      </div>
    </>
  );
}
