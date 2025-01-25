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
      'backgroundblack': '#0c0c0c',
      'buttongold': '#FFEEBB',
      'buttondarkgold': '#D4AA5B',
      'outlinebrown': '#362711',
      'offwhite':'#EBE8E0',
      'yellowlight':'#fce47a',
      'chordgold':'#8a7560',
      'darksideblack':'#0C0E0D',
      'prideblue':'#5BCEFA',
      'channelorange':'#ff7e30',
      'bratgreen':'#8ace00',
      'thepodtan':'#E7D7B5',
      'nevermindthebollocksyellow':'#FFEC2D',
      'black':'#000000',
      'igorpink':'#f6aec1',
      'thesmithspurple':'#7F476A',
      'goodnewsgreen':'#A1C683',
      'comedownmachinered':'#C52A2E',
      'whenthepawnred':'#800301',
      'blurorange':'#FA9705',
      'pureguavaorange':'#FF4400',
      '77red':'#FF242C',
      'wallsocketblue':'#78A2CC',
      'pydjpink':'#BC4F56'
    },
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      gridTemplateColumns: {
        '70/30': '70% 28%',
      },

    },

  },
  plugins: [],
}

