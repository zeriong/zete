/** @type {import('tailwindcss').Config} */
const createRemEntries = (size) => {
  return {...Array.from(Array(size + 1)).reduce((accumulator, _, i) => {
      return {...accumulator, [i]: `${i * 0.0625}rem` }
    })
  };
}
const createPxEntries = (size) => {
  return {...Array.from(Array(size + 1)).reduce((accumulator, _, i) => {
      return {...accumulator, [`${i}px`]: `${i}px` }
    })
  };
}
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        'side-menu-md': '920px',
      },
      fontSize: {...createRemEntries(50)},
      colors: {
        'brand': '#fec107',
        'memo': '#fff8d9',
        'gpt': '#19C37D',

        'zete': {
          'scroll-gray': '#a0a0a0',
          'placeHolder': '#767676',
          'md-placeHolder': '#f3f3f3',
          'memo-border': '#e0e0e0',

          'tagBlack': '#313131',
          'dark': '#2f2f2f',
          'dark-500': '#303030',
          'dark-400': '#383838',
          'dark-300': '#464646',
          'dark-200': '#4b4b4b',
          'dark-100': '#727272',
          'gray-500': '#707070',
          'gray-400': '#878787',
          'gray-300': '#b0b0b0',
          'gray-200': '#cecece',
          'gray-100': '#d5d5d5',
          'light-gray-500': '#e1e1e1',
          'light-gray-400': '#e6e6e6',
          'light-gray-300': '#eeeeee',
          'light-gray-200': '#f2f2f2',
          'light-gray-100': '#f5f5f5',
          'gpt-black': '#202123',

          'gpt-200': '#70c9a5',
          'gpt-100': '#a0e3c7',
        }
      },
      spacing: {
        ...createPxEntries(100),
      },
    },
  },
  plugins: [],
}
