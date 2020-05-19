const { selectTutorial, logResources, createResource } = require('./utils.js')

// const fs = require('fs')
// const promisify = require('util').promisify

// const inquirer = require('inquirer')
const log = require('npmlog')

const run = require('../../modules/run')
const tutorials = require('../../../src/static/tutorials.json')

// customize log styling
log.addLevel('info', 2000, { fg: 'blue', bold: true }, '🧙‍♂️ ProtoWizard')

// determine new tutorial number
log.info("Let's add resources to your tutorial.")
async function command (options) {
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

run(command)
