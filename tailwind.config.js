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
        accent: {
          green: '#3BB273',
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
    },
  },
  plugins: [],
};
