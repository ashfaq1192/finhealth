export const runtime = "edge";

import type { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AffiliateCTA from "@/components/AffiliateCTA";

export const metadata: Metadata = {
  title: "Invoice Factoring: How It Works, Rates & Alternatives | US Business Funding Climate Score",
  description:
    "Complete guide to invoice factoring for US small businesses. Learn how factoring works, what it costs, how prime rate affects your rates, and when it makes sense vs alternatives.",
  alternates: { canonical: "/invoice-factoring" },
  openGraph: {
    title: "Invoice Factoring: How It Works, Rates & Alternatives",
    description:
      "The full guide to invoice factoring for trucking, staffing, and small businesses — with real cost comparisons and a free calculator.",
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
  headline: "Invoice Factoring: How It Works, Rates & Alternatives",
  description:
    "Complete guide to invoice factoring for US small businesses — rates, how it works, trucking and staffing use cases, and comparison vs MCA.",
  url: "https://usfundingclimate.com/invoice-factoring",
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

export default async function InvoiceFactoringPage() {
  const score = await getLiveScore();
  const primeRate = score?.dprime ?? 7.5;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <nav className="text-xs text-slate-400 mb-6 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-600">Home</Link>
          <span>›</span>
          <span>Invoice Factoring</span>
        </nav>

        {score && (
          <div className="bg-blue-950 text-white rounded-2xl p-4 mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold tracking-widest text-blue-400 uppercase mb-0.5">Live Context — Updated Daily</p>
              <p className="text-sm text-slate-200">
                Prime rate: <strong className="text-white">{primeRate.toFixed(2)}%</strong>
                {" "}· Funding climate: <strong className={score.status_label === "Optimal" ? "text-green-400" : score.status_label === "Moderate" ? "text-yellow-300" : "text-red-400"}>{score.status_label}</strong>
                {" "}· Factoring rates correlated with prime
              </p>
            </div>
            <Link href="/" className="text-xs font-semibold text-blue-300 hover:text-white whitespace-nowrap">Full Score →</Link>
          </div>
        )}

        <div className="mb-6">
          <p className="text-xs font-bold tracking-widest text-blue-600 uppercase mb-2">Complete Guide</p>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Invoice Factoring: How It Works, Rates &amp; Alternatives
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Invoice factoring turns your unpaid invoices into immediate cash. For trucking
            companies waiting 30–60 days for freight brokers to pay, and staffing agencies
            covering weekly payroll before clients remit, it is often the fastest — and sometimes
            the only — viable funding option. This guide explains exactly what it costs and when
            it makes sense.
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
              ["#how-it-works", "How invoice factoring works (step-by-step)"],
              ["#costs", "What does factoring cost? Rates explained"],
              ["#prime-rate", "How the prime rate affects factoring costs"],
              ["#trucking", "Invoice factoring for trucking companies"],
              ["#staffing", "Invoice factoring for staffing agencies"],
              ["#vs-mca", "Factoring vs merchant cash advance"],
              ["#vs-sba", "Factoring vs SBA loan"],
              ["#faq", "Frequently asked questions"],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="text-blue-600 hover:underline">{label}</a>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-0 prose prose-slate max-w-none prose-h2:text-xl prose-h2:font-bold prose-h2:text-slate-900 prose-h2:mt-10 prose-h2:mb-4 prose-p:text-slate-700 prose-p:leading-7 prose-li:text-slate-700 prose-strong:text-slate-900">

          <h2 id="how-it-works">How Invoice Factoring Works</h2>
          <p>
            Invoice factoring is the sale — not a loan — of your accounts receivable to a
            third-party company called a "factor." Here is the process:
          </p>

          <div className="not-prose space-y-2 my-5">
            {[
              { step: "1", title: "You complete work and invoice your client", desc: "You deliver goods or services and issue an invoice with standard payment terms (Net-30, Net-60, etc.)." },
              { step: "2", title: "You sell the invoice to the factor", desc: "The factoring company buys your invoice, typically advancing 80–95% of the face value within 24–48 hours." },
              { step: "3", title: "You receive the advance", desc: "Cash hits your account, usually the next business day. No waiting 30–60 days for your client to pay." },
              { step: "4", title: "Your client pays the factor directly", desc: "The factor notifies your client to remit payment directly to them (recourse factoring) or handles collections entirely (non-recourse)." },
              { step: "5", title: "Factor releases the reserve minus the fee", desc: "Once your client pays, the factor releases the remaining balance (the 'reserve') minus their fee — typically 1–5% of the invoice value." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4 bg-white border border-slate-200 rounded-xl p-4">
                <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-black flex-shrink-0">{step}</div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 id="costs">What Does Factoring Cost? Rates Explained</h2>
          <p>
            Factoring fees are expressed as a percentage of the invoice value, charged per period
            (usually per 30 days or per week). Typical rates:
          </p>

          <div className="not-prose bg-white border border-slate-200 rounded-2xl overflow-hidden my-5">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
              <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">Typical Factoring Rate Ranges</p>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                ["Trucking (strong credit clients)", "0.5–2%", "per invoice", "bg-green-50 text-green-700"],
                ["Staffing agencies", "1–3%", "per invoice", "bg-blue-50 text-blue-700"],
                ["General small business", "1–5%", "per invoice", "bg-amber-50 text-amber-700"],
                ["Startups / risky industries", "3–7%+", "per invoice", "bg-red-50 text-red-700"],
              ].map(([sector, rate, unit, color]) => (
                <div key={sector} className="flex items-center justify-between px-5 py-3">
                  <span className="text-xs text-slate-600">{sector}</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${color}`}>{rate} <span className="font-normal opacity-70">{unit}</span></span>
                </div>
              ))}
            </div>
          </div>

          <p>
            Use the <Link href="/tools/invoice-factoring-calculator" className="text-blue-600 hover:underline font-semibold">Invoice Factoring Cost Calculator</Link> to
            convert your specific rate into effective APR and net cash received.
          </p>

          <h2 id="prime-rate">How the Prime Rate Affects Factoring Costs</h2>
          <p>
            Invoice factoring fees are not technically tied to the prime rate — unlike SBA loans,
            they are fixed by the factor at origination. However, the prime rate affects factoring
            in two indirect ways:
          </p>
          <p>
            First, factoring companies borrow money to fund your advances. When the prime rate
            is high (currently <strong>{primeRate.toFixed(2)}%</strong>), their cost of capital
            rises — and they pass that on by tightening approval standards or increasing fees for
            riskier clients. Factoring rates in a {primeRate > 6.5 ? "high" : "normal"}-rate
            environment are typically 0.5–1 percentage point higher than they would be at
            prime 4.5%.
          </p>
          <p>
            Second, high prime rates make bank loans and SBA loans more expensive, increasing
            demand for factoring as an alternative. Higher demand gives factors pricing power.
            Check the <Link href="/" className="text-blue-600 hover:underline">daily score</Link> to
            track whether conditions are improving.
          </p>

          <h2 id="trucking">Invoice Factoring for Trucking Companies</h2>
          <p>
            Trucking is the most common use case for invoice factoring in the US. The cash flow
            gap is structural: <strong>fuel, driver pay, and maintenance are due immediately</strong>,
            but freight brokers pay Net-30 to Net-60. An owner-operator with three trucks can be
            perfectly profitable and still unable to make payroll.
          </p>
          <p>
            Trucking-specific factors understand this dynamic and typically offer:
          </p>
          <ul>
            <li>Same-day or next-day funding (vs 2–3 days for general factoring)</li>
            <li>Fuel advance programs (cash against undelivered loads)</li>
            <li>Integration with load boards and TMS software</li>
            <li>Non-notification factoring (client doesn't know you're factoring)</li>
          </ul>
          <p>
            Typical trucking factoring rates: <strong>0.5–2% per invoice</strong>, with the advance
            rate at 90–97% of the invoice value for established carriers with creditworthy brokers.
          </p>

          <h2 id="staffing">Invoice Factoring for Staffing Agencies</h2>
          <p>
            Staffing agencies face a unique version of the same problem: they must meet
            <strong> weekly payroll</strong> for their placed workers before clients pay their
            invoices (typically Net-30 to Net-60). A growing staffing agency can run out of cash
            precisely because it is winning more business.
          </p>
          <p>
            Staffing-focused factors typically advance 85–92% against staffing invoices, with
            fees of 1–3%. Some offer <strong>payroll funding programs</strong> — they advance
            specifically against payroll obligations and release funds directly to a payroll
            provider, simplifying the process.
          </p>

          <h2 id="vs-mca">Factoring vs Merchant Cash Advance</h2>

          <div className="not-prose bg-white border border-slate-200 rounded-2xl overflow-hidden my-5">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
              <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">Head-to-Head Comparison</p>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                ["Effective APR (typical)", "18–65%", "40–150%"],
                ["Based on", "Your invoices / receivables", "Your daily card/bank sales"],
                ["Repayment", "When client pays invoice", "Daily % of sales"],
                ["Best for", "B2B businesses with invoices", "B2C, retail, restaurants"],
                ["Speed to fund", "24–72 hours", "24–48 hours"],
                ["Credit requirements", "Client's credit matters more", "Your daily sales volume"],
              ].map(([label, factoring, mca]) => (
                <div key={label} className="grid grid-cols-3 divide-x divide-slate-100">
                  <div className="px-4 py-3 text-xs font-semibold text-slate-600">{label}</div>
                  <div className="px-4 py-3 text-xs text-green-700 bg-green-50">{factoring}</div>
                  <div className="px-4 py-3 text-xs text-orange-700">{mca}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 divide-x divide-slate-100 bg-slate-50">
              <div className="px-4 py-2" />
              <div className="px-4 py-2"><Link href="/tools/invoice-factoring-calculator" className="text-[10px] text-blue-600 font-semibold underline">Calculate factoring cost →</Link></div>
              <div className="px-4 py-2"><Link href="/tools/mca-calculator" className="text-[10px] text-blue-600 font-semibold underline">Calculate MCA APR →</Link></div>
            </div>
          </div>

          <h2 id="vs-sba">Factoring vs SBA Loan</h2>
          <p>
            SBA 7(a) loans are cheaper (currently {(primeRate + 2.75).toFixed(2)}% APR vs
            18–65% effective APR for factoring) but require 2+ years in business, strong credit,
            collateral, and 30–90 days to fund. Factoring can fund in 24–72 hours with minimal
            credit requirements.
          </p>
          <p>
            The practical rule: <strong>use SBA for capital investment, use factoring for
            cash flow gaps</strong>. If you need $200,000 to buy equipment, SBA is the right
            tool. If you need to bridge a 45-day payment gap on a $50,000 invoice, factoring is
            faster and purpose-built for the problem.
          </p>

          <h2 id="faq">Frequently Asked Questions</h2>
          <div className="not-prose space-y-4 my-5">
            {[
              {
                q: "Is invoice factoring a good option for trucking companies right now?",
                a: `With the prime rate at ${primeRate.toFixed(2)}% and C&I lending standards tighter than pre-2022, bank lines of credit for owner-operators are harder to get and more expensive. Factoring is not cheap — a 2% fee on a 30-day invoice equals a 24% effective APR — but it requires no collateral, no minimum credit score, and funds in 24 hours. For cash-flow-constrained carriers who cannot qualify for an SBA line of credit, it remains the most practical option.`,
              },
              {
                q: "How does the prime rate affect trucking business loans?",
                a: `The prime rate at ${primeRate.toFixed(2)}% directly raises the cost of any variable-rate business loan tied to it — including SBA 7(a) loans, which are currently at ${(primeRate + 2.75).toFixed(2)}%. For a $150,000 equipment loan at a 7-year term, that rate adds hundreds of dollars per month versus pre-2022 rates. Factoring rates are set by the factor, not the prime rate directly, but factors' own borrowing costs are higher in this environment — so even factoring rates have crept up 0.25–0.5 percentage points.`,
              },
              {
                q: "What are typical invoice factoring rates for staffing companies?",
                a: "Staffing factoring rates typically run 1–3% per invoice, with advance rates of 85–92%. On a $100,000 invoice with a 1.5% fee, you receive $85,000–$92,000 upfront and $6,500–$13,500 when the client pays (minus the $1,500 fee). The effective APR depends on how quickly your clients pay — on Net-30 invoices, a 1.5% fee equals an 18% effective APR. On Net-60 invoices, the same fee equals 9% APR.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-sm font-bold text-slate-900 mb-2">{q}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        <AffiliateCTA variant="factoring" className="my-6" />

        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-5">
          <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4">Related Tools & Guides</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { href: "/tools/invoice-factoring-calculator", label: "Factoring Calculator", desc: "Calculate your exact cost and net cash" },
              { href: "/tools/mca-calculator", label: "MCA Cost Calculator", desc: "Compare factoring vs MCA APR" },
              { href: "/sba-loans", label: "SBA Loan Guide", desc: "Is an SBA loan a better fit?" },
            ].map(({ href, label, desc }) => (
              <Link key={href} href={href} className="bg-slate-50 rounded-xl border border-slate-200 p-3.5 hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                <p className="text-xs font-bold text-slate-700 group-hover:text-blue-700 mb-1">{label}</p>
                <p className="text-[11px] text-slate-400">{desc}</p>
              </Link>
            ))}
          </div>
        </div>

        <p className="text-[10px] text-slate-400 text-center leading-relaxed">
          Rate ranges are indicative based on market data. Actual factoring terms vary by provider and client creditworthiness.{" "}
          <Link href="/disclaimer" className="underline">Not financial advice.</Link>
        </p>
      </div>
    </>
  );
}
