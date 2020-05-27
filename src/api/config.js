/* eslint-disable no-unused-expressions */

const config = {}

config.staticPath = process.env.DATA_STATIC_PATH || 'src/static'
config.tutorialsPath = process.env.DATA_TUTORIALS_PATH || 'src/tutorials'

config.boilerplates = {}
config.boilerplates.path = process.env.LESSON_BOILERPLATES_PATH || `${config.tutorialsPath}/boilerplates`
config.boilerplates.markdownPath = `${config.boilerplates.path}/boilerplate.md`
config.boilerplates.challengeMarkdownPath = `${config.boilerplates.path}/boilerplate-challenge.md`
config.boilerplates.multipleChoiceJsPath = `${config.boilerplates.path}/boilerplate-multiple-choice.js`
config.boilerplates.codeJsPath = `${config.boilerplates.path}/boilerplate-code.js`
config.boilerplates.fileUploadJsPath = `${config.boilerplates.path}/boilerplate-file-upload.js`

module.exports = config
