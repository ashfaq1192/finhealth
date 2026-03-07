import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        optimal: "#16a34a",
        moderate: "#d97706",
        risky: "#ea580c",
        critical: "#dc2626",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
