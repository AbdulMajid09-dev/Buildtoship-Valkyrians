/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './client/index.html',
    './client/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          50: '#f2fbf4',
          100: '#e1f7e6',
          200: '#c4eed0',
          300: '#97deab',
          400: '#64c680',
          500: '#3ba95d',
          600: '#2c8949',
          700: '#256d3c',
          800: '#215732',
          900: '#1c482b',
          950: '#0b2715',
        },
        earth: {
          50: '#fbf9f5',
          100: '#f5f0e6',
          200: '#ebdeca',
          300: '#dcc6a6',
          400: '#cca87f',
          500: '#be8c5f',
          600: '#b17751',
          700: '#935f43',
          800: '#774d39',
          900: '#623f31',
          950: '#352018',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
