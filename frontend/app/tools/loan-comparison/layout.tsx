import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Loan Comparison Calculator — SBA vs MCA vs Factoring | US Business Funding Climate Score",
  description:
    "Compare SBA 7(a) loans, merchant cash advances, invoice factoring, and lines of credit side-by-side. See the true APR and total cost of each option for your funding amount.",
  alternates: { canonical: "/tools/loan-comparison" },
  openGraph: {
    title: "Business Loan Comparison Tool — Compare All Funding Options",
    description:
      "Enter your funding amount and monthly revenue to see SBA loans, MCAs, invoice factoring, and credit lines compared side-by-side with real APR and total cost calculations.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
