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
        mobile: '900px',
      },
      fontSize: {...createRemEntries(50)},
      colors: {
        primary: '#fec107',
        scrollBar: '#a0a0a0',
        placeHolder: '#767676',

        'zete': {
          'scroll-gray': '#a0a0a0',
          'placeHolder': '#767676',
          'md-placeHolder': '#f3f3f3',
          'memo-border': '#e0e0e0',
          'primary-500': '#fec107',
          'primary-300': '#FFE794',
          'primary-200': '#fff8d9',
          'tagBlack': '#313131',
          'dark': '#2f2f2f',
          'dark-500': '#303030',
          'dark-400': '#383838',
          'dark-300': '#464646',
          'dark-200': '#4b4b4b',
          'dark-100': '#727272',
          'gray-500': '#707070',
          'light-gray-500': '#e1e1e1',
          'light-gray-400': '#e6e6e6',
          'light-gray-300': '#eeeeee',
          'light-gray-200': '#f2f2f2',
          'light-gray-100': '#f5f5f5',
          'gpt-black': '#202123',
          'gpt-500': '#19C37D',
          'gpt-400': '#27bd7f',
          'gpt-300': '#42be8b',
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
