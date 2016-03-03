const path = require('path');

module.exports = {
  context: __dirname,
  entry: './src/index',
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
        loader: 'babel',
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
  },
};
