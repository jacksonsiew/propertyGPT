const path = require('path');
const webpack = require('webpack');
const NodemonPlugin = require('nodemon-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const { NODE_ENV = 'production' } = process.env;

module.exports = {
  entry: './server.ts',
  mode: NODE_ENV,
  target: 'node',
  optimization: { minimize: false },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader']
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  externals: [nodeExternals()],
  plugins: [
    new NodemonPlugin(),
    new webpack.DefinePlugin({
      DATABASE_HOST: JSON.stringify(
        NODE_ENV === 'production' ? 'localhost' : '103.233.1.220'
      )
    })
  ]
};
