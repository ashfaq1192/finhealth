"use client";

import { useState } from "react";
import Link from "next/link";
import AffiliateCTA from "@/components/AffiliateCTA";

function fmtCurrency(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
function fmtNum(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}
function fmtPct(n: number, d = 1): string {
  return n.toFixed(d) + "%";
}

export default function BreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = useState("15000");
  const [pricePerUnit, setPricePerUnit] = useState("50");
  const [variableCostPerUnit, setVariableCostPerUnit] = useState("20");
  const [currentRevenue, setCurrentRevenue] = useState("40000");

  const fixed = Math.max(0, parseFloat(fixedCosts.replace(/[^\d]/g, "")) || 0);
  const price = Math.max(0.01, parseFloat(pricePerUnit) || 0.01);
  const variable = Math.max(0, parseFloat(variableCostPerUnit) || 0);
  const revenue = Math.max(0, parseFloat(currentRevenue.replace(/[^\d]/g, "")) || 0);

  const contributionMargin = price - variable;
  const contributionMarginPct = price > 0 ? (contributionMargin / price) * 100 : 0;
  const breakEvenUnits = contributionMargin > 0 ? Math.ceil(fixed / contributionMargin) : 0;
  const breakEvenRevenue = breakEvenUnits * price;
  const marginOfSafety = revenue > 0 && breakEvenRevenue > 0
    ? Math.max(0, ((revenue - breakEvenRevenue) / revenue) * 100)
    : 0;
  const currentUnits = price > 0 ? Math.floor(revenue / price) : 0;
  const isProfitable = revenue >= breakEvenRevenue;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Break-Even Calculator for Small Business",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Free break-even calculator for small businesses. Calculate your break-even point in units and revenue, contribution margin, and margin of safety.",
    url: "https://usfundingclimate.com/tools/break-even-calculator",
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
          <span>Break-Even Calculator</span>
        </nav>

        <div className="mb-6">
          <p className="text-xs font-bold tracking-widest text-green-600 uppercase mb-2">Free Tool</p>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Break-Even Calculator</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Find out exactly how many units you need to sell — and how much revenue you need —
            before your business starts making money. Takes 30 seconds.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 border-t-4 border-t-green-500 overflow-hidden mb-5">
          <div className="bg-green-50 px-6 py-4 border-b border-green-100">
            <p className="text-xs font-bold tracking-widest text-green-600 uppercase">Business Costs</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Monthly Fixed Costs</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={fixedCosts ? Number(fixedCosts).toLocaleString("en-US") : ""}
                    onChange={(e) => setFixedCosts(e.target.value.replace(/[^\d]/g, ""))}
                    placeholder="15,000"
                    className="w-full border border-slate-200 rounded-xl pl-7 pr-3 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-300 bg-slate-50"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Rent, payroll, insurance, loan payments — costs that don't change with sales</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Price Per Unit / Sale</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">$</span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={pricePerUnit}
                    onChange={(e) => setPricePerUnit(e.target.value)}
                    placeholder="50"
                    className="w-full border border-slate-200 rounded-xl pl-7 pr-3 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-300 bg-slate-50"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Revenue per unit sold, job completed, or service delivered</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Variable Cost Per Unit</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={variableCostPerUnit}
                    onChange={(e) => setVariableCostPerUnit(e.target.value)}
                    placeholder="20"
                    className="w-full border border-slate-200 rounded-xl pl-7 pr-3 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-300 bg-slate-50"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Materials, supplies, direct labor — costs that vary per unit sold</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Current Monthly Revenue <span className="text-slate-400 font-normal">(optional)</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={currentRevenue ? Number(currentRevenue).toLocaleString("en-US") : ""}
                    onChange={(e) => setCurrentRevenue(e.target.value.replace(/[^\d]/g, ""))}
                    placeholder="40,000"
                    className="w-full border border-slate-200 rounded-xl pl-7 pr-3 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-300 bg-slate-50"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">To calculate your margin of safety</p>
              </div>
            </div>

            {/* Results */}
            <div className="border-t border-slate-100 pt-5">
              <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4">Results</p>

              {contributionMargin <= 0 ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                  <strong>Warning:</strong> Your variable cost per unit ({fmtCurrency(variable)}) is equal to or greater
                  than your price per unit ({fmtCurrency(price)}). You cannot break even at these numbers —
                  every unit sold loses money. Increase your price or reduce variable costs.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <p className="text-[10px] font-bold text-green-600 uppercase tracking-wide mb-1">Break-Even Units</p>
                      <p className="text-2xl font-black text-green-700 tabular-nums">{fmtNum(breakEvenUnits)}</p>
                      <p className="text-[10px] text-green-500 mt-0.5">units / month</p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wide mb-1">Break-Even Revenue</p>
                      <p className="text-lg font-black text-blue-700 tabular-nums">{fmtCurrency(breakEvenRevenue)}</p>
                      <p className="text-[10px] text-blue-500 mt-0.5">per month</p>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                      <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wide mb-1">Contribution Margin</p>
                      <p className="text-lg font-black text-purple-700 tabular-nums">{fmtCurrency(contributionMargin)}</p>
                      <p className="text-[10px] text-purple-500 mt-0.5">{fmtPct(contributionMarginPct)} per unit</p>
                    </div>

                    <div className={`border-2 rounded-xl p-4 ${revenue > 0 ? (isProfitable ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300") : "bg-slate-50 border-slate-200"}`}>
                      <p className={`text-[10px] font-bold uppercase tracking-wide mb-1 ${revenue > 0 ? (isProfitable ? "text-green-600" : "text-red-600") : "text-slate-400"}`}>
                        Margin of Safety
                      </p>
                      <p className={`text-lg font-black tabular-nums ${revenue > 0 ? (isProfitable ? "text-green-700" : "text-red-700") : "text-slate-500"}`}>
                        {revenue > 0 ? fmtPct(marginOfSafety) : "—"}
                      </p>
                      <p className={`text-[10px] mt-0.5 ${revenue > 0 ? (isProfitable ? "text-green-500" : "text-red-500") : "text-slate-400"}`}>
                        {revenue > 0 ? (isProfitable ? "Above break-even" : "Below break-even") : "Enter revenue above"}
                      </p>
                    </div>
                  </div>

                  {/* Visual */}
                  {revenue > 0 && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-semibold text-slate-700">Current Position vs Break-Even</span>
                        <span className={`font-bold ${isProfitable ? "text-green-600" : "text-red-600"}`}>
                          {isProfitable
                            ? `${fmtCurrency(revenue - breakEvenRevenue)} above break-even`
                            : `${fmtCurrency(breakEvenRevenue - revenue)} below break-even`}
                        </span>
                      </div>
                      <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${isProfitable ? "bg-green-400" : "bg-red-400"}`}
                          style={{ width: `${Math.min(100, (revenue / (breakEvenRevenue * 1.5)) * 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-400">
                        <span>$0</span>
                        <span className="text-orange-500 font-semibold">Break-even: {fmtCurrency(breakEvenRevenue)}</span>
                        <span>{fmtCurrency(breakEvenRevenue * 1.5)}</span>
                      </div>
                    </div>
                  )}

                  <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs text-slate-600 leading-relaxed">
                    <p className="font-semibold text-slate-800 mb-1">What this means:</p>
                    <p>
                      You need to sell <strong>{fmtNum(breakEvenUnits)} units</strong> per month (generating{" "}
                      <strong>{fmtCurrency(breakEvenRevenue)}</strong>) before covering all costs. Each unit
                      contributes <strong>{fmtCurrency(contributionMargin)}</strong> ({fmtPct(contributionMarginPct)}) toward
                      fixed costs and profit.
                      {revenue > 0 && isProfitable && (
                        <> At your current revenue of {fmtCurrency(revenue)}, you have a{" "}
                        <strong className="text-green-700">{fmtPct(marginOfSafety)} margin of safety</strong> —
                        revenue could drop by that much before you hit break-even.</>
                      )}
                      {revenue > 0 && !isProfitable && (
                        <> At your current revenue of {fmtCurrency(revenue)}, you are{" "}
                        <strong className="text-red-700">{fmtCurrency(breakEvenRevenue - revenue)} short</strong> of
                        break-even this month. You need {fmtNum(Math.ceil((breakEvenRevenue - revenue) / price))} more
                        units to reach profitability.</>
                      )}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <AffiliateCTA variant="general" className="mb-6" />

        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-5">
          <h2 className="text-base font-bold text-slate-900 mb-3">Why Break-Even Analysis Matters for Loan Applications</h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">
            When you apply for an SBA loan or any business financing, lenders calculate your
            debt service coverage ratio (DSCR) — essentially how far above break-even your
            business operates. A margin of safety below 20% raises flags for most underwriters.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Before taking on new debt, verify that the loan payment stays comfortably within your
            margin of safety. Use the{" "}
            <Link href="/tools/invoice-factoring-calculator" className="text-blue-600 hover:underline">
              Prime Rate calculator
            </Link>{" "}
            to estimate your monthly SBA payment, then check it fits here.
          </p>
          <div className="mt-4 flex items-center gap-4 text-xs">
            <Link href="/tools/cash-flow-runway" className="text-blue-600 font-semibold hover:underline">
              Cash Flow Runway Calculator →
            </Link>
            <Link href="/" className="text-slate-500 hover:text-slate-700">
              Today's Funding Climate Score →
            </Link>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 text-center leading-relaxed">
          Results are estimates based on your inputs. Actual business performance varies.{" "}
          <Link href="/disclaimer" className="underline">Not financial advice.</Link>
        </p>
      </div>
    </>
  );
}
