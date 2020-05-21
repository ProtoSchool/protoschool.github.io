const inquirer = jest.genMockFromModule('inquirer')

inquirer.__responses = []

inquirer.prompt = async () => {
  return inquirer.__responses.shift()
}

module.exports = inquirer
