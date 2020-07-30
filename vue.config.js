const path = require('path')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const PrerenderSPAPlugin = require('prerender-spa-plugin')

const routes = require('./src/routes')

const Renderer = PrerenderSPAPlugin.PuppeteerRenderer

module.exports = {
  publicPath: '/',
  devServer: {
    port: 3000,
    disableHostCheck: true
  },
  configureWebpack: config => {
    config.plugins.push(new MonacoWebpackPlugin({
      languages: ['javascript']
    }))
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader'
    })
    process.env.NODE_ENV === 'production' &&
      config.plugins.push(
        new PrerenderSPAPlugin({
          staticDir: path.join(__dirname, 'dist'),
          routes,
          renderer: new Renderer({
            renderAfterDocumentEvent: 'x-app-rendered',
            renderAfterElementExists: '#app',
            maxConcurrentRoutes: 4
          })
        })
      )
  },
  chainWebpack: config => {
    config.module.rule('eslint').use('eslint-loader')
      .tap(opts => ({
        ...opts,
        failOnError: process.env.NODE_ENV === 'production'
      }))
  },
  pluginOptions: {
    sitemap: {
      baseURL: 'https://proto.school',
      urls: routes,
      outputDir: 'public'
    }
  }
}
