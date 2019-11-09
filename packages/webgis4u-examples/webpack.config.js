const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// const devMode = process.env.NODE_ENV !== 'production';
const devMode = false;

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
const dirLibSource = path.resolve(__dirname, '../webgis4u/src');
const appEntry = path.resolve(dirSource, 'index.js');
const appHtml = path.resolve(__dirname, dirNames.public, 'index.html');

/**
 * Parameters for serving HTML
 */
const htmlTemplateParams = {
  PUBLIC_URL: 'test',
};

module.exports = {
  mode: devMode ? 'development' : 'production',
  entry: [
    require.resolve('@babel/polyfill'),
    appEntry,
  ],
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.html$/,
        include: dirSource,
        exclude: /(index)\.html/,
        use: { loader: 'html-loader' },
      },
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
        include: path.resolve(__dirname, '../../'),
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'resolve-url-loader',
          'sass-loader',
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
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
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
