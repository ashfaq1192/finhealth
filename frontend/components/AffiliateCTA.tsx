"use client";

import Link from "next/link";

type Variant = "factoring" | "sba" | "mca" | "general";

interface Props {
  variant: Variant;
  className?: string;
}

const CTA_CONTENT: Record<Variant, {
  badge: string;
  badgeColor: string;
  headline: string;
  body: string;
  links: { label: string; href: string; note: string }[];
}> = {
  factoring: {
    badge: "Factoring Providers",
    badgeColor: "bg-blue-100 text-blue-700",
    headline: "Ready to explore factoring options for your business?",
    body:
      "The rates above reflect general market conditions based on Federal Reserve data. Actual factoring quotes depend on your invoice volume, client creditworthiness, and industry. These independent directories help you compare offers from multiple factoring companies.",
    links: [
      { label: "Compare Factoring Companies — Lendio", href: "https://www.lendio.com", note: "Marketplace: 75+ lenders" },
      { label: "Trucking-Specific Factoring — National Business Capital", href: "https://www.nationalbusinesscapital.com", note: "Specializes in trucking & staffing" },
      { label: "Invoice Factoring Guide — SBA.gov", href: "https://www.sba.gov/business-guide/manage-your-business/get-more-funding", note: "Official SBA resources" },
    ],
  },
  sba: {
    badge: "SBA Lenders",
    badgeColor: "bg-green-100 text-green-700",
    headline: "Researching SBA loan options?",
    body:
      "The payment estimates above use today's live prime rate from Federal Reserve data. Your actual SBA loan rate will depend on your lender, loan size, and creditworthiness. These resources help you find SBA-approved lenders and prepare your application.",
    links: [
      { label: "Find SBA Lenders — SBA Lender Match", href: "https://lendermatch.sba.gov", note: "Official SBA tool — free" },
      { label: "Compare SBA Offers — Lendio", href: "https://www.lendio.com", note: "Marketplace with 75+ lenders" },
      { label: "SBA Loan Requirements — SBA.gov", href: "https://www.sba.gov/funding-programs/loans", note: "Official eligibility guide" },
    ],
  },
  mca: {
    badge: "MCA Alternatives",
    badgeColor: "bg-orange-100 text-orange-700",
    headline: "The APR above tells the full story. Explore lower-cost alternatives.",
    body:
      "Merchant cash advances are expensive. The effective APR is often 40–150%, far above SBA or bank loan rates. If your business qualifies for traditional financing, the cost difference is significant. These resources help you compare options.",
    links: [
      { label: "Compare Business Loan Options — Lendio", href: "https://www.lendio.com", note: "Includes SBA, lines of credit, term loans" },
      { label: "SBA Loan Rates Today — SBA.gov", href: "https://www.sba.gov/funding-programs/loans/loan-rates", note: "Official current rates" },
      { label: "Invoice Factoring Calculator", href: "/tools/invoice-factoring-calculator", note: "Often cheaper than MCA" },
    ],
  },
  general: {
    badge: "Business Funding Resources",
    badgeColor: "bg-slate-100 text-slate-700",
    headline: "Exploring your funding options?",
    body:
      "Today's funding climate score reflects real Federal Reserve data on lending conditions. When you're ready to research specific options, these resources provide unbiased, official guidance.",
    links: [
      { label: "SBA Lender Match — SBA.gov", href: "https://lendermatch.sba.gov", note: "Find SBA-approved lenders free" },
      { label: "Business Loan Marketplace — Lendio", href: "https://www.lendio.com", note: "Compare 75+ lenders" },
      { label: "CFPB Small Business Resources", href: "https://www.consumerfinance.gov/business-toolkit/", note: "Official consumer protection guidance" },
    ],
  },
};

export default function AffiliateCTA({ variant, className = "" }: Props) {
  const cta = CTA_CONTENT[variant];

  return (
    <div className={`bg-slate-50 border border-slate-200 rounded-2xl p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${cta.badgeColor}`}>
          {cta.badge}
        </span>
        <span className="text-[10px] text-slate-400 font-medium">Sponsored links</span>
      </div>

      <h3 className="text-sm font-bold text-slate-800 mb-2">{cta.headline}</h3>
      <p className="text-xs text-slate-500 leading-relaxed mb-4">{cta.body}</p>

      <div className="space-y-2">
        {cta.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noopener noreferrer sponsored" : undefined}
            className="flex items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
          >
            <div>
              <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-700 transition-colors leading-snug">
                {link.label}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{link.note}</p>
            </div>
            <span className="text-slate-300 group-hover:text-blue-400 transition-colors flex-shrink-0">→</span>
          </a>
        ))}
      </div>

      <p className="text-[10px] text-slate-400 mt-3 leading-relaxed">
        Links marked "Sponsored links" may earn us a referral fee at no cost to you.
        We only link to established lenders and official government resources.
        This is not a recommendation to use any specific lender.{" "}
        <Link href="/legal" className="underline hover:text-slate-600">See our disclosures.</Link>
      </p>
    </div>
  );
}
