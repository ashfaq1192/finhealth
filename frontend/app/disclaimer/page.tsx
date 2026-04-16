export const runtime = "edge";

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclaimer | US Business Funding Climate Score",
  description:
    "Important disclaimers for usfundingclimate.com — this site is for educational purposes only and does not constitute financial advice of any kind.",
  alternates: {
    canonical: "/disclaimer",
  },
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-400 mb-8 flex items-center gap-1.5">
        <Link href="/" className="hover:text-slate-600">Home</Link>
        <span>›</span>
        <span>Disclaimer</span>
      </nav>

      <div className="mb-8">
        <p className="text-xs font-bold tracking-widest text-blue-500 uppercase mb-3">Legal</p>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Disclaimer</h1>
        <p className="text-xs text-slate-400">Effective: April 2026</p>
      </div>

      <div className="space-y-5">

        {/* Primary disclaimer — most prominent */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
          <p className="text-xs font-bold tracking-widest text-red-600 uppercase mb-3">
            Not Financial Advice
          </p>
          <p className="text-sm text-slate-800 font-semibold leading-relaxed mb-3">
            The US Business Funding Climate Score and all content published on usfundingclimate.com
            is provided for <strong>educational and informational purposes only</strong>. It does not
            constitute financial advice, investment advice, credit advice, legal advice, or any other
            form of professional advice.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed mb-3">
            The Funding Climate Score is a composite indicator derived from publicly available
            Federal Reserve Economic Database (FRED) data. It describes general macroeconomic
            conditions and their typical relationship to small business lending. It does not reflect
            your personal financial situation, creditworthiness, business performance, specific
            industry dynamics, or individual funding needs.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            <strong>
              Always consult a licensed financial advisor, qualified banker, or SBA-approved lender
              before making any borrowing, investment, or business financing decision.
            </strong>{" "}
            A score on this site is not a loan approval, a credit recommendation, or a prediction
            of your individual outcome.
          </p>
        </div>

        {/* No guarantees */}
        <div className="bg-white rounded-2xl border border-slate-200 p-7">
          <h2 className="text-base font-bold text-slate-900 mb-3">Accuracy of Information</h2>
          <p className="text-sm text-slate-700 leading-relaxed mb-3">
            While we take reasonable steps to ensure accuracy, we make no representation or
            warranty — express or implied — that the information on this site is current, complete,
            or error-free. Economic conditions change rapidly, and some FRED data series used to
            calculate the score are released quarterly, meaning they may reflect conditions from
            1&ndash;3 months prior. See the{" "}
            <Link href="/methodology" className="text-blue-600 hover:underline">
              Methodology page
            </Link>{" "}
            for exact data update frequencies.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            We are not responsible for errors or omissions in the content, or for any actions taken
            in reliance on information provided on this site.
          </p>
        </div>

        {/* AI content */}
        <div className="bg-white rounded-2xl border border-slate-200 p-7">
          <h2 className="text-base font-bold text-slate-900 mb-3">AI-Generated Content</h2>
          <p className="text-sm text-slate-700 leading-relaxed mb-3">
            The written analysis and blog posts on this site are produced with the assistance of
            artificial intelligence language models. All AI-generated content is fact-checked
            against the underlying FRED economic data before publication. However, AI-generated
            text may contain errors, omissions, or interpretations that a human expert might render
            differently.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            The Funding Climate Score itself is calculated by a deterministic, rule-based algorithm
            with no AI involvement. See our{" "}
            <Link href="/methodology" className="text-blue-600 hover:underline">
              Methodology page
            </Link>{" "}
            for the full scoring formula.
          </p>
        </div>

        {/* Advertising */}
        <div className="bg-white rounded-2xl border border-slate-200 p-7">
          <h2 className="text-base font-bold text-slate-900 mb-3">Advertising Disclosure</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            This site displays advertisements served by Google AdSense. Advertising revenue helps
            us keep this service free. Advertisements are clearly labeled and are served
            automatically by Google based on page content and user signals. We do not control
            which specific ads appear. Advertising relationships do not influence our editorial
            content, data methodology, or the calculation of the Funding Climate Score.
          </p>
        </div>

        {/* Liability */}
        <div className="bg-white rounded-2xl border border-slate-200 p-7">
          <h2 className="text-base font-bold text-slate-900 mb-3">Limitation of Liability</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            To the fullest extent permitted by law, US Business Funding Climate Score and its
            operators shall not be liable for any loss or damage — including financial loss —
            arising directly or indirectly from reliance on any information published on this site.
            Your use of this site is entirely at your own risk.
          </p>
        </div>

        {/* Footer links */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-center">
          <p className="text-sm text-slate-600 mb-4">For full legal information, see:</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/legal" className="text-xs text-slate-500 hover:text-slate-700 transition-colors font-medium">
              Legal &amp; Disclosures →
            </Link>
            <Link href="/privacy-policy" className="text-xs text-slate-500 hover:text-slate-700 transition-colors font-medium">
              Privacy Policy →
            </Link>
            <Link href="/terms" className="text-xs text-slate-500 hover:text-slate-700 transition-colors font-medium">
              Terms &amp; Conditions →
            </Link>
            <Link href="/contact" className="text-xs text-slate-500 hover:text-slate-700 transition-colors font-medium">
              Contact Us →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
