/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'warm-beige': '#EADEC8', 
        'mocha-brown': '#7E5B42', 
        'sage-green': '#8A9A86',  
        'lavender': '#D8CBE3',
        'soft-peach': '#F5D3C8'
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
        vibes: ['"Great Vibes"', 'cursive']
      }
    },
  },
  plugins: [],
}