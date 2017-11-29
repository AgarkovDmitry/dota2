const webpack = require('webpack')
const path = require('path')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OfflinePlugin = require('offline-plugin')

module.exports = {
  entry: {
   app: [
    // 'react-hot-loader/patch',
    // 'webpack-dev-server/client?http://localhost:3000',
    // 'webpack/hot/only-dev-server',
     path.join(__dirname, './src/')
   ],
   libs: [
     'react',
     'react-dom',
     'mobx',
     'mobx-react'
   ],
 },
 output: {
    filename: '[name].js',
    path: path.join(__dirname, '/dist'),
    chunkFilename: '[name].js',
    publicPath: '/'
  },
  module: {
    loaders: [
      { test: /\.(ts|tsx)?$/, loaders: [
          // "react-hot-loader/webpack",
          "awesome-typescript-loader"
      ] },
      { test: /\.s?css$/, loader: ExtractTextPlugin.extract({ 
        fallback: 'style-loader',
        use: [
          'css-loader?modules',
          'sass-loader',
        ]
      }) },
      { test: /\.(jpg|svg|png|ttf)$/, loader: 'file-loader?&name=images/[hash].[ext]' },
    ]
  },
  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  // devServer: {
  //   contentBase: './dist',
  //   publicPath: '/',
  //   port: 3000,

  //   inline: true,
  //   historyApiFallback: true,
  //   stats: 'normal',
  // },
  plugins: [
    new ExtractTextPlugin('styles/bundle.css'),
    new webpack.optimize.CommonsChunkPlugin({ name: 'libs' }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    // new OfflinePlugin({
    //   publicPath: '/',
    //   externals: [
    //     '/'
    //   ],
    //   ServiceWorker: {
    //     navigateFallbackURL: '/'
    //   },
    //   caches: {
    //     main: [':rest:'],
    //     additional: [':externals:'],
    //     optional: []
    //   },
    // }),
  ]
}
