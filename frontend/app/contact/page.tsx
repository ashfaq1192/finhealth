export const runtime = "edge";

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact | US Business Funding Climate Score",
  description:
    "Get in touch with the US Business Funding Climate Score team for media inquiries, data corrections, advertising partnerships, or general questions.",
  alternates: {
    canonical: "/contact",
  },
};

const CONTACT_EMAIL = "info@usfundingclimate.com";

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-400 mb-8 flex items-center gap-1.5">
        <Link href="/" className="hover:text-slate-600">Home</Link>
        <span>›</span>
        <span>Contact</span>
      </nav>

      <div className="mb-8">
        <p className="text-xs font-bold tracking-widest text-blue-500 uppercase mb-3">Get in Touch</p>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Contact Us</h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          We read every message. Typical response time is 1–2 business days.
        </p>
      </div>

      {/* Contact reasons */}
      <div className="space-y-3 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex gap-4 hover:border-slate-300 transition-colors">
          <div className="bg-blue-600 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-sm font-bold">D</span>
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">Data Corrections</p>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">If you spot an error in our score, indicators, or economic analysis, please let us know. We take accuracy seriously and will investigate promptly.</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex gap-4 hover:border-slate-300 transition-colors">
          <div className="bg-purple-600 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-sm font-bold">M</span>
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">Media &amp; Press Inquiries</p>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">Journalists and bloggers covering US small business finance are welcome to cite our data or request a quote. We&apos;re happy to provide context on the indicators we track.</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex gap-4 hover:border-slate-300 transition-colors">
          <div className="bg-green-600 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-sm font-bold">P</span>
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">Advertising &amp; Partnerships</p>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">For advertising or data partnership inquiries, please include your company name and a brief description of what you have in mind.</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex gap-4 hover:border-slate-300 transition-colors">
          <div className="bg-slate-600 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-sm font-bold">Q</span>
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">General Questions</p>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">Questions about how the score works, how to interpret it, or anything else? We&apos;re glad to help.</p>
          </div>
        </div>
      </div>

      {/* Email CTA */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center">
        <p className="text-sm text-slate-600 mb-3">Send us an email at:</p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-xl font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
        >
          {CONTACT_EMAIL}
        </a>
        <p className="text-xs text-slate-400 mt-3">
          For data privacy or rights requests, please indicate that in your subject line.
          We respond to CCPA/GDPR requests within 30 days.
        </p>
      </div>

      {/* Footer links */}
      <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-center gap-6">
        <Link href="/about" className="text-xs text-slate-500 hover:text-slate-700 transition-colors">
          About the Founder →
        </Link>
        <Link href="/methodology" className="text-xs text-slate-500 hover:text-slate-700 transition-colors">
          Our Methodology →
        </Link>
        <Link href="/privacy-policy" className="text-xs text-slate-500 hover:text-slate-700 transition-colors">
          Privacy Policy →
        </Link>
        <Link href="/legal" className="text-xs text-slate-500 hover:text-slate-700 transition-colors">
          Legal &amp; Disclosures →
        </Link>
      </div>
    </div>
  );
}
