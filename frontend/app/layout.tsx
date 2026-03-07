import type { Metadata } from "next";
import "./globals.css";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "US Business Funding Climate Score",
  description:
    "Daily AI-generated indicator of US small business funding conditions, powered by FRED economic data.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 flex flex-col">
        <main className="flex-1">{children}</main>
        <Disclaimer />
      </body>
    </html>
  );
}
