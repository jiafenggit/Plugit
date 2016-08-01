const path = require('path');
const webpack = require('webpack');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const PUBLIC_PATH = path.resolve(__dirname, 'plugIt/public');
const BUILD_PATH = path.resolve(PUBLIC_PATH, 'build');
const SRC_PATH = path.resolve(PUBLIC_PATH, 'src');
const SCRIPTS_PATH = path.resolve(SRC_PATH, 'scripts');
const TEMPLATES_PATH = path.resolve(SRC_PATH, 'templates');

module.exports = {
  entry: {
    app: path.resolve(SCRIPTS_PATH, 'index.js'),
    vendors: ['react', 'react-dom', 'redux', 'react-redux']
  },
  output: {
    path: BUILD_PATH,
    publicPath: '/',
    filename: 'assets/[name].[hash].js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/
      }, {
        test: /\.less$/,
        loader: 'style!css!autoprefixer!less'
      }, {
        test: /\.css$/,
        loader: 'style!css!autoprefixer'
      }, {
        test: /\.(png|jpg)$/,
        loader: 'url?limit=8192'
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin('vendors', 'assets/vendors.boundle.js'),
    new webpack.NoErrorsPlugin(),
    new HtmlwebpackPlugin({
      title: 'Hello World app',
      template: path.resolve(TEMPLATES_PATH, 'index.ejs'),
      filename: 'index.html',
      chunks: ['app', 'vendors'],
      inject: 'body'
    }),
    new CleanWebpackPlugin(['build'], {
      root: PUBLIC_PATH,
      verbose: true,
      dry: false,
      exclude: ['shared.js']
    })
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  proxy: {
    '/': {
      target: 'http://localhost:3000'
    }
  },
  devServer: {
    contentBase: BUILD_PATH
  },
  devtool: 'source-map',
};