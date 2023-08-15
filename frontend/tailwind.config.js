/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        'side-menu-md': '920px',
        'xs': '365px',
      },
      colors: {
        'primary': '#fec107',
        'memo': '#fff8d9',
        'gpt': '#19C37D',
        'dark': '#2f2f2f',
      },
    },
  },
  plugins: [],
}
