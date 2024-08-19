import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin'
import { join } from 'path'
import PrerenderSPAPlugin from 'prerender-spa-plugin'

import { all } from './src/routes.js'

const { PuppeteerRenderer } = PrerenderSPAPlugin

const Renderer = PuppeteerRenderer

export const publicPath = '/'
export const devServer = {
  port: 3000,
  disableHostCheck: true
}
export function configureWebpack (config) {
  config.plugins.push(new MonacoWebpackPlugin({
    languages: ['javascript']
  }))
  config.output.hashFunction = 'sha256'
  config.module.rules.push({
    test: /\.md$/,
    use: 'raw-loader'
  })
  process.env.NODE_ENV === 'production' &&
    config.plugins.push(
      new PrerenderSPAPlugin({
        staticDir: join(__dirname, 'dist'),
        routes: all().map(route => route.path),
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
}
export function chainWebpack (config) {
  config.module.rule('eslint').use('eslint-loader')
    .tap(opts => ({
      ...opts,
      failOnError: process.env.NODE_ENV === 'production'
    }))
}

export const pluginOptions = {
  sitemap: {
    baseURL: 'https://proto.school',
    urls: all()
      .filter(route => !!route.sitemap)
      .map(route => route.sitemap),
    outputDir: 'public',
    trailingSlash: true
  }
}
