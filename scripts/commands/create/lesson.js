const { selectTutorial, createLesson, logLessons } = require('./utils.js')

const inquirer = require('inquirer')
const log = require('npmlog')

const run = require('../../modules/run')

// customize log styling
log.addLevel('info', 2000, { fg: 'blue', bold: true }, '🧙‍♂️ ProtoWizard')

// determine new tutorial number
log.info("Let's add lessons to your tutorial.")
async function command (options) {
  const { tutorial, tutorialId, lessons } = await selectTutorial('lesson')

  // print existing lessons if present
  if (lessons.length === 0) {
    log.info("Let's create your first lesson!")
  } else {
    log.info("Here are the lessons you've created so far:")
    logLessons(lessons)
    log.info("Let's create your next lesson!")
  }

  // runs until you say you don't want more lessons
  await createLesson(tutorial, tutorialId, lessons)

  log.info(`We'll poke you here to create resources if you don't have any yet.`)
}

run(command)
