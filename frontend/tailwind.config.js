/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",   // 👈 Points to your root pages folder
    "./components/**/*.{js,ts,jsx,tsx}",
    "./globals.css"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}