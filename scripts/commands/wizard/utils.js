const promisify = require('util').promisify

const fs = require('fs')
const inquirer = require('inquirer')
const log = require('npmlog')

const api = require('../../../src/api')

// *** DATA FETCHING & MANIPULATION ***

async function saveStaticJsonFile (file, data) {
  return promisify(fs.writeFile)(`src/static/${file.replace('.json', '')}.json`, JSON.stringify(data, null, 2))
}

// *** SHARED INPUT VALIDATION ***

function validateStringPresent (string) {
  if (string.trim()) {
    return true
  } else {
    return `Oops! You can't leave this blank, but you'll have a chance to edit it later.`
  }
}

// *** TRANSITIONAL DIALOGS & PROMPTS (INQUIRER) ***

async function selectTutorial (newItemType, { createTutorial, createResource, createLesson }) {
  let tutorial
  let tutorials = await api.tutorials.list.get()
  let latestTutorial = await api.tutorials.list.getLatest()

  const tutorialResponses1 = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'latestTutorial',
      message: `Should we add your ${newItemType} to the "${latestTutorial.title}" tutorial?`
    }
  ])
  // set data to latest tutorial
  if (tutorialResponses1.latestTutorial) {
    tutorial = latestTutorial

  // offer selection of existing tutorials or creating a new one
  } else {
    let tutorialChoices = [
      new inquirer.Separator(),
      { name: '+ Create new tutorial', value: 'new' },
      new inquirer.Separator()
    ]

    Object.keys(tutorials).sort().forEach(tutorialId => {
      tutorialChoices.push({ name: tutorials[tutorialId].title, value: tutorialId })
    })

    const tutorialResponses2 = await inquirer
      .prompt([
        {
          type: 'list',
          name: 'tutorialId',
          message: `Which of these existing tutorials should we add your ${newItemType} to?`,
          choices: tutorialChoices.reverse()
        }
      ])
    // set data based on other selected tutorial
    if (tutorialResponses2.tutorialId !== 'new') {
      tutorial = tutorials[tutorialResponses2.tutorialId]
    // create new tutorial and set data accordingly
    } else {
      tutorial = await createTutorial({ createLesson, createResource }, { skipPromptLesson: true })
    }
  }

  return tutorial
}

async function promptRepeat (type) {
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Would you like to add another ${type}?`
    }
  ])

  return confirm
}

async function promptCreateFirst (itemType, tutorialId) {
  let tutorial = await api.tutorials.get(tutorialId)

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Are you ready to add your first ${itemType} to the "${tutorial.title}" tutorial?`
    }
  ])

  return confirm
}

// *** LOGGING ***

function logEverythingDone (tutorial) {
  log.info(`Awesome work! "${tutorial.title}" has both lesson files and resources!`)
  logPreview('your tutorial', tutorial.url)
  log.info(`To create the content of your lessons, edit the files in the \`src/tutorials/${tutorial.formattedId}-${tutorial.url}/\` directory. (Learn more at https://bit.ly/protoschool-content.)`)
  log.info(`To update your tutorial's title, description, or resources, edit its entry in the \`src/static/tutorials.json\` file. (Learn more at https://bit.ly/protoschool-metadata.)`)
  logGuide()
}

function logList (message, items) {
  log.info(`${message}:
 ‣ ${items.join('\n ‣ ')}`)
}

function logPreview (item, tutorialUrl, pageUrl = '') {
  log.info(`To preview ${item}, first run \`npm start\` in a separate terminal window or tab, then visit this page in your web browser: http://localhost:3000/${tutorialUrl}/${pageUrl}`)
}

function logCreateLater (items) {
  log.info(`Okay, no problem. You can run the ProtoWizard later to add ${items}.`)
  logGuide()
}

function logGuide () {
  log.info(`View our detailed guide to developing tutorials at: https://bit.ly/protoschool-developing`)
}

module.exports = {
  saveStaticJsonFile,
  logEverythingDone,
  logList,
  promptCreateFirst,
  promptRepeat,
  selectTutorial,
  validateStringPresent,
  logPreview,
  logGuide,
  logCreateLater
}
