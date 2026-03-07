export const runtime = "edge";

import { supabase } from "@/lib/supabase";
import ScoreCard, { ScoreState } from "@/components/ScoreCard";
import AdSlot from "@/components/AdSlot";
import TrendChartWrapper from "@/components/TrendChartWrapper";
import Link from "next/link";
import TodaysFocus from "@/components/TodaysFocus";

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

async function getLatestPosts() {
  const { data } = await supabase
    .from("blog_posts")
    .select("date, title, slug, category, meta_description")
    .order("date", { ascending: false })
    .limit(3);
  return data ?? [];
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

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const CATEGORY_COLORS: Record<string, string> = {
  Trucking: "bg-blue-100 text-blue-700",
  Retail: "bg-purple-100 text-purple-700",
  "SBA Loans": "bg-green-100 text-green-700",
  Macro: "bg-slate-100 text-slate-700",
  Staffing: "bg-orange-100 text-orange-700",
};

export default async function HomePage() {
  const [latest, recentScores, latestPosts] = await Promise.all([
    getLatestScore(),
    getRecentScores(),
    getLatestPosts(),
  ]);

  const state = computeScoreState(latest);
  const adVisible = state !== "unavailable" && state !== "cold-start";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* Score card — wider */}
        <div className="lg:col-span-3">
          <ScoreCard
            score={latest?.health_score ?? null}
            label={latest?.status_label ?? null}
            date={latest?.date ?? null}
            reasoning={latest?.reasoning ?? []}
            state={state}
          />
        </div>

        {/* Side panel */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* About card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">
              What Is This?
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              A daily composite score (0–100) measuring how favourable US economic
              conditions are for small business funding — powered by 6 Federal Reserve
              indicators, refreshed every morning.
            </p>
            <div className="space-y-2">
              {[
                { label: "Prime Rate", desc: "Cost of borrowing", icon: "💵" },
                { label: "Yield Curve", desc: "Credit market signal", icon: "📉" },
                { label: "C&I Tightening", desc: "Bank lending standards", icon: "🏦" },
                { label: "Jobless Claims", desc: "Labour market health", icon: "👷" },
                { label: "Business Apps", desc: "Entrepreneur activity", icon: "📋" },
              ].map(({ label, desc, icon }) => (
                <div key={label} className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2">
                  <span className="text-base">{icon}</span>
                  <div>
                    <div className="text-xs font-semibold text-slate-700">{label}</div>
                    <div className="text-xs text-slate-400">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-3 text-center">Updated daily · 9 AM EST</p>
          </div>

          {/* Today's industry focus */}
          {latestPosts[0] && <TodaysFocus post={latestPosts[0]} />}

          {/* Ad slot */}
          <AdSlot visible={adVisible} slot="homepage-sidebar" />
        </div>
      </div>

      {/* Trend chart */}
      {recentScores.length > 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 px-6 pt-6 pb-4 mb-6">
          <TrendChartWrapper data={recentScores} />
        </div>
      )}

      {/* Latest analysis */}
      {latestPosts.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
              Latest Analysis
            </p>
            <Link
              href="/blog"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              View all →
            </Link>
          </div>
          <ul className="divide-y divide-slate-100">
            {latestPosts.map((post) => (
              <li key={post.slug} className="py-3 first:pt-0 last:pb-0">
                <Link href={`/blog/${post.slug}`} className="group flex gap-3 items-start">
                  <span
                    className={`mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                      CATEGORY_COLORS[post.category] ?? "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {post.category}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors leading-snug">
                      {post.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{formatDate(post.date)}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
