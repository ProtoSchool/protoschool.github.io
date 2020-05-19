const promisify = require('util').promisify

const fs = require('fs')
const inquirer = require('inquirer')
const log = require('npmlog')

const tutorials = require('../../../src/static/tutorials.json')
const courses = require('../../../src/static/courses.json')
const projects = require('../../../src/static/projects.json')

const { validateStringPresent, promptCreateFirst } = require('./utils.js')

const tutorialKeys = Object.keys(tutorials)

// *** HELPER FUNCTIONS ***

function nextTutorialNumber () {
  return (parseInt(tutorialKeys.sort()[tutorialKeys.length - 1]) + 1).toString().padStart(4, 0)
}

// *** INPUT VALIDATION ***

function validateUniqueTitle (string) {
  if (!string.trim()) {
    return `Oops! You can't leave this blank, but you'll have a chance to edit it later.`
  } else if (Object.values(tutorials).some(tutorial => tutorial.title.toLowerCase() === string.toLowerCase())) {
    return `That tutorial already exists. Please pick another title.`
  } else {
    return true
  }
}

function validateUniqueUrl (string) {
  if (!string.trim()) {
    return `Oops! You can't leave this blank, but you'll have a chance to edit it later.`
  } else if (Object.values(tutorials).some(tutorial => tutorial.url.toLowerCase() === string.toLowerCase())) {
    return `That path already exists. Please pick another.`
  } else {
    return true
  }
}

// *** TUTORIAL CREATION ***

async function createTutorial () {
  log.info("Let's create the files you need to build your tutorial. We'll ask you a few questions to get started.")
  const responses = await inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: 'What is the name of your new tutorial?',
        validate: validateUniqueTitle
      },
      {
        type: 'input',
        name: 'url',
        message: 'What short title should appear in the URL for your tutorial (eg `http://proto.school/#/short-tutorial-title/). It will also be used to create the abbreviated title that is shown in the breadcrumb navigation and the small header at the top of each page of your tutorial. In most cases this will match your tutorial title. (Hit return to accept our suggestion.)',
        default: function (responses) {
          return responses.title.toLowerCase().split(' ').join('-')
        },
        validate: validateUniqueUrl
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
        message: 'Please provide a short description for your tutorial to be displayed in tutorial listings.',
        validate: validateStringPresent
      }
    ])

  // determine new tutorial number
  const tutorialNumber = nextTutorialNumber()

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
  log.info(`Thanks! We've created a directory for your tutorial at \`src/tutorials/${tutorialNumber}-${responses.url}/\`.`)
  log.info(`Preview your tutorial by running \`npm start\` and visiting: http://localhost:3000/#/${responses.url}`)
  // suggest creating a lesson
  await promptCreateFirst('lesson', tutorialNumber)
}

module.exports = { createTutorial }
