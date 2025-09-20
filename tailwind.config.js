module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './Components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6D24FF',
        darkBg: '#1A1D1F',
        darkSecondary: '#222628',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};