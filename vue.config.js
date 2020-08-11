const path = require('path')
const _ = require('lodash')
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
          routes: routes.map(route => route.loc),
          renderer: new Renderer({
            renderAfterDocumentEvent: 'x-app-rendered',
            maxConcurrentRoutes: 4
          }),
          // Allows to customize the HTML and output path before
          // writing the rendered contents to a file.
          // renderedRoute format:
          // {
          //   route: String, // Where the output file will end up (relative to outputDir)
          //   originalRoute: String, // The route that was passed into the renderer, before redirects.
          //   html: String, // The rendered HTML for this route.
          //   outputPath: String // The path the rendered HTML will be written to.
          // }
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
      urls: routes
        .filter(route => route.type === routes.types.STATIC || route.type === routes.types.TUTORIAL)
        .map(route => _.pick(route, ['loc', 'priority', 'lastmod', 'changefreq'])),
      outputDir: 'public',
      trailingSlash: true
    }
  }
}
