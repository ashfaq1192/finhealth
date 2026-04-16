export const runtime = "edge";

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | US Business Funding Climate Score",
  description:
    "Terms and conditions for using usfundingclimate.com — including permitted use, intellectual property, disclaimers of liability, and governing law.",
  alternates: {
    canonical: "/terms",
  },
};

const SITE_NAME = "US Business Funding Climate Score";
const SITE_URL = "usfundingclimate.com";
const CONTACT_EMAIL = "info@usfundingclimate.com";
const LAST_UPDATED = "April 2026";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-400 mb-8 flex items-center gap-1.5">
        <Link href="/" className="hover:text-slate-600">Home</Link>
        <span>›</span>
        <span>Terms &amp; Conditions</span>
      </nav>

      <div className="mb-8">
        <p className="text-xs font-bold tracking-widest text-blue-500 uppercase mb-3">Legal</p>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Terms &amp; Conditions</h1>
        <p className="text-xs text-slate-400">Last updated: {LAST_UPDATED}</p>
        <p className="text-sm text-slate-600 mt-3 leading-relaxed">
          Please read these Terms and Conditions carefully before using{" "}
          <strong>{SITE_URL}</strong>. By accessing or using this website, you agree to be
          bound by these terms. If you do not agree, please do not use this site.
        </p>
      </div>

      <div className="space-y-5">

        <section className="bg-white rounded-2xl border border-slate-200 p-7">
          <h2 className="text-base font-bold text-slate-900 mb-3">1. About This Service</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            <strong>{SITE_NAME}</strong> (the &ldquo;Service&rdquo;) is a free, publicly
            accessible financial data and analysis tool operated at {SITE_URL}. The Service
            provides a daily composite score (0&ndash;100) reflecting general US macroeconomic
            conditions as they relate to small business credit access, derived from publicly
            available Federal Reserve Economic Database (FRED) data. The Service is provided
            for <strong>educational and informational purposes only.</strong>
          </p>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-7">
          <h2 className="text-base font-bold text-slate-900 mb-3">2. Not Financial Advice</h2>
          <p className="text-sm text-slate-700 leading-relaxed mb-3">
            Nothing on this website constitutes financial advice, investment advice, legal
            advice, or any other form of professional advice. The Funding Climate Score and
            all written analysis describe general macroeconomic conditions only. They do not
            account for your personal financial situation, business performance, creditworthiness,
            or individual funding needs.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            <strong>
              Always consult a licensed financial advisor, banker, or SBA-approved lender before
              making any borrowing, investment, or financial decision.
            </strong>{" "}
            We are not a bank, broker-dealer, investment advisor, or financial institution of
            any kind.
          </p>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-7">
          <h2 className="text-base font-bold text-slate-900 mb-3">3. Permitted Use</h2>
          <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
            <p>You may access and use this website for personal, non-commercial informational purposes. You may:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>View and read the content published on this site</li>
              <li>Share links to individual pages of this site</li>
              <li>Subscribe to our email digest for personal use</li>
              <li>Quote brief excerpts of our content with appropriate attribution and a link back to the original page</li>
            </ul>
            <p>You may <strong>not</strong>:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Reproduce, republish, or redistribute substantial portions of our content without written permission</li>
              <li>Use automated tools (scrapers, bots, crawlers) to harvest content or data from this site in bulk</li>
              <li>Use any content from this site to build a competing service without written permission</li>
              <li>Remove or obscure any copyright, trademark, or attribution notices</li>
              <li>Use this site in any way that violates applicable law or regulation</li>
            </ul>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-7">
          <h2 className="text-base font-bold text-slate-900 mb-3">4. Intellectual Property</h2>
          <p className="text-sm text-slate-700 leading-relaxed mb-3">
            All original content on this site &mdash; including but not limited to the scoring
            methodology, written analysis, blog posts, graphics, and site design &mdash; is the
            intellectual property of {SITE_NAME} and is protected by applicable copyright law.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Economic data sourced from the Federal Reserve Economic Database (FRED) is in the
            public domain. Attribution to the Federal Reserve Bank of St. Louis is included
            where applicable.
          </p>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-7">
          <h2 className="text-base font-bold text-slate-900 mb-3">5. Disclaimer of Warranties</h2>
          <p className="text-sm text-slate-700 leading-relaxed mb-3">
            This website and its content are provided on an &ldquo;as is&rdquo; and
            &ldquo;as available&rdquo; basis without warranties of any kind, either express or
            implied. We do not warrant that:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-700 leading-relaxed">
            <li>The site will be uninterrupted, error-free, or free of viruses or other harmful components</li>
            <li>The economic data displayed is current, complete, or accurate at all times</li>
            <li>The Funding Climate Score will accurately predict lending availability for any specific business</li>
            <li>The written analysis is free from errors or omissions</li>
          </ul>
          <p className="text-sm text-slate-700 leading-relaxed mt-3">
            Some FRED data series (specifically C&amp;I Lending Standards) are released quarterly
            and may be 1&ndash;3 months behind the current date. See our{" "}
            <Link href="/methodology" className="text-blue-600 hover:underline">
              Methodology page
            </Link>{" "}
            for full details on data lag.
          </p>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-7">
          <h2 className="text-base font-bold text-slate-900 mb-3">6. Limitation of Liability</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            To the fullest extent permitted by applicable law, {SITE_NAME} and its operators
            shall not be liable for any direct, indirect, incidental, consequential, special, or
            punitive damages arising from your use of, or inability to use, this website or its
            content &mdash; including but not limited to losses resulting from reliance on
            information published here in connection with any borrowing, investment, or business
            decision. Your use of this site is entirely at your own risk.
          </p>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-7">
          <h2 className="text-base font-bold text-slate-900 mb-3">7. Third-Party Links and Advertising</h2>
          <p className="text-sm text-slate-700 leading-relaxed mb-3">
            This site displays advertisements served by Google AdSense and may contain links to
            third-party websites. We do not control, endorse, or accept responsibility for the
            content, privacy practices, or accuracy of any third-party site. Clicking a
            third-party link is done at your own risk.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Advertising relationships do not influence the Funding Climate Score calculation or
            the editorial independence of our analysis.
          </p>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-7">
          <h2 className="text-base font-bold text-slate-900 mb-3">8. AI-Generated Content</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Written analysis and blog posts on this site are produced with the assistance of
            artificial intelligence language models. While we fact-check all AI-generated content
            against underlying FRED economic data before publication, AI-generated text may
            contain errors or omissions. The Funding Climate Score itself is calculated by a
            deterministic, rule-based algorithm with no AI involvement. See our{" "}
            <Link href="/methodology" className="text-blue-600 hover:underline">
              Methodology page
            </Link>{" "}
            and{" "}
            <Link href="/legal" className="text-blue-600 hover:underline">
              Legal &amp; Disclosures
            </Link>{" "}
            for full transparency.
          </p>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-7">
          <h2 className="text-base font-bold text-slate-900 mb-3">9. Privacy</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Your use of this site is also governed by our{" "}
            <Link href="/privacy-policy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            , which is incorporated into these Terms by reference.
          </p>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-7">
          <h2 className="text-base font-bold text-slate-900 mb-3">10. Changes to These Terms</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            We reserve the right to modify these Terms at any time. When we do, we will update
            the &ldquo;Last updated&rdquo; date at the top of this page. Continued use of the
            site after any changes constitutes acceptance of the updated Terms.
          </p>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-7">
          <h2 className="text-base font-bold text-slate-900 mb-3">11. Governing Law</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            These Terms are governed by the laws of the United States. Any disputes arising
            from your use of this site shall be resolved under applicable US federal and
            state law.
          </p>
        </section>

        {/* Contact */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-center">
          <p className="text-sm text-slate-600 mb-2">Questions about these terms?</p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-blue-600 font-semibold hover:underline text-sm"
          >
            {CONTACT_EMAIL}
          </a>
          <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-center gap-6">
            <Link href="/privacy-policy" className="text-xs text-slate-500 hover:text-slate-700 transition-colors">
              Privacy Policy →
            </Link>
            <Link href="/legal" className="text-xs text-slate-500 hover:text-slate-700 transition-colors">
              Legal &amp; Disclosures →
            </Link>
            <Link href="/contact" className="text-xs text-slate-500 hover:text-slate-700 transition-colors">
              Contact Us →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
