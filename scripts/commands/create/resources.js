const { selectTutorial } = require('./utils.js')

const fs = require('fs')
const promisify = require('util').promisify

const inquirer = require('inquirer')
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
    console.group()
    resources.forEach(resource => {
      log.info(`${resource.title} (${resource.type})`)
    })
    console.groupEnd()
    log.info("Let's create your next resource!")
  }

  const responses = await inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: "What's the title of this resource?"
      },
      {
        type: 'input',
        name: 'link',
        message: "What's the URL of this resource?"
      },
      {
        type: 'input',
        name: 'description',
        message: 'Add a description of this resource.'
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
    link: responses.link,
    type: responses.type,
    description: responses.description
  }

  tutorials[tutorialId].resources.push(newResource)
  await promisify(fs.writeFile)('src/static/tutorials.json', JSON.stringify(tutorials, null, 4))
  // log success
  log.info(`We've added that new resource. You can preview your resources page by running \`npm start\` and visiting: http://localhost:3000/#/${tutorial.url}/resources`)
  log.info(`Someday we'll offer to let you add another resource here!`)
}

run(command)
