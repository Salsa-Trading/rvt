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
    plugins: plugins(),
    devServer: devServer()
  };
};

function resolve() {
  return {
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.jsx', '.json']
  };
}

function moduleObj() {
  const scssLoaders = [{
    loader: 'style-loader',
  }, {
    loader: 'css-loader',
    options: {
      sourceMap: env === 'development'
    }
  }, {
    loader: 'postcss-loader',
    options: {
      plugins: postcss(),
      sourceMap: env === 'development'
    }
  }, {
    loader: 'sass-loader',
    options: {
      sourceMap: env === 'development'
    }
  }];

  const cssLoaders = [{
    loader: 'style-loader'
  }, {
    loader: 'css-loader',
    options: {
      sourceMap: env === 'development'
    }
  }, {
    loader: 'postcss-loader',
    options: {
      sourceMap: env === 'development',
      plugins: postcss()
    }
  }];

  let tsLoaders;
  if (env == 'development') {
    tsLoaders = [{
      loader: 'react-hot-loader/webpack'
    }, {
      loader: 'ts-loader',
      options: {
        configFileName: './tsconfig.json'
      }
    }];
  } else {
    tsLoaders = [{
      loader: 'ts-loader',
      options: {
        configFileName: './tsconfig.json'
      }
    }];
  }

  return {
    rules: [
      {
        test: /\.[t|j]s(x?)$/,
        exclude: /node_modules/,
        use: tsLoaders
      },
      { test: /\.scss$/, use: scssLoaders },
      { test: /\.css$/, use: cssLoaders },
      { test: /\.html$/, loader: 'file-loader', options: {name: '[name].[ext]'}},
      { test: /\.png$/, loader: 'url-loader', options: {limit: 10000}},
      { test: /\.jpg$/, loader: 'file-loader' }
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
        path.join(projectRoot, 'docs/demo.scss'),
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
