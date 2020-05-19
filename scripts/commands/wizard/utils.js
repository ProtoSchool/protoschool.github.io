const promisify = require('util').promisify

const fs = require('fs')
const inquirer = require('inquirer')
const log = require('npmlog')
const marked = require('meta-marked')

const tutorials = require('../../../src/static/tutorials.json')

const { createLesson, afterLessonCreate, logLessons } = require('./lesson.js')
const { createResource, afterResourceCreate, logResources } = require('./resource.js')

const tutorialKeys = Object.keys(tutorials)
const latestTutorialId = tutorialKeys.sort().reverse()[0]
const latestTutorial = tutorials[latestTutorialId]

// *** HELPER FUNCTIONS ***

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

// *** SHARED INPUT VALIDATION ***

function validateStringPresent (string) {
  if (string.trim()) {
    return true
  } else {
    return `Oops! You can't leave this blank, but you'll have a chance to edit it later.`
  }
}

// *** TRANSITIONAL DIALOGS (INQUIRER) ***

async function selectTutorial (newItemType) {
  let tutorial
  let tutorialId
  let lessons

  const tutorialResponses1 = await inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'latestTutorial',
        message: `Should we add your ${newItemType} to the "${latestTutorial.title}" tutorial?`
      }
    ])
  if (tutorialResponses1.latestTutorial) {
    tutorial = latestTutorial
    tutorialId = latestTutorialId
    lessons = await getTutorialLessons(tutorial, tutorialId)
  } else {
    // list existing tutorials + option to create new one
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
    if (tutorialResponses2.tutorialId !== 'new') {
      tutorial = tutorials[tutorialResponses2.tutorialId]
      tutorialId = tutorialResponses2.tutorialId
      lessons = await getTutorialLessons(tutorial, tutorialId)
    } else {
      log.info("I see that you want to create a new tutorial. Someday I'll figure out how to help with that. For now, you'll need to run the command `npm run scripts:create:tutorial` .")
      // TODO: launch into creating new tutorial
    }
  }
  return { tutorial, tutorialId, lessons }
}

async function offerRepeat (tutorial, tutorialId, type) {
  const another = await inquirer
    .prompt([
      {
        type: 'confirm',
        name: type,
        message: `Would you like to add another ${type}?`
      }
    ])

  if (another.lesson) {
    // BUG: says createLesson is not a function
    await createLesson(tutorial, tutorialId)
  } else if (another.resource) {
    await createResource(tutorial, tutorialId)
  } else {
    log.info(`Okay, sounds like we're done. Here are all the ${type}s now included in the "${tutorial.title}" tutorial:`)
    if (type === 'lesson') {
      logLessons(await getTutorialLessons(tutorial, tutorialId))
      afterLessonCreate(tutorial, tutorialId)
    } else if (type === 'resource') {
      logResources(tutorials[tutorialId].resources)
      afterResourceCreate(tutorial, tutorialId)
    }
  }
}

async function promptCreateFirst (itemType, tutorialId) {
  const start = await inquirer
    .prompt([
      {
        type: 'confirm',
        name: itemType,
        message: `Are you ready to add your first ${itemType} to the "${tutorials[tutorialId].title}" tutorial?`
      }
    ])

  if (start.lesson) {
    // BUG: Says createLesson is not a function
    await createLesson(tutorials[tutorialId], tutorialId)
  } else if (start.resource) {
    await createResource(tutorials[tutorialId], tutorialId)
  } else {
    log.info(`Okay, no problem. You can create a ${itemType} later using this command: \`npm run scripts:create:${itemType}\``)
  }
}

function logEverythingDone (tutorial) {
  log.info(`Awesome work! "${tutorial.title}" has both lesson files and resources!`)
  log.info(`Preview your tutorial by running \`npm start\` and visiting: http://localhost:3000/#/${tutorial.url}`)
  log.info(`To create the content of your lessons, edit the files in the \`src/tutorials/${tutorial.formattedId}-${tutorial.url}/\` directory.`)
  log.info(`To update your tutorial's title, description, or resources, edit its entry in the \`src/static/tutorials.json\` file.`)
}

module.exports = { getTutorialLessons, logEverythingDone, promptCreateFirst, offerRepeat, selectTutorial, validateStringPresent }
