import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoice Factoring Cost Calculator — Free Tool | US Business Funding Climate Score",
  description:
    "Calculate your net cash advance, effective APR, and total factoring cost instantly. Free invoice factoring calculator for trucking, staffing, and small business owners.",
  alternates: { canonical: "/tools/invoice-factoring-calculator" },
  openGraph: {
    title: "Invoice Factoring Cost Calculator",
    description:
      "Free tool: enter your invoice amount, advance rate, and factor fee to see your true cost of factoring — including effective APR.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
