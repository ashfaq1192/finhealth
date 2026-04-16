"use client";

import { useState } from "react";
import Link from "next/link";
import AffiliateCTA from "@/components/AffiliateCTA";

function fmtCurrency(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
function fmtPct(n: number, d = 1): string {
  return n.toFixed(d) + "%";
}

export default function McaCalculator() {
  const [advanceAmount, setAdvanceAmount] = useState("50000");
  const [factorRate, setFactorRate] = useState("1.35");
  const [dailySales, setDailySales] = useState("3000");
  const [repaymentPct, setRepaymentPct] = useState("15");

  const advance = Math.max(0, parseFloat(advanceAmount.replace(/[^\d]/g, "")) || 0);
  const rate = Math.max(1.01, parseFloat(factorRate) || 1.01);
  const sales = Math.max(1, parseFloat(dailySales.replace(/[^\d]/g, "")) || 1);
  const pct = Math.min(100, Math.max(1, parseFloat(repaymentPct) || 1));

  const totalRepayment = advance * rate;
  const totalCost = totalRepayment - advance;
  const dailyPayment = sales * (pct / 100);
  const repaymentDays = dailyPayment > 0 ? Math.ceil(totalRepayment / dailyPayment) : 0;
  const effectiveAPR = repaymentDays > 0 ? (totalCost / advance) * (365 / repaymentDays) * 100 : 0;
  const costPct = advance > 0 ? (totalCost / advance) * 100 : 0;

  // Risk assessment
  const riskLevel = effectiveAPR > 100 ? "high" : effectiveAPR > 50 ? "moderate" : "low";
  const riskConfig = {
    high: { label: "Very High Cost", color: "text-red-600 bg-red-50 border-red-200" },
    moderate: { label: "High Cost", color: "text-orange-600 bg-orange-50 border-orange-200" },
    low: { label: "Moderate Cost", color: "text-amber-600 bg-amber-50 border-amber-200" },
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "MCA True Cost Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Free merchant cash advance calculator. Convert your MCA factor rate to effective APR and see the true cost before you sign.",
    url: "https://usfundingclimate.com/tools/mca-calculator",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <nav className="text-xs text-slate-400 mb-6 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-600">Home</Link>
          <span>›</span>
          <Link href="/tools" className="hover:text-slate-600">Tools</Link>
          <span>›</span>
          <span>MCA True Cost Calculator</span>
        </nav>

        <div className="mb-6">
          <p className="text-xs font-bold tracking-widest text-orange-500 uppercase mb-2">Free Tool</p>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">MCA True Cost Calculator</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Merchant cash advance lenders quote a <em>factor rate</em>, not an APR — making the
            real cost hard to see. This calculator converts your MCA terms into an effective APR
            so you can compare it against other financing options.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 border-t-4 border-t-orange-400 overflow-hidden mb-5">
          <div className="bg-orange-50 px-6 py-4 border-b border-orange-100">
            <p className="text-xs font-bold tracking-widest text-orange-500 uppercase">MCA Terms</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Advance Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={advanceAmount ? Number(advanceAmount).toLocaleString("en-US") : ""}
                    onChange={(e) => setAdvanceAmount(e.target.value.replace(/[^\d]/g, ""))}
                    placeholder="50,000"
                    className="w-full border border-slate-200 rounded-xl pl-7 pr-3 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-slate-50"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Cash amount you receive upfront</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Factor Rate <span className="text-slate-400 font-normal">(e.g. 1.35)</span>
                </label>
                <input
                  type="number"
                  min="1.01"
                  max="2.5"
                  step="0.01"
                  value={factorRate}
                  onChange={(e) => setFactorRate(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-slate-50"
                />
                <p className="text-[10px] text-slate-400 mt-1">Typical range: 1.1 (cheap) to 1.5 (expensive)</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Average Daily Sales</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={dailySales ? Number(dailySales).toLocaleString("en-US") : ""}
                    onChange={(e) => setDailySales(e.target.value.replace(/[^\d]/g, ""))}
                    placeholder="3,000"
                    className="w-full border border-slate-200 rounded-xl pl-7 pr-3 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-slate-50"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Your average daily card/bank revenue</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Holdback / Repayment % <span className="text-slate-400 font-normal">(typically 10–20%)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="5"
                    max="50"
                    step="1"
                    value={repaymentPct}
                    onChange={(e) => setRepaymentPct(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl pl-3 pr-8 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-slate-50"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">%</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">% of daily sales withheld for repayment</p>
              </div>
            </div>

            {/* Results */}
            <div className="border-t border-slate-100 pt-5">
              <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4">Results</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Total Repayment</p>
                  <p className="text-lg font-black text-slate-700 tabular-nums">{fmtCurrency(totalRepayment)}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Factor rate × advance</p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-red-500 uppercase tracking-wide mb-1">Total Cost</p>
                  <p className="text-lg font-black text-red-700 tabular-nums">{fmtCurrency(totalCost)}</p>
                  <p className="text-[10px] text-red-400 mt-0.5">{fmtPct(costPct)} of advance</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wide mb-1">Daily Payment</p>
                  <p className="text-lg font-black text-blue-700 tabular-nums">{fmtCurrency(dailyPayment)}</p>
                  <p className="text-[10px] text-blue-400 mt-0.5">{fmtPct(pct)} of {fmtCurrency(sales)}/day</p>
                </div>

                <div className={`border-2 rounded-xl p-4 ${riskConfig[riskLevel].color}`}>
                  <p className="text-[10px] font-bold uppercase tracking-wide mb-1 opacity-80">Effective APR</p>
                  <p className="text-lg font-black tabular-nums">{fmtPct(effectiveAPR)}</p>
                  <p className="text-[10px] mt-0.5 font-semibold opacity-80">{riskConfig[riskLevel].label}</p>
                </div>
              </div>

              {/* Repayment timeline */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-700">Estimated Repayment Period</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">
                      {repaymentDays} <span className="text-base font-normal text-slate-500">business days</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">~{Math.round(repaymentDays / 21)} months at {fmtCurrency(dailyPayment)}/day</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-700">You repay</p>
                    <p className="text-xl font-black text-red-600 mt-1">{fmtCurrency(totalCost)} <span className="text-sm font-normal text-red-400">extra</span></p>
                    <p className="text-xs text-slate-400 mt-0.5">above the {fmtCurrency(advance)} received</p>
                  </div>
                </div>
              </div>

              {/* Warning for high APR */}
              {effectiveAPR > 60 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-700 leading-relaxed">
                  <strong>High effective cost:</strong> An effective APR of {fmtPct(effectiveAPR)} is significantly
                  above SBA 7(a) loan rates (currently prime + 2.75%) and most bank term loans.
                  If your business qualifies for traditional financing, the savings are substantial.{" "}
                  <Link href="/tools/invoice-factoring-calculator" className="underline font-semibold">
                    Compare invoice factoring →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <AffiliateCTA variant="mca" className="mb-6" />

        {/* Education */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-5">
          <h2 className="text-base font-bold text-slate-900 mb-4">Understanding MCA Factor Rates vs APR</h2>
          <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
            <p>
              A <strong>factor rate</strong> of 1.35 means you repay $1.35 for every $1.00 borrowed.
              Unlike an interest rate, it does not account for how quickly you repay — which is why
              converting to APR reveals the true cost.
            </p>
            <p>
              A 1.35 factor rate on a 6-month repayment term equals roughly a <strong>70% effective APR</strong>.
              The same factor rate paid off in 3 months equals a 140% APR. Speed of repayment
              dramatically changes the actual cost.
            </p>
            <p>
              MCAs are best for businesses with no other options, predictable daily card sales, and
              a short-term cash need (equipment down, seasonal gap). They are expensive, fast, and
              require no collateral or minimum credit score.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs">
            <Link href="/tools/invoice-factoring-calculator" className="text-blue-600 font-semibold hover:underline">
              Invoice Factoring Calculator (often cheaper) →
            </Link>
            <Link href="/invoice-factoring" className="text-slate-500 hover:text-slate-700">
              MCA vs Factoring Guide →
            </Link>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 text-center leading-relaxed">
          Estimates based on inputs provided. Actual MCA costs vary by provider and contract terms.{" "}
          <Link href="/disclaimer" className="underline">Not financial advice.</Link>
        </p>
      </div>
    </>
  );
}
