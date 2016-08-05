const path = require('path');
const webpack = require('webpack');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const PUBLIC_PATH = path.resolve(__dirname, 'plugit/public');
const BUILD_PATH = path.resolve(PUBLIC_PATH, 'build/plugit-backend');
const SRC_PATH = path.resolve(PUBLIC_PATH, 'src');
const SCRIPTS_PATH = path.resolve(SRC_PATH, 'scripts');
const TEMPLATES_PATH = path.resolve(SRC_PATH, 'templates');

let plugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.CommonsChunkPlugin({
    names: ['vendors']
  }),
  new webpack.NoErrorsPlugin(),
  new HtmlwebpackPlugin({
    title: 'Hello World app',
    template: path.resolve(TEMPLATES_PATH, 'index.ejs'),
    filename: 'index.html',
    chunks: ['app', 'vendors'],
    inject: 'body'
  }),
  new webpack.EnvironmentPlugin([
    "NODE_ENV"
  ])
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
  plugins.push(new CleanWebpackPlugin(['build', 'plugit', 'plugit-backend'], {
    root: PUBLIC_PATH,
    verbose: true,
    dry: false
  }));
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {warnings: false}
  }));
}

module.exports = {
  entry: {
    app: path.resolve(SCRIPTS_PATH, 'index.js'),
    vendors: ['react', 'react-dom', 'redux', 'redux-promise', 'react-redux', 'axios']
  },
  output: {
    path: BUILD_PATH,
    publicPath: process.env.NODE_ENV === 'development' ? '/' : './',
    filename: 'assets/[name].[hash].js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/,
        query: babelrc
      }, {
        test: /\.less$/,
        loader: 'style!css!autoprefixer!less'
      }, {
        test: /\.scss$/,
        loader: 'style!css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass'
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
    extensions: ['', '.js', '.jsx', '.json']
  },
  devServer: {
    contentBase: BUILD_PATH
  },
};