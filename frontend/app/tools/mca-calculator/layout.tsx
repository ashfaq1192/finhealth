import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MCA True Cost Calculator — Convert Factor Rate to APR | US Business Funding Climate Score",
  description:
    "Free merchant cash advance calculator. Enter your factor rate, advance amount, and daily sales to see your effective APR and true cost before you sign.",
  alternates: { canonical: "/tools/mca-calculator" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
