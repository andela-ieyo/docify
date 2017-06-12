const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');

const BUILD_PATH = path.resolve(__dirname, 'public');
const APP_DIR = `${path.resolve(__dirname)}/app`;

module.exports = {
  devtool: 'cheap-eval-source-map',
  entry: `${APP_DIR}/index.js`,
  output: {
    path: BUILD_PATH,
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new ExtractTextPlugin('style.css'),
    new BabiliPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [
          path.join(__dirname, 'app'),
          path.join(__dirname, 'server/shared')
        ],
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.jsx$/,
        include: [
          path.join(__dirname, 'app'),
          path.join(__dirname, 'server/shared')
        ],
        exclude: /node_modules/,
        loader: 'babel-loader'

      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        loaders: ['css-loader', 'sass-loader']
      },
      {
        test: /\.jpg$/,
        loader: 'file-loader'
      }
    ]
  }
};
