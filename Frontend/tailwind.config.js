/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          canvas: '#F8FAFC',
          surface: '#FFFFFF',
          border: '#E2E8F0',
        },
        content: {
          primary: '#0F172A',
          secondary: '#64748B',
        },
        trade: {
          action: '#3B82F6',
          gain: '#10B981',
          loss: '#F43F5E',
        },
      },
      boxShadow: {
        surface: '0px 8px 24px -4px rgba(0, 0, 0, 0.04)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
