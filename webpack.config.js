const path = require('path');

module.exports = {
  context: __dirname,
  entry: './index',
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'recora.js',
    library: 'recora',
    libraryTarget: 'umd',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader?loose=all',
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
  },
};
