const path = require('path');
const webpack = require('webpack');
const config = require('./src/config');

module.exports = {
  debug: true,
  // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
  // eval cuts size to 50%, alternative is cheap-module-eval-source-map
  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client',
    'react-hot-loader/patch',
    // 'webpack/hot/dev-server',
    './src/client-render'
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loaders: ['babel'],
        exclude: /node_modules/,
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.(less)$/,
        loaders: ['style', 'css', 'less']
      },
      {
        test: /\.(scss)$/,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.(css)$/,
        loaders: ['style', 'css']
      },
      {
        test: /\.(png|jpe?g)(\?.*)?$/,
        loader: 'url?limit=8182'
      },
      {
        test: /\.(svg|ttf|woff2?|eot)(\?.*)?$/,
        loader: 'file'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};
