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
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  };
}

function moduleObj() {
  return {
    loaders: [
      {
        test: /\.[t|j]s(x?)$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.json',
          compilerOptions: {
            declaration: false
          }
        }
      }
    ]
  };
}

function entry() {
  return path.join(projectRoot, 'src/index.ts');
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
  return {
    'react': 'react',
    'react-dom': 'react-dom'
  };
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
    plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
    plugins.push(new webpack.NoEmitOnErrorsPlugin());
  } else if (env == 'development') {
    plugins.push(new webpack.NoEmitOnErrorsPlugin());
    plugins.push(new webpack.HotModuleReplacementPlugin());
  } else if (env == 'test') {
    plugins.push(new webpack.SourceMapDevToolPlugin({
      test: /\.(ts|js|tsx)($|\?)/i // process .js, .ts, .tsx files only
    }));
  }

  return plugins;
}
