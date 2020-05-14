const fs = require('fs')
const promisify = require('util').promisify

const inquirer = require('inquirer')
const log = require('npmlog')

const run = require('../../modules/run')
const projects = require('../../../src/static/projects.json')
const tutorials = require('../../../src/static/tutorials.json')
const courses = require('../../../src/static/courses.json')

async function command (options) {
  log.info('tutorial-creation', "Let's create the files you need to build your tutorial. We'll ask you a few questions to get started.")
  const responses = await inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: 'What is the name of your new tutorial?'
      },
      {
        type: 'input',
        name: 'url',
        message: 'What is the URL for your tutorial? (Hit return to accept our suggestion.)',
        default: function (responses) {
          return responses.title.toLowerCase().split(' ').join('-')
        }
      },
      {
        type: 'list',
        name: 'project',
        message: 'Which project is your tutorial about?',
        choices: projects.map(project => ({name: project.name, value: project.id}))
      },
      {
        type: 'input',
        name: 'description',
        message: 'Please provide a short description for your tutorial to be displayed in tutorial listings.'
      }
    ])

  // determine new tutorial number
  const tutorialKeys = Object.keys(tutorials)
  const tutorialNumber = (parseInt(tutorialKeys.sort()[tutorialKeys.length - 1]) + 1).toString().padStart(4, 0)

  // create new directory
  await promisify(fs.mkdir)(`src/tutorials/${tutorialNumber}-${responses.url}`)

  // update all array in courses.json
  courses.all.push(tutorialNumber)
  await promisify(fs.writeFile)('src/static/courses.json', JSON.stringify(courses, null, 4))

  // add entry to tutorials.json
  const newTutorial = {
    url: responses.url,
    project: responses.project,
    title: responses.title,
    description: responses.description,
    newMessage: '',
    updateMessage: '',
    createdAt: new Date(),
    updatedAt: '',
    resources: []
  }

  tutorials[tutorialNumber] = newTutorial
  await promisify(fs.writeFile)('src/static/tutorials.json', JSON.stringify(tutorials, null, 4))

  // log success
  log.info('tutorial-creation', `Thanks! We've created a directory for your tutorial at src/tutorials/${tutorialNumber}-${responses.url}/}.`)
  log.info('tutorial-creation', `Preview your tutorial by visiting: http://localhost:3000/#/${responses.url}`)
}

run(command)
