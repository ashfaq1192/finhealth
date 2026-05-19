export const runtime = "edge";

import type { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Business Funding Climate Score — Historical Archive | US Business Funding Climate Score",
  description:
    "Daily archive of the US Business Funding Climate Score since March 2026. Track how small business lending conditions have changed over time using Federal Reserve economic data.",
  alternates: { canonical: "/score-history" },
  openGraph: {
    title: "US Business Funding Climate Score — Historical Archive",
    description:
      "The only daily index of US small business funding conditions, powered by 6 Federal Reserve indicators. View the full score history since March 2026.",
    type: "website",
  },
};

interface ScoreRow {
  date: string;
  health_score: number;
  status_label: string;
  dprime?: number | null;
}

async function getAllScores(): Promise<ScoreRow[]> {
  const { data } = await supabase
    .from("daily_scores")
    .select("date, health_score, status_label, dprime")
    .order("date", { ascending: true });
  return data ?? [];
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateShort(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

const STATUS_COLORS: Record<string, string> = {
  Optimal:  "bg-green-500",
  Moderate: "bg-amber-400",
  Risky:    "bg-orange-500",
  Critical: "bg-red-500",
};

const STATUS_TEXT: Record<string, string> = {
  Optimal:  "text-green-700 bg-green-50 border-green-200",
  Moderate: "text-amber-700 bg-amber-50 border-amber-200",
  Risky:    "text-orange-700 bg-orange-50 border-orange-200",
  Critical: "text-red-700 bg-red-50 border-red-200",
};

function computeMonthlyAverages(scores: ScoreRow[]) {
  const byMonth: Record<string, { sum: number; count: number; scores: number[] }> = {};
  for (const s of scores) {
    const key = s.date.slice(0, 7); // YYYY-MM
    if (!byMonth[key]) byMonth[key] = { sum: 0, count: 0, scores: [] };
    byMonth[key].sum += s.health_score;
    byMonth[key].count += 1;
    byMonth[key].scores.push(s.health_score);
  }
  return Object.entries(byMonth).map(([month, { sum, count, scores }]) => ({
    month,
    avg: Math.round(sum / count),
    count,
    min: Math.min(...scores),
    max: Math.max(...scores),
  }));
}

export default async function ScoreHistoryPage() {
  const scores = await getAllScores();

  if (scores.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-slate-500 text-sm">No score data available yet.</p>
      </div>
    );
  }

  const monthlyAverages = computeMonthlyAverages(scores);
  const latest = scores[scores.length - 1];
  const earliest = scores[0];
  const allTimeAvg = Math.round(scores.reduce((s, r) => s + r.health_score, 0) / scores.length);
  const allTimeMin = Math.min(...scores.map((s) => s.health_score));
  const allTimeMax = Math.max(...scores.map((s) => s.health_score));

  // For the sparkline chart — use last 60 entries max for visual clarity
  const chartScores = scores.slice(-90);
  const chartMax = Math.max(...chartScores.map((s) => s.health_score), 1);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Dataset",
        name: "US Business Funding Climate Score — Daily Historical Index",
        description:
          "Daily composite score (0–100) measuring how favorable US economic conditions are for small business loans, computed from 6 Federal Reserve FRED indicators. Published daily since March 2026.",
        url: "https://usfundingclimate.com/score-history",
        creator: {
          "@type": "Person",
          name: "M. Ashfaq",
          url: "https://usfundingclimate.com/about",
          jobTitle: "M.Phil Economics",
          sameAs: ["https://www.linkedin.com/in/m-ashfaq-economist"],
        },
        publisher: {
          "@type": "Organization",
          name: "US Business Funding Climate Score",
          url: "https://usfundingclimate.com",
        },
        temporalCoverage: `${earliest.date}/..`,
        measurementTechnique: "Composite score from 6 Federal Reserve FRED economic indicators: prime rate, C&I lending standards (large/small), Treasury yield spread (T10Y2Y), initial jobless claims, and new business applications.",
        variableMeasured: "Small business funding climate conditions in the United States",
        license: "https://usfundingclimate.com/terms",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://usfundingclimate.com" },
          { "@type": "ListItem", position: 2, name: "Score History", item: "https://usfundingclimate.com/score-history" },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <nav className="text-xs text-slate-400 mb-6 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-600">Home</Link>
          <span>›</span>
          <span>Score History</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-bold tracking-widest text-blue-500 uppercase mb-2">Original Data</p>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Business Funding Climate Score — Historical Archive
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
            Every daily score since{" "}
            <strong className="text-slate-700">{formatDate(earliest.date)}</strong>, computed from
            6 Federal Reserve indicators. The only daily index of US small business funding
            conditions — updated every morning at 9 AM ET.
          </p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Data Points", value: scores.length.toString(), sub: "daily scores" },
            { label: "All-Time Average", value: allTimeAvg.toString(), sub: "out of 100" },
            { label: "All-Time High", value: allTimeMax.toString(), sub: "best conditions" },
            { label: "All-Time Low", value: allTimeMin.toString(), sub: "worst conditions" },
          ].map(({ label, value, sub }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
              <p className="text-3xl font-black text-slate-900 tabular-nums">{value}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* Bar chart — last 90 days */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
              Daily Score Chart {chartScores.length < scores.length ? `(last ${chartScores.length} days)` : ""}
            </p>
            <div className="flex items-center gap-3 text-[10px]">
              {[
                { label: "Optimal (80–100)", color: "bg-green-500" },
                { label: "Moderate (60–79)", color: "bg-amber-400" },
                { label: "Risky (40–59)", color: "bg-orange-500" },
                { label: "Critical (0–39)", color: "bg-red-500" },
              ].map(({ label, color }) => (
                <span key={label} className="flex items-center gap-1 text-slate-500">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${color}`} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Bar chart */}
          <div className="flex items-end gap-0.5 h-40 overflow-hidden">
            {chartScores.map((s) => {
              const barHeight = Math.max(4, (s.health_score / 100) * 100);
              const barColor =
                s.health_score >= 80 ? "bg-green-500 hover:bg-green-400"
                : s.health_score >= 60 ? "bg-amber-400 hover:bg-amber-300"
                : s.health_score >= 40 ? "bg-orange-500 hover:bg-orange-400"
                : "bg-red-500 hover:bg-red-400";
              return (
                <div
                  key={s.date}
                  className="flex-1 flex flex-col items-center justify-end group relative"
                  style={{ minWidth: 0 }}
                  title={`${formatDateShort(s.date)}: ${s.health_score} (${s.status_label})`}
                >
                  <div
                    className={`w-full rounded-t transition-colors cursor-pointer ${barColor}`}
                    style={{ height: `${barHeight}%` }}
                  />
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] rounded px-1.5 py-0.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {formatDateShort(s.date)}: {s.health_score}
                  </div>
                </div>
              );
            })}
          </div>

          {/* X-axis labels — show first and last */}
          <div className="flex justify-between mt-1.5 text-[9px] text-slate-400">
            <span>{formatDateShort(chartScores[0].date)}</span>
            <span>{formatDateShort(chartScores[Math.floor(chartScores.length / 2)].date)}</span>
            <span>{formatDateShort(chartScores[chartScores.length - 1].date)}</span>
          </div>
          <div className="flex justify-between mt-0.5 text-[9px] text-slate-300">
            <span>Score 0 ↑</span>
            <span>100</span>
          </div>
        </div>

        {/* Monthly averages */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800">Monthly Averages</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-5 py-2.5 font-semibold text-slate-500">Month</th>
                  <th className="text-center px-4 py-2.5 font-semibold text-slate-500">Avg Score</th>
                  <th className="text-center px-4 py-2.5 font-semibold text-slate-500">Range</th>
                  <th className="text-center px-4 py-2.5 font-semibold text-slate-500">Data Points</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-slate-500">Conditions</th>
                </tr>
              </thead>
              <tbody>
                {[...monthlyAverages].reverse().map((m) => {
                  const label =
                    m.avg >= 80 ? "Optimal"
                    : m.avg >= 60 ? "Moderate"
                    : m.avg >= 40 ? "Risky"
                    : "Critical";
                  const textStyle = STATUS_TEXT[label] ?? "text-slate-700 bg-slate-50 border-slate-200";
                  const [year, month] = m.month.split("-");
                  const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
                  return (
                    <tr key={m.month} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3 font-semibold text-slate-700">{monthName}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-lg font-black text-slate-900 tabular-nums">{m.avg}</span>
                      </td>
                      <td className="px-4 py-3 text-center text-slate-500 tabular-nums">{m.min}–{m.max}</td>
                      <td className="px-4 py-3 text-center text-slate-400">{m.count} days</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${textStyle}`}>{label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Full daily log */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800">
              Complete Daily Log{" "}
              <span className="font-normal text-slate-400 text-xs">({scores.length} data points)</span>
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-5 py-2.5 font-semibold text-slate-500">Date</th>
                  <th className="text-center px-4 py-2.5 font-semibold text-slate-500">Score</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-slate-500">Status</th>
                  <th className="text-center px-4 py-2.5 font-semibold text-slate-500">Prime Rate</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-slate-500">Analysis</th>
                </tr>
              </thead>
              <tbody>
                {[...scores].reverse().map((s) => {
                  const textStyle = STATUS_TEXT[s.status_label] ?? "text-slate-700 bg-slate-50 border-slate-200";
                  const barColor = STATUS_COLORS[s.status_label] ?? "bg-slate-400";
                  return (
                    <tr key={s.date} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-2.5 font-medium text-slate-700 whitespace-nowrap">
                        {formatDate(s.date)}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${barColor}`}
                              style={{ width: `${s.health_score}%` }}
                            />
                          </div>
                          <span className="font-black text-slate-900 tabular-nums w-6 text-right">{s.health_score}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${textStyle}`}>
                          {s.status_label}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-center text-slate-500 tabular-nums">
                        {s.dprime != null ? `${s.dprime.toFixed(2)}%` : "—"}
                      </td>
                      <td className="px-4 py-2.5">
                        <Link
                          href={`/blog?date=${s.date}`}
                          className="text-blue-500 hover:underline font-medium"
                        >
                          View analysis →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Methodology note */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6">
          <h2 className="text-sm font-bold text-slate-800 mb-3">About This Data</h2>
          <p className="text-xs text-slate-600 leading-relaxed mb-3">
            The US Business Funding Climate Score is a composite index (0–100) computed daily from
            six Federal Reserve Economic Data (FRED) indicators:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            {[
              ["Prime Rate (DPRIME)", "Sets the floor on variable-rate business loans"],
              ["C&I Lending Standards — Large Firms (DRTSCILM)", "% of banks tightening commercial credit"],
              ["C&I Lending Standards — Small Firms (DRTSCIS)", "% of banks tightening small business credit"],
              ["Treasury Yield Spread T10Y–T2Y", "Inverted = recession / credit stress signal"],
              ["Initial Jobless Claims (ICSA)", "Weekly unemployment filings — labor market stress"],
              ["Business Applications (BUSAPPWNSAUS)", "New business filings — entrepreneur confidence"],
            ].map(([name, desc]) => (
              <div key={name} className="flex gap-2 text-xs">
                <span className="text-slate-300 flex-shrink-0 mt-0.5">•</span>
                <div>
                  <span className="font-semibold text-slate-700">{name}</span>
                  <span className="text-slate-400 ml-1">— {desc}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Scores below 40 are Critical, 40–59 are Risky, 60–79 are Moderate, and 80–100 are Optimal for small business
            funding. See the <Link href="/methodology" className="text-blue-600 hover:underline">full methodology</Link> for
            weighting details. Data is not financial advice —{" "}
            <Link href="/disclaimer" className="underline">read the disclaimer</Link>.
          </p>
        </div>

        {/* CTA to current score */}
        <div className="bg-blue-950 text-white rounded-2xl p-5 text-center">
          <p className="text-xs font-bold tracking-widest text-blue-400 uppercase mb-2">Live Score</p>
          <p className="text-sm text-slate-200 mb-3">
            Today's score is updated every morning at 9 AM ET from live Federal Reserve data.
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors"
          >
            View Today's Score →
          </Link>
        </div>

      </div>
    </>
  );
}
