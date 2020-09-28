// USER FLOW:

// DONE let's create a quiz
// DONE do the lesson and tutorial exist?
// DONE if not, bounce back to main menu
// DONE confirm which tutorial
// DONE confirm which lesson in an existing tutorial
// DONE if no mult choice lesson there, bounce back to main menu

// confirm overwrite existing quiz if there's real data
// prompt for question
// prompt for correct answer (text, success message)
// prompt repetitively for 2-4 wrong answers (text, failure message)
// randomly sort order of wrong answers
// store data to js file (remember to deal with quotes correctly)
// log randomized questions?
// show link to preview
// show which file to go to to edit text
// create another quiz OR return to main menu for other options OR exit

const log = require('npmlog')
// const inquirer = require('inquirer')

const {
  selectTutorial,
  promptFilesReady,
  selectLesson,
  logList
  // promptRepeat,
  // validateStringPresent,
  // promptCreateFirst,
  // logEverythingDone
  // logPreview,
  // logCreateLater
} = require('./utils.js')

async function createQuizIntro ({ createLesson, createTutorial, createResource }) {
  log.info("Let's create a multiple-choice quiz! This will only work if you've already created the tutorial and lesson files.")
  if (await promptFilesReady()) {
    const tutorial = await selectTutorial('quiz', { createTutorial, createResource, createLesson, createQuiz })
    // CHOOSE A LESSON
    const lesson = await selectLesson(tutorial)
    if (lesson) { // skip if value is null because there weren't mult choice lessons in tutorial
      return createQuiz(tutorial, lesson, {createLesson})
    }
    // return createQuiz(tutorial.id, { createLesson }) // loops until user declines to repeat, then offers closing statements
  } else {
    log.info('No worries. Please run the ProtoWizard again to create your tutorial and lesson. Once you have the necessary files, you can run this script again to build your quiz.')
  }
} // end createQuizIntro

async function createQuiz (tutorial, lesson, { createLesson }) {
  logList(`Great! You've chosen to build a quiz for`, [`Tutorial: ${tutorial.title}`, `Lesson: ${lesson.title}`])
  log.info("Now it's time to write the question for your multiple-choice quiz and provide answer choices, with positive or negative feedback for each. Wrong answers, and the feedback associated with them, are a great way to address common misconceptions about the topic. Be sure to make your feedback as helpful as possible, to guide the learner to the right choice. You'll need to create 1 correct answer and 2-3 incorrect answers. (I'll take care of randomizing their order later.")
  log.info("Pretend we're creating your quiz now.")
} // end createQuiz
module.exports = { createQuizIntro, createQuiz }
