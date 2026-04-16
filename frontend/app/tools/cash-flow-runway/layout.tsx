import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cash Flow Runway Calculator — How Many Months Do You Have? | US Business Funding Climate Score",
  description:
    "Free cash flow runway calculator. Enter your cash balance, revenue, and expenses to find out how many months of runway you have and when you need to act.",
  alternates: { canonical: "/tools/cash-flow-runway" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
