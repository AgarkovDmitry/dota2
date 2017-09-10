const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const wdm = require('webpack-dev-middleware')
const whm = require('webpack-hot-middleware')
const { createServer } = require('http')
const app = express()

if (process.env.NODE_ENV !== 'production') {
  const config = require('./webpack.config')
  const compiler = webpack(config)

  app.use(wdm(compiler, { noInfo: true, publicPath: config.output.publicPath }))
  app.use(whm(compiler))
}

app.use(express.static(`${__dirname}/dist`))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/*', (req, res) => res.sendFile(__dirname + '/dist/index.html'))

app.listen(process.env.PORT || 5000)