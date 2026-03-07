export const runtime = "edge";

import { supabase } from "@/lib/supabase";
import dynamic from "next/dynamic";
import ScoreCard, { ScoreState } from "@/components/ScoreCard";
import AdSlot from "@/components/AdSlot";

const TrendChart = dynamic(() => import("@/components/TrendChart"), {
  ssr: false,
  loading: () => <div className="mt-8 h-40 bg-gray-50 rounded animate-pulse" />,
});

interface ScoreRow {
  date: string;
  health_score: number;
  status_label: string;
  reasoning: string[];
}

async function getLatestScore(): Promise<ScoreRow | null> {
  const { data, error } = await supabase
    .from("daily_scores")
    .select("date, health_score, status_label, reasoning")
    .order("date", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;
  return data as ScoreRow;
}

async function getRecentScores(): Promise<ScoreRow[]> {
  const { data, error } = await supabase
    .from("daily_scores")
    .select("date, health_score, status_label, reasoning")
    .order("date", { ascending: false })
    .limit(30);

  if (error || !data) return [];
  return data as ScoreRow[];
}

function computeScoreState(latest: ScoreRow | null): ScoreState {
  if (!latest) return "cold-start";
  const latestDate = new Date(latest.date);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const diffDays = Math.floor(
    (today.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return "current";
  if (diffDays <= 3) return "stale";
  return "unavailable";
}

export default async function HomePage() {
  const [latest, recentScores] = await Promise.all([
    getLatestScore(),
    getRecentScores(),
  ]);

  const state = computeScoreState(latest);
  const adVisible = state !== "unavailable" && state !== "cold-start";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <ScoreCard
        score={latest?.health_score ?? null}
        label={latest?.status_label ?? null}
        date={latest?.date ?? null}
        reasoning={latest?.reasoning ?? []}
        state={state}
      />
      <AdSlot visible={adVisible} slot="homepage-below-score" />
      <TrendChart data={recentScores} />
    </div>
  );
}
