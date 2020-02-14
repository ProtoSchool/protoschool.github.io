const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  publicPath: './',
  devServer: {
    port: 3000,
    disableHostCheck: true
  },
  configureWebpack: config => {
    config.plugins.push(
      new CopyWebpackPlugin([
        {
          from: 'node_modules/monaco-editor/min/vs',
          to: 'vs'
        }
      ])
    )
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader'
    })
  },
  chainWebpack: config => {
    config.module.rule('eslint').use('eslint-loader')
      .tap(opts => ({
        ...opts,
        failOnError: process.env.NODE_ENV === 'production'
      }))
  }
}
