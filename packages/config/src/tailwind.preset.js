/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        // Brand colors - Realpro Suite
        brand: {
          50: '#E6F7F9',
          100: '#CCF0F4',
          200: '#99E0E8',
          300: '#66D1DD',
          400: '#3DAABD', // Primary brand color
          500: '#2D8A9A',
          600: '#236B78',
          700: '#1A4D56',
          800: '#102F34',
          900: '#081012',
        },
        // Semantic colors
        success: {
          50: '#ECFDF5',
          500: '#10B981',
          700: '#047857',
        },
        warning: {
          50: '#FFFBEB',
          500: '#F59E0B',
          700: '#B45309',
        },
        error: {
          50: '#FEF2F2',
          500: '#EF4444',
          700: '#B91C1C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
      },
    },
  },
};
