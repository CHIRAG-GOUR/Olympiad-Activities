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
      screens: {
        xs: "480px",
      },
      colors: {
        // Light academic Olympiad system — used across dashboard, exam shell and reports.
        olympiad: {
          bg: "#F4F7FB",
          surface: "#FFFFFF",
          text: "#182338",
          textMuted: "#667085",
          textSubtle: "#98A2B3",
          border: "#E1E7EF",
          borderStrong: "#D5DDE8",
          // Primary academic blue
          primary: "#2468B2",
          primaryDark: "#1C5190",
          primaryDeep: "#163F71",
          primarySoft: "#EAF2FC",
          primaryTint: "#D9E8F8",
          // Secondary sky
          sky: "#59B6DE",
          skySoft: "#E8F4FB",
          // Olympiad accents
          yellow: "#F4C542",
          yellowDark: "#E0AE2B",
          yellowSoft: "#FDF5DF",
          orange: "#F29A38",
          orangeSoft: "#FDF0E3",
          success: "#55B987",
          successSoft: "#EAF7F1",
          error: "#E8786A",
          errorSoft: "#FBEEED",
          lavender: "#8067D9",
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
        "panel-in": {
          "0%": { opacity: "0", transform: "translateY(14px) scale(0.985)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "wash-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "orbit-reverse": {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        "grid-shift": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(10px, -8px)" },
        },
        "drift-y": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-16px)" },
        },
        "draw-plot": {
          "0%": { strokeDashoffset: "1" },
          "55%": { strokeDashoffset: "0" },
          "85%": { strokeDashoffset: "0", opacity: "1" },
          "100%": { strokeDashoffset: "0", opacity: "0" },
        },
        "toward-lamp": {
          "0%": { transform: "translate(0, 0)", opacity: "0" },
          "30%": { opacity: "1" },
          "100%": { transform: "translate(var(--tx, 60px), var(--ty, -70px))", opacity: "0" },
        },
        "orbit-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "drift": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "rise-in": "rise-in 0.35s ease-out both",
        "panel-in": "panel-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
        "wash-in": "wash-in 0.9s ease-out both",
        "orbit-slow": "orbit-slow 28s linear infinite",
        drift: "drift 5s ease-in-out infinite",
        "fade-in": "wash-in 0.18s ease-out both",
        "slide-in-left": "slide-in-left 0.22s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
