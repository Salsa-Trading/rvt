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
    postcss: postcss(),
    entry: entry(),
    output: output(),
    devtool: devtool(),
    externals: externals(),
    plugins: plugins(),
    devServer: devServer()
  };
};

function resolve() {
  return {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.jsx', '.json']
  };
}

function moduleObj() {
  var cssLoaders, scssLoaders, tsLoaders;

  if (env == 'development' || env == 'test') {
    scssLoaders = ['style', 'css?sourceMap', 'postcss?sourceMap', 'sass?sourceMap'];
    cssLoaders =  ['style', 'css?sourceMap', 'postcss?sourceMap'];
  }
  else {
    scssLoaders = ['style', 'css', 'postcss', 'sass'];
    cssLoaders =  ['style', 'css', 'postcss'];
  }

  if (env == 'development') {
    tsLoaders = ['react-hot-loader/webpack', 'ts-loader?configFileName=./tsconfig.json'];
  }
  else {
    tsLoaders = ['ts-loader?configFileName=./tsconfig.json'];
  }

  return {
    loaders: [
      {
        test: /\.[t|j]s(x?)$/,
        exclude: /node_modules/,
        loaders: tsLoaders
      },
      { test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url?limit=10000' },
      { test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/, loader: 'file' },
      { test: /\.html$/, loader: 'file-loader?name=[name].[ext]' },
      { test: /\.scss$/, loaders: scssLoaders },
      { test: /\.css$/, loaders: cssLoaders },
      { test: /\.png$/, loader: 'url-loader?limit=100000' },
      { test: /\.jpg$/, loader: 'file-loader' },
      { test: /\.json$/, loader: 'json-loader' }
    ]
  };
}

function postcss() {
  return {
    postcss: function () {
      return [require('autoprefixer')];
    }
  };
}

function entry() {
  if (env == 'development') {
    return {
      index: [
        'webpack-dev-server/client?http://localhost:4000',
        'webpack/hot/only-dev-server',
        'react-hot-loader/patch',
        'bootstrap-loader',
        'font-awesome-loader',
        path.join(projectRoot, 'docs/index.tsx')
      ]
    };
  }
  else if (env == 'production') {
    return {
      index: [
        'bootstrap-loader',
        path.join(projectRoot, 'docs/index.tsx')
      ],
    };
  }
}

function output() {
  var outputPath = path.join(projectRoot, 'build/app/');
  return {
    path: outputPath,
    filename: '[name].js',
    publicPath: '/app/'
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
    new webpack.DllReferencePlugin({
      context: '.',
      manifest: require(projectRoot + '/docs/public/vendor/react-manifest.json')
    }),
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

function devServer() {
  if (env == 'production') {
    return undefined;
  }
  else if (env == 'development') {
    return {
      hot: true,
      contentBase: 'docs/public/',
      historyApiFallback: true,
      port: 4000,
    };
  }
}
