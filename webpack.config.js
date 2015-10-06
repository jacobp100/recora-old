const webpack = require('webpack');
const path = require('path');
const ramda = require('ramda');

const ramdaPlugins = Object.keys(ramda).reduce(function transform(out, key) {
  out[key] = `ramda/src/${key}`;
  return out;
}, {});

// ramdaPlugins.pipe = path.join(__dirname, 'debug/pipe');
ramdaPlugins.print = path.join(__dirname, 'debug/print');

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
