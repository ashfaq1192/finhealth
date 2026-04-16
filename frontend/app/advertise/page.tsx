export const runtime = "edge";

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Advertise & Partner With Us | US Business Funding Climate Score",
  description:
    "Reach US small business owners actively researching financing. Media kit, advertising options, and affiliate partnership information for usfundingclimate.com.",
  alternates: { canonical: "/advertise" },
  robots: { index: true, follow: true },
};

const AUDIENCE_STATS = [
  { label: "Primary audience", value: "US small business owners", sub: "Actively researching funding options" },
  { label: "Content focus", value: "Business financing", sub: "SBA loans, factoring, MCAs, credit" },
  { label: "Data source", value: "Federal Reserve (FRED)", sub: "Live economic data, daily updates" },
  { label: "Content quality", value: "E-E-A-T compliant", sub: "M.Phil Economics author, cited data" },
];


const CONTENT_PILLARS = [
  { pillar: "SBA Loans", pages: ["/sba-loans", "/tools/loan-comparison"], audience: "Established businesses seeking low-cost capital" },
  { pillar: "Invoice Factoring", pages: ["/invoice-factoring", "/tools/invoice-factoring-calculator"], audience: "Trucking, staffing, and B2B businesses" },
  { pillar: "MCA & Alternative Lending", pages: ["/tools/mca-calculator"], audience: "Businesses needing fast funding" },
  { pillar: "Business Planning", pages: ["/tools/break-even-calculator", "/tools/cash-flow-runway"], audience: "Small businesses preparing for financing applications" },
  { pillar: "Daily Market Data", pages: ["/", "/blog"], audience: "Business owners tracking Fed/prime rate changes" },
];

