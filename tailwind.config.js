/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'page-bg': '#111827',
        'card-bg': '#1f2937',
        'text-dark': '#f3f4f6',
        'text-muted': '#9ca3af',
        'text-dark-strong': '#0e2c39',
        'border': '#374151',
        'group-card-bg': '#1f2937',
        
        'air-bg': '#1e3a8a',
        'air-text': '#dbeafe',
        'oxy-bg': '#115e59',
        'oxy-text': '#ccfbf1',
        'tup-bg': '#581c87',
        'tup-text': '#f3e8ff',
        
        'accent': '#3b82f6',
        
        'ok-bg': '#10b981',
        'warn-bg': '#f59e0b',
        'bad-bg': '#ef4444',

        'flag-green': '#eaf7ef',
        'flag-pink': '#ffe6ee',
        'flag-red': '#ffe9e9',
        'flag-red-shadow': '#d10000',
        'selection-yellow': '#fefce8',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'DEFAULT': '0 6px 20px rgba(0,0,0,.2)',
      }
    },
  },
  plugins: [],
}
