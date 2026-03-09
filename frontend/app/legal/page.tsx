export const runtime = "edge";

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Legal & Disclosures | US Business Funding Climate Score",
  description:
    "Financial disclaimer, affiliate disclosure, AI content policy, and privacy policy for the US Business Funding Climate Score.",
};

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE THESE before going live
// ─────────────────────────────────────────────────────────────────────────────
const SITE_NAME = "US Business Funding Climate Score";
const CONTACT_EMAIL = "ashfaqahmed1192@gmail.com";
const LAST_UPDATED = "March 2026";
// ─────────────────────────────────────────────────────────────────────────────

export default function LegalPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-400 mb-8 flex items-center gap-1.5">
        <Link href="/" className="hover:text-slate-600">Home</Link>
        <span>›</span>
        <span>Legal</span>
      </nav>

      <div className="mb-8">
        <p className="text-xs font-bold tracking-widest text-blue-500 uppercase mb-3">Legal</p>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Legal &amp; Disclosures</h1>
        <p className="text-xs text-slate-400">Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="space-y-6">
        {/* Financial Disclaimer — most important, first */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
          <p className="text-xs font-bold tracking-widest text-red-600 uppercase mb-3">
            Financial Disclaimer
          </p>
          <p className="text-sm text-slate-800 font-semibold mb-3">
            The {SITE_NAME} is for educational and informational purposes only. It does not
            constitute financial advice, investment advice, or any form of personalized financial
            recommendation.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed mb-3">
            The Funding Climate Score and all analysis published on this site describe general
            macroeconomic conditions. They do not account for your personal financial situation,
            credit history, business performance, specific industry dynamics, or individual funding
            needs.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            <strong>
              Always consult a licensed financial advisor, banker, or SBA-approved lender before
              making any borrowing or investment decision.
            </strong>{" "}
            Past economic conditions are not indicative of future lending availability or approval
            outcomes.
          </p>
        </div>

        {/* Affiliate Disclosure */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-3">
            Advertising &amp; Affiliate Disclosure
          </p>
          <p className="text-sm text-slate-700 leading-relaxed mb-3">
            This site displays Google AdSense advertisements and may in the future contain
            affiliate links to third-party financial products and services. If you click on an
            affiliate link and subsequently make a purchase or sign up for a service, we may earn
            a commission at no additional cost to you.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Affiliate relationships do not influence our editorial content, data methodology, or
            the calculation of the Funding Climate Score. We only reference products or services
            that we believe may be relevant to our audience. All paid advertisements are clearly
            labeled as such and are served by Google.
          </p>
        </div>

        {/* Data Sources */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-3">
            Data Sources &amp; Accuracy
          </p>
          <p className="text-sm text-slate-700 leading-relaxed mb-3">
            Economic data used to calculate the Funding Climate Score is sourced from the Federal
            Reserve Economic Database (FRED) operated by the Federal Reserve Bank of St. Louis,
            and the US Department of Labor. While we take steps to ensure data accuracy, we make
            no guarantees that the data is error-free or that it represents the most current
            release for all series at the time of reading.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Some indicators (specifically C&amp;I Lending Standards) are released quarterly and
            may lag by 1–3 months. See our{" "}
            <Link href="/methodology" className="text-blue-600 hover:underline">
              Methodology page
            </Link>{" "}
            for exact FRED series IDs and update frequencies.
          </p>
        </div>

        {/* AI Disclosure */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-3">
            AI-Generated Content Disclosure
          </p>
          <p className="text-sm text-slate-700 leading-relaxed mb-3">
            The written analysis and blog posts on this site are produced with the assistance of
            artificial intelligence language models (CrewAI multi-agent framework, Groq inference
            API). All AI-generated content is fact-checked against the underlying FRED economic
            data before publication.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            The Funding Climate Score itself is calculated by a deterministic, rule-based
            algorithm with no AI involvement — the AI is used only to generate the explanatory
            written analysis around the score. The scoring formula is fully documented on our{" "}
            <Link href="/methodology" className="text-blue-600 hover:underline">
              Methodology page
            </Link>
            .
          </p>
        </div>

        {/* Privacy Policy */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4">
            Privacy Policy
          </p>
          <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
            <div>
              <p className="font-semibold text-slate-800 mb-1">Information We Collect</p>
              <p>
                This site does not require account registration. If you subscribe to our daily
                email digest, we collect your email address solely for that purpose. You may
                unsubscribe at any time via the link in any email. We also use Google Analytics
                and Google AdSense, which may collect anonymized usage data including IP
                addresses, browser type, pages visited, and referring URLs for analytics and
                advertising purposes.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-800 mb-1">Cookies</p>
              <p>
                This site uses cookies placed by Google AdSense and Google Analytics for
                advertising measurement and site analytics. You can opt out of personalized
                advertising at{" "}
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google&apos;s Ad Settings
                </a>
                .
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-800 mb-1">Third-Party Services</p>
              <p>
                We use Supabase (database hosting), Cloudflare (CDN and hosting), Google AdSense
                (advertising), and Groq (AI inference). Each service has its own privacy policy
                governing data they independently process.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-800 mb-1">Data Retention</p>
              <p>
                We do not store visitor data beyond what is retained by the third-party analytics
                and advertising services described above. We do not sell personal data to any
                third party.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-800 mb-1">CCPA / GDPR Rights</p>
              <p>
                If you are a California resident or EU/EEA citizen and wish to exercise your data
                rights (access, deletion, correction, or opt-out of sale), please contact us via
                the email address below. We will respond within 30 days.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-800 mb-1">Children&apos;s Privacy</p>
              <p>
                This site is not directed at children under the age of 13 and does not knowingly
                collect personal data from children. If you believe a child has submitted personal
                information to us, please contact us immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-center">
          <p className="text-sm text-slate-600 mb-2">
            Questions about these policies or our data practices?
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-blue-600 font-semibold hover:underline text-sm"
          >
            {CONTACT_EMAIL}
          </a>
          <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-center gap-6">
            <Link href="/about" className="text-xs text-slate-500 hover:text-slate-700 transition-colors">
              About →
            </Link>
            <Link href="/methodology" className="text-xs text-slate-500 hover:text-slate-700 transition-colors">
              Methodology →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
