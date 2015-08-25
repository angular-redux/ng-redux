var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [
    'webpack/hot/dev-server',
    './index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'ngRedux Counter',
      template: './index.html',
      inject: 'body'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.ts', '.webpack.js', '.web.js', '.js']
  },
  devtool: 'source-map',
  module: {
    loaders: [
     {test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
     { test: /\.html$/, loader: 'html' }
     ]
  }
};
