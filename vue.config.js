module.exports = {
  configureWebpack: config => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader'
    })
  }
}
