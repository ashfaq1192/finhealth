"use client";

import { useState } from "react";

interface Props {
  primeRate: number;
}

const SPREAD = 2.75;       // Typical SBA 7(a) spread over prime (loans $50K–$250K)
const HEALTHY_PRIME = 4.5; // Pre-2022 tightening cycle baseline

const TERMS = [
  { label: "12 months", value: 12 },
  { label: "24 months", value: 24 },
  { label: "36 months", value: 36 },
  { label: "60 months", value: 60 },
  { label: "84 months", value: 84 },
];

function monthlyPayment(principal: number, annualRatePct: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  if (annualRatePct === 0) return principal / months;
  const r = annualRatePct / 100 / 12;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

function fmtCurrency(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function PrimeRateCalculator({ primeRate }: Props) {
  const [rawAmount, setRawAmount] = useState("100000");
  const [term, setTerm] = useState(60);

  const principal = Math.max(0, parseInt(rawAmount.replace(/\D/g, ""), 10) || 0);
  const currentRate = primeRate + SPREAD;
  const healthyRate = HEALTHY_PRIME + SPREAD;
  const rateGap = currentRate - healthyRate;

  const currentPayment = monthlyPayment(principal, currentRate, term);
  const healthyPayment = monthlyPayment(principal, healthyRate, term);
  const extraMonthly = Math.max(0, currentPayment - healthyPayment);
  const extraTotal = extraMonthly * term;

  // Rate bar — scale to max visible width
  const maxRate = Math.max(currentRate, 15);
  const healthyBarPct = Math.round((healthyRate / maxRate) * 100);
  const currentBarPct = Math.round((currentRate / maxRate) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden border-t-4 border-blue-400">
      {/* Header */}
      <div className="bg-blue-50 px-5 py-4 border-b border-blue-100">
        <p className="text-[10px] font-bold tracking-widest text-blue-400 uppercase mb-0.5">
          Prime Rate Impact Calculator
        </p>
        <p className="text-sm text-slate-600">
          Today&apos;s prime rate is{" "}
          <span className="font-black text-red-600">{primeRate.toFixed(2)}%</span>
          {" "}—{" "}
          <span className="font-bold text-slate-700">{rateGap.toFixed(2)} points above</span>
          {" "}the pre-tightening baseline of{" "}
          <span className="font-black text-green-600">{HEALTHY_PRIME}%</span>.
          See the real dollar cost for your SBA 7(a) loan.
        </p>
      </div>

      <div className="p-5">
        {/* Rate gap visual bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">
            <span>Rate Comparison</span>
            <span className="text-red-500">+{rateGap.toFixed(2)}% above healthy</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-green-600 w-16 text-right flex-shrink-0">
                {healthyRate.toFixed(2)}%
              </span>
              <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full bg-green-400 transition-all duration-500"
                  style={{ width: `${healthyBarPct}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 w-14 flex-shrink-0">Baseline</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-red-600 w-16 text-right flex-shrink-0">
                {currentRate.toFixed(2)}%
              </span>
              <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full bg-red-400 transition-all duration-500"
                  style={{ width: `${currentBarPct}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 w-14 flex-shrink-0">Today</span>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Loan Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">
                $
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={rawAmount ? Number(rawAmount).toLocaleString("en-US") : ""}
                onChange={(e) => setRawAmount(e.target.value.replace(/\D/g, ""))}
                placeholder="100,000"
                className="w-full border border-slate-200 rounded-xl pl-7 pr-3 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 bg-slate-50 transition-shadow"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Loan Term
            </label>
            <select
              value={term}
              onChange={(e) => setTerm(Number(e.target.value))}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 bg-slate-50 transition-shadow"
            >
              {TERMS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results — extra cost is the hero */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
            <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1.5">
              At Baseline ({healthyRate.toFixed(2)}%)
            </p>
            <p className="text-xl font-black text-slate-600 leading-none tabular-nums">
              {fmtCurrency(healthyPayment)}
              <span className="text-sm font-normal text-slate-400">/mo</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Prime {HEALTHY_PRIME}% + {SPREAD}% spread
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-3.5">
            <p className="text-[10px] font-bold tracking-widest uppercase text-red-400 mb-1.5">
              At Today&apos;s Rate ({currentRate.toFixed(2)}%)
            </p>
            <p className="text-xl font-black text-red-700 leading-none tabular-nums">
              {fmtCurrency(currentPayment)}
              <span className="text-sm font-normal text-red-400">/mo</span>
            </p>
            <p className="text-[11px] text-red-400 mt-1">
              Prime {primeRate.toFixed(2)}% + {SPREAD}% spread
            </p>
          </div>

          {/* Hero card — the extra cost */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-3.5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-100 rounded-bl-full opacity-50" />
            <p className="text-[10px] font-bold tracking-widest uppercase text-amber-600 mb-1.5">
              Extra Monthly Cost
            </p>
            <p className="text-2xl font-black text-amber-700 leading-none tabular-nums">
              {fmtCurrency(extraMonthly)}
              <span className="text-sm font-normal text-amber-500">/mo</span>
            </p>
            <p className="text-[11px] text-amber-600 mt-1 font-semibold">
              {fmtCurrency(extraTotal)} extra over {term} mo
            </p>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 leading-relaxed">
          Based on an SBA 7(a) amortizing loan at prime + {SPREAD}% spread. Actual rates vary
          by lender, loan size, and creditworthiness. Not financial advice.
        </p>
      </div>
    </div>
  );
}
