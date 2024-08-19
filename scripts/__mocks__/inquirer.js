const inquirer = jest.genMockFromModule('inquirer')

import { defaultTo } from 'lodash'
import { _onLog } from 'npmlog'

import { assertLogSnapshot as _assertLogSnapshot } from '../../jest/helpers/asserts'

inquirer.__responses = []

inquirer.prompt = async (prompts) => {
  let response = inquirer.__responses.shift()
  let onLog
  let assertLogSnapshot = true

  if (response.response) {
    onLog = response.onLog
    assertLogSnapshot = defaultTo(response.assertLogSnapshot, assertLogSnapshot)
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

  _onLog = assertLogSnapshot ? function (log) {
    _assertLogSnapshot(log)
    onLog && onLog(log)
  } : onLog

  return response
}

export default inquirer
