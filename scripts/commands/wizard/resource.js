const inquirer = require('inquirer')
const log = require('npmlog')

const {
  offerRepeat,
  validateStringPresent,
  selectTutorial,
  getTutorialLessons,
  saveStaticJsonFile,
  promptCreateFirst,
  logEverythingDone
} = require('./utils.js')

const tutorials = require('../../../src/static/tutorials.json')

// *** HELPER FUNCTIONS ***

function logResources (resources) {
  console.group()
  resources.forEach(resource => {
    log.info(`> ${resource.title} (${resource.type})`)
  })
  console.groupEnd()
}

// *** INPUT VALIDATION ***

function validateUrl (url) {
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('ipfs://')) {
    return true
  } else {
    return `That URL doesn't look right. Please be sure to start with \`http://\` or \`https://\`.`
  }
}

// *** RESOURCE CREATION ***

async function createResourceIntro () {
  // determine new tutorial number
  log.info("Let's add resources to your tutorial.")

  // BUG: says selectTutorial is not a function (but it works when called from lesson.js)
  const { tutorial, tutorialId } = await selectTutorial('resources')
  const resources = tutorials[tutorialId].resources

  // print existing resources if present
  if (resources.length === 0) {
    log.info("Let's create your first resource!")
  } else {
    log.info("Here are the resources you've created so far:")

    logResources(resources)
  }

  await createResource(tutorial, tutorialId) // loops until user declines to repeat, then offers closing statements
}

async function createResource (tutorial, tutorialId) {
  const responses = await inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: "What's the title of this resource?",
        validate: validateStringPresent
      },
      {
        type: 'input',
        name: 'link',
        message: "What's the URL of this resource?",
        validate: validateUrl
      },
      {
        type: 'input',
        name: 'description',
        message: 'Add a description of this resource.',
        validate: validateStringPresent
      },
      {
        type: 'list',
        name: 'type',
        message: "What's the format of this resource?",
        choices: [ 'article', 'demo', 'docs', 'tool', 'tutorial', 'video' ]
      }
    ])

  // create resource in tutorials.json
  const newResource = {
    title: responses.title,
    link: responses.link.toLowerCase(),
    type: responses.type,
    description: responses.description
  }

  tutorials[tutorialId].resources.push(newResource)
  await saveStaticJsonFile('tutorials.json', tutorials)

  // log success
  log.info(`We've added "${responses.title}" to your resources list.`)

  await offerRepeat(tutorial, tutorialId, 'resource') // loops until user declines to repeat
}

async function afterResourceCreate (tutorial, tutorialId) {
  log.info(`You can preview your resources page by running \`npm start\` and visiting: http://localhost:3000/#/${tutorial.url}/resources`)
  log.info('Need to change something? You can edit your resources in the file `src/static/tutorials.json`.')

  // prompt to create lessons if not yet done
  if ((await getTutorialLessons(tutorial, tutorialId)).length === 0) {
    log.info(`Looks like your "${tutorial.title}" tutorial doesn't have any lessons yet.`)

    await promptCreateFirst('resource', tutorialId)
  } else {
    logEverythingDone(tutorial)
  }
}

module.exports = { createResourceIntro, createResource, afterResourceCreate }
