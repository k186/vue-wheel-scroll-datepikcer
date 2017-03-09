const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./webpack.base.config');
const config = require('../config');
const tool = require('./tool');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const env =config.build.env
const ProdConfig = merge(baseConfig, {
  module: {
    rules: tool.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  devtool: config.build.productionSourceMap ? '#source-map' :false,
  output: {
    path: config.build.staticRoot,
    filename: tool.staticPath('js/[name].[chunkhash].js'),
    chunkFilename: tool.staticPath('js/[id].[chunkhash].js')
  },
  plugins: [

    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
     compress: {
     warnings: false,
     drop_debugger: true,
     drop_console: true
     },
      sourceMap: true
     }),

    new ExtractTextPlugin({
      filename: tool.staticPath('css/[name].[contenthash].css')
    }),

    new OptimizeCSSPlugin(),

    new HtmlWebpackPlugin({
      filename: config.build.indexHtml,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'dependency'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {

        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
  ]
});
module.exports = ProdConfig;
