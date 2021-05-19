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
        'gray-custom': '#727272'
      },
      fontFamily: {
        logo: ["Source Sans Pro", "sans-serif"],
        sans: ["Inter", "sans-serif", ...defaultTheme.fontFamily.sans],
        oswald: ["Oswald", "sans-serif"]
      },
    },
  },
  variants: {},
  plugins: [],
}
