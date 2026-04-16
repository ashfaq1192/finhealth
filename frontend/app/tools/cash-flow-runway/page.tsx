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

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getCashOutDate(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + Math.floor(months));
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function CashFlowRunwayCalculator() {
  const [cashBalance, setCashBalance] = useState("80000");
  const [monthlyRevenue, setMonthlyRevenue] = useState("35000");
  const [monthlyExpenses, setMonthlyExpenses] = useState("42000");

  const balance = Math.max(0, parseFloat(cashBalance.replace(/[^\d]/g, "")) || 0);
  const revenue = Math.max(0, parseFloat(monthlyRevenue.replace(/[^\d]/g, "")) || 0);
  const expenses = Math.max(0, parseFloat(monthlyExpenses.replace(/[^\d]/g, "")) || 0);

  const netBurn = expenses - revenue; // positive = burning cash, negative = growing
  const isBurning = netBurn > 0;
  const runwayMonths = isBurning && netBurn > 0 ? balance / netBurn : Infinity;
  const isInfinite = !isBurning;
  const cashOutDate = isInfinite ? null : getCashOutDate(runwayMonths);
  const minRevenueBreakEven = expenses;
  const revenueGap = Math.max(0, minRevenueBreakEven - revenue);

  // Urgency level
  const urgency =
    isInfinite ? "safe"
    : runwayMonths >= 6 ? "healthy"
    : runwayMonths >= 3 ? "caution"
    : "critical";

  const urgencyConfig = {
    safe:     { label: "Cash Flow Positive", color: "text-green-700 bg-green-50 border-green-300", barColor: "bg-green-400" },
    healthy:  { label: "Healthy Runway",     color: "text-blue-700 bg-blue-50 border-blue-300",   barColor: "bg-blue-400" },
    caution:  { label: "Caution — Under 6 Months", color: "text-amber-700 bg-amber-50 border-amber-300", barColor: "bg-amber-400" },
    critical: { label: "Critical — Under 3 Months", color: "text-red-700 bg-red-50 border-red-300",   barColor: "bg-red-500" },
  };
  const uc = urgencyConfig[urgency];

  // 6-month cash projection
  const projection: { month: string; balance: number }[] = [];
  let running = balance;
  for (let i = 0; i < 6; i++) {
    running = running - netBurn;
    const d = new Date();
    d.setMonth(d.getMonth() + i + 1);
    projection.push({ month: MONTHS[d.getMonth()], balance: Math.max(0, running) });
  }
  const projMax = Math.max(balance, ...projection.map((p) => p.balance), 1);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Cash Flow Runway Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Free cash flow runway calculator for small businesses. See how many months of cash you have left and your projected cash-out date.",
    url: "https://usfundingclimate.com/tools/cash-flow-runway",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <nav className="text-xs text-slate-400 mb-6 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-600">Home</Link>
          <span>›</span>
          <Link href="/tools" className="hover:text-slate-600">Tools</Link>
          <span>›</span>
          <span>Cash Flow Runway</span>
        </nav>

        <div className="mb-6">
          <p className="text-xs font-bold tracking-widest text-purple-600 uppercase mb-2">Free Tool</p>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Cash Flow Runway Calculator</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Enter your current cash balance, monthly revenue, and monthly expenses to find out
            exactly how many months of runway you have — and when you need to act.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 border-t-4 border-t-purple-500 overflow-hidden mb-5">
          <div className="bg-purple-50 px-6 py-4 border-b border-purple-100">
            <p className="text-xs font-bold tracking-widest text-purple-600 uppercase">Your Numbers</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Current Cash Balance</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">$</span>
                  <input
                    type="text" inputMode="numeric"
                    value={cashBalance ? Number(cashBalance).toLocaleString("en-US") : ""}
                    onChange={(e) => setCashBalance(e.target.value.replace(/[^\d]/g, ""))}
                    placeholder="80,000"
                    className="w-full border border-slate-200 rounded-xl pl-7 pr-3 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-slate-50"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Cash in bank accounts today</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Monthly Revenue</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">$</span>
                  <input
                    type="text" inputMode="numeric"
                    value={monthlyRevenue ? Number(monthlyRevenue).toLocaleString("en-US") : ""}
                    onChange={(e) => setMonthlyRevenue(e.target.value.replace(/[^\d]/g, ""))}
                    placeholder="35,000"
                    className="w-full border border-slate-200 rounded-xl pl-7 pr-3 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-slate-50"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Average monthly cash collected</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Monthly Expenses</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">$</span>
                  <input
                    type="text" inputMode="numeric"
                    value={monthlyExpenses ? Number(monthlyExpenses).toLocaleString("en-US") : ""}
                    onChange={(e) => setMonthlyExpenses(e.target.value.replace(/[^\d]/g, ""))}
                    placeholder="42,000"
                    className="w-full border border-slate-200 rounded-xl pl-7 pr-3 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-slate-50"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">All outflows: payroll, rent, loans, suppliers</p>
              </div>
            </div>

            {/* Results */}
            <div className="border-t border-slate-100 pt-5">
              <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4">Results</p>

              {/* Hero result */}
              <div className={`border-2 rounded-2xl p-6 mb-4 ${uc.color}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">{uc.label}</p>
                    <p className="text-5xl font-black leading-none tabular-nums">
                      {isInfinite ? "∞" : runwayMonths < 1 ? "<1" : runwayMonths.toFixed(1)}
                    </p>
                    <p className="text-base font-semibold opacity-80 mt-1">
                      {isInfinite ? "months — you're cash flow positive" : "months of runway remaining"}
                    </p>
                  </div>
                  {!isInfinite && cashOutDate && (
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Cash-Out Date</p>
                      <p className="text-lg font-black">{cashOutDate}</p>
                      <p className="text-xs opacity-60 mt-0.5">at current burn rate</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Key metrics row */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                    {isBurning ? "Monthly Burn" : "Monthly Surplus"}
                  </p>
                  <p className={`text-lg font-black tabular-nums ${isBurning ? "text-red-600" : "text-green-600"}`}>
                    {fmtCurrency(Math.abs(netBurn))}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">/month {isBurning ? "deficit" : "profit"}</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Break-Even Revenue</p>
                  <p className="text-lg font-black text-slate-700 tabular-nums">{fmtCurrency(minRevenueBreakEven)}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">/month needed</p>
                </div>

                <div className={`border rounded-xl p-3.5 text-center ${revenueGap > 0 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
                  <p className={`text-[10px] font-bold uppercase tracking-wide mb-1 ${revenueGap > 0 ? "text-red-500" : "text-green-500"}`}>
                    Revenue Gap
                  </p>
                  <p className={`text-lg font-black tabular-nums ${revenueGap > 0 ? "text-red-700" : "text-green-700"}`}>
                    {revenueGap > 0 ? fmtCurrency(revenueGap) : "None"}
                  </p>
                  <p className={`text-[10px] mt-0.5 ${revenueGap > 0 ? "text-red-400" : "text-green-400"}`}>
                    {revenueGap > 0 ? "to reach break-even" : "you're profitable"}
                  </p>
                </div>
              </div>

              {/* 6-month projection bar chart */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
                <p className="text-xs font-bold text-slate-600 mb-3">6-Month Cash Projection</p>
                <div className="flex items-end gap-2 h-36">
                  {/* Starting bar */}
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <p className="text-[9px] font-bold text-slate-500 tabular-nums">
                      {balance >= 1000 ? `$${Math.round(balance/1000)}k` : `$${balance}`}
                    </p>
                    <div
                      className="w-full rounded-t bg-slate-400 transition-all duration-500"
                      style={{ height: `${Math.max(8, (balance / projMax) * 100)}px` }}
                    />
                    <span className="text-[9px] text-slate-400 font-semibold">Now</span>
                  </div>
                  {projection.map((p, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 flex-1">
                      <p className="text-[9px] font-bold text-slate-500 tabular-nums">
                        {p.balance >= 1000 ? `$${Math.round(p.balance/1000)}k` : p.balance > 0 ? `$${p.balance}` : "$0"}
                      </p>
                      <div
                        className={`w-full rounded-t transition-all duration-500 ${
                          p.balance === 0 ? "bg-red-300"
                          : p.balance < balance * 0.25 ? "bg-red-500"
                          : p.balance < balance * 0.5 ? "bg-amber-400"
                          : "bg-blue-500"
                        }`}
                        style={{ height: `${Math.max(8, (p.balance / projMax) * 100)}px` }}
                      />
                      <span className="text-[9px] text-slate-500 font-medium">{p.month}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-2">
                  Based on {isBurning ? `${fmtCurrency(netBurn)}/month burn` : "current surplus"}. Does not account for revenue growth or expense changes.
                </p>
              </div>

              {/* Urgency callout */}
              {urgency === "critical" && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 leading-relaxed">
                  <strong>Immediate action required:</strong> With under 3 months of runway,
                  funding takes priority over everything else. Traditional bank loans typically
                  take 2-8 weeks. Invoice factoring and MCAs can fund in 24-72 hours — check the{" "}
                  <Link href="/" className="underline font-semibold">funding climate score</Link>{" "}
                  to understand today's lending environment before applying.
                </div>
              )}
              {urgency === "caution" && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700 leading-relaxed">
                  <strong>Plan ahead:</strong> 3-6 months gives you time to apply for an SBA
                  loan or line of credit before hitting a crisis. Start the application now —
                  SBA approvals currently average 4-8 weeks.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Score tie-in */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-5">
          <p className="text-xs font-bold tracking-widest text-blue-500 uppercase mb-2">Today's Funding Environment</p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Runway is only half the picture. The other half is whether today is a good time to
            seek financing. Check the{" "}
            <Link href="/" className="text-blue-600 font-semibold hover:underline">
              US Business Funding Climate Score
            </Link>{" "}
            — updated every morning from Federal Reserve data — to see whether lending conditions
            favor or work against you right now.
          </p>
        </div>

        <AffiliateCTA variant="general" className="mb-6" />

        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-5">
          <h2 className="text-base font-bold text-slate-900 mb-3">What Lenders Look for in Cash Flow</h2>
          <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
            <p>
              Most SBA lenders require a <strong>debt service coverage ratio (DSCR) of 1.25x</strong> —
              meaning your net operating income must be 1.25 times your annual loan payments.
              If your runway is below 6 months, DSCR is likely below that threshold.
            </p>
            <p>
              Invoice factoring and MCAs do not require strong DSCR — they look at your
              receivables or daily sales instead. But as shown in the{" "}
              <Link href="/tools/mca-calculator" className="text-blue-600 hover:underline">
                MCA calculator
              </Link>
              , the cost of speed is steep. Use them only when time is the constraint.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs">
            <Link href="/tools/break-even-calculator" className="text-blue-600 font-semibold hover:underline">Break-Even Calculator →</Link>
            <Link href="/sba-loans" className="text-slate-500 hover:text-slate-700">SBA Loan Guide →</Link>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 text-center leading-relaxed">
          Projections are estimates based on constant burn rate. Actual results depend on revenue variability and unplanned expenses.{" "}
          <Link href="/disclaimer" className="underline">Not financial advice.</Link>
        </p>
      </div>
    </>
  );
}
