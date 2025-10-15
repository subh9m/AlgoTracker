/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
  fadeIn: 'fadeIn 0.8s ease-out forwards',
  scaleIn: 'scaleIn 0.3s ease-out forwards',
  matrixScroll: 'matrixScroll 10s linear infinite',
},
keyframes: {
  fadeIn: { '0%': { opacity: 0, transform: 'translateY(10px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
  scaleIn: { '0%': { opacity: 0, transform: 'scale(0.9)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
  matrixScroll: {
    '0%': { backgroundPosition: '0 0' },
    '100%': { backgroundPosition: '0 10px' },
  },
}

    },
  },
  plugins: [],
}
