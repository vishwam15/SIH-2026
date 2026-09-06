/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#3b82f6',
          dark: '#1d4ed8',
          glow: 'rgba(59, 130, 246, 0.4)',
        },
        risk: {
          low: '#10b981',       // Emerald 500
          moderate: '#f59e0b',  // Amber 500
          high: '#f97316',      // Orange 500
          critical: '#ef4444',  // Red 500
        },
        dark: {
          base: '#090d16',
          card: '#0f172a',
          cardHover: '#1e293b',
          border: 'rgba(255, 255, 255, 0.08)',
          accent: '#1e293b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'radar-sweep': 'radarSweep 4s linear infinite',
        'rain-drop': 'rainDrop 1.2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 15px rgba(239, 68, 68, 0.6)' },
          '50%': { opacity: 0.7, boxShadow: '0 0 5px rgba(239, 68, 68, 0.2)' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        rainDrop: {
          '0%': { transform: 'translateY(-100px)', opacity: 0 },
          '50%': { opacity: 1 },
          '100%': { transform: 'translateY(800px)', opacity: 0.2 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
