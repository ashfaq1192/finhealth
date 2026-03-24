import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Disclaimer from "@/components/Disclaimer";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://usfundingclimate.com"),
  title: {
    default: "US Business Funding Climate Score",
    template: "%s | US Business Funding Climate Score",
  },
  description:
    "Free daily score (0–100) measuring US small business funding conditions, powered by 6 Federal Reserve indicators. Updated every morning.",
  openGraph: {
    type: "website",
    siteName: "US Business Funding Climate Score",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "US Business Funding Climate Score — Daily Small Business Lending Index",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image"],
  },
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
        <GoogleAnalytics gaId="G-XH1EHWGZBX" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9488224992325074"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
