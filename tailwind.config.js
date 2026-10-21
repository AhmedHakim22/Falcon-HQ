/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#FCFAF7',
          100: '#F8F5F0', // Falcon primary warm canvas background
          200: '#EFEAE1',
          300: '#E4DDD0',
          400: '#D5CABE',
          500: '#C2B3A3',
          border: '#E8E3DA',
        },
        falcon: {
          50: '#FEE2E2',
          100: '#FCA5A5',
          500: '#EF4444',
          600: '#D32F2F', // Falcon brand primary crimson
          700: '#B71C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        charcoal: {
          DEFAULT: '#1C1917',
          muted: '#78716C',
        },
        gold: {
          DEFAULT: '#D97706',
          light: '#FEF3C7',
          dark: '#B45309',
        },
      },
      borderRadius: {
        '3xl': '1.5rem', // 24px Bento radius
        '4xl': '2rem',
      },
      fontFamily: {
        sans: ['Readex Pro', 'Cairo', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
