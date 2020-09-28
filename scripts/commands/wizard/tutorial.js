const inquirer = require('inquirer')
const log = require('npmlog')

const api = require('../../../src/api')

const {
  validateStringPresent,
  promptCreateFirst,
  logPreview,
  logCreateLater
} = require('./utils.js')

// *** INPUT VALIDATION ***

function validateUniqueTitle (title, tutorials) {
  if (Object.values(tutorials).some(tutorial => tutorial.title.toLowerCase() === title.toLowerCase())) {
    return `That tutorial already exists. Please pick another title.`
  } else {
    return validateStringPresent(title)
  }
}

function validateUniqueUrl (url, tutorials) {
  if (Object.values(tutorials).some(tutorial => tutorial.url.toLowerCase() === url.toLowerCase())) {
    return `That path already exists. Please pick another.`
  } else {
    return validateStringPresent(url)
  }
}

// *** TUTORIAL CREATION ***

async function createTutorial ({ createLesson, createResource, createQuiz }, { skipPromptLesson } = {}) {
  log.info("Let's create the files you need to build your tutorial. We'll ask you a few questions to get started.")

  const tutorials = await api.tutorials.list.get()

  const responses = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'What is the name of your new tutorial?',
      validate: title => validateUniqueTitle(title, tutorials)
    },
    {
      type: 'input',
      name: 'url',
      message: 'What short title should appear in the URL for your tutorial (eg `http://proto.school/short-tutorial-title/). It will also be used to create the abbreviated title that is shown in the breadcrumb navigation and the small header at the top of each page of your tutorial. In most cases this will match your tutorial title. (Hit return to accept our suggestion.)',
      default: function (responses) {
        return responses.title.toLowerCase().split(' ').join('-')
      },
      validate: url => validateUniqueUrl(url, tutorials)
    },
    {
      type: 'list',
      name: 'project',
      message: 'Which project is your tutorial about?',
      choices: api.projects.list.get().map(project => ({name: project.name, value: project.id}))
    },
    {
      type: 'input',
      name: 'description',
      message: 'Please provide a short description for your tutorial to be displayed in tutorial listings.',
      validate: validateStringPresent
    },
    {
      type: 'confirm',
      name: 'addNewMessage',
      message: `When your tutorial is first published, we'll alert users that it's new. Would you like to add a custom message to that alert? (See an example at https://bit.ly/protoschool-alerts.)`
    },
    {
      type: 'input',
      name: 'newMessage',
      message: 'What message should we share about the new tutorial?',
      when: function (responses) {
        return responses.addNewMessage
      }
    }
  ])

  const tutorial = await api.tutorials.create(responses)

  await api.courses.add(tutorial.id)

  // log success
  log.info(`Thanks! We've created a directory for your tutorial at \`src/tutorials/${tutorial.formattedId}-${responses.url}/\`.`)
  logPreview('your tutorial', responses.url)

  if (!skipPromptLesson) {
    // suggest creating a lesson unless noPrompt: true was passed in
    if (await promptCreateFirst('lesson', tutorial.id)) {
      await createLesson(tutorial.id, { createResource })
    } else {
      logCreateLater('lessons')
    }
  }

  return tutorial
}

module.exports = { createTutorial }
