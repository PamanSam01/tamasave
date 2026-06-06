import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        shell: "#f7f0cf",
        screen: "#c7e7b1",
        ink: "#20312b",
        mint: "#9bdba8",
        peach: "#ffc1a6",
        candy: "#f7a7c8",
        sky: "#a8d8ff",
        lilac: "#c7b9ff",
        butter: "#ffe58a",
        coral: "#ff8370",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        }
      },
      fontFamily: {
        pixel: ["var(--font-pixel)", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        pixel: "6px 6px 0 #20312b",
        "pixel-sm": "3px 3px 0 #20312b"
      },
      borderRadius: {
        xl: "8px",
        "2xl": "8px"
      },
      animation: {
        marquee: "marquee 40s linear infinite"
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" }
        }
      }
    }
  },
  plugins: [tailwindcssAnimate]
};

export default config;
