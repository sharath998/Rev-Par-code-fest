/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // New brand colors
        cream: '#F8F6F2',
        dark: '#2C2C2C',
        gold: '#CBA135',
        // Legacy colors
        primary: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#bfa094',
          600: '#a18072',
          700: '#977669',
          800: '#846358',
          900: '#43302b',
        },
        accent: {
          gold: '#c9a050',
          burgundy: '#6b1c23',
          navy: '#1a2b49',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'elevated': '0 4px 16px rgba(0, 0, 0, 0.1)',
        'soft': '0 2px 15px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 10px 40px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'splash-in': 'splashIn 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'splash-out': 'splashOut 0.35s ease-in forwards',
        'shimmer': 'shimmer 3.5s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2.2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        splashIn: {
          '0%':   { opacity: '0', transform: 'translateY(-32px) scale(0.85)' },
          '60%':  { opacity: '1', transform: 'translateY(6px)  scale(1.03)' },
          '100%': { opacity: '1', transform: 'translateY(0)    scale(1)' },
        },
        splashOut: {
          '0%':   { opacity: '1', transform: 'translateX(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateX(60px) scale(0.92)' },
        },
        shimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':       { backgroundPosition: '100% 50%' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(203,161,53,0.45)' },
          '50%':       { boxShadow: '0 0 0 10px rgba(203,161,53,0)' },
        },
      },
    },
  },
  plugins: [],
}
