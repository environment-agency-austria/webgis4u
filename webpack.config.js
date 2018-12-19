const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

/**
 * Source directory
 */
const dirSource = path.resolve(__dirname, 'src');
const dirNameDist = 'build';
/**
 * Distribution directory
 */
const dirDist = path.resolve(__dirname, dirNameDist);

module.exports = {
  entry: './src/index.js',
  devtool: 'source-map',
  output: {
    path: dirDist,
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        include: dirSource,
        exclude: /(node_modules|bower_components|build|coverage)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.scss$/,
        use: [
          // creates style nodes from JS strings
          { loader: 'style-loader' },
          // translates CSS into CommonJS
          { loader: 'css-loader' },
          // compiles Sass to CSS
          { loader: 'sass-loader' },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.json'],
  },
  plugins: [
    new CleanWebpackPlugin([`${dirNameDist}/*`]),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
