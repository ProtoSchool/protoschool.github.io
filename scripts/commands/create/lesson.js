const { selectTutorial, createLesson, logLessons } = require('./utils.js')

// const inquirer = require('inquirer')
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

  log.info(`You can find all the files you'll need for these lessons in the \`src/tutorials/${tutorialId}-${tutorial.url}/\` directory.`)

  if (tutorial.resources.length === 0) {
    log.info(`All tutorials have a resources page where users can find opportunities for further learning.`)
    log.info(`Ready to add your first resource? Run \`npm run scripts:create:resources\` to get started.`)
    // TODO: Actually ask and launch them into resources script
  } else {
    log.info(`Hey, you have lessons AND resources. You're super cool and you might be done with all this.`)
    log.info(`Preview your tutorial by running \`npm start\` and visiting: http://localhost:3000/#/${tutorial.url}`)
  }
}

run(command)
