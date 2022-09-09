/** @type {import('tailwindcss').Config} */
const { join } = require('path');
const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
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
