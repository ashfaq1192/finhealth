"use client";

import { useEffect, useRef, useState } from "react";

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

// ── Animation session helpers ──────────────────────────────────────────────
const ANIM_KEY = "fh_score_anim_v1";
const REPLAY_MS = 30 * 60 * 1000; // 30 minutes

function shouldPlayAnimation(): boolean {
  try {
    const raw = sessionStorage.getItem(ANIM_KEY);
    if (!raw) return true;
    const { ts } = JSON.parse(raw);
    return Date.now() - ts > REPLAY_MS;
  } catch {
    return true;
  }
}

export function markAnimationPlayed(): void {
  try {
    sessionStorage.setItem(ANIM_KEY, JSON.stringify({ ts: Date.now() }));
  } catch {}
}

// ── Hook: slot-machine count-up ────────────────────────────────────────────
function useSlotMachineScore(target: number | null) {
  const [display, setDisplay] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const lastRandom = useRef(0);

  useEffect(() => {
    if (target === null) return;

    if (!shouldPlayAnimation()) {
      setDisplay(target);
      return;
    }

    setAnimating(true);
    setDisplay(null); // show placeholder while animating

    const PHASE1_MS = 1200;
    const TICK_MS = 75;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += TICK_MS;
      const rand = Math.floor(Math.random() * 101);
      lastRandom.current = rand;
      setDisplay(rand);

      if (elapsed >= PHASE1_MS) {
        clearInterval(interval);

        // Phase 2: ease toward real value
        const phase2Start = performance.now();
        const PHASE2_MS = 1000;
        const startVal = lastRandom.current;

        const ease = (now: number) => {
          const progress = Math.min((now - phase2Start) / PHASE2_MS, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
          setDisplay(Math.round(startVal + (target - startVal) * eased));

          if (progress < 1) {
            requestAnimationFrame(ease);
          } else {
            setDisplay(target);
            setAnimating(false);
            markAnimationPlayed();
          }
        };

        requestAnimationFrame(ease);
      }
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [target]);

  return { display, animating };
}

// ── Component ──────────────────────────────────────────────────────────────
export default function ScoreCard({ score, label, date, reasoning, state }: ScoreCardProps) {
  const { display: displayScore, animating } = useSlotMachineScore(score);

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
  const scorePercent = displayScore ?? 0;

  return (
    <div className={`rounded-2xl border ${theme.border} ${theme.bg} overflow-hidden`}>
      {/* Top score panel */}
      <div className="px-8 pt-8 pb-6 text-center">
        <p className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-3">
          Business Funding Climate Score
        </p>

        {/* Score number with slot-machine effect */}
        <div
          className={`text-9xl font-black leading-none transition-colors duration-300 ${
            animating ? "text-slate-400 tabular-nums" : theme.score
          }`}
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {displayScore !== null ? displayScore : (
            <span className="inline-block w-32 h-24 bg-slate-200 rounded-xl animate-pulse" />
          )}
        </div>

        {/* Animating hint */}
        {animating && (
          <p className="text-[11px] text-slate-400 font-medium tracking-widest uppercase mt-2 animate-pulse">
            Calculating today&apos;s score…
          </p>
        )}

        <div className="mt-4 flex items-center justify-center gap-3">
          {label && !animating && (
            <span className={`px-4 py-1 rounded-full border text-sm font-bold ${theme.badge}`}>
              {label}
            </span>
          )}
          {date && !animating && (
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
          {/* Marker — slides with the animated score */}
          <div
            className="absolute top-0 w-1 h-3 bg-slate-900 rounded-full -translate-x-1/2 transition-[left] duration-75"
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
      {reasoning.length > 0 && !animating && (
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

      {/* Reasoning placeholder while animating */}
      {reasoning.length > 0 && animating && (
        <div className="bg-white border-t border-slate-100 px-8 py-6">
          <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4">
            Key Drivers
          </p>
          <div className="space-y-3">
            {reasoning.map((_, i) => (
              <div key={i} className="flex gap-3 items-center">
                <span className="w-2 h-2 rounded-full flex-shrink-0 bg-slate-200" />
                <div className="h-3 bg-slate-100 rounded animate-pulse flex-1" style={{ width: `${70 + (i * 13) % 25}%` }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
