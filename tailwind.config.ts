import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/engine/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light academic Olympiad system — used across dashboard, exam shell and reports.
        olympiad: {
          bg: "#F6F8FB",
          surface: "#FFFFFF",
          text: "#172033",
          textMuted: "#667085",
          textSubtle: "#98A2B3",
          border: "#E3E8EF",
          borderStrong: "#D3DBE6",
          // Primary academic blue
          primary: "#2563A8",
          primaryDark: "#1B4E88",
          primaryDeep: "#143C69",
          primarySoft: "#EAF2FB",
          primaryTint: "#DCE9F7",
          // Secondary sky
          sky: "#4FA8D8",
          skySoft: "#E8F4FB",
          // Olympiad accents
          yellow: "#F4C542",
          yellowDark: "#E0AE2B",
          yellowSoft: "#FDF5DF",
          orange: "#F39A3D",
          orangeSoft: "#FDF0E3",
          success: "#39A96B",
          successSoft: "#E9F7EF",
          error: "#D9534F",
          errorSoft: "#FBEEED",
          lavender: "#8C7AE6",
          lavenderSoft: "#F0EDFC",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-manrope)", "Manrope", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "10px",
        xl: "12px",
        "2xl": "16px",
      },
      boxShadow: {
        // Deliberately restrained — examination materials, not floating SaaS cards.
        subtle: "0 1px 2px 0 rgba(23, 32, 51, 0.04)",
        card: "0 1px 3px 0 rgba(23, 32, 51, 0.06), 0 1px 2px -1px rgba(23, 32, 51, 0.04)",
        lifted: "0 4px 12px -2px rgba(23, 32, 51, 0.08), 0 2px 4px -2px rgba(23, 32, 51, 0.05)",
        dropdown: "0 12px 28px -6px rgba(23, 32, 51, 0.14), 0 4px 10px -4px rgba(23, 32, 51, 0.08)",
      },
      keyframes: {
        "rise-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "orbit-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "drift": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        "rise-in": "rise-in 0.35s ease-out both",
        "orbit-slow": "orbit-slow 28s linear infinite",
        drift: "drift 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
