module.exports = {
  content: ['./pages/*/*.{js,ts,jsx,tsx}', './components/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      mobile: { min: '0px', max: '650px' },

      laptop: { min: '650px', max: '1080px' },

      desktop: '1080px',
      // => @media (min-width: 1080px) { ... }
    },
    // spacing: {
    //   15: '3.8rem',
    // },
  },
  plugins: [],
};
