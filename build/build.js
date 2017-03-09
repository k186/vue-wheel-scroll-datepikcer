require('shelljs/global');
process.env.NODE_ENV='production'
const path = require('path');
const webpack = require('webpack');
const ProdConfig = require('./webpack.prod.config');
const chalk = require('chalk');
const ora = require('ora');

rm('-rf', './dist');
mkdir('-p', './dist/static');
cp('-R', 'static/*', './dist/static');

const spinner = ora('building production.....');
spinner.start();

webpack(ProdConfig, function (err, stats) {
  spinner.stop();
  if (err)throw err;
  process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModuleIds: false
    }) + '\n\n');
  console.log(chalk.cyan('Build complete.\n'));
  console.log((chalk.yellow(
    '  Tip: built files are meant to be served over an HTTP server.\n' +
    '  Opening index.html over file:// won\'t work.\n'
  )))

})
