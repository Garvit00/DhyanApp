/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: "#2997FF",
        gray: {
          DEFAULT: "#86868b",
          100: "#94928d",
          200: "#afafaf",
          300: "#42424570",
        },
        zinc: "#101010",
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'spin-slow': 'spin 4s linear infinite',
        'float-smooth': 'float-smooth 3s ease-in-out infinite',
        'pulse-scale-custom': 'pulse-scale-custom 2s ease-in-out infinite',
        'float-particles': 'float-particles 3s ease-in-out infinite',
        'typewriter-smooth': 'typewriter-smooth 4s ease-in-out infinite',
        'dots-elegant': 'dots-elegant 2s ease-in-out infinite',
        'progress-vertical': 'progress-vertical 2s ease-in-out infinite',
        'fade-in': 'fade-in 1s ease-out forwards',
        'progress-smooth': 'progress-smooth 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'fade-in-scale': 'fade-in-scale 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      backgroundImage: {
        'gradient-conic': 'conic-gradient(from 0deg, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
