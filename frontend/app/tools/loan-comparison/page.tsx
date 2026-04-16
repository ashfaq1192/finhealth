"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import AffiliateCTA from "@/components/AffiliateCTA";

interface Inputs {
  loanAmount: string;
  monthlyRevenue: string;
  termMonths: string;
  mcaFactorRate: string;
  factoringFee: string;
  primeRate: string;
}

interface Option {
  name: string;
  type: string;
  icon: string;
  color: string;
  borderColor: string;
  monthlyPayment: number | null;
  totalRepayment: number | null;
  totalCost: number | null;
  effectiveAPR: number | null;
  prosText: string[];
  consText: string[];
  bestFor: string;
}

const DEFAULT: Inputs = {
  loanAmount: "50000",
  monthlyRevenue: "25000",
  termMonths: "60",
  mcaFactorRate: "1.35",
  factoringFee: "3",
  primeRate: "7.5",
};

function fmt(n: number, decimals = 0) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function fmtCurrency(n: number) {
  return "$" + fmt(Math.abs(n));
}

function calcOptions(inputs: Inputs): Option[] {
  const loan = parseFloat(inputs.loanAmount) || 0;
  const monthlyRev = parseFloat(inputs.monthlyRevenue) || 0;
  const termMo = parseInt(inputs.termMonths) || 60;
  const mcaFactor = parseFloat(inputs.mcaFactorRate) || 1.35;
  const factoringFeePct = parseFloat(inputs.factoringFee) || 3;
  const prime = parseFloat(inputs.primeRate) || 7.5;

  // SBA 7(a) — prime + 2.75% standard spread, monthly amortizing
  const sbaRate = prime + 2.75;
  const sbaMonthlyRate = sbaRate / 100 / 12;
  const sbaPmt =
    sbaMonthlyRate === 0
      ? loan / termMo
      : (loan * sbaMonthlyRate * Math.pow(1 + sbaMonthlyRate, termMo)) /
        (Math.pow(1 + sbaMonthlyRate, termMo) - 1);
  const sbaTotalRepayment = sbaPmt * termMo;
  const sbaTotalCost = sbaTotalRepayment - loan;

  // MCA — factor rate, repay via % of daily sales, effective term estimated
  const mcaTotalRepayment = loan * mcaFactor;
  const mcaTotalCost = mcaTotalRepayment - loan;
  const dailyRev = monthlyRev / 22; // ~22 business days
  const mcaDailyPayment = dailyRev * 0.15; // typical 15% holdback
  const mcaDays = mcaDailyPayment > 0 ? mcaTotalRepayment / mcaDailyPayment : 240;
  const mcaMonths = mcaDays / 22;
  // APR via simple interest approximation
  const mcaAPR = mcaMonths > 0 ? (mcaTotalCost / loan) * (12 / mcaMonths) * 100 : null;
  const mcaMonthlyPayment = mcaMonths > 0 ? mcaTotalRepayment / mcaMonths : null;

  // Invoice Factoring — factoring fee on invoices, 30-day cycle
  // Advance 85% of invoice, pay fee on full amount, get reserve back minus fee
  const advanceRate = 0.85;
  const monthlyInvoices = monthlyRev; // simplified: factoring monthly revenue
  const advancePaid = monthlyInvoices * advanceRate;
  const feeAmount = monthlyInvoices * (factoringFeePct / 100);
  const netCostPerCycle = feeAmount;
  // Annualized effective cost for factoring (cost / advance × 12 months)
  const factoringEffectiveAPR =
    advancePaid > 0 ? (netCostPerCycle / advancePaid) * 12 * 100 : null;
  // For comparison: if they factor for 12 months to fund loan amount worth of working capital
  const factoringMonths = loan / advancePaid;
  const factoringTotalCost = feeAmount * Math.max(1, Math.round(factoringMonths));
  const factoringTotalRepayment = loan + factoringTotalCost;
  const factoringMonthlyPayment = factoringTotalRepayment / Math.max(1, Math.round(factoringMonths));

  // Line of Credit — prime + 3.5%, interest-only on drawn amount, 12-month term
  const locRate = prime + 3.5;
  const locMonthlyInterest = loan * (locRate / 100 / 12);
  const locTermMonths = 12;
  const locTotalCost = locMonthlyInterest * locTermMonths;
  const locTotalRepayment = loan + locTotalCost;
  const locMonthlyPayment = locMonthlyInterest + loan / locTermMonths;
  const locAPR = locRate;

  return [
    {
      name: "SBA 7(a) Loan",
      type: "Traditional Bank Loan",
      icon: "🏦",
      color: "bg-green-50 border-green-200",
      borderColor: "border-t-green-500",
      monthlyPayment: sbaPmt,
      totalRepayment: sbaTotalRepayment,
      totalCost: sbaTotalCost,
      effectiveAPR: sbaRate,
      prosText: ["Lowest interest rate available", "Longest repayment terms (up to 10 years)", "No prepayment penalty on variable rates"],
      consText: ["Requires strong credit (680+)", "2–3 month approval process", "Collateral often required"],
      bestFor: "Established businesses with good credit seeking low-cost capital",
    },
    {
      name: "Merchant Cash Advance",
      type: "Revenue-Based Financing",
      icon: "💳",
      color: "bg-red-50 border-red-200",
      borderColor: "border-t-red-500",
      monthlyPayment: mcaMonthlyPayment,
      totalRepayment: mcaTotalRepayment,
      totalCost: mcaTotalCost,
      effectiveAPR: mcaAPR,
      prosText: ["Funded in 24–48 hours", "No fixed monthly payment", "Bad credit OK (500+)"],
      consText: ["Extremely high effective APR (50–300%+)", "Daily repayment from bank account", "No benefit to paying early (factor rate is fixed)"],
      bestFor: "Short-term emergency funding only — avoid if any alternative exists",
    },
    {
      name: "Invoice Factoring",
      type: "Asset-Based Financing",
      icon: "📄",
      color: "bg-blue-50 border-blue-200",
      borderColor: "border-t-blue-500",
      monthlyPayment: factoringMonthlyPayment,
      totalRepayment: factoringTotalRepayment,
      totalCost: factoringTotalCost,
      effectiveAPR: factoringEffectiveAPR,
      prosText: ["Approval based on customer credit, not yours", "No debt on balance sheet", "Scales with revenue"],
      consText: ["Only works if you invoice B2B clients", "Customers may see your lender", "Net-30/60 invoices only"],
      bestFor: "Trucking, staffing, and B2B businesses with outstanding invoices",
    },
    {
      name: "Business Line of Credit",
      type: "Revolving Credit",
      icon: "🔄",
      color: "bg-purple-50 border-purple-200",
      borderColor: "border-t-purple-500",
      monthlyPayment: locMonthlyPayment,
      totalRepayment: locTotalRepayment,
      totalCost: locTotalCost,
      effectiveAPR: locAPR,
      prosText: ["Draw only what you need, when you need it", "Interest only on drawn amount", "Reusable as you repay"],
      consText: ["Lower limits than term loans", "Variable rate tied to prime", "Annual renewal required"],
      bestFor: "Managing seasonal cash flow gaps and short-term working capital",
    },
  ];
}

