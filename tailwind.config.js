/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vault: {
          bg: '#0a0a0f',
          surface: '#12121a',
          card: '#1a1a26',
          border: '#2a2a3d',
          accent: '#6c63ff',
          accentHover: '#7c74ff',
          accentDim: '#6c63ff22',
          green: '#22c55e',
          red: '#ef4444',
          yellow: '#f59e0b',
          blue: '#3b82f6',
          muted: '#6b7280',
          text: '#e2e8f0',
          textDim: '#94a3b8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
