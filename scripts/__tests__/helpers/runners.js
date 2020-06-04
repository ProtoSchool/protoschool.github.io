const inquirer = require('inquirer')

async function protowizard (responses) {
  inquirer.__responses = responses

  await require('../../commands/wizard')()
}

module.exports = {
  protowizard
}
