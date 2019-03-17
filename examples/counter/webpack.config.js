var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [
    './index.js',
    //Remove the following line to remove devTools
    './devTools.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath:''
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'ngRedux Counter',
      template: './index.html',
      inject: 'body'
    }),
    new webpack.NoErrorsPlugin()
  ],
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel",
        exclude: /node_modules/,
        query:
        {
          presets:['es2015','react']
        }
      },
      {
        test: /\.html$/,
        loader: 'html'
      }
    ]
  }
};
