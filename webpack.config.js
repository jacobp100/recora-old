const webpack = require('webpack');
const path = require('path');
const ramda = require('ramda');

const ramdaPlugins = Object.keys(ramda).reduce(function transform(out, key) {
  out[key] = `ramda/src/${key}`;
  return out;
}, {});

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
        loader: 'babel-loader?loose=all&stage=0',
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin(ramdaPlugins),
  ],
};
