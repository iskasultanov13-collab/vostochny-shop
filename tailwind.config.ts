import type { Config } from 'tailwindcss'
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'black': '#0a0a0a',
        'black-card': '#141414',
        'black-border': '#1e1e1e',
        'white': '#f5f5f0',
        'white-dim': '#a8a8a0',
        'white-faint': '#4a4a45',
        'crimson': '#8b1a1a',
        'crimson-bright': '#c41e1e',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body: ['Montserrat', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config