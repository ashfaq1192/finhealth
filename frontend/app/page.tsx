export const runtime = "edge";

import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};
import ScoreCard, { ScoreState } from "@/components/ScoreCard";
import TrendChartWrapper from "@/components/TrendChartWrapper";
import Link from "next/link";
import TodaysFocus from "@/components/TodaysFocus";
import FOMCCountdown from "@/components/FOMCCountdown";
import EmailCapture from "@/components/EmailCapture";

interface ScoreRow {
  date: string;
  health_score: number;
  status_label: string;
  reasoning: string[];
  cpi_yoy?: number | null;
  nfib_optimism?: number | null;
}

async function getLatestScore(): Promise<ScoreRow | null> {
  const { data, error } = await supabase
    .from("daily_scores")
    .select("date, health_score, status_label, reasoning, cpi_yoy, nfib_optimism")
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
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">
              What Is This?
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              A daily composite score (0–100) measuring how favourable US economic
              conditions are for small business funding — powered by 6 Federal Reserve
              indicators, refreshed every morning.
            </p>
            <div className="space-y-2.5">
              {[
                { label: "Prime Rate", desc: "Daily benchmark for business loans", source: "FRED DPRIME", abbr: "PR" },
                { label: "Yield Curve", desc: "Treasury 10Y-2Y spread indicator", source: "FRED T10Y2Y", abbr: "YC" },
                { label: "C&I Tightening", desc: "Bank lending standards (large firms)", source: "FRED DRTSCILM", abbr: "CI" },
                { label: "Jobless Claims", desc: "Weekly initial unemployment filings", source: "FRED ICSA", abbr: "JC" },
                { label: "Business Apps", desc: "New business applications (seasonal)", source: "FRED BUSAPPWNSAUS", abbr: "BA" },
                { label: "Treasury Spread", desc: "Long-term vs short-term rates", source: "Daily computed", abbr: "TS" },
              ].map(({ label, desc, source, abbr }) => (
                <div key={label} className="bg-slate-50 rounded-xl px-3 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-600 flex-shrink-0">{abbr}</span>
                    <div className="text-xs font-semibold text-slate-700">{label}</div>
                  </div>
                  <div className="ml-9 mt-0.5 flex items-center gap-2">
                    <span className="text-xs text-slate-600">{desc}</span>
                    <span className="text-[10px] text-slate-400">·</span>
                    <span className="text-[10px] text-slate-400">{source}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-3 text-center">Updated daily · 9 AM EST</p>
          </div>

          {/* Today's industry focus */}
          {latestPosts[0] && <TodaysFocus post={latestPosts[0]} />}

          {/* FOMC countdown — high-value return-visit hook */}
          <FOMCCountdown />
        </div>
      </div>

      {/* Trend chart */}
      {recentScores.length > 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 px-5 pt-5 pb-4 mb-5">
          <TrendChartWrapper data={recentScores} />
        </div>
      )}

      {/* CPI + NFIB context strip — shown once data is available from pipeline */}
      {(latest?.cpi_yoy != null || latest?.nfib_optimism != null) && (
        <div className={`grid grid-cols-1 gap-3 mb-5 ${latest?.cpi_yoy != null && latest?.nfib_optimism != null ? "sm:grid-cols-2" : ""}`}>
          {latest?.cpi_yoy != null && (
            <div className={`rounded-2xl border p-4 ${
              latest.cpi_yoy > 4 ? "bg-red-50 border-red-200" :
              latest.cpi_yoy > 2 ? "bg-amber-50 border-amber-200" :
              "bg-green-50 border-green-200"
            }`}>
              <p className="text-[10px] font-bold tracking-widest uppercase opacity-60 mb-2">
                US Inflation (CPI)
              </p>
              <div className={`text-3xl font-black leading-none mb-1 ${
                latest.cpi_yoy > 4 ? "text-red-700" :
                latest.cpi_yoy > 2 ? "text-amber-700" :
                "text-green-700"
              }`}>
                {latest.cpi_yoy.toFixed(1)}%
              </div>
              <div className="text-sm font-semibold">Year-over-Year</div>
              <div className="text-xs opacity-60 mt-1">
                Fed target: 2.0% ·{" "}
                {latest.cpi_yoy > 4 ? "Well above target — rates stay elevated"
                  : latest.cpi_yoy > 2 ? "Above target — Fed remains cautious"
                  : "Near target — easing conditions possible"}
              </div>
            </div>
          )}
          {latest?.nfib_optimism != null && (
            <div className={`rounded-2xl border p-4 ${
              latest.nfib_optimism < 90 ? "bg-red-50 border-red-200" :
              latest.nfib_optimism < 98 ? "bg-amber-50 border-amber-200" :
              "bg-green-50 border-green-200"
            }`}>
              <p className="text-[10px] font-bold tracking-widest uppercase opacity-60 mb-2">
                NFIB Small Biz Optimism
              </p>
              <div className={`text-3xl font-black leading-none mb-1 ${
                latest.nfib_optimism < 90 ? "text-red-700" :
                latest.nfib_optimism < 98 ? "text-amber-700" :
                "text-green-700"
              }`}>
                {latest.nfib_optimism.toFixed(1)}
              </div>
              <div className="text-sm font-semibold">Monthly Survey</div>
              <div className="text-xs opacity-60 mt-1">
                Neutral baseline: 98 ·{" "}
                {latest.nfib_optimism < 90 ? "Owners are pessimistic"
                  : latest.nfib_optimism < 98 ? "Below average confidence"
                  : "Owners are optimistic"}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Email digest capture */}
      <div className="mb-6">
        <EmailCapture />
      </div>

      {/* Latest analysis */}
      {latestPosts.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
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
