/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          wood: '#8B5A2B',
          'accent-green': '#88A45C',
          'accent-beige': '#F6E5D5',
          bg: '#FAF7F2',
          text: '#000000',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        cursive: ['"Dancing Script"', 'cursive'],
      }
    },
  },
  plugins: [],
}
