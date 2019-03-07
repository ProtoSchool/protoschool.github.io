const CopyWebpackPlugin = require('copy-webpack-plugin')
module.exports = {
  baseUrl: './',
  configureWebpack: config => {
    config.resolve.alias = {
      ipfs: 'ipfs/dist/index.min.js'
    }
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
  }
}
