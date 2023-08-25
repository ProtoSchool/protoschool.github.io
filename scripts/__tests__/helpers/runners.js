import inquirer from 'inquirer'

export async function protowizard (responses) {
  inquirer.__responses = responses

  await import('../../commands/wizard')()
}
