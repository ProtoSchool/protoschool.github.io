const inquirer = jest.genMockFromModule('inquirer')

const _ = require('lodash')
const npmlog = require('npmlog')

const jestAsserts = require('../../jest/helpers/asserts')

inquirer.__responses = []

inquirer.prompt = async (prompts) => {
  let response = inquirer.__responses.shift()
  let onLog
  let assertLogSnapshot = true

  if (response.response) {
    onLog = response.onLog
    assertLogSnapshot = _.defaultTo(response.assertLogSnapshot, assertLogSnapshot)
    response = response.response
  }

  prompts.forEach((prompt, i) => {
    if (prompt.validate) {
      const validation = prompt.validate(response[prompt.name] || '')

      if (typeof validation !== 'boolean' || !validation) {
        throw new Error(`INQUIRER VALIDATION FAILED: value of "${prompt.name}" with value "${response[prompt.name]}" did not pass validation. Message: "${validation}"`)
      }
    }
  })

  npmlog._onLog = assertLogSnapshot ? function (log) {
    jestAsserts.assertLogSnapshot(log)
    onLog && onLog(log)
  } : onLog

  return response
}

module.exports = inquirer
