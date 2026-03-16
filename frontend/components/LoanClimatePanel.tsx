interface LoanType {
  name: string;
  status: string;
  statusColor: string;
  detail: string;
}

interface ClimateConfig {
  headline: string;
  headlineColor: string;
  loans: LoanType[];
  lenderFocus: string;
  watchSignal: string;
}

const CLIMATE: Record<string, ClimateConfig> = {
  Optimal: {
    headline: "Lending conditions are broadly favorable for small businesses",
    headlineColor: "text-green-700",
    loans: [
      {
        name: "SBA 7(a) Loans",
        status: "Favorable",
        statusColor: "bg-green-100 text-green-700 border-green-200",
        detail:
          "Approval rates are near historical norms. Full loan amounts are accessible with standard documentation and 680+ FICO.",
      },
      {
        name: "Lines of Credit",
        status: "Open",
        statusColor: "bg-green-100 text-green-700 border-green-200",
        detail:
          "Banks are actively extending revolving credit to qualified applicants. Renewal terms are competitive and documentation requirements are standard.",
      },
      {
        name: "Equipment Financing",
        status: "Competitive",
        statusColor: "bg-green-100 text-green-700 border-green-200",
        detail:
          "Lenders are offering aggressive fixed rates. A solid window to lock in long-term equipment loans before any rate reversal.",
      },
    ],
    lenderFocus:
      "Cash flow history and business plan quality. Standard debt-service coverage ratios (≥1.25×) apply. Personal credit above 680 is sufficient.",
    watchSignal:
      "Monitor the next FOMC meeting — a rate hold or cut would sustain these conditions. A surprise hike would shift to Moderate.",
  },
  Moderate: {
    headline: "Lending is available but underwriting standards are tightening",
    headlineColor: "text-amber-700",
    loans: [
      {
        name: "SBA 7(a) Loans",
        status: "Selective",
        statusColor: "bg-amber-100 text-amber-700 border-amber-200",
        detail:
          "Approval is possible but banks are scrutinizing applications more carefully. Expect longer processing times and stronger collateral requirements.",
      },
      {
        name: "Lines of Credit",
        status: "Cautious",
        statusColor: "bg-amber-100 text-amber-700 border-amber-200",
        detail:
          "Banks are raising documentation requirements on renewals. New applicants need 2+ years of clean financials and a debt-service ratio above 1.35×.",
      },
      {
        name: "Equipment Financing",
        status: "Available",
        statusColor: "bg-amber-100 text-amber-700 border-amber-200",
        detail:
          "Loans are available but at elevated rates. Shorter terms (24–48 months) are being offered to reduce lender exposure.",
      },
    ],
    lenderFocus:
      "Two or more years in business, FICO 700+, strong collateral, and proven revenue consistency across at least two fiscal years.",
    watchSignal:
      "Any prime rate increase would push conditions toward Risky. Apply before the next FOMC decision if your financials are ready.",
  },
  Risky: {
    headline: "Credit access is restricted — lenders are highly selective",
    headlineColor: "text-orange-700",
    loans: [
      {
        name: "SBA 7(a) Loans",
        status: "Difficult",
        statusColor: "bg-orange-100 text-orange-700 border-orange-200",
        detail:
          "Banks are prioritizing existing customers. New applicants face longer delays, stricter collateral requirements, and lower approval loan amounts.",
      },
      {
        name: "Lines of Credit",
        status: "Tight",
        statusColor: "bg-orange-100 text-orange-700 border-orange-200",
        detail:
          "Many lenders are reducing credit limits on renewals. New revolving credit lines are rarely approved without significant hard collateral.",
      },
      {
        name: "Equipment Financing",
        status: "Restricted",
        statusColor: "bg-orange-100 text-orange-700 border-orange-200",
        detail:
          "Available only with strong hard collateral and FICO 720+. Variable-rate loans are especially expensive — seek fixed-rate structures only.",
      },
    ],
    lenderFocus:
      "Collateral first, then revenue. Unsecured loans are nearly unavailable. Strong personal credit (730+) and a personal guarantee are expected.",
    watchSignal:
      "A prime rate cut or a meaningful drop in C&I tightening standards would signal improving conditions. Watch the next FOMC statement closely.",
  },
  Critical: {
    headline: "Lending conditions are at a multi-year low — proceed with caution",
    headlineColor: "text-red-700",
    loans: [
      {
        name: "SBA 7(a) Loans",
        status: "Very Difficult",
        statusColor: "bg-red-100 text-red-700 border-red-200",
        detail:
          "Approval rates are near multi-year lows. Only businesses with excellent collateral, FICO 750+, and 3+ years of profitable history are succeeding.",
      },
      {
        name: "Lines of Credit",
        status: "Frozen",
        statusColor: "bg-red-100 text-red-700 border-red-200",
        detail:
          "Most banks have paused new revolving credit for small businesses. Existing lines are being reviewed and many are being reduced or cancelled.",
      },
      {
        name: "Equipment Financing",
        status: "Highly Restricted",
        statusColor: "bg-red-100 text-red-700 border-red-200",
        detail:
          "Offered only to long-established customers with strong balance sheets. Expect high rates, short terms, and mandatory personal guarantees.",
      },
    ],
    lenderFocus:
      "Collateral only. Revenue projections carry almost no weight. Personal guarantees are non-negotiable. Expect 30–60 day processing delays.",
    watchSignal:
      "Wait for a Fed rate cut or a rebound in NFIB Small Business Optimism above 98 before submitting new loan applications.",
  },
};

const DEFAULT: ClimateConfig = CLIMATE.Moderate;

interface Props {
  label: string | null;
  score: number | null;
}

export default function LoanClimatePanel({ label, score }: Props) {
  if (!label || score === null) return null;

  const config = CLIMATE[label] ?? DEFAULT;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-1">
            What This Score Means For Your Loan
          </p>
          <p className={`text-base font-bold ${config.headlineColor}`}>
            {config.headline}
          </p>
        </div>
        <span className="text-2xl font-black text-slate-200 ml-4 flex-shrink-0">
          {score}
        </span>
      </div>

      {/* Loan type grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {config.loans.map((loan) => (
          <div
            key={loan.name}
            className="bg-slate-50 rounded-xl p-3 border border-slate-100"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-slate-700">{loan.name}</p>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${loan.statusColor}`}
              >
                {loan.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{loan.detail}</p>
          </div>
        ))}
      </div>

      {/* Lender focus + watch signal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">
            What Lenders Are Prioritizing
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">{config.lenderFocus}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
          <p className="text-[10px] font-bold tracking-widest text-blue-400 uppercase mb-1">
            Signal to Watch
          </p>
          <p className="text-xs text-blue-700 leading-relaxed">{config.watchSignal}</p>
        </div>
      </div>
    </div>
  );
}
