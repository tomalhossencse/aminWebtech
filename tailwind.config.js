/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#2563EB", // Royal Blue - matching your HTML
        secondary: "#6366F1", // Indigo tone for borders/accents
        dark: "#0F172A", // Deep Slate for Navbar
        "background-light": "#F3F4F6", // Light Gray - matching your HTML
        "background-dark": "#0F172A", // Slate 900 - matching your HTML
        "text-light": "#1F2937",
        "text-dark": "#F3F4F6",
        "subtext-light": "#4B5563",
        "subtext-dark": "#9CA3AF",
        "card-light": "#FFFFFF",
        "card-dark": "#1F2937", // Gray-800
        "muted-light": "#6B7280",
        "muted-dark": "#9CA3AF",
        "accent-yellow": "#FFD700", // Gold/Yellow for the highlight text
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        'xl': "1rem",
        '2xl': "1.5rem",
        '3xl': "1.5rem",
        '4xl': "2rem",
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0,0,0,0.08)',
        'glow': '0 0 15px rgba(59, 130, 246, 0.3)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.5)',
      },
      backgroundImage: {
        'gradient-badge': 'linear-gradient(to right, #a855f7, #ec4899)', // Purple to Pink gradient
        'hero-gradient': 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)', // Blue to Purple gradient
      },
      animation: {
        'bounce-slow': 'bounce-slight 3s infinite ease-in-out',
      },
      keyframes: {
        'bounce-slight': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#3B82F6",
          "secondary": "#6366F1",
          "accent": "#37CDBE",
          "neutral": "#3D4451",
          "base-100": "#FFFFFF",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
        dark: {
          "primary": "#3B82F6",
          "secondary": "#6366F1",
          "accent": "#37CDBE",
          "neutral": "#2A2E37",
          "base-100": "#0f172a",
          "base-200": "#1F2937",
          "base-300": "#334155",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
    ],
  },
}