const promisify = require('util').promisify

const fs = require('fs')
const inquirer = require('inquirer')
const log = require('npmlog')

const tutorials = require('../../../src/static/tutorials.json')

const {
  promptRepeat,
  validateStringPresent,
  selectTutorial,
  getTutorialLessons,
  promptCreateFirst,
  logEverythingDone
} = require('./utils.js')

const { createResource } = require('./resource.js')

// *** HELPER FUNCTIONS ***

function nextLessonNumber (lessons) {
  let lessonNumber = '01'

  if (lessons.length > 0) {
    lessonNumber = (parseInt(lessons.map(lesson => lesson.formattedId).sort().reverse()[0]) + 1).toString().padStart(2, 0)
  }

  return lessonNumber
}

function logLessons (lessons) {
  console.group()
  lessons.forEach(lesson => {
    log.info(`> ${lesson.id} - ${lesson.title} (${lesson.type})`)
  })
  console.groupEnd()
}

// *** LESSON CREATION ***

async function createLessonIntro () {
  // determine new tutorial number
  log.info("Let's add lessons to your tutorial.")
  const { tutorial, tutorialId, lessons } = await selectTutorial('lesson')

  // print existing lessons if present
  if (lessons.length === 0) {
    log.info("Let's create your first lesson!")
  } else {
    log.info("Here are the lessons you've created so far:")
    logLessons(lessons)
    log.info("Let's create your next lesson!")
  }

  // loops until you say you don't want more lessons, then offers closing statements
  await createLesson(tutorial, tutorialId, lessons)
}

// used by LESSONS
async function createLesson (tutorial, tutorialId) {
  let lessons = await getTutorialLessons(tutorial, tutorialId)
  const lessonResponses = await inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: "What's the title of this lesson?",
        validate: validateStringPresent
      },
      {
        type: 'list',
        name: 'type',
        message: "What's the format of this lesson?",
        choices: [
          {
            name: 'Text only',
            value: 'text'
          },
          {
            name: 'Multiple-choice quiz',
            value: 'multiple-choice'
          },
          {
            name: 'Code challenge',
            value: 'code'
          },
          {
            name: 'Code challenge with file upload',
            value: 'file-upload'
          }
        ]
      }
    ])

  // create lesson
  let lessonNumber = nextLessonNumber(lessons)
  let newFileDetails = [`${lessonNumber}.md (for writing the text of your lesson)`]

  await promisify(fs.copyFile)('src/tutorials/boilerplates/boilerplate.md', `src/tutorials/${tutorialId}-${tutorial.url}/${lessonNumber}.md`)

  let markdown = await promisify(fs.readFile)(`src/tutorials/${tutorialId}-${tutorial.url}/${lessonNumber}.md`, 'utf8')
  let newMarkdown = markdown.replace(`title: "Lesson title"`, `title: "${lessonResponses.title}"`)

  if (lessonResponses.type !== 'text') {
    newMarkdown = newMarkdown.replace(`type: "text"`, `type: "${lessonResponses.type}"`)
    await promisify(fs.copyFile)(`src/tutorials/boilerplates/boilerplate-${lessonResponses.type}.js`, `src/tutorials/${tutorialId}-${tutorial.url}/${lessonNumber}.js`)

    if (lessonResponses.type !== 'multiple-choice') {
      await promisify(fs.copyFile)(`src/tutorials/boilerplates/boilerplate-challenge.md`, `src/tutorials/${tutorialId}-${tutorial.url}/${lessonNumber}-challenge.md`)

      newFileDetails.push(`${lessonNumber}-challenge.md (for describing your code challenge)`)
      newFileDetails.push(`${lessonNumber}.js (for building your code challenge)`)
    } else {
      newFileDetails.push(`${lessonNumber}.js (for building your multiple-choice quiz)`)
    }
  }

  await promisify(fs.writeFile)(`src/tutorials/${tutorialId}-${tutorial.url}/${lessonNumber}.md`, newMarkdown)

  // log success
  log.info("Tada! We've created the following files that you'll need for this lesson:")
  console.group()
  newFileDetails.forEach(file => log.info(file))
  console.groupEnd()
  log.info(`Preview your lesson by running \`npm start\` and visiting: http://localhost:3000/#/${tutorial.url}/${lessonNumber}`)

  // prompt to repeat process until user declines, then log results
  if (await promptRepeat(tutorial, tutorialId, 'lesson')) {
    await createLesson(tutorial, tutorialId)
  } else {
    log.info(`Okay, sounds like we're done. Here are all the lessons now included in "${tutorial.title}":`)
    logLessons(await getTutorialLessons(tutorial, tutorialId))
    afterLessonCreate(tutorial, tutorialId)
  }
}

async function afterLessonCreate (tutorial, tutorialId) {
  log.info(`You can find all the files you'll need for these lessons in the \`src/tutorials/${tutorialId}-${tutorial.url}/\` directory.`)

  // prompt to create resources if not yet done
  if (tutorial.resources.length === 0) {
    log.info(`All tutorials have a resources page where users can find opportunities for further learning.`)

    if (await promptCreateFirst('resource', tutorialId)) {
      createResource(tutorials[tutorialId], tutorialId)
    } else {
      log.info(`Okay, no problem. You can create run the ProtoWizard later to add resources.`)
    }
  } else {
    logEverythingDone(tutorial)
  }
}

module.exports = { createLessonIntro, createLesson, afterLessonCreate }
