import webpack from 'webpack';
// import ExtractTextPlugin from 'extract-text-webpack-plugin';
import path from 'path';

const BUILD_PATH = path.resolve(__dirname, 'public');
const APP_DIR = `${path.resolve(__dirname)}/client`;

export default {
  devtool: 'cheap-eval-source-map',
  entry: `${APP_DIR}/index.js`,
  output: {
    path: BUILD_PATH,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [
          path.join(__dirname, 'client'),
          path.join(__dirname, 'server/shared')
        ],
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.jsx$/,
        include: [
          path.join(__dirname, 'client'),
          path.join(__dirname, 'server/shared')
        ],
        exclude: /node_modules/,
        loader: 'babel-loader'

      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.jpg$/,
        loader: 'file-loader'
      }
    ]
  }
};
