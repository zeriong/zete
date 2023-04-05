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
      fontSize: {...createRemEntries(50)},
      colors: {
        'primary': {
          500: '#fec107',
        },
        'layoutGray': {
          lightUp: '#f8f8f6',
          light: '#E6E6E6',
          DEFAULT: '#C6C7CD', // f9d270
          deep: '#92929A',

        },
        'zete': {
          'placeHolder': '#767676',
          'md-placeHolder': '#f3f3f3',
          'memo-border': '#e0e0e0',
          'primary-500': '#fec107',
          'primary-300': '#FFE794',
          'primary-200': '#fff8d9',
          'tagBlack': '#313131',
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
        }
      },
      width: {
        'signUpLayout': '120px',
        'login': '500px',
      },
      height: {
        'signUpLayout': '360px',
      },
      spacing: {
        'asideWidth': '300px',
        'headerHeight': '46px',
        ...createPxEntries(100),
      },
    },
  },
  plugins: [],
}
