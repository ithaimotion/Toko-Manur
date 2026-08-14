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
      padding: { DEFAULT: "1rem", sm: "2rem", lg: "4rem", xl: "5rem", "2xl": "6rem" },
    },
    extend: {
      colors: {
        primary: {
          50: "#fff0f0",
          100: "#ffe0e0",
          200: "#ffc2c2",
          300: "#ff9999",
          400: "#ff4f4f",
          500: "#cf2525",
          600: "#b91c1c",
          700: "#991b1b",
          800: "#7f1d1d",
          900: "#651818",
          950: "#380d0d",
          DEFAULT: "#cf2525",
          foreground: "#ffffff",
        },
        secondary: {
          50: "#fffaf4",
          100: "#ffe7ce",
          200: "#fdd0a2",
          300: "#fca55d",
          400: "#fb8a34",
          500: "#f97316",
          600: "#ea580c",
          DEFAULT: "#ffe7ce",
          foreground: "#5b3a53",
        },
        accent: {
          DEFAULT: "#ff4f4f",
          foreground: "#ffffff",
        },
        // Admin-specific colors
        sidebar: {
          DEFAULT: "#fdfcff",
          foreground: "#4b3f49",
          hover: "#f6edf7",
          active: "#eef7fb",
          "active-foreground": "#2f2a33",
          border: "#e8dce7",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        warning: {
          DEFAULT: "#f59e0b",
          foreground: "#ffffff",
        },
        success: {
          DEFAULT: "#22c55e",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f8fafc",
          foreground: "#64748b",
        },
        border: "#fecaca",
        input: "#fecaca",
        ring: "#cf2525",
        background: "#fffcfe",
        foreground: "#2f2a33",
        card: {
          DEFAULT: "#ffffff",
          foreground: "#2f2a33",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#2f2a33",
        },
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      fontFamily: {
        sans: ["var(--font-nunito)", "var(--font-inter)", "system-ui", "sans-serif"],
        admin: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        card: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 24px rgba(207, 37, 37, 0.18), 0 1px 3px rgba(0,0,0,0.08)",
        glow: "0 0 40px rgba(207, 37, 37, 0.16)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-in-right": "slideInRight 0.4s ease-out",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "marquee-left": "marqueeLeft 20s linear infinite",
        "marquee-right": "marqueeRight 20s linear infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        slideInRight: { "0%": { opacity: "0", transform: "translateX(20px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
        float: { "0%, 100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-10px)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        marqueeLeft: { "0%": { transform: "translateX(0%)" }, "100%": { transform: "translateX(-50%)" } },
        marqueeRight: { "0%": { transform: "translateX(-50%)" }, "100%": { transform: "translateX(0%)" } },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-pattern": "linear-gradient(135deg, #ff4f4f 0%, #fff0f0 50%, #ffe7ce 100%)",
        shimmer: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
      },
    },
  },
  plugins: [],
};
