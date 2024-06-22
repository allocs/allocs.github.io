/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'weezerblue': '#189BCC',
      'lovelesspink': '#D03A75',
      'lovelessblack': '#53152E',
      'exodusgold': '#B3883A',
      'disciplinered': '#B9262E',
      'disciplinegray': '#90928F',
      'backgroundgray': '#181915',
      'backgroundblack': '#13130F',
      'buttongold': '#FFEEBB',
      'buttondarkgold': '#D4AA5B',
      'outlinebrown': '#362711',
      'offwhite':'#EBE8E0',
      'yellowlight':'#fce47a',
      'chordgold':'#8a7560'
    },
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      gridTemplateColumns: {
        '70/30': '70% 28%',
      }
    },
  },
  plugins: [],
}

