/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
        display: ['Playfair Display', 'serif'],
      },
      colors: {
        ink: '#0d0d0d',
        paper: '#f5f0e8',
        cream: '#ede8dc',
        amber: { DEFAULT: '#e8a020', dark: '#c47a10' },
        sage: '#4a7c6f',
        muted: '#6b6357',
        card: '#faf7f2',
        border: '#ddd5c4',
      },
    },
  },
  plugins: [],
};
