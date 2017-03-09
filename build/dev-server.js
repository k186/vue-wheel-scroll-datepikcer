const path = require('path');
const webpack = require("webpack");
const webpackConfig = require("./webpack.dev.config");
const config = require('../config');

const opn = require('opn');
const express = require("express");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const url = 'http://localhost:' + config.dev.port;
const app = express();

const compiler = webpack(webpackConfig);

const DevMiddleware =  webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true,
});
const HotMiddleware = webpackHotMiddleware(compiler, {
  log: () => {}
});

compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (htmlPluginData, callback) {
    HotMiddleware.publish({action: 'reload'});
    callback();
  });
});
app.use(require('connect-history-api-fallback')())

app.use(DevMiddleware);
app.use(HotMiddleware);

const staticPath = path.posix.join(config.dev.staticPublishPath, config.dev.staticSubDirectory);
app.use(staticPath, express.static('./static'));

DevMiddleware.waitUntilValid(function () {
  console.log(">>Listening at " + url + '\n');
});
app.listen(8080, function (err) {
  if (err) {
    console.log(err);
    return
  }
   if(config.dev.autoOpenBrowser){
   opn(url);
   }
});
