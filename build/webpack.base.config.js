const path = require('path');
const webpack = require('webpack');
const config = require('../config');
const tool = require('./tool');
const vueLoaderConfig = require('./vue-loader.config')

function pathResolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    main: './src/main.js',
  },
  output: {
    path: config.build.staticRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.staticPublishPath
      : config.dev.staticPublishPath
  },
  resolve: {
    extensions: ['*', '.js', '.vue', '.json'],
    modules: [path.resolve(__dirname, "src"), "node_modules"],
	  alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: "pre",
        include: [pathResolve('src')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: [pathResolve('src')]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: tool.staticPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: tool.staticPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: []
}
