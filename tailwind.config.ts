import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F0F0EE',
        surface: '#FFFFFF',
        'surface-2': '#F7F7F5',
        border: '#E4E4E0',
        text: '#1A1A18',
        'text-muted': '#888884',
        'accent-green': '#4ADE80',
        'accent-orange': '#FB923C',
        'accent-red': '#F87171',
        'accent-blue': '#60A5FA',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Sans Mono', 'monospace'],
      },
      borderRadius: {
        card: '14px',
        button: '8px',
        pill: '100px',
      },
      boxShadow: {
        'card': '0 0 0 1px #E4E4E0',
        'card-hover': '0 0 0 1px #1A1A18',
        'modal': '0 8px 32px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
