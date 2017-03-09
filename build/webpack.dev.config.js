const path = require('path');
const webpack = require('webpack');
const config = require('../config');
const tool =require('./tool');
const baseConfig = require('./webpack.base.config');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

Object.keys(baseConfig.entry).forEach(function (name) {
  baseConfig.entry[name] = ['./build/dev-client'].concat(baseConfig.entry[name])
});

const devConfig = merge(baseConfig, {
  module: {
    rules: tool.styleLoaders({sourceMap:config.dev.cssSourceMap})
  },
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    new webpack.HotModuleReplacementPlugin(),

    new webpack.NoEmitOnErrorsPlugin(),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
    }),
    new FriendlyErrorsPlugin()
  ]
});
module.exports = devConfig;
