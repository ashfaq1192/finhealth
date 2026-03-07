export type ScoreState = "current" | "stale" | "unavailable" | "cold-start";

interface ScoreCardProps {
  score: number | null;
  label: string | null;
  date: string | null;
  reasoning: string[];
  state: ScoreState;
}

const LABEL_COLORS: Record<string, string> = {
  Optimal: "bg-green-100 text-green-800 border-green-300",
  Moderate: "bg-amber-100 text-amber-800 border-amber-300",
  Risky: "bg-orange-100 text-orange-800 border-orange-300",
  Critical: "bg-red-100 text-red-800 border-red-300",
};

const SCORE_COLORS: Record<string, string> = {
  Optimal: "text-green-600",
  Moderate: "text-amber-600",
  Risky: "text-orange-600",
  Critical: "text-red-600",
};

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ScoreCard({
  score,
  label,
  date,
  reasoning,
  state,
}: ScoreCardProps) {
  if (state === "cold-start") {
    return (
      <div className="text-center py-16">
        <p className="text-2xl font-semibold text-gray-500">
          Launching soon — check back tomorrow
        </p>
        <p className="text-gray-400 mt-2">
          Our daily economic analysis will be ready shortly.
        </p>
      </div>
    );
  }

  if (state === "unavailable") {
    return (
      <div className="text-center py-16">
        <p className="text-2xl font-semibold text-gray-500">
          Data temporarily unavailable — check back soon
        </p>
        <p className="text-gray-400 mt-2">
          Our data sources are being refreshed. The score will return once updated
          economic data is available.
        </p>
      </div>
    );
  }

  const scoreColor = label ? (SCORE_COLORS[label] ?? "text-gray-700") : "text-gray-700";
  const labelColor = label ? (LABEL_COLORS[label] ?? "bg-gray-100 text-gray-700 border-gray-300") : "";

  return (
    <div className="text-center">
      <h1 className="text-lg font-semibold text-gray-500 uppercase tracking-widest mb-1">
        Business Funding Climate Score
      </h1>

      <div className={`text-8xl font-black ${scoreColor} leading-none my-4`}>
        {score}
      </div>

      {label && (
        <span
          className={`inline-block px-4 py-1 rounded-full border text-sm font-semibold ${labelColor}`}
        >
          {label}
        </span>
      )}

      {date && (
        <p className={`text-sm mt-2 ${state === "stale" ? "text-amber-600 font-medium" : "text-gray-400"}`}>
          as of {formatDate(date)}
          {state === "stale" && " — data refresh pending"}
        </p>
      )}

      {reasoning.length > 0 && (
        <ul className="mt-6 text-left max-w-xl mx-auto space-y-2">
          {reasoning.map((bullet, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-700">
              <span className="text-gray-400 flex-shrink-0">•</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
