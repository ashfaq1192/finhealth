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
// UPDATE THESE — your real details for E-E-A-T compliance
// ─────────────────────────────────────────────────────────────────────────────
const AUTHOR_NAME = "M. Ashfaq";
const AUTHOR_TITLE = "M.Phil Economics";
const AUTHOR_EMAIL = "info@usfundingclimate.com";
const MPHIL_FOCUS = "South Asian Agriculture R&D Expenditures";
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
            {AUTHOR_NAME} is an Economist and Digital Product Developer specializing in automated
            financial intelligence. Holding an M.Phil in Economics with a focus in{" "}
            <strong className="text-slate-900">{MPHIL_FOCUS}</strong>, he combines a rigorous
            understanding of US monetary policy and credit markets with hands-on AI engineering.
          </p>
          <p>
            After observing the disconnect between rising US interest rates and the survival rates
            of small businesses — and recognizing that the Federal Reserve&apos;s own data is
            publicly available but rarely <em>accessible</em> — he built the US Business Funding
            Climate Score to change that.
          </p>
          <p>
            The goal is straightforward: give a Main Street retailer or owner-operator trucker the
            same data-driven picture of credit conditions that large corporations pay millions for,
            delivered free, every single day.
          </p>
        </div>
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
          {[
            {
              icon: "🏛️",
              title: "Federal Reserve Data (FRED)",
              desc: "Every score is built exclusively on public data from the St. Louis Federal Reserve Economic Database — the same source used by professional economists and Fed researchers. No proprietary data, no guesswork.",
            },
            {
              icon: "🤖",
              title: "Agentic AI Analysis",
              desc: "We use a proprietary multi-agent AI pipeline (CrewAI + Groq) to analyze six real-time economic indicators and synthesize them into a single, actionable 0–100 score with plain-English explanations.",
            },
            {
              icon: "📐",
              title: "Economist-Validated Methodology",
              desc: "The scoring algorithm was designed by a trained economist — not a programmer guessing at weights. Each indicator's contribution reflects established monetary transmission theory. See our Methodology page for the exact formula.",
            },
            {
              icon: "⚡",
              title: "Daily Frequency",
              desc: "Traditional lending analysis is quarterly or monthly. Ours runs every morning, giving small business owners a current picture, not a three-month-old one.",
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex gap-4">
              <span className="text-2xl mt-0.5 flex-shrink-0">{icon}</span>
              <div>
                <p className="font-semibold text-slate-800 text-sm">{title}</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Credentials */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-6">
        <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4">
          Education &amp; Credentials
        </p>
        <div className="space-y-4">
          <div className="flex items-start gap-4 bg-slate-50 rounded-xl p-4">
            <span className="text-xl mt-0.5">🎓</span>
            <div>
              <p className="font-bold text-slate-800">M.Phil in Economics</p>
              <p className="text-sm text-slate-500 mt-0.5">Specialization: {MPHIL_FOCUS}</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-slate-50 rounded-xl p-4">
            <span className="text-xl mt-0.5">🎓</span>
            <div>
              <p className="font-bold text-slate-800">Bachelor of Commerce (B.Com)</p>
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
