/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8f8f7',
          100: '#eeede9',
          200: '#dddbd3',
          300: '#c5c2b7',
          400: '#a8a497',
          500: '#8c8777',
          600: '#6e6b5d',
          700: '#56544a',
          800: '#3d3c35',
          900: '#1b1b1b',
          950: '#0d0d0d',
        },
        brand: {
          50: '#faf7fe',
          100: '#f4eefd',
          200: '#ebe0fb',
          300: '#dcc8f7',
          400: '#c7a5f1',
          500: '#b182ea',
          600: '#9e5eef',
          700: '#8a42d6',
          800: '#7338b3',
          900: '#5f2f92',
          950: '#401a63',
        },
        accent: {
          orange: '#F5A623',
          warm: '#eeede9',
        },
        neutral: {
          50: '#f8f8f7',
          100: '#f2f2f0',
          200: '#e6e5e1',
          300: '#d1d0ca',
          400: '#b3b2aa',
          500: '#8d8c83',
          600: '#6e6d66',
          700: '#56554f',
          800: '#3d3c38',
          900: '#1b1b1b',
          950: '#0d0d0d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
      },
      boxShadow: {
        'soft': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'card': '0 8px 18px rgba(0, 0, 0, 0.12)',
        'panel': '0 12px 35px rgba(0, 0, 0, 0.18)',
        'glow': '0 0 20px rgba(158, 94, 239, 0.3)',
      },
      letterSpacing: {
        'tighter': '-0.02em',
      },
      animation: {
        'slideLeft': 'slideLeft 0.3s ease-out',
        'slideRight': 'slideRight 0.3s ease-out',
        'fadeIn': 'fadeIn 0.2s ease-out',
        'scaleIn': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        slideLeft: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
