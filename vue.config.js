const path = require('path')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer

const api = require('./src/api')

// compute routes for tutorials
const tutorialRoutes = Object.values(api.tutorials.list.get()).reduce((routes, tutorial) => {
  routes.push(`/${tutorial.url}`)
  routes.push(`/${tutorial.url}/resources`)

  return routes.concat(tutorial.lessons.map(lesson => `/${lesson.url}`))
}, [])

const routes = [
  // Pages
  '/',
  '/events',
  '/chapters',
  '/host',
  '/build',
  '/contribute',
  '/tutorials',
  '/news',
  ...tutorialRoutes,
  '/404'
]

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
  }
}
