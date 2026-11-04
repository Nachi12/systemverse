import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        theme: {
          bg: "#090E12",
          card: "#172126",
          primary: "#A3E635",
          accent: "#2DD4BF",
          text: "#E7F5F0",
          border: "#24333B",
          borderLight: "#2F434E",
          cardElevated: "#1D2A31",
          cardHover: "#22333B",
          muted: "#7E9693",
          secondary: "#A5BCB8",
          error: "#F87171",
          warning: "#FBBF24",
          success: "#A3E635",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["IBM Plex Mono", "JetBrains Mono", "SF Mono", "Consolas", "monospace"],
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
