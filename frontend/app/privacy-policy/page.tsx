export const runtime = "edge";

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | US Business Funding Climate Score",
  description:
    "Privacy policy for usfundingclimate.com — how we collect, use, and protect your data, including our use of Google AdSense, Google Analytics, and email subscriptions.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

const CONTACT_EMAIL = "info@usfundingclimate.com";
const LAST_UPDATED = "April 2026";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-400 mb-8 flex items-center gap-1.5">
        <Link href="/" className="hover:text-slate-600">Home</Link>
        <span>›</span>
        <span>Privacy Policy</span>
      </nav>

      <div className="mb-8">
        <p className="text-xs font-bold tracking-widest text-blue-500 uppercase mb-3">Legal</p>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-xs text-slate-400">Last updated: {LAST_UPDATED}</p>
        <p className="text-sm text-slate-600 mt-3 leading-relaxed">
          This Privacy Policy describes how <strong>US Business Funding Climate Score</strong>{" "}
          (operated at <strong>usfundingclimate.com</strong>) collects, uses, and protects
          information when you visit our website. By using this site, you agree to the practices
          described below.
        </p>
      </div>

      <div className="space-y-5">

        {/* Information We Collect */}
        <section className="bg-white rounded-2xl border border-slate-200 p-7">
          <h2 className="text-base font-bold text-slate-900 mb-4">1. Information We Collect</h2>
          <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
            <div>
              <p className="font-semibold text-slate-800 mb-1">Information you provide</p>
              <p>
                This site does not require account registration. If you subscribe to our free daily
                email digest, we collect only your email address for that purpose. You may
                unsubscribe at any time using the link in any email we send.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-800 mb-1">Information collected automatically</p>
              <p>
                When you visit usfundingclimate.com, standard server logs and third-party analytics
                tools may automatically collect information such as your IP address, browser type
                and version, pages visited, time spent on pages, and the referring URL. This data
                is used in aggregate form to understand how our site is used and to improve it.
              </p>
            </div>
          </div>
        </section>

        {/* Cookies */}
        <section className="bg-white rounded-2xl border border-slate-200 p-7">
          <h2 className="text-base font-bold text-slate-900 mb-4">2. Cookies</h2>
          <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
            <p>
              This site uses cookies placed by the following third-party services:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Google AdSense</strong> — serves contextual advertisements and uses cookies
                to show relevant ads based on your browsing history. Google may use this data per
                its own{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Privacy Policy
                </a>
                .
              </li>
              <li>
                <strong>Google Analytics</strong> — collects anonymized usage statistics to help
                us understand site traffic and user behavior.
              </li>
            </ul>
            <p>
              You can opt out of personalized advertising at any time via{" "}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google&apos;s Ad Settings
              </a>
              . You can also opt out of Google Analytics tracking by installing the{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google Analytics Opt-out Browser Add-on
              </a>
              .
            </p>
          </div>
        </section>

        {/* How We Use Information */}
        <section className="bg-white rounded-2xl border border-slate-200 p-7">
          <h2 className="text-base font-bold text-slate-900 mb-4">3. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 leading-relaxed">
            <li>To send you the daily email digest you subscribed to (email address only)</li>
            <li>To analyze site usage and improve our content and user experience</li>
            <li>To serve contextual advertisements via Google AdSense</li>
            <li>To respond to your messages if you contact us directly</li>
          </ul>
          <p className="text-sm text-slate-700 leading-relaxed mt-4">
            We do not use your personal information for automated decision-making or profiling.
            We do not sell, rent, or share your personal information with third parties for their
            own marketing purposes.
          </p>
        </section>

        {/* Third-Party Services */}
        <section className="bg-white rounded-2xl border border-slate-200 p-7">
          <h2 className="text-base font-bold text-slate-900 mb-4">4. Third-Party Services</h2>
          <p className="text-sm text-slate-700 leading-relaxed mb-4">
            This site integrates with the following third-party services, each governed by its own
            privacy policy:
          </p>
          <div className="space-y-3">
            {[
              { name: "Google AdSense & Analytics", url: "https://policies.google.com/privacy", desc: "Advertising and analytics" },
              { name: "Supabase", url: "https://supabase.com/privacy", desc: "Database hosting" },
              { name: "Cloudflare", url: "https://www.cloudflare.com/privacypolicy/", desc: "CDN and site hosting" },
              { name: "Resend", url: "https://resend.com/privacy", desc: "Email delivery" },
              { name: "Groq", url: "https://groq.com/privacy-policy/", desc: "AI inference for content generation" },
            ].map(({ name, url, desc }) => (
              <div key={name} className="flex items-start gap-3 bg-slate-50 rounded-xl p-3">
                <div className="min-w-0">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-blue-600 hover:underline"
                  >
                    {name}
                  </a>
                  <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Data Retention */}
        <section className="bg-white rounded-2xl border border-slate-200 p-7">
          <h2 className="text-base font-bold text-slate-900 mb-4">5. Data Retention</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            We retain email subscriber data for as long as you remain subscribed. Upon
            unsubscribing, your email address is removed from our mailing list within 30 days.
            We do not store any other personal data beyond what is retained by the third-party
            services listed above.
          </p>
        </section>

        {/* Your Rights */}
        <section className="bg-white rounded-2xl border border-slate-200 p-7">
          <h2 className="text-base font-bold text-slate-900 mb-4">6. Your Rights (CCPA / GDPR)</h2>
          <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
            <p>
              If you are a California resident (CCPA) or a resident of the EU/EEA (GDPR), you have
              the right to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Request access to the personal data we hold about you</li>
              <li>Request correction of inaccurate personal data</li>
              <li>Request deletion of your personal data</li>
              <li>Opt out of the sale of personal data (we do not sell personal data)</li>
              <li>Lodge a complaint with your relevant supervisory authority</li>
            </ul>
            <p>
              To exercise any of these rights, contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-600 hover:underline">
                {CONTACT_EMAIL}
              </a>{" "}
              with the subject line "Privacy Request." We will respond within 30 days.
            </p>
          </div>
        </section>

        {/* Children */}
        <section className="bg-white rounded-2xl border border-slate-200 p-7">
          <h2 className="text-base font-bold text-slate-900 mb-4">7. Children&apos;s Privacy</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            This site is not directed at children under the age of 13 and does not knowingly
            collect personal information from children. If you believe a child has provided
            personal information to us, please contact us immediately and we will take steps to
            remove it.
          </p>
        </section>

        {/* Changes */}
        <section className="bg-white rounded-2xl border border-slate-200 p-7">
          <h2 className="text-base font-bold text-slate-900 mb-4">8. Changes to This Policy</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            We may update this Privacy Policy from time to time. When we do, we will update the
            "Last updated" date at the top of this page. Continued use of the site after any
            changes constitutes your acceptance of the updated policy.
          </p>
        </section>

        {/* Contact */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-center">
          <p className="text-sm text-slate-600 mb-2">
            Questions about this Privacy Policy?
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-blue-600 font-semibold hover:underline text-sm"
          >
            {CONTACT_EMAIL}
          </a>
          <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-center gap-6">
            <Link href="/contact" className="text-xs text-slate-500 hover:text-slate-700 transition-colors">
              Contact Us →
            </Link>
            <Link href="/legal" className="text-xs text-slate-500 hover:text-slate-700 transition-colors">
              Legal &amp; Disclosures →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
