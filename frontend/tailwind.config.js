/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // Enable dark mode with class strategy
  theme: {
    extend: {
      fontFamily: {
        merriweather: ["Merriweather", "serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        primary: "#1976D2",
        "primary-dark": "#0D47A1",
        secondary: "#00BCD4",
        accent: "#00E5FF",
      },
    },
  },
  plugins: [],
};
