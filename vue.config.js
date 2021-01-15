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
          routes: routes.all().map(route => route.path),
          renderer: new Renderer({
            renderAfterDocumentEvent: 'x-app-rendered',
            maxConcurrentRoutes: 4,
            headless: true // If false, display the browser window when rendering. Useful for debugging
          }),
          postProcess (renderedRoute) {
            // ignore redirects
            renderedRoute.route = renderedRoute.originalRoute

            return renderedRoute
          }
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
      urls: routes.all()
        .filter(route => !!route.sitemap)
        .map(route => route.sitemap),
      outputDir: 'public',
      trailingSlash: true
    }
  }
}
