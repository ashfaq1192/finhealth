export const runtime = "edge";

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | US Business Funding Climate Score",
  description:
    "The economist and AI engineer behind the US Business Funding Climate Score — a free daily tool that makes Federal Reserve data actionable for US small business owners.",
  alternates: {
    canonical: "/about",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE: Replace YOUR_LINKEDIN_PROFILE_URL with your real LinkedIn URL
// e.g. "https://www.linkedin.com/in/your-name"
// ─────────────────────────────────────────────────────────────────────────────
const AUTHOR_NAME = "M. Ashfaq";
const AUTHOR_TITLE = "M.Phil Economics";
const AUTHOR_EMAIL = "info@usfundingclimate.com";
const LINKEDIN_URL = "YOUR_LINKEDIN_PROFILE_URL";
// ─────────────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-400 mb-8 flex items-center gap-1.5">
        <Link href="/" className="hover:text-slate-600">Home</Link>
        <span>›</span>
        <span>About</span>
      </nav>

      {/* Hero */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-6">
        <p className="text-xs font-bold tracking-widest text-blue-500 uppercase mb-3">
          About the Founder
        </p>
        <h1 className="text-3xl font-bold text-slate-900 mb-1">{AUTHOR_NAME}</h1>
        <p className="text-base text-slate-500 font-medium mb-6">
          {AUTHOR_TITLE} · Economist &amp; Digital Product Developer
        </p>
        <div className="space-y-4 text-slate-700 leading-relaxed text-sm">
          <p>
            {AUTHOR_NAME} is an Economist and Digital Product Developer with graduate-level
            training in quantitative economic research. His M.Phil in Economics built deep
            competency in applied econometrics — studying how capital expenditure decisions
            respond to policy changes, interest rate signals, and market conditions. That same
            analytical framework now underpins how this site interprets Federal Reserve data
            and translates it into plain-English lending signals for US small business owners.
          </p>
          <p>
            The problem {AUTHOR_NAME} set out to solve is specific: the Federal Reserve publishes
            some of the most important economic data in the world — prime rate movements, C&amp;I
            lending standards, Treasury yield spreads, jobless claims — but none of it is designed
            to be read by a trucking operator worried about invoice factoring costs, or a retail
            shop owner trying to decide whether to apply for a line of credit this quarter.
            Professional analysts at large financial institutions synthesize this data every day
            and charge accordingly. Small businesses have had no equivalent resource — until now.
          </p>
          <p>
            The US Business Funding Climate Score runs every morning at 9 AM EST, pulling the
            six FRED indicators most directly tied to small business credit access, computing a
            deterministic 0&ndash;100 score using a formula designed by a trained economist, and
            publishing both the score and a plain-English explanation of the mechanisms driving it.
            The goal is not to replace a lender or financial advisor. The goal is to give every
            Main Street business owner the same situational awareness that their bank&apos;s
            risk team has — free, daily, and without jargon.
          </p>
          <p>
            {AUTHOR_NAME} holds a Bachelor of Commerce (B.Com) and an M.Phil in Economics.
            His graduate research focused on the quantitative relationship between public investment
            policy and capital market responses — a body of work that requires the same skills
            this project demands: identifying which indicators matter, understanding the transmission
            mechanism between macroeconomic signals and real-world outcomes, and communicating
            complex data clearly to non-specialist audiences.
          </p>
          <p>
            Beyond the economics, {AUTHOR_NAME} builds and operates the full technical stack
            himself: the Python data pipeline, the CrewAI multi-agent analysis system, the
            Next.js frontend, the Supabase database, and the GitHub Actions automation that
            keeps everything running daily. The site has zero operational cost beyond the domain
            — built to be sustainable at any traffic level.
          </p>
        </div>
        {LINKEDIN_URL !== "YOUR_LINKEDIN_PROFILE_URL" && (
          <div className="mt-5 pt-5 border-t border-slate-100">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              View LinkedIn Profile
            </a>
          </div>
        )}
      </div>

      {/* Mission statement */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 mb-6">
        <p className="text-xs font-bold tracking-widest text-blue-500 uppercase mb-4">
          Our Mission
        </p>
        <blockquote className="text-lg font-medium text-slate-800 leading-relaxed border-l-4 border-blue-400 pl-5">
          &ldquo;To bridge the gap between complex macroeconomic data and the daily reality of US
          small business owners — so that a local retailer, trucking operator, or staffing agency
          owner can understand whether today is a good day to seek funding, without needing a
          finance degree.&rdquo;
        </blockquote>
      </div>

      {/* Technical edge */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-6">
        <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-5">
          How We Build It
        </p>
        <div className="space-y-5">
          <div className="flex gap-4">
            <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm font-bold">1</span>
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">Federal Reserve Data (FRED)</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">Every score is built exclusively on public data from the St. Louis Federal Reserve Economic Database — the same source used by professional economists and Fed researchers. No proprietary data, no guesswork.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-purple-600 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm font-bold">2</span>
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">Agentic AI Analysis</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">We use a proprietary multi-agent AI pipeline (CrewAI + Groq) to analyze six real-time economic indicators and synthesize them into a single, actionable 0–100 score with plain-English explanations.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-green-600 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm font-bold">3</span>
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">Economist-Validated Methodology</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">The scoring algorithm was designed by a trained economist — not a programmer guessing at weights. Each indicator&apos;s contribution reflects established monetary transmission theory. See our Methodology page for the exact formula.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-orange-500 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm font-bold">4</span>
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">Daily Frequency</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">Traditional lending analysis is quarterly or monthly. Ours runs every morning, giving small business owners a current picture, not a three-month-old one.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Credentials */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-6">
        <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4">
          Education &amp; Credentials
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-4 bg-slate-50 rounded-xl p-4">
            <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">M</span>
            </div>
            <div>
              <p className="font-bold text-slate-800">M.Phil in Economics</p>
              <p className="text-sm text-slate-500 mt-0.5">Graduate-level quantitative research · Applied econometrics · Policy &amp; capital market analysis</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-slate-50 rounded-xl p-4">
            <div className="bg-green-600 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">B</span>
            </div>
            <div>
              <p className="font-bold text-slate-800">Bachelor of Commerce (B.Com)</p>
              <p className="text-sm text-slate-500 mt-0.5">Business finance · Accounting · Economic theory</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-slate-50 rounded-xl p-4">
            <div className="bg-purple-600 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">★</span>
            </div>
            <div>
              <p className="font-bold text-slate-800">Areas of Expertise</p>
              <p className="text-sm text-slate-500 mt-0.5">US monetary policy · Federal Reserve data (FRED) · Small business credit markets · SBA lending conditions · Macroeconomic indicator analysis · AI-driven financial intelligence</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { stat: "6", label: "FRED indicators tracked" },
          { stat: "Daily", label: "Score refresh cadence" },
          { stat: "Free", label: "Always, no account needed" },
        ].map(({ stat, label }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
            <div className="text-2xl font-black text-blue-600">{stat}</div>
            <div className="text-xs text-slate-500 mt-1 leading-tight">{label}</div>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-center">
        <p className="text-sm text-slate-600 mb-2">
          For media inquiries, data partnerships, or corrections:
        </p>
        <a
          href={`mailto:${AUTHOR_EMAIL}`}
          className="text-blue-600 font-semibold hover:underline text-sm"
        >
          {AUTHOR_EMAIL}
        </a>
        <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-center gap-6">
          <Link href="/methodology" className="text-xs text-slate-500 hover:text-slate-700 transition-colors">
            Our Methodology →
          </Link>
          <Link href="/legal" className="text-xs text-slate-500 hover:text-slate-700 transition-colors">
            Legal &amp; Disclosures →
          </Link>
        </div>
      </div>
    </div>
  );
}
