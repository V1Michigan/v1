const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
  },
  purge: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'accent-1': '#333',
        'V1gold': '#F0CC70',
        'gray-350': '#B7BCC5'
      },
      fontFamily: {
        logo: ["Source Sans Pro", "sans-serif"],
        sans: ["Inter", "sans-serif", ...defaultTheme.fontFamily.sans],
      },
      inset : {
        'nav-nouser': '16.0313rem',
        'nav-user': '15.4063rem'
      },
      minHeight: {
        '48': '12rem',
        '52': '13rem',
        '56': '14rem',
        '60': '15rem',
      }
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
