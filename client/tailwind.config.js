/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lumiere: {
          bg: '#F8F4EC',           // Warm cream / ivory background
          cream: '#EFE6D6',        // Secondary warm cream
          gold: '#B58A45',         // Warm Indian gold
          'gold-dark': '#8E682F',  // Dark gold
          'gold-light': '#D4AF67', // Light gold
          accent: '#7A3030',       // Dark maroon / kumkum burgundy accent
          maroon: '#7A3030',       // Dark Indian maroon
          text: '#2D2823',         // Primary warm dark charcoal text
          muted: '#63594F',        // Secondary warm muted text
          light: '#8C8276',        // Tertiary muted text
          border: '#E5DAC8',       // Subtle warm border
          'border-light': '#F0E8DC',
          card: '#FFFFFF',         // Clean product card surface
          'card-warm': '#FAF6EE',  // Warm cream card
          deep: '#231E19',         // Warm deep espresso / brown for announcements / primary buttons
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      letterSpacing: {
        tight: '-0.015em',
        normal: '0',
        wide: '0.05em',
        wider: '0.1em',
        widest: '0.18em',
      },
      boxShadow: {
        subtle: '0 2px 10px -1px rgba(45, 40, 35, 0.05)',
        elevated: '0 10px 25px -4px rgba(45, 40, 35, 0.08)',
        drawer: '-8px 0 30px rgba(45, 40, 35, 0.12)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.25, 1, 0.5, 1)',
      }
    },
  },
  plugins: [],
};
