const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// const devMode = process.env.NODE_ENV !== 'production';
const devMode = false;
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
  mode: devMode ? 'development' : 'production',
  // This is just the entry point for webpack, not the one for submodule imports
  entry: './index.js',
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
        exclude: /(node_modules|bower_components|coverage)/,
        use: {
          loader: 'babel-loader',
        },
      }, {
        // Transpile imported scss files
        test: /\.scss$/,
        include: dirSource,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: true } },
          'resolve-url-loader',
          { loader: 'sass-loader', options: { sourceMap: true } },
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
  plugins: [
    new CleanWebpackPlugin([`${dirNameDist}/*`]),
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
