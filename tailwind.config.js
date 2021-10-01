module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        dark: '#151515',
      },
      fontFamily: {
        comp: ['IBM Plex Mono'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
