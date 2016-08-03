const path = require('path');
const webpack = require('webpack');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const PUBLIC_PATH = path.resolve(__dirname, 'plugit/public');
const BUILD_PATH = path.resolve(PUBLIC_PATH, 'build');
const SRC_PATH = path.resolve(PUBLIC_PATH, 'src');
const SCRIPTS_PATH = path.resolve(SRC_PATH, 'scripts');
const TEMPLATES_PATH = path.resolve(SRC_PATH, 'templates');

let plugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.CommonsChunkPlugin('vendors', 'assets/vendors.boundle.js'),
  new webpack.NoErrorsPlugin()
];

let babelrc = {
  presets: [
    "es2015",
    "stage-0",
    "react"
  ]
};

if (process.env.NODE_ENV == 'development') {
  babelrc.presets.push("react-hmre");
} else {
  plugins.push(new HtmlwebpackPlugin({
    title: 'Hello World app',
    template: path.resolve(TEMPLATES_PATH, 'index.ejs'),
    filename: 'index.html',
    chunks: ['app', 'vendors'],
    inject: 'body'
  }));
}

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
        exclude: /node_modules/,
        query: babelrc
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
  plugins,
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
  }
};