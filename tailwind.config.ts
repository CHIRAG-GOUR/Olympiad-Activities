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
        olympiad: {
          deepBlue: "#0B4F8A",
          primaryBlue: "#1769AA",
          academicBlue: "#2D82C4",
          blueLight: "#EBF4FB",
          blueSoft: "#F0F7FD",
          yellow: "#F4C400",
          yellowWarm: "#FFD84D",
          yellowLight: "#FEF9E7",
          orange: "#F28C28",
          orangeLight: "#FEF3E8",
          green: "#42A844",
          greenLight: "#EDF8EE",
          red: "#C62828",
          redLight: "#FDECEC",
          cream: "#FFF8EA",
          bg: "#F5F8FA",
          surface: "#FFFFFF",
          card: "#FFFFFF",
          text: "#172B3A",
          textMuted: "#687784",
          textSubtle: "#8C9BA8",
          border: "#D9E2E8",
          borderLight: "#E8EFF4",
          borderDark: "#BAC8D3",
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
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(11, 79, 138, 0.06), 0 1px 2px -1px rgba(11, 79, 138, 0.04)",
        card: "0 2px 6px 0 rgba(11, 79, 138, 0.08), 0 1px 3px 0 rgba(11, 79, 138, 0.05)",
        dropdown: "0 12px 28px -4px rgba(11, 79, 138, 0.14), 0 6px 14px -2px rgba(11, 79, 138, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
