'use strict';

var path = require('path');
var webpack = require('webpack');
var projectRoot = __dirname.split('/').slice(0, -2).join('/');
var outputPath = path.join(projectRoot, 'docs/public/vendor/');
var packageFile = require(path.join(projectRoot, 'package.json'));

module.exports = function(env) {
  var cssLoaders, scssLoaders;

  if (env == 'development' || env == 'test') {
    scssLoaders = ['style', 'css?sourceMap', 'postcss?sourceMap', 'sass?sourceMap'];
    cssLoaders =  ['style', 'css?sourceMap', 'postcss?sourceMap'];
  } else {
    scssLoaders = ['style', 'css', 'postcss', 'sass'];
    cssLoaders =  ['style', 'css', 'postcss'];
  }

  return {
    context: projectRoot,
    entry: {
      react: packageFile.vendored
    },
    output: {
      filename: '[name].bundle.js',
      path: outputPath,
      publicPath: '/vendor/',
      library: '[name]_lib'
    },
    devtool: 'eval-cheap-module-source-map',
    module: {
      loaders: [
        {
          test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'url?limit=10000'
        },
        {
          test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
          loader: 'file'
        },
        { test: /\.scss$/, loaders: scssLoaders },
        { test: /\.css$/, loaders: cssLoaders },
        { test: /\.png$/, loader: 'url-loader?limit=100000' },
        { test: /\.jpg$/, loader: 'file-loader' },
        { test: /\.json$/, loader: 'json-loader' }
      ]
    },
    postcss: function () {
      return [require('autoprefixer')];
    },
    plugins: [
      new webpack.DllPlugin({
        path: path.join(outputPath, '[name]-manifest.json'),
        name: '[name]_lib'
      })
    ]
  };
};
