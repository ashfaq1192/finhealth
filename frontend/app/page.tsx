export const runtime = "edge";

import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "US Business Funding Climate Score — Daily Small Business Lending Index",
  description:
    "Free daily score (0–100) measuring how favorable US conditions are for small business loans. Powered by 6 Federal Reserve indicators: prime rate, yield curve, C&I lending standards, jobless claims, NFIB optimism, and new business applications. Updated every morning at 9 AM EST.",
  keywords: [
    "small business funding",
    "business loan conditions today",
    "SBA loan rates today",
    "prime rate small business loans",
    "small business lending index",
    "is now a good time for a business loan",
    "US small business credit conditions",
    "business funding climate score",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "US Business Funding Climate Score — Daily Small Business Lending Index",
    description:
      "Free daily score (0–100) measuring how favorable US conditions are for small business loans — powered by 6 Federal Reserve indicators. Updated every morning.",
    type: "website",
    url: "https://usfundingclimate.com",
    siteName: "US Business Funding Climate Score",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "US Business Funding Climate Score",
    description:
      "Free daily score (0–100) measuring how favorable US conditions are for small business loans — powered by 6 Federal Reserve indicators.",
  },
};
import ScoreCard, { ScoreState } from "@/components/ScoreCard";
import Link from "next/link";
import TodaysFocus from "@/components/TodaysFocus";
import FOMCCountdown from "@/components/FOMCCountdown";
import EmailCapture from "@/components/EmailCapture";
import LoanClimatePanel from "@/components/LoanClimatePanel";
import PrimeRateCalculator from "@/components/PrimeRateCalculator";
import ContextStatsPanel from "@/components/ContextStatsPanel";

interface ScoreRow {
  date: string;
  health_score: number;
  status_label: string;
  reasoning: string[];
  cpi_yoy?: number | null;
  nfib_optimism?: number | null;
  dprime?: number | null;
}

interface PostRow {
  date: string;
  title: string;
  slug: string;
  category: string;
  meta_description: string;
}

async function getLatestScore(): Promise<ScoreRow | null> {
  const { data, error } = await supabase
    .from("daily_scores")
    .select("date, health_score, status_label, reasoning, cpi_yoy, nfib_optimism, dprime")
    .order("date", { ascending: false })
    .limit(1)
    .single();
  if (error || !data) return null;
  return data as ScoreRow;
}

async function getLatestPosts(): Promise<PostRow[]> {
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
  Trucking:    "bg-blue-100 text-blue-700",
  Retail:      "bg-purple-100 text-purple-700",
  "SBA Loans": "bg-green-100 text-green-700",
  Macro:       "bg-slate-100 text-slate-700",
  Staffing:    "bg-orange-100 text-orange-700",
};

const CATEGORY_BORDER: Record<string, string> = {
  Trucking:    "border-l-blue-400",
  Retail:      "border-l-purple-400",
  "SBA Loans": "border-l-green-400",
  Macro:       "border-l-slate-400",
  Staffing:    "border-l-orange-400",
};

const INDICATORS = [
  {
    label: "Prime Rate",
    desc: "Sets the floor on most variable-rate business loans and SBA 7(a) rates",
    impact: "Higher = costlier borrowing",
    dot: "bg-red-400",
    impactColor: "text-red-500",
    dir: "↑",
  },
  {
    label: "Yield Curve",
    desc: "10Y minus 2Y Treasury spread — inversion signals credit stress ahead",
    impact: "Negative = recession signal",
    dot: "bg-purple-400",
    impactColor: "text-purple-500",
    dir: "↓",
  },
  {
    label: "C&I Standards (Large)",
    desc: "% of banks tightening commercial loan standards for large firms",
    impact: "Higher = less credit available",
    dot: "bg-orange-400",
    impactColor: "text-orange-500",
    dir: "↑",
  },
  {
    label: "C&I Standards (Small)",
    desc: "% of banks tightening commercial loan standards for small firms",
    impact: "Higher = harder to qualify",
    dot: "bg-orange-300",
    impactColor: "text-orange-400",
    dir: "↑",
  },
  {
    label: "Jobless Claims",
    desc: "Weekly new unemployment filings — reflects labor market health",
    impact: "Higher = economic stress rising",
    dot: "bg-amber-400",
    impactColor: "text-amber-600",
    dir: "↑",
  },
  {
    label: "Business Applications",
    desc: "New business filings — leading indicator of entrepreneur confidence",
    impact: "Higher = opportunity signal",
    dot: "bg-green-400",
    impactColor: "text-green-600",
    dir: "↑",
  },
];

