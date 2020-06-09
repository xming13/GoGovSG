/* eslint-disable import/no-extraneous-dependencies */
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

const [webpackConfig] = require('../../webpack.config')()

webpackConfig.mode = 'development'

webpackConfig.entry.unshift(
  'webpack-hot-middleware/client?reload=true&timeout=1000',
)
webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin())

const compiler = webpack(webpackConfig)

export default [
  webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
  }),
  webpackHotMiddleware(compiler),
]
