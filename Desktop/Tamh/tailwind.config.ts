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
        // ============================
        // GORGEOUS & ELEGANT PALETTE
        // ============================
        charcoal: {
          DEFAULT: "#0A0A0B",
          50: "#1A1A1C",
          100: "#151517",
          200: "#101012",
          300: "#0D0D0F",
          400: "#0A0A0B",
          500: "#08080A",
          600: "#060608",
          700: "#040406",
          800: "#020204",
          900: "#000000",
        },
        gold: {
          DEFAULT: "#D4AF37",
          50: "#FBF5DC",
          100: "#F6EBB6",
          200: "#EFDC85",
          300: "#E6CB5C",
          400: "#DCB942",
          500: "#D4AF37", // primary gold
          600: "#B8952A",
          700: "#937420",
          800: "#6E5618",
          900: "#4A3A10",
        },
        ivory: "#F5F1E8",
        cognac: "#C2854D",
        burgundy: "#5C1F2C",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Cormorant Garamond", "Playfair Display", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Italiana", "serif"],
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #FBF5DC 0%, #D4AF37 35%, #B8952A 65%, #6E5618 100%)",
        "gold-shine":
          "linear-gradient(110deg, transparent 30%, rgba(212,175,55,0.45) 50%, transparent 70%)",
        "noise-texture":
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        "gold-glow": "0 0 24px 0 rgba(212, 175, 55, 0.35)",
        "gold-glow-lg": "0 0 48px 0 rgba(212, 175, 55, 0.5)",
        "inner-luxe":
          "inset 0 1px 0 0 rgba(212,175,55,0.15), inset 0 -1px 0 0 rgba(0,0,0,0.5)",
        soft: "0 16px 48px -16px rgba(0,0,0,0.7)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "gold-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(212,175,55,0.0)" },
          "50%": { boxShadow: "0 0 24px 4px rgba(212,175,55,0.45)" },
        },
      },
      animation: {
        shimmer: "shimmer 3s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out both",
        "gold-pulse": "gold-pulse 2.4s ease-in-out infinite",
      },
      backdropBlur: {
        xs: "2px",
        luxe: "20px",
      },
      letterSpacing: {
        widest2: "0.32em",
      },
    },
  },
  plugins: [],
};

export default config;
