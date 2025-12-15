/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Quicksand", "ui-sans-serif", "system-ui"],
        script: ["Dancing Script", "ui-serif", "serif"],
      },
      colors: {
        cream: "#FDFBF7",
        sage: "#E3EBD3",
        "sage-dark": "#9FB388",
        rose: {
          50: "#FFF1F2",
          100: "#FFE4E6",
          200: "#FECDD3",
          300: "#FDA4AF",
          400: "#FB7185",
          800: "#9F1239",
        },
        baker: {
          brown: "#8B5E3C",
          light: "#D4A373",
        },
      },
      keyframes: {
        "fade-in-down": {
          "0%": { opacity: "0", transform: "translate3d(0,-10px,0)" },
          "100%": { opacity: "1", transform: "translate3d(0,0,0)" },
        },
        "pulse-once": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.01)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in-down": "fade-in-down 500ms ease-out both",
        "pulse-once": "pulse-once 650ms ease-out both",
      },
    },
  },
  plugins: [],
};
