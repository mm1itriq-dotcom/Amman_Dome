/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#0B0C0E',
          surface: '#131519',
          elevated: '#1A1D24',
        },
        limestone: {
          DEFAULT: '#F4EFE6',
          warm: '#EAE2D3',
          deep: '#D8CEBE',
        },
        brass: {
          DEFAULT: '#D4A359',
          light: '#E5BE7E',
          muted: '#9E783D',
        },
        terracotta: {
          DEFAULT: '#E06D46',
        },
        emerald: {
          oasis: '#45B28B',
        },
        stone: {
          alabaster: '#F7F5F0',
          muted: '#9A9891',
        }
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        display: ['"Syne"', '"Readex Pro"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', '"IBM Plex Sans Arabic"', 'sans-serif'],
        arabicDisplay: ['"Readex Pro"', 'sans-serif'],
        arabicSans: ['"IBM Plex Sans Arabic"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
