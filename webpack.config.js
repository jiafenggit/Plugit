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
  new webpack.NoErrorsPlugin(),
  new HtmlwebpackPlugin({
    template: path.resolve(TEMPLATES_PATH, 'index.html'),
    filename: 'index.html',
    chunks: ['app', 'vendors'],
    inject: 'head'
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
  plugins = [...plugins, ...[
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendors']
    }),
    new CleanWebpackPlugin(['build', 'plugit', 'plugit-backend'], {
      root: PUBLIC_PATH,
      verbose: true,
      dry: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  ]];
}

module.exports = {
  entry: {
    app: path.resolve(SCRIPTS_PATH, 'index.js'),
    vendors: ['react', 'react-dom', 'redux', 'react-redux', 'redux-axios-middleware', 'axios']
  },
  output: {
    path: BUILD_PATH,
    publicPath: process.env.NODE_ENV === 'development' ? '/' : '/plugit-backend',
    filename: 'assets/boundles/[name].[hash].js'
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
        loader: 'style!css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!autoprefixer!less'
      }, {
        test: /\.scss$/,
        loader: 'style!css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!autoprefixer!sass'
      }, {
        test: /\.css$/,
        loader: 'style!css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!autoprefixer'
      }, {
        test: /images\/.*\.(gif|png|jpe?g)$/i,
        loaders: [
          `file?hash=sha512&digest=hex&name=${process.env.NODE_ENV === 'development' ? '' : '/'}assets/images/[name].[hash].[ext]`,
          'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
        ]
      }, {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url",
        query: {
          limit: 8192,
          mimetype: 'application/font-woff',
          name: `${process.env.NODE_ENV === 'development' ? '' : '/'}assets/fonts/[name].[ext]`
        }
      }, {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file",
        query: {
          name: `${process.env.NODE_ENV === 'development' ? '' : '/'}assets/fonts/[name].[ext]`
        }
      }
    ]
  },
  plugins,
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  },
  devServer: {
    contentBase: BUILD_PATH
  }
};