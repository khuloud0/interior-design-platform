/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2D2016",
        sand: "#D3B128",
        stone: "#8C7B68",
        muted: "#B0A090",
        border: "#E2D8CE",
        background: "#F6F1EA",
        surface: "#FFFDF9",
      },
    },
  },
  plugins: [],
}