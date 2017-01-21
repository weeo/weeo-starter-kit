const webpack = require('webpack')
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin")
const path = require('path')

const builds = {
  'development': {
    devtool: 'inline-source-map',
    plugins: [
      new CommonsChunkPlugin("commons.js"),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      })
    ]
  },
  'production': {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
         warnings: false
        }
      }),
      new CommonsChunkPlugin("commons.js"),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
      })
    ]
  }
}

function genConfig (opts) {
  const config = {
    context: path.join(__dirname, '/src/_js'),
    entry: {
      top: './top.js',
      about: './about.js',
      company: './company.js'
    },
    output: {
      path: path.join(__dirname, 'public'),
      filename: '[name].js'
    },
    devtool: opts.devtool,
    resolve: {
      extensions: ['', '.js', '.vue']
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel'
        }, {
          test: /\.vue$/,
          loader: 'vue'
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]?[hash]'
          }
        }
      ]
    },
    babel: {
      presets: ['es2015', 'stage-2'],
      plugins: ['transform-runtime'],
      comments: false
    },
    plugins: opts.plugins
  };

  return config;
}

module.exports = genConfig(builds[process.env.NODE_ENV]);
