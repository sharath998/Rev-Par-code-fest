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
        'glow-pulse': 'glowPulse 2.4s ease-in-out infinite',
        'gradient-shift': 'gradientShift 6s ease infinite',
        'flash-pulse': 'flashPulse 1.6s ease-in-out infinite',
        'flame': 'flame 0.7s ease-in-out infinite alternate',
        'urgent-pulse': 'urgentPulse 1s ease-in-out infinite',
        'savings-pop': 'savingsPop 2s ease-in-out infinite',
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
          '50%':      { backgroundPosition: '100% 50%' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(203,161,53,0.45)' },
          '50%':      { boxShadow: '0 0 0 10px rgba(203,161,53,0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 24px 0 rgba(203,161,53,0.45), 0 0 0 0 rgba(203,161,53,0.0)' },
          '50%':      { boxShadow: '0 0 48px 6px rgba(203,161,53,0.85), 0 0 0 4px rgba(203,161,53,0.25)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        flashPulse: {
          '0%, 100%': { transform: 'scale(1)',   boxShadow: '0 0 0 0 rgba(255,90,30,0.7)' },
          '50%':      { transform: 'scale(1.06)', boxShadow: '0 0 0 10px rgba(255,90,30,0)' },
        },
        flame: {
          '0%':   { transform: 'translateY(0) scale(1) rotate(-3deg)',  opacity: '0.95' },
          '100%': { transform: 'translateY(-1px) scale(1.12) rotate(3deg)', opacity: '1' },
        },
        urgentPulse: {
          '0%, 100%': { color: '#ffffff', textShadow: '0 0 0 rgba(255,80,80,0)' },
          '50%':      { color: '#FF6B6B', textShadow: '0 0 12px rgba(255,80,80,0.85)' },
        },
        savingsPop: {
          '0%, 100%': { transform: 'rotate(-3deg) scale(1)' },
          '50%':      { transform: 'rotate(-3deg) scale(1.08)' },
        },
      },
    },
  },
  plugins: [],
}
