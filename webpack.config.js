const path = require('path');
const webpack = require('webpack');
const babelSettings = { presets: ['react', 'es2015'] };

const PORT = parseInt(process.env.PORT, 10) + 1 || 3003;
const HOST = '0.0.0.0';
const PUBLIC_PATH = `//${HOST}:${PORT}/assets/`;

module.exports = {
  entry: {
    app: [
      `webpack-hot-middleware/client?path=//${HOST}:${PORT}/__webpack_hmr`,
      './client-render.js'
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: PUBLIC_PATH
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel',
        query: babelSettings,
        exclude: /node_modules/
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
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};
