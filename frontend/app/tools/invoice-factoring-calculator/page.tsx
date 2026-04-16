"use client";

import { useState } from "react";
import Link from "next/link";
import AffiliateCTA from "@/components/AffiliateCTA";

// ─── Metadata can't be exported from "use client" — see route segment config below
// SEO is handled via the generateMetadata pattern but this is a client page.
// We wrap it: the outer layout provides the <head> via a server component wrapper.

function fmtCurrency(n: number, decimals = 0): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });
}

function fmtPct(n: number, decimals = 1): string {
  return n.toFixed(decimals) + "%";
}

export default function InvoiceFactoringCalculator() {
  const [invoiceAmount, setInvoiceAmount] = useState("50000");
  const [advanceRate, setAdvanceRate] = useState("90");
  const [factorFee, setFactorFee] = useState("3");
  const [paymentDays, setPaymentDays] = useState("30");

  const invoice = Math.max(0, parseFloat(invoiceAmount.replace(/[^\d.]/g, "")) || 0);
  const advance = Math.min(100, Math.max(0, parseFloat(advanceRate) || 0));
  const fee = Math.max(0, parseFloat(factorFee) || 0);
  const days = Math.max(1, parseInt(paymentDays) || 1);

  // Core calculations
  const advanceAmount = invoice * (advance / 100);
  const factorFeeAmount = invoice * (fee / 100);
  const reserveAmount = invoice - advanceAmount;
  const reserveReleased = reserveAmount - factorFeeAmount;
  const netCashTotal = advanceAmount + reserveReleased;
  const totalCostOfCapital = factorFeeAmount;
  const costPct = invoice > 0 ? (totalCostOfCapital / invoice) * 100 : 0;

  // Effective APR: annualize the fee cost
  const effectiveAPR = invoice > 0 ? (factorFeeAmount / advanceAmount) * (365 / days) * 100 : 0;

  const isViable = reserveReleased >= 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Invoice Factoring Cost Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Free invoice factoring calculator for small businesses. Calculate net cash received, effective APR, and total cost of factoring your invoices.",
    url: "https://usfundingclimate.com/tools/invoice-factoring-calculator",
    author: {
      "@type": "Person",
      name: "M. Ashfaq",
      url: "https://usfundingclimate.com/about",
    },
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
          <Link href="/tools" className="hover:text-slate-600">Tools</Link>
          <span>›</span>
          <span>Invoice Factoring Calculator</span>
        </nav>

        <div className="mb-6">
          <p className="text-xs font-bold tracking-widest text-blue-500 uppercase mb-2">Free Tool</p>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Invoice Factoring Cost Calculator</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Enter your invoice details below to instantly calculate your net cash advance, total
            factoring cost, and effective APR — so you know exactly what invoice factoring will
            cost your business before you sign anything.
          </p>
        </div>

        {/* Calculator */}
        <div className="bg-white rounded-2xl border border-slate-200 border-t-4 border-t-blue-400 overflow-hidden mb-5">
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
            <p className="text-xs font-bold tracking-widest text-blue-500 uppercase">Invoice Details</p>
          </div>

          <div className="p-6">
            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              {/* Invoice Amount */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Invoice Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={invoiceAmount ? Number(invoiceAmount).toLocaleString("en-US") : ""}
                    onChange={(e) => setInvoiceAmount(e.target.value.replace(/[^\d]/g, ""))}
                    placeholder="50,000"
                    className="w-full border border-slate-200 rounded-xl pl-7 pr-3 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">The face value of the invoice you are factoring</p>
              </div>

              {/* Advance Rate */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Advance Rate <span className="text-slate-400 font-normal">(typically 80–95%)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="50"
                    max="100"
                    step="1"
                    value={advanceRate}
                    onChange={(e) => setAdvanceRate(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl pl-3 pr-8 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">%</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">% of invoice paid upfront by the factor</p>
              </div>

              {/* Factor Fee */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Factor Fee <span className="text-slate-400 font-normal">(typically 1–5%)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0.1"
                    max="20"
                    step="0.1"
                    value={factorFee}
                    onChange={(e) => setFactorFee(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl pl-3 pr-8 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">%</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">% of invoice charged as the factoring fee</p>
              </div>

              {/* Payment Terms */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Client Payment Terms <span className="text-slate-400 font-normal">(days)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="180"
                    step="1"
                    value={paymentDays}
                    onChange={(e) => setPaymentDays(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl pl-3 pr-16 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">days</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">How long until your client pays (e.g. Net-30 = 30)</p>
              </div>
            </div>

            {/* Results */}
            <div className="border-t border-slate-100 pt-5">
              <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4">Results</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wide mb-1">Advance Paid</p>
                  <p className="text-lg font-black text-blue-700 tabular-nums">{fmtCurrency(advanceAmount)}</p>
                  <p className="text-[10px] text-blue-400 mt-0.5">Upfront cash ({advance}%)</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Reserve Released</p>
                  <p className={`text-lg font-black tabular-nums ${reserveReleased >= 0 ? "text-slate-700" : "text-red-600"}`}>
                    {fmtCurrency(Math.max(0, reserveReleased))}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">After fee deducted</p>
                </div>

                <div className={`border rounded-xl p-4 ${isViable ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                  <p className={`text-[10px] font-bold uppercase tracking-wide mb-1 ${isViable ? "text-green-500" : "text-red-500"}`}>
                    Net Cash Total
                  </p>
                  <p className={`text-lg font-black tabular-nums ${isViable ? "text-green-700" : "text-red-700"}`}>
                    {fmtCurrency(netCashTotal)}
                  </p>
                  <p className={`text-[10px] mt-0.5 ${isViable ? "text-green-500" : "text-red-500"}`}>
                    {fmtPct(100 - costPct)} of invoice
                  </p>
                </div>

                <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wide mb-1">Effective APR</p>
                  <p className="text-lg font-black text-amber-700 tabular-nums">{fmtPct(effectiveAPR)}</p>
                  <p className="text-[10px] text-amber-500 mt-0.5">Annualized cost</p>
                </div>
              </div>

              {/* Cost breakdown bar */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-700">Cost Breakdown</span>
                  <span className="text-slate-500">Total fee: <strong className="text-red-600">{fmtCurrency(totalCostOfCapital)}</strong> ({fmtPct(costPct)})</span>
                </div>
                <div className="h-4 bg-slate-200 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-green-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, (netCashTotal / invoice) * 100)}%` }}
                    title="Net cash received"
                  />
                  <div
                    className="h-full bg-red-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, costPct)}%` }}
                    title="Factor fee"
                  />
                </div>
                <div className="flex items-center gap-4 mt-2 text-[10px]">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" /> Net cash ({fmtPct(100 - costPct)})</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" /> Factor fee ({fmtPct(costPct)})</span>
                </div>
              </div>

              {/* Interpretation */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs text-slate-600 leading-relaxed">
                <p className="font-semibold text-slate-800 mb-1">What this means for your business:</p>
                <p>
                  You receive <strong>{fmtCurrency(advanceAmount)}</strong> upfront (today), then{" "}
                  <strong>{fmtCurrency(Math.max(0, reserveReleased))}</strong> once your client pays in{" "}
                  {days} days — for a total of <strong>{fmtCurrency(netCashTotal)}</strong> out of a{" "}
                  {fmtCurrency(invoice)} invoice. The factoring company earns{" "}
                  <strong className="text-red-600">{fmtCurrency(totalCostOfCapital)}</strong> ({fmtPct(costPct)}
                  of the invoice). Annualized, that is equivalent to a <strong className="text-amber-700">{fmtPct(effectiveAPR)} APR</strong> —
                  compare this against your other financing options.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Affiliate CTA */}
        <AffiliateCTA variant="factoring" className="mb-6" />

        {/* Educational content — E-E-A-T */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-5">
          <h2 className="text-base font-bold text-slate-900 mb-4">How Invoice Factoring Works</h2>
          <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
            <p>
              Invoice factoring lets businesses sell unpaid invoices to a third party (the "factor")
              in exchange for immediate cash. Instead of waiting 30, 60, or 90 days for a client to
              pay, you get most of the invoice value upfront — minus a fee.
            </p>
            <p>
              The <strong>advance rate</strong> (typically 80–95%) is the percentage you receive
              immediately. The remaining amount — called the <strong>reserve</strong> — is held until
              your client pays. Once paid, the factor releases the reserve minus their fee.
            </p>
            <p>
              The <strong>factor fee</strong> is the factoring company's profit. It is usually
              expressed as a percentage of the invoice, often 1–5%. Some factors charge additional
              fees (origination, wire transfer, monthly minimums) — always read the full contract.
            </p>
            <p>
              The <strong>effective APR</strong> this calculator shows is the annualized equivalent
              of your factoring cost. A 3% fee on a 30-day invoice equals a 36.5% APR — much higher
              than most bank loans, but often justified by the speed and qualification simplicity.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs">
            <Link href="/invoice-factoring" className="text-blue-600 font-semibold hover:underline">
              Full Invoice Factoring Guide →
            </Link>
            <Link href="/tools/mca-calculator" className="text-slate-500 hover:text-slate-700">
              Compare: MCA True Cost Calculator →
            </Link>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 text-center leading-relaxed">
          This calculator is for informational purposes only. Results are estimates based on inputs
          provided. Actual factoring terms vary by provider, invoice quality, and industry.{" "}
          <Link href="/disclaimer" className="underline">Not financial advice.</Link>
        </p>
      </div>
    </>
  );
}
