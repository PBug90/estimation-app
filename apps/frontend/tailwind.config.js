const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');

module.exports = {
  purge: createGlobPatternsForDependencies(__dirname),
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    backgroundColor: ({ after }) => after(['disabled']),
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
    },
  },
  plugins: [require('tw-elements/dist/plugin')],
};
