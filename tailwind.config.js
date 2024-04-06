/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["*html"],
  theme: {
    screens: {
      'phone': {'min': '0px', 'max': '400px'},

      'tablet': {'min': '400px', 'max': '740px'},

      'laptop': {'min': '740px', 'max': '3000px'},

    },
    extend: {
      width: {
        calc60: 'calc(100vw - 110px)',
        // calc50: 'calc(100vw - 50px)',
      },
      fontFamily: {
        poppins: ['Poppins']
      }
    },
  },
  plugins: [],
}

