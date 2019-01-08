const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

/**
 * Name of common used directories
 */
const dirNames = {
  src: 'src',
  build: 'build',
  public: 'public',
};
/**
 * Source directory
 */
const dirSource = path.resolve(__dirname, dirNames.src);
/**
 * Distribution directory
 */
const dirDist = path.resolve(__dirname, dirNames.build);
/**
 * Directory to the library entry point
 */
const dirLibSource = path.resolve(__dirname, '../../src/webgis4u');
const appEntry = path.resolve(dirSource, 'index.js');
const appHtml = path.resolve(__dirname, dirNames.public, 'index.html');

/**
 * Parameters for serving HTML
 */
const htmlTemplateParams = {
  PUBLIC_URL: 'test',
};

module.exports = {
  entry: [
    require.resolve('@babel/polyfill'),
    appEntry,
  ],
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, '../../'),
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
    alias: {
      webgis4u: dirLibSource,
    },
  },
  plugins: [
    new CleanWebpackPlugin([`${dirNames.build}/*`]),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'Development',
      template: appHtml,
      templateParameters: htmlTemplateParams,
    }),
  ],
  output: {
    path: dirDist,
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  devServer: {
    contentBase: `./${dirNames.build}`,
  },
};
