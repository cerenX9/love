/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        love: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        blush: {
          50: '#fdf4f5',
          100: '#fbe8ea',
          200: '#f7d5d9',
          300: '#f0b3bb',
          400: '#e58896',
          500: '#d75d71',
          600: '#c14156',
        },
        lavender: {
          50: '#fbf7ff',
          100: '#f5eeff',
          200: '#ebdcff',
          300: '#d9beff',
          400: '#c092fc',
          500: '#a865f5',
        }
      },
      fontFamily: {
        romantic: ['"Nunito"', '"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['"Outfit"', '"Plus Jakarta Sans"', '"Quicksand"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(244, 63, 94, 0.12)',
        'glass-hover': '0 12px 40px 0 rgba(244, 63, 94, 0.22)',
        'soft-pink': '0 10px 25px -5px rgba(251, 113, 133, 0.3)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(3deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.5s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        wiggle: 'wiggle 0.3s ease-in-out 3',
      }
    },
  },
  plugins: [],
}
