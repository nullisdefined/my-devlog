import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // 커스텀 색상 추가
        lavender: {
          100: "#e6e6fa",
          700: "#7a7aff",
          900: "#4b0082",
        },
        mint: {
          100: "#f5fffa",
          700: "#3eb489",
          900: "#2e8b57",
        },
        peach: {
          100: "#ffdab9",
          700: "#ff7f50",
          900: "#ff4500",
        },
        sky: {
          100: "#e6f2ff",
          700: "#4682b4",
          900: "#00416a",
        },
        lemon: {
          100: "#fffacd",
          700: "#ffd400",
          900: "#ffa500",
        },
        coral: {
          100: "#fff5ee",
          700: "#ff7f50",
          900: "#ff4500",
        },
        lilac: {
          100: "#e6e6fa",
          700: "#9370db",
          900: "#8a2be2",
        },
        sage: {
          100: "#f0fff0",
          700: "#8fbc8f",
          900: "#2e8b57",
        },
        apricot: {
          100: "#ffefd5",
          700: "#ffa07a",
          900: "#ff6347",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
