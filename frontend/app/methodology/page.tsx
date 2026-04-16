export const runtime = "edge";

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Methodology | US Business Funding Climate Score",
  description:
    "Full transparency on how we calculate the US Business Funding Climate Score — exact FRED series IDs, indicator weights, scoring formula, and AI usage disclosure.",
  alternates: {
    canonical: "/methodology",
  },
};

const INDICATORS = [
  {
    name: "Prime Rate",
    series: "DPRIME",
    source: "Federal Reserve",
    frequency: "Daily",
    role: "Baseline borrowing cost",
    description:
      "The US prime rate directly sets the floor for most variable-rate small business loans, SBA 7(a) loans, and revolving lines of credit. When it rises, every loan tied to it costs more — immediately.",
    impact: "−5 pts per 0.25% above 5.0%",
    impactColor: "text-red-600 bg-red-50",
  },
  {
    name: "C&I Lending Standards — Large Firms",
    series: "DRTSCILM",
    source: "Fed Senior Loan Officer Survey",
    frequency: "Quarterly",
    role: "Bank tightening signal (large firms)",
    description:
      "Percentage of banks reporting tighter commercial & industrial lending standards for large firms. When large-firm standards tighten, small-firm conditions almost always follow — lenders become more selective across all borrower sizes.",
    impact: "−1 pt per 1% net tightening",
    impactColor: "text-orange-600 bg-orange-50",
  },
  {
    name: "C&I Lending Standards — Small Firms",
    series: "DRTSCIS",
    source: "Fed Senior Loan Officer Survey",
    frequency: "Quarterly",
    role: "Bank tightening signal (small firms, direct)",
    description:
      "Same survey, small-firm specific. This directly measures how much harder it has become for a small business to get a loan versus last quarter. A positive number means more banks are tightening than easing.",
    impact: "−0.5 pts per 1% net tightening",
    impactColor: "text-orange-600 bg-orange-50",
  },
  {
    name: "Treasury Yield Spread (10Y − 2Y)",
    series: "T10Y2Y",
    source: "Federal Reserve",
    frequency: "Daily",
    role: "Credit market health signal",
    description:
      "The gap between the 10-year and 2-year Treasury yield. A negative spread (inverted curve) historically precedes recessions and credit crunches. When deeply inverted, banks compress lending margins and reduce risk appetite for small business loans.",
    impact: "−3 pts if negative · +3 pts if above +1.0%",
    impactColor: "text-blue-600 bg-blue-50",
  },
  {
    name: "Initial Jobless Claims",
    series: "ICSA",
    source: "US Department of Labor",
    frequency: "Weekly",
    role: "Labor market health",
    description:
      "Weekly new unemployment claims. Rising claims signal a weakening labor market, which increases default risk on existing business loans and makes lenders more conservative about new credit. The 250,000 threshold reflects historically healthy labor conditions.",
    impact: "−1 pt per 10,000 claims above 250,000",
    impactColor: "text-red-600 bg-red-50",
  },
  {
    name: "Business Applications",
    series: "BUSAPPWNSAUS",
    source: "US Census Bureau via FRED",
    frequency: "Weekly",
    role: "Entrepreneur confidence signal",
    description:
      "New business applications filed in the US. A rising 4-week trend signals that entrepreneurs are confident enough to start new ventures — a leading indicator of healthy credit demand and economic expansion.",
    impact: "+5 pts if 4-week trend is rising",
    impactColor: "text-green-600 bg-green-50",
  },
];

