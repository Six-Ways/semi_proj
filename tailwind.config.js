/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#495057',
        secondary: '#6c757d',
        background: '#ffffff',
        foreground: '#1a1a1a',
        muted: '#f8f9fa',
        accent: '#f1f3f5',
        border: '#e9ecef',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-serif)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
  plugins: [],
}