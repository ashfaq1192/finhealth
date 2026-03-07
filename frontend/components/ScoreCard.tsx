export type ScoreState = "current" | "stale" | "unavailable" | "cold-start";

interface ScoreCardProps {
  score: number | null;
  label: string | null;
  date: string | null;
  reasoning: string[];
  state: ScoreState;
}

const THEME: Record<string, { bar: string; badge: string; score: string; bg: string; border: string }> = {
  Optimal: {
    bar: "bg-green-500",
    badge: "bg-green-100 text-green-800 border-green-300",
    score: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  Moderate: {
    bar: "bg-amber-500",
    badge: "bg-amber-100 text-amber-800 border-amber-300",
    score: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  Risky: {
    bar: "bg-orange-500",
    badge: "bg-orange-100 text-orange-800 border-orange-300",
    score: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  Critical: {
    bar: "bg-red-500",
    badge: "bg-red-100 text-red-800 border-red-300",
    score: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
};

const DEFAULT_THEME = {
  bar: "bg-slate-400",
  badge: "bg-slate-100 text-slate-700 border-slate-300",
  score: "text-slate-700",
  bg: "bg-slate-50",
  border: "border-slate-200",
};

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const ZONE_LABELS = [
  { label: "Critical", color: "bg-red-400", width: "w-[40%]" },
  { label: "Risky", color: "bg-orange-400", width: "w-[20%]" },
  { label: "Moderate", color: "bg-amber-400", width: "w-[20%]" },
  { label: "Optimal", color: "bg-green-400", width: "w-[20%]" },
];

export default function ScoreCard({ score, label, date, reasoning, state }: ScoreCardProps) {
  if (state === "cold-start") {
    return (
      <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200">
        <div className="text-5xl mb-4">📊</div>
        <p className="text-2xl font-bold text-slate-700">Launching soon</p>
        <p className="text-slate-500 mt-2">Our daily economic analysis will be ready tomorrow.</p>
      </div>
    );
  }

  if (state === "unavailable") {
    return (
      <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200">
        <div className="text-5xl mb-4">🔄</div>
        <p className="text-2xl font-bold text-slate-700">Data refresh in progress</p>
        <p className="text-slate-500 mt-2">
          Our data sources are being updated. Check back shortly.
        </p>
      </div>
    );
  }

  const theme = label ? (THEME[label] ?? DEFAULT_THEME) : DEFAULT_THEME;
  const scorePercent = score ?? 0;

  return (
    <div className={`rounded-2xl border ${theme.border} ${theme.bg} overflow-hidden`}>
      {/* Top score panel */}
      <div className="px-8 pt-8 pb-6 text-center">
        <p className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-3">
          Business Funding Climate Score
        </p>

        <div className={`text-9xl font-black leading-none ${theme.score}`}>
          {score}
        </div>

        <div className="mt-4 flex items-center justify-center gap-3">
          {label && (
            <span className={`px-4 py-1 rounded-full border text-sm font-bold ${theme.badge}`}>
              {label}
            </span>
          )}
          {date && (
            <span className={`text-sm ${state === "stale" ? "text-amber-600 font-medium" : "text-slate-400"}`}>
              as of {formatDate(date)}
              {state === "stale" && " · refresh pending"}
            </span>
          )}
        </div>
      </div>

      {/* Score meter */}
      <div className="px-8 pb-6">
        <div className="relative">
          {/* Zone bar */}
          <div className="flex h-3 rounded-full overflow-hidden mb-1">
            {ZONE_LABELS.map((z) => (
              <div key={z.label} className={`${z.color} ${z.width}`} />
            ))}
          </div>
          {/* Marker */}
          <div
            className="absolute top-0 w-1 h-3 bg-slate-900 rounded-full -translate-x-1/2"
            style={{ left: `${scorePercent}%` }}
          />
          {/* Zone labels */}
          <div className="flex text-[10px] text-slate-400 font-medium mt-1">
            <span className="w-[40%]">Critical (0–39)</span>
            <span className="w-[20%] text-center">Risky</span>
            <span className="w-[20%] text-center">Moderate</span>
            <span className="w-[20%] text-right">Optimal</span>
          </div>
        </div>
      </div>

      {/* Reasoning bullets */}
      {reasoning.length > 0 && (
        <div className="bg-white border-t border-slate-100 px-8 py-6">
          <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4">
            Key Drivers
          </p>
          <ul className="space-y-3">
            {reasoning.map((bullet, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-700 leading-relaxed">
                <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${theme.bar}`} />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