export default function AdvertisePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-400 mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-slate-600">Home</Link>
        <span>›</span>
        <span>Advertise</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-bold tracking-widest text-blue-500 uppercase mb-2">Media Kit</p>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Reach Small Business Owners At the Moment of Decision</h1>
        <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
          usfundingclimate.com is a free resource for US small business owners researching financing options.
          Our audience arrives from search while actively comparing SBA loans, invoice factoring, and
          merchant cash advances — the highest buyer intent in business finance.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href="mailto:info@usfundingclimate.com?subject=Advertising%20Inquiry"
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Get in touch →
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:border-slate-400 transition-colors"
          >
            Contact form
          </Link>
        </div>
      </div>

      {/* Audience snapshot */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Audience &amp; Site Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {AUDIENCE_STATS.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
              <p className="text-sm font-bold text-slate-900 leading-tight">{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-snug">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why this audience */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white mb-10">
        <p className="text-xs font-bold tracking-widest text-blue-400 uppercase mb-2">Why this audience is valuable</p>
        <h2 className="text-base font-bold mb-3">Small business financing is the highest-CPC category in Google AdSense</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { stat: "$3–15", label: "Finance CPC vs $0.30 for lifestyle", tag: "CPC" },
            { stat: "High intent", label: "Visitors use calculators before applying for loans", tag: "→$" },
            { stat: "B2B decision makers", label: "Business owners, not consumers", tag: "B2B" },
          ].map((item) => (
            <div key={item.stat} className="bg-white/10 rounded-xl p-4">
              <div className="inline-block bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded mb-2">{item.tag}</div>
              <div className="text-lg font-bold text-white">{item.stat}</div>
              <div className="text-xs text-slate-300 leading-relaxed">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Advertising options */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-slate-900 mb-2">Advertising &amp; Partnership Options</h2>
        <p className="text-sm text-slate-500 mb-5">
          All placements are clearly labeled per FTC guidelines. We only work with partners whose products
          genuinely serve small business owners.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email Digest */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="bg-blue-600 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">E</span>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">Highest engagement</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-0.5">Email Digest Sponsorship</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-blue-600">$75–$200 per send</span>
              <span className="text-[10px] text-slate-400">3× per week</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">Sponsored placement in our daily funding climate digest. Sent to subscribers who opted in specifically for small business finance news. High open rates typical of niche finance newsletters.</p>
            <div className="bg-slate-50 rounded-lg px-3 py-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">Ideal for</p>
              <p className="text-xs text-slate-600">SBA lenders, factoring companies, business credit products</p>
            </div>
          </div>
          {/* Sponsored Content */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="bg-green-600 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">S</span>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700">Best for SEO</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-0.5">Sponsored Content</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-blue-600">$150–$500 per post</span>
              <span className="text-[10px] text-slate-400">Limited availability</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">Clearly labeled sponsored article published on the site. Written in our editorial style, covers a topic relevant to your product category. Includes a backlink and affiliate call-to-action.</p>
            <div className="bg-slate-50 rounded-lg px-3 py-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">Ideal for</p>
              <p className="text-xs text-slate-600">Fintech companies, lenders, financial services</p>
            </div>
          </div>
          {/* Tool Co-Branding */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="bg-purple-600 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">T</span>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">High intent traffic</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-0.5">Tool Co-Branding</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-blue-600">Custom pricing</span>
              <span className="text-[10px] text-slate-400">Per tool</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">Add your brand to one of our free calculators (invoice factoring, MCA, SBA loan payment). Your logo and a contextual CTA appear on every calculator result. These tools receive consistent organic search traffic.</p>
            <div className="bg-slate-50 rounded-lg px-3 py-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">Ideal for</p>
              <p className="text-xs text-slate-600">Factoring companies, SBA lenders seeking calculator traffic</p>
            </div>
          </div>
          {/* Affiliate Partnership */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="bg-orange-500 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-700">Performance-based</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-0.5">Affiliate Partnership</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-blue-600">Revenue share (CPL/CPS)</span>
              <span className="text-[10px] text-slate-400">Ongoing</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">We place contextual affiliate links on relevant tool pages and articles. You pay per qualified lead or funded loan. No upfront cost. Ideal for lenders with established affiliate programs.</p>
            <div className="bg-slate-50 rounded-lg px-3 py-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">Ideal for</p>
              <p className="text-xs text-slate-600">Lendio, National Business Capital, factoring providers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content pillars + pages */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-10">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-800">Content Coverage &amp; Placement Opportunities</h2>
          <p className="text-xs text-slate-400 mt-0.5">High-intent pages where contextual placements perform best</p>
        </div>
        <div className="divide-y divide-slate-50">
          {CONTENT_PILLARS.map((row) => (
            <div key={row.pillar} className="px-5 py-3 flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-800">{row.pillar}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{row.audience}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {row.pages.map((page) => (
                  <Link
                    key={page}
                    href={page}
                    className="text-[10px] bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    {page}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editorial policy */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-10">
        <h2 className="text-sm font-bold text-amber-900 mb-2">Editorial Policy &amp; Disclosures</h2>
        <ul className="space-y-1.5 text-xs text-amber-800 leading-relaxed">
          <li>• Sponsored content is clearly labeled &quot;Sponsored&quot; or &quot;Partner Post&quot; on every page</li>
          <li>• Affiliate links include <code className="bg-amber-100 px-1 rounded">rel=&quot;sponsored&quot;</code> per Google&apos;s link attribute guidelines</li>
          <li>• We do not write fake reviews or make specific lender recommendations without disclosure</li>
          <li>• All financial data cited is sourced from the Federal Reserve FRED database</li>
          <li>• Advertorial content is subject to our editorial review — we reserve the right to decline any placement</li>
        </ul>
      </div>

      {/* CTA */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
        <h2 className="text-base font-bold text-slate-900 mb-2">Ready to reach small business owners?</h2>
        <p className="text-sm text-slate-500 mb-5 max-w-md mx-auto">
          Email us with your company name, product category, and the audience size you&apos;re targeting.
          We&apos;ll respond within 2 business days.
        </p>
        <a
          href="mailto:info@usfundingclimate.com?subject=Advertising%20Inquiry%20—%20usfundingclimate.com"
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Email info@usfundingclimate.com →
        </a>
        <p className="text-xs text-slate-400 mt-3">Or use the <Link href="/contact" className="underline hover:text-slate-600">contact form</Link></p>
      </div>
    </div>
  );
}
