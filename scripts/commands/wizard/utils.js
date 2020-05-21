const promisify = require('util').promisify

const fs = require('fs')
const inquirer = require('inquirer')
const log = require('npmlog')
const marked = require('meta-marked')

const tutorials = require('../../../src/static/tutorials.json')

const tutorialKeys = Object.keys(tutorials)
const latestTutorialId = tutorialKeys.sort().reverse()[0]
const latestTutorial = tutorials[latestTutorialId]

// *** DATA FETCHING & MANIPULATION ***

async function getTutorialLessons (tutorial, tutorialId, lessons = [], lessonNumber = 1) {
  const lessonFilePrefix = `${tutorialId}-${tutorial.url}/${lessonNumber.toString().padStart(2, 0)}`

  let lessonMd
  let lesson
  try {
    lessonMd = await promisify(fs.readFile)(`src/tutorials/${lessonFilePrefix}.md`, 'utf8')
    lesson = {
      id: lessonNumber,
      formattedId: lessonNumber.toString().padStart(2, 0),
      ...marked(lessonMd).meta
    }
  } catch (error) {
    // lesson not found, we reached the end
    if (error.code === 'ENOENT') {
      return lessons
    }

    // data not well formatted
    if (error.name === 'YAMLException') {
      console.error(
        new Error(`Data improperly formatted in the lesson markdown file "${lessonFilePrefix}.md". Check that the YAML syntax is correct.`)
      )
    }
    throw error
  }
  lessons.push(lesson)
  return getTutorialLessons(tutorial, tutorialId, lessons, lessonNumber + 1)
}

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
  let tutorialId
  let lessons

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
    tutorialId = latestTutorialId
    lessons = await getTutorialLessons(tutorial, tutorialId)

  // offer selection of existing tutorials or creating a new one
  } else {
    let tutorialsList = [{name: 'CREATE NEW TUTORIAL', value: 'new'}]

    Object.keys(tutorials).sort().forEach(tutorialId => {
      tutorialsList.push({ name: tutorials[tutorialId].title, value: tutorialId })
    })

    const tutorialResponses2 = await inquirer
      .prompt([
        {
          type: 'list',
          name: 'tutorialId',
          message: `Which of these existing tutorials should we add your ${newItemType} to?`,
          choices: tutorialsList.reverse()
        }
      ])
    // set data based on other selected tutorial
    if (tutorialResponses2.tutorialId !== 'new') {
      tutorial = tutorials[tutorialResponses2.tutorialId]
      tutorialId = tutorialResponses2.tutorialId
      lessons = await getTutorialLessons(tutorial, tutorialId)
    // create new tutorial and set data accordingly
    } else {
      const tutorialData = await createTutorial({ createLesson, createResource }, { skipPromptLesson: true })
      tutorial = tutorialData.tutorial
      tutorialId = tutorialData.tutorialId
      lessons = await getTutorialLessons(tutorial, tutorialId)
    }
  }
  return { tutorial, tutorialId, lessons }
}

async function promptRepeat (tutorial, tutorialId, type) {
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
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Are you ready to add your first ${itemType} to the "${tutorials[tutorialId].title}" tutorial?`
    }
  ])

  return confirm
}

// *** LOGGING ***

function logEverythingDone (tutorial, tutorialId) {
  log.info(`Awesome work! "${tutorial.title}" has both lesson files and resources!`)
  logPreview('your tutorial', tutorial.url)
  log.info(`To create the content of your lessons, edit the files in the \`src/tutorials/${tutorialId}-${tutorial.url}/\` directory.`)
  log.info(`To update your tutorial's title, description, or resources, edit its entry in the \`src/static/tutorials.json\` file.`)
  logGuide()
}

function logList (message, items) {
  log.info(`${message}:
 ‣ ${items.join('\n ‣ ')}`)
}

function logPreview (item, tutorialUrl, pageUrl = '') {
  log.info(`To preview ${item}, first run \`npm start\` in a separate terminal window or tab, then visit this page in your web browser: http://localhost:3000/#/${tutorialUrl}/${pageUrl}`)
}

function logCreateLater (items) {
  log.info(`Okay, no problem. You can run the ProtoWizard later to add ${items}.`)
  logGuide()
}

function logGuide () {
  log.info(`View our detailed guide to developing tutorials at: https://github.com/ProtoSchool/protoschool.github.io/blob/code/DEVELOPING_TUTORIALS.md`)
}

module.exports = {
  getTutorialLessons,
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
