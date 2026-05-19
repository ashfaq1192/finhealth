export const runtime = "edge";

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Small Business Finance Tools | US Business Funding Climate Score",
  description:
    "Free financial calculators for US small business owners: invoice factoring cost, MCA true APR, break-even analysis, cash flow runway, SBA loan payment estimator, and business loan comparison.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "Free Small Business Finance Calculators",
    description:
      "6 free tools for US small business owners: see your true factoring cost, MCA APR, break-even point, cash runway, SBA loan payment, and compare all funding options — powered by live Federal Reserve data.",
    type: "website",
  },
};

const TOOLS = [
  {
    href: "/tools/invoice-factoring-calculator",
    iconPath: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    iconColor: "text-blue-500",
    badge: "Most Popular",
    badgeColor: "bg-blue-100 text-blue-700",
    title: "Invoice Factoring Cost Calculator",
    desc: "Enter your invoice amount, advance rate, and factor fee to see your net cash received, effective APR, and total cost of factoring.",
    tags: ["Trucking", "Staffing", "Retail"],
    color: "border-t-blue-400",
  },
  {
    href: "/tools/mca-calculator",
    iconPath: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    iconColor: "text-amber-500",
    badge: "Eye-opener",
    badgeColor: "bg-orange-100 text-orange-700",
    title: "MCA True Cost Calculator",
    desc: "Convert your merchant cash advance factor rate into an effective APR. See the real annual cost of your MCA before you sign.",
    tags: ["Retail", "Restaurants", "All sectors"],
    color: "border-t-orange-400",
  },
  {
    href: "/tools/break-even-calculator",
    iconPath: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
    iconColor: "text-violet-500",
    badge: "Essential",
    badgeColor: "bg-green-100 text-green-700",
    title: "Break-Even Calculator",
    desc: "Find your break-even point in units and revenue, contribution margin, and margin of safety. Takes 30 seconds.",
    tags: ["All businesses", "Loan prep"],
    color: "border-t-green-500",
  },
  {
    href: "/tools/cash-flow-runway",
    iconPath: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8",
    iconColor: "text-sky-500",
    badge: "Critical insight",
    badgeColor: "bg-purple-100 text-purple-700",
    title: "Cash Flow Runway Calculator",
    desc: "Enter cash balance, revenue, and expenses to see exactly how many months of runway you have and when you need to act.",
    tags: ["All businesses", "Urgent planning"],
    color: "border-t-purple-500",
  },
  {
    href: "/#prime-rate-calculator",
    iconPath: "M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z",
    iconColor: "text-red-500",
    badge: "Live data",
    badgeColor: "bg-red-100 text-red-700",
    title: "SBA Loan Payment Calculator",
    desc: "Estimate your monthly SBA 7(a) payment using today's live prime rate from the Federal Reserve. See the real dollar cost of high rates.",
    tags: ["SBA Loans", "All businesses"],
    color: "border-t-red-400",
  },
  {
    href: "/tools/loan-comparison",
    iconPath: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    iconColor: "text-indigo-500",
    badge: "Most comprehensive",
    badgeColor: "bg-indigo-100 text-indigo-700",
    title: "Business Loan Comparison Tool",
    desc: "Compare SBA loans, MCAs, invoice factoring, and lines of credit side-by-side. See true APR and total cost for your exact funding scenario.",
    tags: ["All businesses", "Loan shopping"],
    color: "border-t-slate-500",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      name: "Free Small Business Finance Tools",
      description:
        "Free financial calculators for US small business owners — invoice factoring, MCA cost, break-even, cash flow runway, and SBA loan payments.",
      url: "https://usfundingclimate.com/tools",
      hasPart: TOOLS.map((t) => ({
        "@type": "SoftwareApplication",
        name: t.title,
        url: `https://usfundingclimate.com${t.href}`,
        applicationCategory: "FinanceApplication",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://usfundingclimate.com" },
        { "@type": "ListItem", position: 2, name: "Tools", item: "https://usfundingclimate.com/tools" },
      ],
    },
  ],
};

export default function ToolsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-400 mb-6 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-600">Home</Link>
          <span>›</span>
          <span>Tools</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-bold tracking-widest text-blue-500 uppercase mb-2">Free Tools</p>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Small Business Finance Calculators</h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
            Five free calculators built specifically for US small business owners. No sign-up,
            no data stored, instant results. All tools use live Federal Reserve data where applicable.
          </p>
        </div>

        {/* Tools grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className={`group bg-white rounded-2xl border border-slate-200 border-t-4 ${tool.color} p-6 hover:shadow-md transition-all`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className={`w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 ${tool.iconColor}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d={tool.iconPath} />
                  </svg>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${tool.badgeColor}`}>
                  {tool.badge}
                </span>
              </div>
              <h2 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                {tool.title}
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">{tool.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {tool.tags.map((tag) => (
                  <span key={tag} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {/* Score cross-link */}
        <div className="bg-slate-900 rounded-2xl p-6 text-white mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest text-blue-400 uppercase mb-1">Live Economic Data</p>
              <h2 className="text-base font-bold mb-2">Today's US Business Funding Climate Score</h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-3">
                The calculators above show your cost. The Score shows the macro environment —
                whether banks are tightening, rates are rising, and whether today is a good
                or bad time to seek financing. Updated every morning from Federal Reserve data.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Check Today's Score →
              </Link>
            </div>
          </div>
        </div>

        {/* Pillar page links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/sba-loans"
            className="bg-white rounded-2xl border border-slate-200 border-t-4 border-t-green-400 p-5 hover:shadow-md transition-all group"
          >
            <p className="text-xs font-bold tracking-widest text-green-600 uppercase mb-2">Complete Guide</p>
            <h3 className="text-sm font-bold text-slate-800 group-hover:text-green-700 transition-colors mb-2 leading-snug">
              SBA Loans: Eligibility, Rates & How to Apply
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Requirements, current rates, and what lenders check.
            </p>
            <p className="text-xs font-semibold text-green-600 mt-3">Read guide →</p>
          </Link>
          <Link
            href="/invoice-factoring"
            className="bg-white rounded-2xl border border-slate-200 border-t-4 border-t-blue-400 p-5 hover:shadow-md transition-all group"
          >
            <p className="text-xs font-bold tracking-widest text-blue-600 uppercase mb-2">Complete Guide</p>
            <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors mb-2 leading-snug">
              Invoice Factoring: How It Works, Rates & Alternatives
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Real cost comparisons for trucking, staffing, and B2B businesses.
            </p>
            <p className="text-xs font-semibold text-blue-600 mt-3">Read guide →</p>
          </Link>
          <Link
            href="/cash-flow-management"
            className="bg-white rounded-2xl border border-slate-200 border-t-4 border-t-purple-400 p-5 hover:shadow-md transition-all group"
          >
            <p className="text-xs font-bold tracking-widest text-purple-600 uppercase mb-2">Survival Guide</p>
            <h3 className="text-sm font-bold text-slate-800 group-hover:text-purple-700 transition-colors mb-2 leading-snug">
              Cash Flow Management: How to Survive the Gaps
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              The 5 cash flow killers and exactly when to seek financing.
            </p>
            <p className="text-xs font-semibold text-purple-600 mt-3">Read guide →</p>
          </Link>
        </div>
      </div>
    </>
  );
}
