/**
 * Configuration for `babel`
 * @see https://babeljs.io/docs/en/configuration
 */
module.exports = {
  presets: ['@babel/preset-env'],
  plugins: [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-class-properties',
  ],
};
