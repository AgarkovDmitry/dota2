let config = require('./webpack.config.js')
const webpack = require('webpack')

config.plugins = [
  ...config.plugins,
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }),
  new webpack.optimize.UglifyJsPlugin({
    minimize: true,
    comments: false, // remove comments
    compress: {
       unused: true,
       dead_code: true, // big one--strip code that will never execute
       warnings: false, // good for prod apps so users can't peek behind curtain
       drop_debugger: true,
       conditionals: true,
       evaluate: true,
       drop_console: true, // strips console statements
       sequences: true,
       booleans: true,
    }
  }),
  new webpack.optimize.ModuleConcatenationPlugin(),
]

module.exports = config
