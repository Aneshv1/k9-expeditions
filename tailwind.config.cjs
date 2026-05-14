/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        k9: {
          green: '#1D9E75',
          'green-dark': '#178A65',
          'green-light': '#E1F5EE',
          accent: '#D4A017',
        },
        brand: {
          charcoal: '#1A1A1A',
          'charcoal-light': '#2A2A2A',
          dark: '#111111',
          muted: '#F5F5F4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
