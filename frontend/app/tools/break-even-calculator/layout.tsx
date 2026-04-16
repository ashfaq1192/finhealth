import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Break-Even Calculator for Small Business — Free Tool | US Business Funding Climate Score",
  description:
    "Free break-even calculator for small business owners. Find your break-even point in units and revenue, contribution margin, and margin of safety in seconds.",
  alternates: { canonical: "/tools/break-even-calculator" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
