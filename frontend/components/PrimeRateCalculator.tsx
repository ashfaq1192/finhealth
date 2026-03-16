"use client";

import { useState } from "react";

interface Props {
  primeRate: number;
}

// Typical SBA 7(a) spread over prime rate (loans $50K–$250K)
const SPREAD = 2.75;
// Pre-2022 tightening cycle prime rate baseline
const HEALTHY_PRIME = 4.5;

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
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default function PrimeRateCalculator({ primeRate }: Props) {
  const [rawAmount, setRawAmount] = useState("100000");
  const [term, setTerm] = useState(60);

  const principal = Math.max(0, parseInt(rawAmount.replace(/\D/g, ""), 10) || 0);
  const currentRate = primeRate + SPREAD;
  const healthyRate = HEALTHY_PRIME + SPREAD;

  const currentPayment = monthlyPayment(principal, currentRate, term);
  const healthyPayment = monthlyPayment(principal, healthyRate, term);
  const extraMonthly = Math.max(0, currentPayment - healthyPayment);
  const extraTotal = extraMonthly * term;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-1">
        Prime Rate Impact Calculator
      </p>
      <p className="text-sm text-slate-500 mb-5">
        See how today&apos;s prime rate of{" "}
        <span className="font-bold text-slate-700">{primeRate.toFixed(2)}%</span> compares
        to the pre-tightening baseline of{" "}
        <span className="font-bold text-slate-700">{HEALTHY_PRIME}%</span> for a typical
        SBA 7(a) loan.
      </p>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Loan Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
              $
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={rawAmount ? Number(rawAmount).toLocaleString("en-US") : ""}
              onChange={(e) => setRawAmount(e.target.value.replace(/\D/g, ""))}
              placeholder="100,000"
              className="w-full border border-slate-200 rounded-xl pl-7 pr-3 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:border-blue-400 bg-slate-50"
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
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:border-blue-400 bg-slate-50"
          >
            {TERMS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-3.5">
          <p className="text-[10px] font-bold tracking-widest uppercase text-red-400 mb-1.5">
            At Current Rate ({currentRate.toFixed(2)}%)
          </p>
          <p className="text-2xl font-black text-red-700 leading-none">
            {fmtCurrency(currentPayment)}
            <span className="text-sm font-normal text-red-500">/mo</span>
          </p>
          <p className="text-[11px] text-red-400 mt-1">
            Prime {primeRate.toFixed(2)}% + {SPREAD}% SBA spread
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-3.5">
          <p className="text-[10px] font-bold tracking-widest uppercase text-green-400 mb-1.5">
            At Healthy Baseline ({healthyRate.toFixed(2)}%)
          </p>
          <p className="text-2xl font-black text-green-700 leading-none">
            {fmtCurrency(healthyPayment)}
            <span className="text-sm font-normal text-green-500">/mo</span>
          </p>
          <p className="text-[11px] text-green-400 mt-1">
            Prime {HEALTHY_PRIME}% + {SPREAD}% SBA spread
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
          <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1.5">
            Extra Cost vs Baseline
          </p>
          <p className="text-2xl font-black text-slate-700 leading-none">
            {fmtCurrency(extraMonthly)}
            <span className="text-sm font-normal text-slate-500">/mo</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {fmtCurrency(extraTotal)} extra over {term} months
          </p>
        </div>
      </div>

      <p className="text-[10px] text-slate-400 leading-relaxed">
        Estimates based on a standard SBA 7(a) amortizing loan at prime + {SPREAD}% spread.
        Actual rates vary by lender, loan size, and creditworthiness. Not financial advice.
      </p>
    </div>
  );
}
