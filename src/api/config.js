/* eslint-disable no-unused-expressions */
export const staticPath = process.env.DATA_STATIC_PATH || 'src/static'
export const tutorialsPath = process.env.DATA_TUTORIALS_PATH || 'src/tutorials'

const boilerplatesPath = process.env.LESSON_BOILERPLATES_PATH || `${tutorialsPath}/boilerplates`

export const boilerplates = {
  path: boilerplatesPath,
  markdownPath: `${boilerplatesPath}/boilerplate.md`,
  challengeMarkdownPath: `${boilerplatesPath}/boilerplate-challenge.md`,
  multipleChoiceJsPath: `${boilerplatesPath}/boilerplate-multiple-choice.js`,
  codeJsPath: `${boilerplatesPath}/boilerplate-code.js`,
  fileUploadJsPath: `${boilerplatesPath}/boilerplate-file-upload.js`
}
