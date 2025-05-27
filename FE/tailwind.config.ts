import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import flowbite from "flowbite/plugin";

const config: Config = {
  darkMode: "class", // Dùng class `.dark` để chuyển theme
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "767px",
      lg: "991px",
      xl: "1199px",
      "1408px": "1408px",
      "2xl": "1536px",
    },
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      fontFamily: {
        questrial: ["Questrial", "sans-serif"],
        raleway: ["Raleway", "sans-serif"],
      },
      colors: {
        light: {
          50: "#f7fddf",
          100: "#ebf8b5",
          200: "#dcf28a",
          300: "#c9e95c",
          400: "#b8cd06",
          500: "#a1b803",
          600: "#889e03",
          700: "#6d8206",
          800: "#566707",
          900: "#445206",
          950: "#263301",
        },
        // ✅ Dựa trên biến CSS để hỗ trợ theme động
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
        status: {
          DEFAULT: "hsl(var(--status))",
          foreground: "hsl(var(--status-foreground))",
        },
        border1: {
          DEFAULT: "hsl(var(--border1))",
          foreground: "hsl(var(--border1-foreground))",
        },
        border2: {
          DEFAULT: "hsl(var(--border2))",
          foreground: "hsl(var(--border2-foreground))",
        },
        background1: {
          DEFAULT: "hsl(var(--foreground))",
          foreground: "hsl(var(--background))",
        },
        background2: {
          DEFAULT: "hsl(var(--background2))",
          foreground: "hsl(var(--foreground2))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
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
  plugins: [tailwindcssAnimate, flowbite],
};

export default config;