export default function MethodologyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-400 mb-8 flex items-center gap-1.5">
        <Link href="/" className="hover:text-slate-600">Home</Link>
        <span>›</span>
        <span>Methodology</span>
      </nav>

      <div className="mb-8">
        <p className="text-xs font-bold tracking-widest text-blue-500 uppercase mb-3">
          Transparency
        </p>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Our Methodology</h1>
        <p className="text-slate-600 leading-relaxed text-sm mb-3">
          The US Business Funding Climate Score is built on public data from the Federal Reserve
          and the US Department of Labor. This page explains every data source, every FRED series
          ID, and the exact formula used to calculate the 0–100 score. No black boxes.
        </p>
        <div className="flex items-center gap-2 text-xs text-slate-400 border-t border-slate-100 pt-3">
          <span>Reviewed and maintained by</span>
          <Link href="/about" className="font-semibold text-slate-600 hover:text-blue-600 transition-colors">
            M. Ashfaq, M.Phil Economics
          </Link>
          <span>·</span>
          <span>Last updated April 2026</span>
        </div>
      </div>

      {/* Scoring formula */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-6">
        <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4">
          The Scoring Formula
        </p>
        <div className="bg-slate-950 rounded-xl p-5 font-mono text-sm leading-relaxed mb-6">
          <p className="text-slate-400 mb-3">// Starting score</p>
          <p className="text-white font-bold">score = 100</p>
          <p className="text-slate-400 mt-4 mb-2">// Deductions</p>
          <p className="text-red-400">score −= 5 × floor((dprime − 5.0) / 0.25)  <span className="text-slate-500">// if dprime &gt; 5%</span></p>
          <p className="text-red-400">score −= 1 × drtscilm_pct                  <span className="text-slate-500">// C&I tight, large</span></p>
          <p className="text-red-400">score −= 0.5 × drtscis_pct                 <span className="text-slate-500">// C&I tight, small</span></p>
          <p className="text-red-400">score −= 3  <span className="text-slate-500 ml-2">// if t10y2y &lt; 0 (inverted curve)</span></p>
          <p className="text-red-400">score −= (icsa − 250000) / 10000           <span className="text-slate-500">// if icsa &gt; 250K</span></p>
          <p className="text-slate-400 mt-4 mb-2">// Bonuses</p>
          <p className="text-green-400">score += 5  <span className="text-slate-500 ml-2">// if busapp 4-week trend is rising</span></p>
          <p className="text-green-400">score += 3  <span className="text-slate-500 ml-2">// if t10y2y &gt; 1.0</span></p>
          <p className="text-slate-400 mt-4 mb-2">// Bounds</p>
          <p className="text-blue-400">score = max(0, min(100, score))</p>
        </div>

        {/* Score label bands */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { range: "80–100", label: "Optimal", color: "bg-green-50 border-green-200 text-green-700" },
            { range: "60–79", label: "Moderate", color: "bg-amber-50 border-amber-200 text-amber-700" },
            { range: "40–59", label: "Risky", color: "bg-orange-50 border-orange-200 text-orange-700" },
            { range: "0–39", label: "Critical", color: "bg-red-50 border-red-200 text-red-700" },
          ].map(({ range, label, color }) => (
            <div key={label} className={`rounded-xl border p-3 text-center ${color}`}>
              <p className="font-black text-lg">{range}</p>
              <p className="text-sm font-semibold">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Indicators */}
      <h2 className="text-lg font-bold text-slate-900 mb-4">The Six Indicators</h2>
      <div className="space-y-4 mb-6">
        {INDICATORS.map((ind) => (
          <div key={ind.series} className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="font-bold text-slate-900 text-sm">{ind.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{ind.role}</p>
              </div>
              <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg whitespace-nowrap flex-shrink-0">
                {ind.series}
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">{ind.description}</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-medium">
                {ind.source}
              </span>
              <span className="bg-slate-50 text-slate-600 px-2.5 py-1 rounded-md border border-slate-100">
                {ind.frequency}
              </span>
              <span className={`px-2.5 py-1 rounded-md font-mono font-semibold ${ind.impactColor}`}>
                {ind.impact}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* AI transparency */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6">
        <p className="text-xs font-bold tracking-widest text-amber-600 uppercase mb-3">
          AI Transparency
        </p>
        <p className="text-sm text-slate-700 leading-relaxed mb-2">
          The written analysis on each blog post is generated by a multi-agent AI pipeline
          (CrewAI framework, Groq inference). The agents receive the raw FRED indicator values and
          the calculated score, then produce human-readable explanations of the economic mechanisms
          at work.
        </p>
        <p className="text-sm text-slate-700 leading-relaxed">
          <strong>The score itself is deterministic</strong> — calculated by the fixed Python
          formula above with no AI involvement. The AI only writes the explanatory text.
        </p>
      </div>

      {/* Data lag */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
        <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-3">
          A Note on Data Lag
        </p>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          Some indicators (C&amp;I Lending Standards) are released quarterly by the Federal
          Reserve — the score reflects the most recently published values, which may be 1–3 months
          old for these series. Daily-frequency indicators (Prime Rate, Yield Spread) and weekly
          indicators (Jobless Claims, Business Applications) are always current as of the prior
          trading day.
        </p>
        <div className="flex gap-4">
          <Link href="/about" className="text-xs text-blue-600 hover:underline">
            About the Founder →
          </Link>
          <Link href="/legal" className="text-xs text-blue-600 hover:underline">
            Legal &amp; Disclosures →
          </Link>
        </div>
      </div>
    </div>
  );
}
