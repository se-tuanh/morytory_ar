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
          wood: '#5C4A3D',
          'accent-green': '#6B7F4B',
          'accent-beige': '#E8E1D5',
          bg: '#FAF8F5',
          text: '#2C241B',
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
