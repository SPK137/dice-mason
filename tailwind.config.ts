import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0F0F14",
        surface: "#1A1A24",
        border: "#2E2E42",
        primary: "#F0EEF8",
        muted: "#8B89A8",
        accent: "#7C5CEF",
        "accent-hover": "#9B7EFF",
        success: "#4ADE80",
        danger: "#F87171",
      },
      fontFamily: {
        display: ["Cinzel", "serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;