function getRiskColor(apr: number | null): string {
  if (apr === null) return "text-slate-500";
  if (apr <= 15) return "text-green-600";
  if (apr <= 30) return "text-amber-600";
  if (apr <= 60) return "text-orange-600";
  return "text-red-600";
}

function getRiskLabel(apr: number | null): string {
  if (apr === null) return "—";
  if (apr <= 15) return "Low cost";
  if (apr <= 30) return "Moderate";
  if (apr <= 60) return "High cost";
  return "Very high cost";
}

export default function LoanComparisonPage() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULT);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const set = useCallback(
    (field: keyof Inputs) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setInputs((prev) => ({ ...prev, [field]: e.target.value })),
    []
  );

  const options = calcOptions(inputs);
  const cheapest = options.reduce((a, b) =>
    (a.totalCost ?? Infinity) < (b.totalCost ?? Infinity) ? a : b
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Business Loan Comparison Calculator",
    description:
      "Compare SBA 7(a) loans, merchant cash advances, invoice factoring, and lines of credit side-by-side with true APR and total cost calculations.",
    url: "https://usfundingclimate.com/tools/loan-comparison",
    applicationCategory: "FinanceApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

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
          <Link href="/tools" className="hover:text-slate-600">Tools</Link>
          <span>›</span>
          <span>Loan Comparison</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-bold tracking-widest text-blue-500 uppercase mb-2">Free Tool</p>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Business Loan Comparison Calculator</h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
            Enter your funding amount and monthly revenue to compare SBA loans, merchant cash advances,
            invoice factoring, and lines of credit — side-by-side with true APR and total cost.
          </p>
        </div>

        {/* Inputs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <h2 className="text-sm font-bold text-slate-800 mb-5">Your Funding Scenario</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Funding amount needed
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input
                  type="number"
                  value={inputs.loanAmount}
                  onChange={set("loanAmount")}
                  className="w-full border border-slate-200 rounded-xl pl-7 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="50000"
                  min={1000}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Monthly business revenue
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input
                  type="number"
                  value={inputs.monthlyRevenue}
                  onChange={set("monthlyRevenue")}
                  className="w-full border border-slate-200 rounded-xl pl-7 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="25000"
                  min={1000}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Desired loan term (months)
              </label>
              <input
                type="number"
                value={inputs.termMonths}
                onChange={set("termMonths")}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="60"
                min={6}
                max={120}
              />
              <p className="text-xs text-slate-400 mt-1">For SBA loan only (6–120 months)</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Current prime rate (%)
              </label>
              <input
                type="number"
                value={inputs.primeRate}
                onChange={set("primeRate")}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                step="0.25"
                placeholder="7.5"
              />
              <p className="text-xs text-slate-400 mt-1">Check today's rate on the <Link href="/" className="text-blue-500 hover:underline">Score page</Link></p>
            </div>
          </div>

          {/* Advanced options */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="mt-4 text-xs font-semibold text-blue-500 hover:text-blue-700 flex items-center gap-1"
          >
            {showAdvanced ? "▲" : "▼"} Advanced: MCA &amp; Factoring rates
          </button>
          {showAdvanced && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  MCA factor rate (e.g. 1.35)
                </label>
                <input
                  type="number"
                  value={inputs.mcaFactorRate}
                  onChange={set("mcaFactorRate")}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  step="0.01"
                  placeholder="1.35"
                  min={1.1}
                  max={1.5}
                />
                <p className="text-xs text-slate-400 mt-1">Typical range: 1.15–1.45</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Invoice factoring fee (%)
                </label>
                <input
                  type="number"
                  value={inputs.factoringFee}
                  onChange={set("factoringFee")}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  step="0.25"
                  placeholder="3"
                  min={0.5}
                  max={10}
                />
                <p className="text-xs text-slate-400 mt-1">Trucking: 2–4%, Staffing: 2–5%</p>
              </div>
            </div>
          )}
        </div>

        {/* Winner banner */}
        <div className="bg-green-600 rounded-2xl px-5 py-4 mb-6 flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">🏆</span>
          <div>
            <p className="text-xs font-bold text-green-100 uppercase tracking-widest mb-0.5">Lowest total cost for your scenario</p>
            <p className="text-base font-bold text-white">
              {cheapest.name} — saves {fmtCurrency((options.reduce((max, o) => Math.max(max, o.totalCost ?? 0), 0)) - (cheapest.totalCost ?? 0))} vs the most expensive option
            </p>
            <p className="text-xs text-green-100 mt-0.5">
              Total interest/fees: {fmtCurrency(cheapest.totalCost ?? 0)} · APR: {cheapest.effectiveAPR !== null ? cheapest.effectiveAPR.toFixed(1) + "%" : "—"}
            </p>
          </div>
        </div>

        {/* Comparison cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {options.map((opt) => {
            const isCheapest = opt.name === cheapest.name;
            return (
              <div
                key={opt.name}
                className={`bg-white rounded-2xl border-t-4 ${opt.borderColor} border p-5 transition-all ${isCheapest ? "border-green-300 ring-2 ring-green-400 ring-offset-2 shadow-lg shadow-green-100" : "border-slate-200"}`}
              >
                {isCheapest && (
                  <div className="flex justify-end mb-1">
                    <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                      Best value
                    </span>
                  </div>
                )}
                <div className="flex items-start gap-2 mb-3">
                  <span className="text-2xl">{opt.icon}</span>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 leading-tight">{opt.name}</h2>
                    <p className="text-xs text-slate-400">{opt.type}</p>
                  </div>
                </div>

                {/* Key metrics */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-slate-50 rounded-xl p-2.5">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Monthly payment</p>
                    <p className="text-base font-bold text-slate-900">
                      {opt.monthlyPayment !== null ? fmtCurrency(opt.monthlyPayment) : "Varies"}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2.5">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Total interest/fees</p>
                    <p className="text-base font-bold text-red-600">
                      {opt.totalCost !== null ? fmtCurrency(opt.totalCost) : "—"}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2.5">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Effective APR</p>
                    <p className={`text-base font-bold ${getRiskColor(opt.effectiveAPR)}`}>
                      {opt.effectiveAPR !== null ? opt.effectiveAPR.toFixed(1) + "%" : "—"}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2.5">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Cost rating</p>
                    <p className={`text-sm font-bold ${getRiskColor(opt.effectiveAPR)}`}>
                      {getRiskLabel(opt.effectiveAPR)}
                    </p>
                  </div>
                </div>

                {/* Pros */}
                <div className="mb-2">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-green-600 mb-1">Pros</p>
                  <ul className="space-y-0.5">
                    {opt.prosText.map((p) => (
                      <li key={p} className="text-xs text-slate-600 flex gap-1.5">
                        <span className="text-green-500 flex-shrink-0">✓</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div className="mb-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-red-500 mb-1">Cons</p>
                  <ul className="space-y-0.5">
                    {opt.consText.map((c) => (
                      <li key={c} className="text-xs text-slate-600 flex gap-1.5">
                        <span className="text-red-400 flex-shrink-0">✗</span>{c}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Best for */}
                <div className="bg-slate-50 rounded-xl p-2.5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">Best for</p>
                  <p className="text-xs text-slate-700 leading-relaxed">{opt.bestFor}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-8">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800">Side-by-Side Summary</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-4 py-2.5 font-semibold text-slate-500">Option</th>
                  <th className="text-right px-4 py-2.5 font-semibold text-slate-500">Monthly</th>
                  <th className="text-right px-4 py-2.5 font-semibold text-slate-500">Total cost</th>
                  <th className="text-right px-4 py-2.5 font-semibold text-slate-500">APR</th>
                  <th className="text-right px-4 py-2.5 font-semibold text-slate-500">Total repay</th>
                </tr>
              </thead>
              <tbody>
                {options.map((opt, i) => (
                  <tr key={opt.name} className={`border-b border-slate-50 ${i % 2 === 1 ? "bg-slate-50/50" : ""}`}>
                    <td className="px-4 py-2.5 font-semibold text-slate-700">
                      {opt.icon} {opt.name}
                    </td>
                    <td className="px-4 py-2.5 text-right text-slate-600">
                      {opt.monthlyPayment !== null ? fmtCurrency(opt.monthlyPayment) : "Varies"}
                    </td>
                    <td className={`px-4 py-2.5 text-right font-semibold ${getRiskColor(opt.effectiveAPR)}`}>
                      {opt.totalCost !== null ? fmtCurrency(opt.totalCost) : "—"}
                    </td>
                    <td className={`px-4 py-2.5 text-right font-semibold ${getRiskColor(opt.effectiveAPR)}`}>
                      {opt.effectiveAPR !== null ? opt.effectiveAPR.toFixed(1) + "%" : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-right text-slate-600">
                      {opt.totalRepayment !== null ? fmtCurrency(opt.totalRepayment) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Affiliate CTA */}
        <div className="mb-8">
          <AffiliateCTA variant="general" />
        </div>

        {/* Educational content */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <h2 className="text-base font-bold text-slate-900 mb-4">How to Choose the Right Funding Option</h2>
          <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
            <p>
              The calculator above shows the math — but choosing the right funding option also depends on
              your situation. Here&apos;s how to read the results:
            </p>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">If APR is under 15%: SBA Loan</h3>
              <p className="text-slate-600">
                SBA 7(a) loans are the gold standard for small business financing. If you qualify —
                credit score 680+, 2+ years in business, $100K+ in revenue — there is almost no
                reason to pay more. The approval process takes 60–90 days, but the savings are
                typically $20,000–$50,000 over the life of a loan compared to alternative options.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">If you invoice B2B clients: Invoice Factoring</h3>
              <p className="text-slate-600">
                Factoring is not a loan — it&apos;s an advance on invoices you&apos;ve already earned.
                Approval is based on your customers&apos; creditworthiness, not yours. This makes it
                the best option for trucking companies, staffing agencies, and manufacturers with
                net-30 or net-60 payment terms. Effective APR on factoring (15–40%) is usually far
                lower than MCA.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">For short-term cash gaps: Line of Credit</h3>
              <p className="text-slate-600">
                A business line of credit is the most flexible option. You only pay interest on
                what you draw, and you can reuse it as you repay. Best for seasonal businesses or
                those with predictable but lumpy cash flow. Rates are higher than SBA loans but
                typically far lower than MCAs.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Avoid MCAs unless it&apos;s an emergency</h3>
              <p className="text-slate-600">
                Merchant cash advances carry effective APRs of 50–300%+. The daily repayment
                structure can trap businesses in a cycle of re-borrowing. The only justified use
                case: you have a time-sensitive opportunity with a return that exceeds the MCA cost,
                and you cannot get approved for any other product in time.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-slate-400 leading-relaxed text-center">
          Estimates are illustrative and based on typical market rates. Actual rates, terms, and
          eligibility vary by lender. Not financial advice.{" "}
          <Link href="/disclaimer" className="underline hover:text-slate-600">Full disclaimer →</Link>
        </p>
      </div>
    </>
  );
}
