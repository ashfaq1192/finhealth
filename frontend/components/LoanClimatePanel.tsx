interface LoanType {
  name: string;
  status: string;
  statusColor: string;
  cardBg: string;
  detail: string;
}

interface ClimateConfig {
  headline: string;
  headlineColor: string;
  topBorder: string;
  headerBg: string;
  loans: LoanType[];
  lenderFocus: string;
  watchSignal: string;
  icon: string;
}

const CLIMATE: Record<string, ClimateConfig> = {
  Optimal: {
    headline: "Lending conditions are broadly favorable for small businesses",
    headlineColor: "text-green-800",
    topBorder: "border-t-4 border-green-400",
    headerBg: "bg-green-50",
    icon: "✓",
    loans: [
      {
        name: "SBA 7(a) Loans",
        status: "Favorable",
        statusColor: "bg-green-100 text-green-700 border-green-200",
        cardBg: "bg-green-50/60 border-green-100",
        detail:
          "Approval rates are near historical norms. Full loan amounts are accessible with standard documentation and 680+ FICO.",
      },
      {
        name: "Lines of Credit",
        status: "Open",
        statusColor: "bg-green-100 text-green-700 border-green-200",
        cardBg: "bg-green-50/60 border-green-100",
        detail:
          "Banks are actively extending revolving credit to qualified applicants. Renewal terms are competitive and documentation requirements are standard.",
      },
      {
        name: "Equipment Financing",
        status: "Competitive",
        statusColor: "bg-green-100 text-green-700 border-green-200",
        cardBg: "bg-green-50/60 border-green-100",
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
    headlineColor: "text-amber-800",
    topBorder: "border-t-4 border-amber-400",
    headerBg: "bg-amber-50",
    icon: "~",
    loans: [
      {
        name: "SBA 7(a) Loans",
        status: "Selective",
        statusColor: "bg-amber-100 text-amber-700 border-amber-200",
        cardBg: "bg-amber-50/60 border-amber-100",
        detail:
          "Approval is possible but banks are scrutinizing applications more carefully. Expect longer processing times and stronger collateral requirements.",
      },
      {
        name: "Lines of Credit",
        status: "Cautious",
        statusColor: "bg-amber-100 text-amber-700 border-amber-200",
        cardBg: "bg-amber-50/60 border-amber-100",
        detail:
          "Banks are raising documentation requirements on renewals. New applicants need 2+ years of clean financials and a debt-service ratio above 1.35×.",
      },
      {
        name: "Equipment Financing",
        status: "Available",
        statusColor: "bg-amber-100 text-amber-700 border-amber-200",
        cardBg: "bg-amber-50/60 border-amber-100",
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
    headlineColor: "text-orange-800",
    topBorder: "border-t-4 border-orange-400",
    headerBg: "bg-orange-50",
    icon: "!",
    loans: [
      {
        name: "SBA 7(a) Loans",
        status: "Difficult",
        statusColor: "bg-orange-100 text-orange-700 border-orange-200",
        cardBg: "bg-orange-50/60 border-orange-100",
        detail:
          "Banks are prioritizing existing customers. New applicants face longer delays, stricter collateral requirements, and lower approval loan amounts.",
      },
      {
        name: "Lines of Credit",
        status: "Tight",
        statusColor: "bg-orange-100 text-orange-700 border-orange-200",
        cardBg: "bg-orange-50/60 border-orange-100",
        detail:
          "Many lenders are reducing credit limits on renewals. New revolving credit lines are rarely approved without significant hard collateral.",
      },
      {
        name: "Equipment Financing",
        status: "Restricted",
        statusColor: "bg-orange-100 text-orange-700 border-orange-200",
        cardBg: "bg-orange-50/60 border-orange-100",
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
    headlineColor: "text-red-800",
    topBorder: "border-t-4 border-red-400",
    headerBg: "bg-red-50",
    icon: "✕",
    loans: [
      {
        name: "SBA 7(a) Loans",
        status: "Very Difficult",
        statusColor: "bg-red-100 text-red-700 border-red-200",
        cardBg: "bg-red-50/60 border-red-100",
        detail:
          "Approval rates are near multi-year lows. Only businesses with excellent collateral, FICO 750+, and 3+ years of profitable history are succeeding.",
      },
      {
        name: "Lines of Credit",
        status: "Frozen",
        statusColor: "bg-red-100 text-red-700 border-red-200",
        cardBg: "bg-red-50/60 border-red-100",
        detail:
          "Most banks have paused new revolving credit for small businesses. Existing lines are being reviewed and many are being reduced or cancelled.",
      },
      {
        name: "Equipment Financing",
        status: "Highly Restricted",
        statusColor: "bg-red-100 text-red-700 border-red-200",
        cardBg: "bg-red-50/60 border-red-100",
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

interface Props {
  label: string | null;
  score: number | null;
}

export default function LoanClimatePanel({ label, score }: Props) {
  if (!label || score === null) return null;

  const config = CLIMATE[label] ?? CLIMATE.Moderate;

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 overflow-hidden ${config.topBorder}`}>
      {/* Header */}
      <div className={`${config.headerBg} px-5 py-4 flex items-center justify-between border-b border-slate-100`}>
        <div>
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-0.5">
            What This Score Means For Your Loan
          </p>
          <p className={`text-sm font-bold leading-snug ${config.headlineColor}`}>
            {config.headline}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-black flex-shrink-0 ml-4 ${config.headerBg} border-2 border-current ${config.headlineColor}`}>
          {config.icon}
        </div>
      </div>

      <div className="p-5">
        {/* Loan type grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {config.loans.map((loan) => (
            <div
              key={loan.name}
              className={`rounded-xl p-3.5 border ${loan.cardBg}`}
            >
              <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-1.5">
                {loan.name}
              </p>
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mb-2 ${loan.statusColor}`}>
                {loan.status}
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">{loan.detail}</p>
            </div>
          ))}
        </div>

        {/* Lender focus + watch signal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">
              🏦 What Lenders Are Prioritizing
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">{config.lenderFocus}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3.5 border border-blue-100">
            <p className="text-[10px] font-bold tracking-widest text-blue-400 uppercase mb-1.5">
              👁 Signal to Watch
            </p>
            <p className="text-xs text-blue-700 leading-relaxed">{config.watchSignal}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
