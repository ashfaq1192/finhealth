"use client";

import { useEffect, useState } from "react";
import { markAnimationPlayed } from "./ScoreCard";

// ── Session check (shares key with ScoreCard so all stats sync) ────────────
const ANIM_KEY = "fh_score_anim_v1";
const REPLAY_MS = 30 * 60 * 1000;

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

// ── Hook: simple count-up for decimal numbers ─────────────────────────────
function useCountUp(target: number | null, decimals = 1, delayMs = 400) {
  const [display, setDisplay] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (target === null) {
      setDisplay(null);
      setDone(true);
      return;
    }

    if (!shouldPlayAnimation()) {
      setDisplay(target);
      setDone(true);
      return;
    }

    const DURATION_MS = 1400;

    const timer = setTimeout(() => {
      const startTime = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / DURATION_MS, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = parseFloat((target * eased).toFixed(decimals));
        setDisplay(value);

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          setDisplay(target);
          setDone(true);
          markAnimationPlayed();
        }
      };

      requestAnimationFrame(tick);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [target, decimals, delayMs]);

  return { display, done };
}

// ── Props ──────────────────────────────────────────────────────────────────
interface ContextStatsPanelProps {
  cpi_yoy: number | null | undefined;
  nfib_optimism: number | null | undefined;
}

export default function ContextStatsPanel({ cpi_yoy, nfib_optimism }: ContextStatsPanelProps) {
  const { display: cpiDisplay, done: cpiDone } = useCountUp(cpi_yoy ?? null, 1, 500);
  const { display: nfibDisplay, done: nfibDone } = useCountUp(nfib_optimism ?? null, 1, 600);

  if (cpi_yoy == null && nfib_optimism == null) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
      {/* CPI */}
      {cpi_yoy != null ? (
        <div
          className={`rounded-2xl border p-4 transition-colors duration-500 ${
            !cpiDone
              ? "bg-slate-50 border-slate-200"
              : cpi_yoy > 4
              ? "bg-red-50 border-red-200"
              : cpi_yoy > 2
              ? "bg-amber-50 border-amber-200"
              : "bg-green-50 border-green-200"
          }`}
        >
          <p className="text-[10px] font-bold tracking-widest uppercase opacity-60 mb-2">
            US Inflation (CPI)
          </p>
          <div
            className={`text-3xl font-black leading-none mb-1 tabular-nums transition-colors duration-500 ${
              !cpiDone
                ? "text-slate-400"
                : cpi_yoy > 4
                ? "text-red-700"
                : cpi_yoy > 2
                ? "text-amber-700"
                : "text-green-700"
            }`}
          >
            {cpiDisplay !== null ? `${cpiDisplay.toFixed(1)}%` : (
              <span className="inline-block w-16 h-8 bg-slate-200 rounded animate-pulse" />
            )}
          </div>
          <div className="text-sm font-semibold">Year-over-Year</div>
          {cpiDone && (
            <div className="text-xs opacity-60 mt-1">
              Fed target: 2.0% ·{" "}
              {cpi_yoy > 4
                ? "Well above target — rates stay elevated"
                : cpi_yoy > 2
                ? "Above target — Fed remains cautious"
                : "Near target — easing conditions possible"}
            </div>
          )}
          {!cpiDone && (
            <div className="text-xs opacity-40 mt-1 animate-pulse">Fetching live data…</div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-[10px] font-bold tracking-widest uppercase text-slate-300 mb-2">US Inflation (CPI)</p>
          <p className="text-xs text-slate-400">Fetched daily from FRED · updates with next pipeline run</p>
        </div>
      )}

      {/* NFIB */}
      {nfib_optimism != null ? (
        <div
          className={`rounded-2xl border p-4 transition-colors duration-500 ${
            !nfibDone
              ? "bg-slate-50 border-slate-200"
              : nfib_optimism < 90
              ? "bg-red-50 border-red-200"
              : nfib_optimism < 98
              ? "bg-amber-50 border-amber-200"
              : "bg-green-50 border-green-200"
          }`}
        >
          <p className="text-[10px] font-bold tracking-widest uppercase opacity-60 mb-2">
            NFIB Small Biz Optimism
          </p>
          <div
            className={`text-3xl font-black leading-none mb-1 tabular-nums transition-colors duration-500 ${
              !nfibDone
                ? "text-slate-400"
                : nfib_optimism < 90
                ? "text-red-700"
                : nfib_optimism < 98
                ? "text-amber-700"
                : "text-green-700"
            }`}
          >
            {nfibDisplay !== null ? nfibDisplay.toFixed(1) : (
              <span className="inline-block w-16 h-8 bg-slate-200 rounded animate-pulse" />
            )}
          </div>
          <div className="text-sm font-semibold">Monthly Survey</div>
          {nfibDone && (
            <div className="text-xs opacity-60 mt-1">
              Neutral baseline: 98 ·{" "}
              {nfib_optimism < 90
                ? "Owners are pessimistic"
                : nfib_optimism < 98
                ? "Below average confidence"
                : "Owners are optimistic"}
            </div>
          )}
          {!nfibDone && (
            <div className="text-xs opacity-40 mt-1 animate-pulse">Fetching live data…</div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-[10px] font-bold tracking-widest uppercase text-slate-300 mb-2">NFIB Small Biz Optimism</p>
          <p className="text-xs text-slate-400">Monthly survey · updates when FRED releases new data</p>
        </div>
      )}
    </div>
  );
}
