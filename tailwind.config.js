module.exports = {
  theme: {
    filter: {
      none: 'none',
      blur: 'blur(15px)',
    },
    backdropFilter: {
      none: 'none',
      blur: 'blur(5px)',
      'blur-heavy': 'blur(20px)',
    },
    extend: {},
  },
  variants: {},
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  plugins: [require('@tailwindcss/ui'), require('tailwindcss-filters')],
  purge: [
    './src/**/*.html',
    './src/**/*.tsx',
    './src/**/*.ts',
    './src/**/*.jsx',
    './src/**/*.js',
  ],
}
