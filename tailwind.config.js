/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Noto Serif KR"', 'Georgia', 'serif'],
        sans: ['"Pretendard"', '"Noto Sans KR"', 'sans-serif'],
      },
      colors: {
        imperial: {
          950: '#070a12',
          900: '#0d1220',
          800: '#141c30',
          700: '#1e2946',
          gold: '#ffd700',
          amber: '#d4af37',
          crimson: '#e11d48',
          purple: '#9333ea',
        }
      }
    },
  },
  plugins: [],
}
