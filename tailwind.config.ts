import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1440px" },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-ibm-plex-sans-arabic)", "var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-cormorant)", "var(--font-ibm-plex-sans-arabic)", "serif"],
        body: ["var(--font-inter)", "var(--font-ibm-plex-sans-arabic)", "sans-serif"],
      },
      colors: {
        cream: {
          DEFAULT: "#F8F1E7",
          50: "#FFFDF9",
          100: "#F8F1E7",
          200: "#EFE3D1",
          300: "#E5D4BC",
        },
        warm: {
          white: "#FFFDF9",
          beige: "#EFE3D1",
        },
        brand: {
          brown: "#5A3724",
          "brown-dark": "#3B2417",
          gold: "#C9A66B",
          "gold-light": "#D9BD8E",
          "gold-dark": "#A6854D",
        },
        // retain legacy names for backwards compatibility during migration
        gold: {
          50: "#fcf9f2",
          100: "#f8f0df",
          200: "#efe0c0",
          300: "#e3cc98",
          400: "#d9bd8e",
          500: "#C9A66B",
          600: "#b08b4e",
          700: "#a6854d",
          800: "#8f6e3c",
          900: "#765b31",
        },
        oud: {
          50: "#f9f6f2",
          100: "#F8F1E7",
          200: "#EFE3D1",
          300: "#e5d4bc",
          400: "#c8b096",
          500: "#a18368",
          600: "#7d5d47",
          700: "#5A3724",
          800: "#3B2417",
          900: "#2a1810",
          950: "#1a0e0a",
        },
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(58, 36, 23, 0.08)",
        card: "0 8px 32px -8px rgba(58, 36, 23, 0.12)",
        gold: "0 4px 24px -4px rgba(201, 166, 107, 0.25)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "smoke": {
          "0%": { opacity: "0", transform: "translateY(10px) scale(0.9)" },
          "50%": { opacity: "0.6", transform: "translateY(-10px) scale(1.05)" },
          "100%": { opacity: "0", transform: "translateY(-30px) scale(1.2)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "fade-up": "fade-up 0.6s ease-out",
        smoke: "smoke 4s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
