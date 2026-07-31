/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
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
          DEFAULT: "#2563eb",
          foreground: "#ffffff",
        },
        sidebar: {
          DEFAULT: "#0f172a",
          foreground: "#e2e8f0",
          hover: "#1e293b",
          active: "#2563eb",
          "active-foreground": "#ffffff",
          border: "#1e293b",
        },
        border: "#e2e8f0",
        input: "#e2e8f0",
        ring: "#2563eb",
        background: "#f8fafc",
        foreground: "#0f172a",
        card: { DEFAULT: "#ffffff", foreground: "#0f172a" },
        popover: { DEFAULT: "#ffffff", foreground: "#0f172a" },
        secondary: { DEFAULT: "#f1f5f9", foreground: "#0f172a" },
        muted: { DEFAULT: "#f1f5f9", foreground: "#64748b" },
        accent: { DEFAULT: "#10b981", foreground: "#ffffff" },
        destructive: { DEFAULT: "#ef4444", foreground: "#ffffff" },
        warning: { DEFAULT: "#f59e0b", foreground: "#ffffff" },
        success: { DEFAULT: "#22c55e", foreground: "#ffffff" },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
        xl: "1rem",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
