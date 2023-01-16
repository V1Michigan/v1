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
        'V1gold': '#F0CC70'
      },
      fontFamily: {
        logo: ["Source Sans Pro", "sans-serif"],
        sans: ["Inter", "sans-serif", ...defaultTheme.fontFamily.sans],
      },
      inset : {
        'nav': '16.0313rem'
      }
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
