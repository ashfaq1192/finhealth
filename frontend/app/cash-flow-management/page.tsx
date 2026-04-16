export const runtime = "edge";

import type { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AffiliateCTA from "@/components/AffiliateCTA";

export const metadata: Metadata = {
  title: "Small Business Cash Flow Management: The Survival Guide | US Business Funding Climate Score",
  description:
    "How to manage cash flow as a small business owner: understanding burn rate, seasonal gaps, net-30 strain, payroll funding, and when to seek financing. Includes free cash flow tools.",
  alternates: { canonical: "/cash-flow-management" },
  openGraph: {
    title: "Small Business Cash Flow Management Guide",
    description:
      "The complete guide to small business cash flow — managing seasonal gaps, net-30 client strain, payroll funding, and using live Federal Reserve data to time financing decisions.",
    type: "article",
  },
};

async function getPrimeRate() {
  const { data } = await supabase
    .from("daily_scores")
    .select("prime_rate, date")
    .order("date", { ascending: false })
    .limit(1)
    .single();
  return data;
}

const CASH_FLOW_KILLERS = [
  {
    rank: 1,
    title: "Net-30/60 clients",
    desc: "You deliver the work or product in January, but don't get paid until March. Meanwhile, payroll, rent, and supplier invoices don't wait. For trucking and staffing businesses, this gap can be $50,000–$500,000 at any given time.",
    solution: "Invoice factoring — sell the invoice today for 85–90 cents on the dollar and stop waiting.",
  },
  {
    rank: 2,
    title: "Seasonal revenue swings",
    desc: "Landscapers, construction firms, and retailers face months where revenue drops 50–80% while fixed costs stay constant. A restaurant that makes $80K/month in summer may make $25K in January — but rent and payroll don't change.",
    solution: "Business line of credit — draw during slow months, repay during peak months.",
  },
  {
    rank: 3,
    title: "Rapid growth outpacing cash",
    desc: "Counter-intuitively, fast growth kills cash flow. Landing a large new contract requires hiring staff, buying materials, and incurring costs weeks before the first invoice gets paid. More revenue on paper, less cash in the bank.",
    solution: "SBA 7(a) working capital loan or invoice factoring on the new contracts.",
  },
  {
    rank: 4,
    title: "Unexpected expenses",
    desc: "Equipment breaks down. A key customer goes bankrupt. A lawsuit requires legal fees. Without a cash buffer, any single unexpected expense can force a business to miss payroll or delay supplier payments — triggering a downward spiral.",
    solution: "Cash reserve of 3–6 months of fixed costs, plus a pre-approved credit line you don't use.",
  },
  {
    rank: 5,
    title: "Over-investing in inventory",
    desc: "Buying too much inventory ties up cash in goods sitting on shelves. The inventory may be worth $200,000 on paper, but it can't pay your rent. This is especially common in manufacturing and wholesale distribution.",
    solution: "Just-in-time ordering, consignment arrangements, or inventory financing.",
  },
];

const METRICS = [
  {
    metric: "Cash runway",
    formula: "Cash balance ÷ Monthly net burn",
    target: "6+ months",
    danger: "Under 3 months",
    tool: "/tools/cash-flow-runway",
  },
  {
    metric: "Break-even revenue",
    formula: "Fixed costs ÷ Gross margin %",
    target: "Know your number",
    danger: "If unknown, you can't plan",
    tool: "/tools/break-even-calculator",
  },
  {
    metric: "Receivables days outstanding",
    formula: "(Accounts receivable ÷ Revenue) × 30",
    target: "Under 30 days",
    danger: "Over 45 days = cash flow crisis",
    tool: null,
  },
  {
    metric: "Current ratio",
    formula: "Current assets ÷ Current liabilities",
    target: "Above 1.5",
    danger: "Under 1.0 = technically insolvent",
    tool: null,
  },
];

const FUNDING_OPTIONS = [
  {
    situation: "Outstanding unpaid invoices from creditworthy clients",
    bestOption: "Invoice Factoring",
    why: "Immediate cash against invoices you've already earned. No new debt.",
    link: "/invoice-factoring",
  },
  {
    situation: "Predictable seasonal cash gap (you know it's coming)",
    bestOption: "Business Line of Credit",
    why: "Pre-approve the line in advance. Draw when needed, repay when revenue recovers.",
    link: "/tools/loan-comparison",
  },
  {
    situation: "Long-term working capital for growth",
    bestOption: "SBA 7(a) Loan",
    why: "Lowest cost of capital. Use for growth, not survival — apply before you need it.",
    link: "/sba-loans",
  },
  {
    situation: "Emergency: payroll in 48 hours, nothing else works",
    bestOption: "MCA (last resort)",
    why: "Fast funding but extremely expensive (50–300% APR). Avoid if any other option exists.",
    link: "/tools/mca-calculator",
  },
];

export default async function CashFlowManagementPage() {
  const scoreData = await getPrimeRate();
  const primeRate = scoreData?.prime_rate ?? 7.5;
  const locRate = (primeRate + 3.5).toFixed(2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Small Business Cash Flow Management: The Survival Guide",
    description:
      "How to manage cash flow as a small business owner — burn rate, seasonal gaps, net-30 strain, payroll funding, and when to seek financing.",
    url: "https://usfundingclimate.com/cash-flow-management",
    datePublished: "2026-04-01",
    dateModified: new Date().toISOString().split("T")[0],
    author: {
      "@type": "Person",
      name: "Ashfaq Ahmad",
      url: "https://usfundingclimate.com/about",
      jobTitle: "M.Phil Economics",
    },
    publisher: {
      "@type": "Organization",
      name: "US Business Funding Climate Score",
      url: "https://usfundingclimate.com",
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://usfundingclimate.com/cash-flow-management" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-400 mb-6 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-600">Home</Link>
          <span>›</span>
          <span>Cash Flow Management</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-bold tracking-widest text-blue-500 uppercase mb-2">Complete Guide</p>
          <h1 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">
            Small Business Cash Flow Management: The Survival Guide
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Cash flow — not profit — is what keeps a business alive. More small businesses fail from
            cash flow problems than from any other cause, including low revenue. This guide explains
            why, how to measure it, and what to do when you&apos;re running short.
          </p>
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <p className="text-xs text-slate-500">
              By{" "}
              <Link href="/about" className="font-semibold text-slate-700 hover:text-blue-600">
                M. Ashfaq
              </Link>
              {" "}· M.Phil Economics · Last updated April 2026
            </p>
          </div>
        </div>

        {/* Live rate context */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8 flex items-start gap-4">
          <span className="text-2xl flex-shrink-0">📊</span>
          <div>
            <p className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-1">Live Federal Reserve Data</p>
            <p className="text-sm text-blue-900 font-semibold mb-0.5">
              Current prime rate: {primeRate}% · Business line of credit: ~{locRate}%
            </p>
            <p className="text-xs text-blue-700 leading-relaxed">
              The cost of financing your cash gap changes with the Fed. Today&apos;s prime rate means
              every $100,000 on a line of credit costs approximately ${((primeRate + 3.5) * 1000).toFixed(0)}/year in interest.
            </p>
            <Link href="/" className="text-xs font-semibold text-blue-600 hover:underline mt-1 inline-block">
              Check today&apos;s Business Funding Climate Score →
            </Link>
          </div>
        </div>

        {/* Cash flow vs profit */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Cash Flow vs Profit: Why the Distinction Kills Businesses</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            A business can be profitable on paper and still run out of cash. This is not a paradox — it
            is standard accounting. Profit is recorded when revenue is earned; cash arrives when invoices
            are actually paid. If your customer pays net-60, you&apos;ve recognized the profit in January
            but the cash arrives in March. Your January payroll can&apos;t wait.
          </p>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">A profitable business that ran out of cash</p>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-3 gap-3 text-center text-sm mb-3">
                <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                  <p className="text-xs text-green-600 mb-1">January Revenue</p>
                  <p className="font-bold text-green-800">$120,000</p>
                  <p className="text-[10px] text-green-600">(recognized)</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-xs text-red-600 mb-1">January Expenses</p>
                  <p className="font-bold text-red-800">$85,000</p>
                  <p className="text-[10px] text-red-600">(cash, due now)</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                  <p className="text-xs text-green-600 mb-1">January Profit</p>
                  <p className="font-bold text-green-800">$35,000</p>
                  <p className="text-[10px] text-green-600">(on paper)</p>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                <p className="text-sm font-bold text-red-800">
                  Cash in bank: $0 — customers pay net-60. Payroll is due in 3 days.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top 5 cash flow killers */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">The 5 Biggest Cash Flow Killers for Small Businesses</h2>
          <div className="space-y-4">
            {CASH_FLOW_KILLERS.map((item) => (
              <div key={item.rank} className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-xs font-bold">{item.rank}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-2">{item.desc}</p>
                    <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                      <p className="text-xs font-semibold text-green-700">Solution: {item.solution}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key metrics */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">4 Cash Flow Metrics Every Business Owner Must Know</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            You can&apos;t manage what you don&apos;t measure. These four numbers tell you where your business
            stands before a crisis develops.
          </p>
          <div className="space-y-3">
            {METRICS.map((m) => (
              <div key={m.metric} className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-slate-900 mb-1">{m.metric}</h3>
                    <code className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">{m.formula}</code>
                    <div className="flex gap-3 mt-2 flex-wrap">
                      <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">
                        Target: {m.target}
                      </span>
                      <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                        Warning: {m.danger}
                      </span>
                    </div>
                  </div>
                  {m.tool && (
                    <Link
                      href={m.tool}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap flex-shrink-0"
                    >
                      Calculate →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Free tools callout */}
        <div className="bg-slate-900 rounded-2xl p-6 text-white mb-8">
          <p className="text-xs font-bold tracking-widest text-blue-400 uppercase mb-2">Free Calculators</p>
          <h2 className="text-base font-bold mb-3">Calculate Your Cash Position Right Now</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/tools/cash-flow-runway"
              className="bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-colors"
            >
              <p className="text-sm font-bold text-white mb-1">🛫 Cash Flow Runway</p>
              <p className="text-xs text-slate-300">How many months of runway do you have?</p>
            </Link>
            <Link
              href="/tools/break-even-calculator"
              className="bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-colors"
            >
              <p className="text-sm font-bold text-white mb-1">⚖️ Break-Even Calculator</p>
              <p className="text-xs text-slate-300">What revenue do you need to cover costs?</p>
            </Link>
            <Link
              href="/tools/loan-comparison"
              className="bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-colors"
            >
              <p className="text-sm font-bold text-white mb-1">🏦 Loan Comparison Tool</p>
              <p className="text-xs text-slate-300">Compare SBA, MCA, factoring, and credit lines</p>
            </Link>
            <Link
              href="/tools/invoice-factoring-calculator"
              className="bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-colors"
            >
              <p className="text-sm font-bold text-white mb-1">📄 Factoring Calculator</p>
              <p className="text-xs text-slate-300">True cost of advancing your invoices</p>
            </Link>
          </div>
        </div>

        {/* When to seek financing */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">When to Seek Financing — And Which Type to Choose</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            The most expensive mistake in business financing is waiting until you&apos;re desperate.
            Lenders smell urgency and price accordingly. Apply for credit when you don&apos;t need it,
            so it&apos;s available when you do.
          </p>
          <div className="space-y-3">
            {FUNDING_OPTIONS.map((opt) => (
              <div key={opt.situation} className="bg-white rounded-2xl border border-slate-200 p-5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">If your situation is:</p>
                <p className="text-sm text-slate-800 font-semibold mb-2">&ldquo;{opt.situation}&rdquo;</p>
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-blue-600 mb-0.5">Best option: {opt.bestOption}</p>
                    <p className="text-xs text-slate-600">{opt.why}</p>
                  </div>
                  <Link
                    href={opt.link}
                    className="text-xs font-semibold text-blue-600 hover:underline flex-shrink-0"
                  >
                    Learn more →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timing with the funding climate */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Using the Funding Climate Score to Time Your Application</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            Macro conditions affect your approval odds and interest rate even for the same business
            profile. When the Federal Reserve is tightening credit standards (as tracked by the SLOOS
            survey), banks reject more applications and increase spreads. When standards ease, the
            same business gets approved more easily.
          </p>
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-xs">
              <div className="bg-green-50 rounded-xl p-3">
                <p className="font-bold text-green-800 text-base mb-1">80–100</p>
                <p className="font-bold text-green-700">Optimal</p>
                <p className="text-green-600 mt-1">Apply now. Banks are lending. Rates are favorable relative to conditions.</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-3">
                <p className="font-bold text-amber-800 text-base mb-1">60–79</p>
                <p className="font-bold text-amber-700">Moderate</p>
                <p className="text-amber-600 mt-1">Apply if you need to. Approval rates are normal. Prepare documentation carefully.</p>
              </div>
              <div className="bg-red-50 rounded-xl p-3">
                <p className="font-bold text-red-800 text-base mb-1">Below 60</p>
                <p className="font-bold text-red-700">Tightening</p>
                <p className="text-red-600 mt-1">Banks are tightening. Increase documentation. Consider factoring over bank loans.</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Check Today&apos;s Score →
              </Link>
            </div>
          </div>
        </div>

        {/* Affiliate CTA */}
        <div className="mb-8">
          <AffiliateCTA variant="general" />
        </div>

        {/* FAQ */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "What is a healthy cash flow runway for a small business?",
                a: "Most financial advisors recommend 3–6 months of operating expenses as a cash reserve. For businesses with highly seasonal revenue, 6+ months is safer. Below 2 months of runway is a warning signal. Below 1 month is a crisis that requires immediate action — either cutting expenses or accessing financing.",
              },
              {
                q: "How do I improve cash flow without taking on debt?",
                a: "The fastest non-debt improvements: (1) shorten your payment terms — move from net-30 to net-15 or offer a 1–2% discount for early payment; (2) invoice immediately upon delivery rather than at month end; (3) negotiate extended terms with suppliers while shortening terms with customers; (4) reduce inventory to minimum viable levels; (5) cut any fixed costs that are not generating revenue.",
              },
              {
                q: "When should I use invoice factoring vs a bank loan?",
                a: "Invoice factoring is the right choice when: your customers are creditworthy businesses but pay slowly; your own credit score is weak; you need cash faster than a bank can approve; you want to avoid taking on traditional debt. Bank loans are better when you have good credit, can wait 60–90 days for approval, and need long-term capital rather than working capital against existing invoices.",
              },
              {
                q: "Does the Federal Reserve's prime rate affect my small business financing?",
                a: `Yes — directly. SBA 7(a) loans are variable-rate, priced at prime plus a spread (typically 2.25–2.75%). At today's prime rate of ${primeRate}%, that means SBA loans currently cost approximately ${(primeRate + 2.75).toFixed(2)}%. Business lines of credit typically run prime plus 3–4%. Every 0.25% Fed rate change affects your monthly payment on existing variable-rate debt and the cost of new borrowing.`,
              },
            ].map((faq) => (
              <div key={faq.q} className="bg-white rounded-2xl border border-slate-200 p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Internal links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Link href="/invoice-factoring" className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-blue-300 group transition-all">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">Complete Guide</p>
            <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Invoice Factoring: Rates, Terms &amp; Alternatives</p>
          </Link>
          <Link href="/sba-loans" className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-green-300 group transition-all">
            <p className="text-xs font-bold text-green-600 uppercase tracking-wide mb-1">Complete Guide</p>
            <p className="text-sm font-bold text-slate-800 group-hover:text-green-600 transition-colors">SBA Loans: Eligibility, Rates &amp; How to Apply</p>
          </Link>
        </div>

        <p className="text-xs text-slate-400 text-center leading-relaxed">
          This guide is for informational purposes only and does not constitute financial advice.
          Consult a qualified financial advisor before making borrowing decisions.{" "}
          <Link href="/disclaimer" className="underline hover:text-slate-600">Full disclaimer →</Link>
        </p>
      </div>
    </>
  );
}
