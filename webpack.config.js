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
      }, {
        // Transpile imported scss files
        test: /\.scss$/,
        use: [
          // creates style nodes from JS strings
          { loader: 'style-loader' },
          // translates CSS into CommonJS
          { loader: 'css-loader' },
          // resolve relative urls
          { loader: 'resolve-url-loader' },
          // compiles Sass to CSS
          { loader: 'sass-loader' },
        ],
      }, {
        // Transpile imported image files
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
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
