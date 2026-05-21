import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'JetBrains Mono'", "monospace"],
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
        display: ["'Syne'", "sans-serif"],
      },
      colors: {
        ink: {
          950: "#0C0C0E",
          900: "#12121A",
          800: "#1A1A26",
          700: "#22223A",
          600: "#2E2E50",
          500: "#3D3D6B",
          400: "#5B5B9A",
          300: "#7E7EBC",
          200: "#A8A8D4",
          100: "#D0D0EA",
          50: "#EBEBF6",
        },
        volt: {
          500: "#C8FF00",
          400: "#D4FF33",
          300: "#DEFF66",
          200: "#EAFF99",
          100: "#F5FFCC",
        },
        ember: {
          500: "#FF4D1A",
          400: "#FF6B3D",
          300: "#FF8F6A",
          200: "#FFB39A",
          100: "#FFD8CC",
        },
        frost: {
          500: "#00C8FF",
          400: "#33D3FF",
          300: "#66DEFF",
          200: "#99E9FF",
          100: "#CCFEFF",
        },
      },
      animation: {
        "fade-up": "fadeUp 0.4s ease-out forwards",
        "fade-in": "fadeIn 0.3s ease-out forwards",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
