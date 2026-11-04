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
        brand: {
          50: "#f0fdf4",
          100: "#dcfce7",
          500: "#22c55e",
          600: "#16a34a",
          900: "#14532d",
        },
        studio: {
          950: "#0b0f19",
          900: "#111827",
          850: "#182234",
          800: "#1f2937",
          700: "#374151",
          600: "#4b5563",
        },
        accent: {
          amber: "#f59e0b",
          cyan: "#06b6d4",
          purple: "#8b5cf6",
          rose: "#f43f5e",
        }
      },
    },
  },
  plugins: [],
};

