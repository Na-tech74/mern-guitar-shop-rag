/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        flat: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
        soft: "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
        pop: "0 4px 12px -2px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.04)",
        lift: "0 10px 24px -8px rgb(0 0 0 / 0.10), 0 2px 6px -2px rgb(0 0 0 / 0.05)",
      },
    },
  },
  plugins: [],
}
