// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
import webpack from '@cypress/webpack-preprocessor'

export default (on, config) => {
  on('before:browser:launch', (browser = {}, launchOptions) => {
    if (browser.name === 'chrome') {
      launchOptions.args.push('--disable-dev-shm-usage')

      return launchOptions
    }
  })
  on('file:preprocessor', webpack({
    webpackOptions: {
      module: {
        rules: [
          {
            test: /\.svg$/,
            exclude: [/node_modules/],
            use: [{
              loader: 'vue-svg-loader'
            }]
          },
          {
            test: /\.md$/,
            exclude: [/node_modules/],
            use: [{
              loader: 'raw-loader'
            }]
          }
        ]
      }
    }
  }))
}
