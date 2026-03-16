"use client";

import { useEffect, useState } from "react";

// FOMC rate decision dates (final day of each 2-day meeting — when the rate is announced)
// Update annually: https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm
const FOMC_DECISION_DATES = [
  // 2025
  "2025-01-29", "2025-03-19", "2025-05-07", "2025-06-18",
  "2025-07-30", "2025-09-17", "2025-10-29", "2025-12-10",
  // 2026
  "2026-01-28", "2026-03-19", "2026-05-07", "2026-06-17",
  "2026-07-29", "2026-09-16", "2026-10-28", "2026-12-09",
];

function getNextFOMC(): { date: Date; daysUntil: number } | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (const ds of FOMC_DECISION_DATES) {
    const d = new Date(ds + "T00:00:00");
    if (d >= today) {
      const diff = Math.round((d.getTime() - today.getTime()) / 86_400_000);
      return { date: d, daysUntil: diff };
    }
  }
  return null;
}

export default function FOMCCountdown() {
  const [next, setNext] = useState<{ date: Date; daysUntil: number } | null>(null);

  useEffect(() => {
    setNext(getNextFOMC());
  }, []);

  // Render a skeleton until hydrated so the grid column is always filled
  if (!next) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 animate-pulse">
        <div className="h-2.5 w-28 bg-slate-100 rounded mb-4" />
        <div className="h-9 w-14 bg-slate-100 rounded mb-2" />
        <div className="h-3 w-24 bg-slate-100 rounded mb-1" />
        <div className="h-2.5 w-36 bg-slate-100 rounded" />
      </div>
    );
  }

  const formatted = next.date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const isToday = next.daysUntil === 0;
  const isImminent = next.daysUntil <= 7;
  const isApproaching = next.daysUntil <= 21;

  const containerColor = isImminent
    ? "text-red-700 bg-red-50 border-red-200"
    : isApproaching
    ? "text-amber-700 bg-amber-50 border-amber-200"
    : "text-slate-700 bg-white border-slate-200";

  const countDisplay = isToday ? "Today" : `${next.daysUntil}d`;

  return (
    <div className={`rounded-2xl border p-5 ${containerColor}`}>
      <p className="text-[10px] font-bold tracking-widest uppercase opacity-60 mb-2">
        Next Fed Rate Decision
      </p>
      <div className="text-4xl font-black leading-none mb-1 tabular-nums">
        {countDisplay}
      </div>
      <div className="text-sm font-semibold">{formatted}</div>
      <div className="text-xs opacity-60 mt-0.5">FOMC meeting · rate decision day</div>
      {isImminent && !isToday && (
        <div className="mt-3 text-xs font-semibold bg-red-100 text-red-700 rounded-lg px-3 py-1.5">
          ⚠ Rate decision imminent — lending conditions may shift
        </div>
      )}
      {isToday && (
        <div className="mt-3 text-xs font-semibold bg-red-100 text-red-700 rounded-lg px-3 py-1.5">
          🔴 Fed decides on rates today
        </div>
      )}
    </div>
  );
}
