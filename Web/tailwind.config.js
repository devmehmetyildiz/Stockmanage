/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2C3E50",
        secondary: "#3d3d3d",
        soft: "#6c7293",
        softBg: "#6c729333",
        tableFilterText: "#35536c",
        tableHeaderIcon: "#cacaca",
        warning: "#db2828"
      },
      height: {
        navbar: '50px',
        contentScreen: 'calc(100vh - 50px)'
      },
      width: {
        sidebarMin: '50px',
        sidebarMax: '240px',
        screen: '100vw',
      },
      minWidth: {
        sidebarMin: '50px',
        sidebarMax: '270px'
      },
      margin: {
        navgar: '50px'
      }
    },
  },
  plugins: [],
}

