'use strict';

var path = require('path');
var webpack = require('webpack');
var projectRoot = __dirname.split('/').slice(0, -2).join('/');
var env;

module.exports = function(_env) {
  env = _env;
  return {
    context: projectRoot,
    resolve: resolve(),
    module: moduleObj(),
    entry: entry(),
    output: output(),
    devtool: devtool(),
    externals: externals(),
    plugins: plugins()
  };
};

function resolve() {
  return {
    extensions: ['', '.ts', '.tsx', '.js', '.jsx', '.json']
  };
}

function moduleObj() {
  return {
    loaders: [
      {
        test: /\.[t|j]s(x?)$/,
        exclude: /node_modules/,
        loaders: ['ts-loader?configFileName=./tsconfig.json']
      }
    ]
  };
}

function entry() {
  return {
    index: [
      path.join(projectRoot, 'src/index.ts')
    ],
  };
}

function output() {
  return {
    path: path.join(projectRoot, '/dist/'),
    filename: 'rvt.js',
    library: ['RVT'],
    libraryTarget: 'umd',
  };
}

function devtool() {
  if (env == 'development' || env == 'test') {
    return 'eval-cheap-module-source-map';
  }
}

function externals() {
  if (env == 'development' || env == 'test') {
    return {
      'react/addons': true,
      'react/lib/ExecutionEnvironment': true,
      'react/lib/ReactContext': 'window'
    };
  }
}

function plugins() {
  var plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(env)
      }
    })
  ];

  if (env == 'production') {
    plugins.push(new webpack.optimize.OccurenceOrderPlugin());
    plugins.push(new webpack.optimize.DedupePlugin());
    plugins.push(new webpack.NoErrorsPlugin());
  }
  else if (env == 'development') {
    plugins.push(new webpack.HotModuleReplacementPlugin());
    plugins.push(new webpack.NoErrorsPlugin());
  }

  return plugins;
}
