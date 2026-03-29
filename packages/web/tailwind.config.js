/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        builder: {
          app: "rgb(var(--color-builder-app) / <alpha-value>)",
          surface: "rgb(var(--color-builder-surface) / <alpha-value>)",
          "surface-muted":
            "rgb(var(--color-builder-surface-muted) / <alpha-value>)",
          border: "rgb(var(--color-builder-border) / <alpha-value>)",
          text: "rgb(var(--color-builder-text) / <alpha-value>)",
          "text-muted": "rgb(var(--color-builder-text-muted) / <alpha-value>)",
          canvas: "rgb(var(--color-builder-canvas) / <alpha-value>)",
          accent: "rgb(var(--color-builder-accent) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ['"Plus Jakarta Sans"', "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "builder-canvas":
          "0 1px 3px rgb(0 0 0 / 0.06), 0 12px 40px -12px rgb(0 0 0 / 0.12)",
        "builder-canvas-dark":
          "0 0 0 1px rgb(63 63 70 / 0.5), 0 20px 50px -20px rgb(0 0 0 / 0.5)",
      },
    },
  },
  plugins: [],
};
