const webpack = require('webpack')
const path = require('path')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OfflinePlugin = require('offline-plugin')

module.exports = {
  entry: {
   app: [
     path.join(__dirname, './src/')
   ],
   libs: [
     'react',
     'react-dom',
     'mobx',
     'mobx-react',
     'recompose'
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
      { test: /\.(ts|tsx)?$/, loader: 'awesome-typescript-loader' },
      { test: /\.s?css$/, loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader?modules', 'sass-loader'] }) },
      { test: /\.(jpg|svg|png|ttf)$/, loader: 'file-loader?&name=images/[hash].[ext]' },
    ]
  },
  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  devServer: {
    contentBase: './dist',
    historyApiFallback: true,
    hot: true,
    publicPath: '/'
  },
  plugins: [
    new ExtractTextPlugin('styles/bundle.css'),
    new webpack.optimize.CommonsChunkPlugin({ name: 'libs' }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new OfflinePlugin({
      safeToUseOptionalCaches: true,
      excludes: ['./index.html'],
      caches: {
        main: [':rest:'],
        additional: [':externals:'],
        optional: []
      },
      externals: [
        './dist/index.html'
      ],
      ServiceWorker: {
        events: true,
        navigateFallbackURL: '/',
        publicPath: '/sw.js'
      },
      AppCache: {
        events: true,
        publicPath: '/appcache',
        FALLBACK: {
          '/': '/'
        },
      },
    }),
  ]
}
