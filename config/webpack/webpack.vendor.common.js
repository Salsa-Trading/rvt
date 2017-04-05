'use strict';

var path = require('path');
var webpack = require('webpack');
var projectRoot = __dirname.split('/').slice(0, -2).join('/');
var outputPath = path.join(projectRoot, 'docs/public/vendor/');
var packageConfig = require(path.join(projectRoot, 'package.json'));


module.exports = function(env) {
  const scssLoaders = [{
    loader: 'style-loader'
  }, {
    loader: 'css-loader'
  }, {
    loader: 'postcss-loader',
    options: {plugins: postcss()}
  }, {
    loader: 'sass-loader'
  }];

  const cssLoaders = [{
    loader: 'style-loader'
  }, {
    loader: 'css-loader'
  }, {
    loader: 'postcss-loader',
    options: {plugins: postcss()}
  }];

  return {
    context: projectRoot,
    entry: {
      react: packageConfig.vendored
    },
    output: {
      filename: '[name].bundle.js',
      path: outputPath,
      publicPath: '/vendor/',
      library: '[name]_lib'
    },
    devtool: env === 'development' ? 'source-map' : false,
    module: {
      rules: [
        {
          test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'url-loader',
          options: {limit: 10000}
        },
        {
          test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
          loader: 'file-loader'
        },
        { test: /\.scss$/, use: scssLoaders },
        { test: /\.css$/, use: cssLoaders },
        { test: /\.html$/, loader: 'file-loader', options: {name: '[name].[ext]'}},
        { test: /\.jpg$/, loader: 'file-loader' }
      ]
    },
    plugins: [
      new webpack.DllPlugin({
        path: path.join(outputPath, '[name]-manifest.json'),
        name: '[name]_lib'
      })
    ]
  };
};

function postcss() {
  return function (){
    return [require('autoprefixer')];
  };
}
