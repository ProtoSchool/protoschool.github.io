const inquirer = jest.genMockFromModule('inquirer')

inquirer.__responses = []

inquirer.prompt = async (prompts) => {
  const responseSet = inquirer.__responses.shift()

  prompts.forEach((prompt, i) => {
    if (prompt.validate) {
      const validation = prompt.validate(responseSet[prompt.name] || '')

      if (typeof validation !== 'boolean' || !validation) {
        throw new Error(`INQUIRER VALIDATION FAILED: value of "${prompt.name}" with value "${responseSet[prompt.name]}" did not pass validation. Message: "${validation}"`)
      }
    }
  })

  return responseSet
}

module.exports = inquirer
