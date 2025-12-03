/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EBF2F9',
          100: '#D7E5F3',
          200: '#AFCBE7',
          300: '#87B1DB',
          400: '#5F97CF',
          500: '#3A6EA5',
          600: '#2E5884',
          700: '#234263',
          800: '#172C42',
          900: '#0C1621',
        },
        accent: {
          green: '#3BB273',
          orange: '#F5A623',
        },
        neutral: {
          50: '#F6F7F9',
          100: '#ECEEF2',
          200: '#D9DDE5',
          300: '#B3BAC8',
          400: '#8D97AB',
          500: '#64748B',
          600: '#4B5565',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#0A0A0A',
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
