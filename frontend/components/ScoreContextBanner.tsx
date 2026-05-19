"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface ScoreRow {
  health_score: number;
  status_label: string;
  score_date: string;
}

const THEME: Record<string, { bg: string; border: string; badge: string; score: string; dot: string }> = {
  Optimal: {
    bg: "bg-green-50",
    border: "border-green-200",
    badge: "bg-green-500 text-white border-green-600",
    score: "text-green-700",
    dot: "bg-green-400",
  },
  Moderate: {
    bg: "bg-sky-50",
    border: "border-sky-200",
    badge: "bg-sky-500 text-white border-sky-600",
    score: "text-sky-700",
    dot: "bg-sky-400",
  },
  Risky: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    badge: "bg-amber-500 text-white border-amber-600",
    score: "text-amber-700",
    dot: "bg-amber-400",
  },
  Critical: {
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-600 text-white border-red-700",
    score: "text-red-700",
    dot: "bg-red-400",
  },
};

const DEFAULT_THEME = {
  bg: "bg-slate-50",
  border: "border-slate-200",
  badge: "bg-slate-100 text-slate-600 border-slate-300",
  score: "text-slate-700",
  dot: "bg-slate-400",
};

export default function ScoreContextBanner() {
  const [row, setRow] = useState<ScoreRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("daily_scores")
      .select("health_score, status_label, score_date")
      .order("score_date", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        setRow(data?.[0] ?? null);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-10 bg-slate-100 rounded-xl animate-pulse mb-6" />
    );
  }

  if (!row) return null;

  const theme = THEME[row.status_label] ?? DEFAULT_THEME;

  return (
    <Link
      href="/"
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${theme.bg} ${theme.border} mb-6 group hover:shadow-sm transition-shadow`}
    >
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${theme.dot}`} />
      <span className="text-xs text-slate-500">Today&apos;s Funding Climate:</span>
      <span className={`text-sm font-black tabular-nums ${theme.score}`}>{row.health_score}</span>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${theme.badge}`}>
        {row.status_label}
      </span>
      <span className="ml-auto text-[10px] text-slate-400 group-hover:text-slate-600 transition-colors hidden sm:block">
        See full analysis →
      </span>
    </Link>
  );
}
