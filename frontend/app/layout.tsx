import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Disclaimer from "@/components/Disclaimer";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "US Business Funding Climate Score",
  description:
    "Daily AI-generated indicator of US small business funding conditions, powered by FRED economic data.",
  other: {
    "google-adsense-account": "ca-pub-9488224992325074",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100 text-gray-900 flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Disclaimer />
      </body>
      <GoogleAnalytics gaId="G-XH1EHWGZBX" />
    </html>
  );
}
