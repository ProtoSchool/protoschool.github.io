const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  configureWebpack: config => {
    config.plugins.push(new MonacoWebpackPlugin())
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader'
    })
  }
}