export default async function HomePage() {
  const [latest, latestPosts] = await Promise.all([
    getLatestScore(),
    getLatestPosts(),
  ]);

  const state = computeScoreState(latest);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://usfundingclimate.com/#website",
        "url": "https://usfundingclimate.com",
        "name": "US Business Funding Climate Score",
        "description": "Daily composite score measuring how favorable US conditions are for small business loans, powered by Federal Reserve economic data.",
        "inLanguage": "en-US",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://usfundingclimate.com/blog?category={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://usfundingclimate.com/#organization",
        "name": "US Business Funding Climate Score",
        "url": "https://usfundingclimate.com",
        "sameAs": [],
        "founder": {
          "@type": "Person",
          "name": "M. Ashfaq",
          "jobTitle": "M.Phil Economics",
        },
      },
      {
        "@type": "DataFeed",
        "@id": "https://usfundingclimate.com/#datafeed",
        "name": "US Business Funding Climate Score — Daily Index",
        "description": "Daily composite score (0–100) for US small business funding conditions, computed from 6 Federal Reserve FRED series.",
        "url": "https://usfundingclimate.com",
        "provider": {
          "@id": "https://usfundingclimate.com/#organization",
        },
        "encodingFormat": "text/html",
        "inLanguage": "en-US",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* ── 1. HERO ROW: Score + Indicators ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3">
          <ScoreCard
            score={latest?.health_score ?? null}
            label={latest?.status_label ?? null}
            date={latest?.date ?? null}
            reasoning={latest?.reasoning ?? []}
            state={state}
          />
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 h-full">
            <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-1">
              What Is This?
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              A daily composite score (0–100) measuring how favourable US economic
              conditions are for small business funding — powered by 6 Federal Reserve
              indicators, updated every morning.
            </p>
            <div className="space-y-2">
              {INDICATORS.map(({ label, desc, impact, dot, impactColor, dir }) => (
                <div key={label} className="flex gap-3 items-start bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-100">
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ${dot}`} />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-700 leading-snug">{label}</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">{desc}</p>
                    <p className={`text-[10px] font-semibold mt-0.5 ${impactColor}`}>
                      {dir} {impact}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-3 text-center">Updated daily · 9 AM EST</p>
          </div>
        </div>
      </div>

      {/* ── 2. LOAN CLIMATE — most actionable, right below hero ── */}
      <div className="mb-5">
        <LoanClimatePanel
          label={latest?.status_label ?? null}
          score={latest?.health_score ?? null}
        />
      </div>

      {/* ── 3. TODAY'S FOCUS + FOMC COUNTDOWN ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {latestPosts[0] && <TodaysFocus post={latestPosts[0]} />}
        <FOMCCountdown />
      </div>

      {/* ── 4. CPI + NFIB CONTEXT STRIP ── animated client component */}
      <ContextStatsPanel
        cpi_yoy={latest?.cpi_yoy}
        nfib_optimism={latest?.nfib_optimism}
      />

      {/* ── 5. PRIME RATE CALCULATOR ── */}
      {latest?.dprime != null && (
        <div className="mb-5">
          <PrimeRateCalculator primeRate={latest.dprime} />
        </div>
      )}

      {/* ── 6. EMAIL CAPTURE ── */}
      <div className="mb-6">
        <EmailCapture />
      </div>

      {/* ── 7. LATEST ANALYSIS ── */}
      {latestPosts.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
              Latest Analysis
            </p>
            <Link
              href="/blog"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {latestPosts.map((post) => {
              const borderColor = CATEGORY_BORDER[post.category] ?? "border-l-slate-300";
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={`block rounded-xl border border-slate-200 border-l-4 ${borderColor} bg-slate-50 hover:bg-white hover:shadow-sm transition-all group p-4`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${CATEGORY_COLORS[post.category] ?? "bg-slate-100 text-slate-600"}`}>
                      {post.category}
                    </span>
                    <span className="text-xs text-slate-400">{formatDate(post.date)}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors leading-snug mb-1">
                    {post.title}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {post.meta_description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      )}

    </div>
    </>
  );
}
