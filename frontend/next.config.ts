import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
import type { NextConfig } from "next";

// Enable Cloudflare bindings in local dev
if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

const nextConfig: NextConfig = {
  // Required for @cloudflare/next-on-pages
  experimental: {},
};

export default nextConfig;
