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
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        secondary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        accent: {
          turquoise: '#0891b2',
          teal: '#14b8a6',
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
        'glow': '0 0 20px rgba(8, 145, 178, 0.3)',
        'glow-turquoise': '0 0 20px rgba(8, 145, 178, 0.4)',
        'glow-teal': '0 0 20px rgba(20, 184, 166, 0.3)',
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
