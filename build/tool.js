const path = require('path');
const config = require('../config');
const ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.staticPath = function (_path) {
  let staticSubDirectory = process.env.NODE_ENV === '"production"'
    ? config.build.staticSubDirectory
    : config.dev.staticSubDirectory
  return path.posix.join(staticSubDirectory, _path)
}
exports.cssLoaders = function (options) {
  options = options || {}
  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === '"production"',
      sourceMap: options.sourceMap
    }
  }
	
  function generateLoaders (loader, loaderOptions) {
    var loaders = [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }
	  
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }
	
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', {indentedSyntax: true}),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}
