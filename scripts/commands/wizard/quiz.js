const log = require('npmlog')
const inquirer = require('inquirer')
const api = require('../../../src/api')

const {
  selectTutorial,
  promptFilesReady,
  selectLesson,
  logList,
  validateStringPresent,
  promptRepeat,
  logPreview,
  logCreateLater
} = require('./utils.js')

// *** QUIZ CREATION ***

async function createQuiz (tutorial, lesson, { createLesson, createTutorial, createResource }) {
  log.info("Now it's time to write the question for your multiple-choice quiz and provide answer choices, with positive or negative feedback for each. Wrong answers, and the feedback associated with them, are a great way to address common misconceptions about the topic. Be sure to make your feedback as helpful as possible, to guide the learner to the right choice. You'll need to create 1 correct answer and 2-3 incorrect answers. (I'll take care of randomizing their order later.)")

  let responses = await inquirer.prompt([
    {
      type: 'input',
      name: 'question',
      message: 'What question should the learner answer?',
      validate: validateStringPresent
    },
    {
      type: 'input',
      name: 'correctAnswer',
      message: "What's the correct answer to this question?",
      validate: validateStringPresent
    },
    {
      type: 'input',
      name: 'correctFeedback',
      message: 'What success message should we show the learner if they pick this option?',
      validate: validateStringPresent
    }
  ])

  const question = responses.question

  const choices = [
    {
      answer: responses.correctAnswer,
      correct: true,
      feedback: responses.correctFeedback
    }
  ]
  log.info(`Question: "${question}"`)
  log.info(`Answer (Correct): "${choices[0].answer}"`)
  log.info(`Feedback: "${choices[0].feedback}"`)

  let askAgain = true
  let wrongAnswer

  while (askAgain) {
    // repeat as many times as they want to create new wrong answers
    responses = await inquirer.prompt([
      {
        type: 'input',
        name: 'incorrectAnswer',
        message: 'What incorrect option should be presented to the learner?',
        validate: validateStringPresent
      },
      {
        type: 'input',
        name: 'incorrectFeedback',
        message: 'What failure message should we show the learner if they pick this option? Be sure to explain why this choice is wrong so they can feel more confident when choosing again.',
        validate: validateStringPresent
      }
    ])

    wrongAnswer = {
      answer: responses.incorrectAnswer,
      correct: false,
      feedback: responses.incorrectFeedback
    }

    log.info(`Answer (Incorrect): "${wrongAnswer.answer}"`)
    log.info(`Feedback: "${wrongAnswer.feedback}"`)

    choices.push(wrongAnswer)

    log.info(`You currently have 1 correct answer and ${choices.length - 1} wrong answer${choices.length > 2 ? 's' : ''}. (We recommend providing 2-3 incorrect options.)`)

    if (!(await promptRepeat('wrong answer'))) {
      askAgain = false
    }
  } // end while loop

  // shuffle right and wrong answers to change position of correct one
  for (let i = (choices.length - 1); i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = choices[i]
    choices[i] = choices[j]
    choices[j] = temp
  }

  logList(`Cool! Here's what we get when we mix up the order of the answer choices`, choices.map((choice, index) => `Option ${index + 1}: \n    ‣ Answer (${choice.correct ? 'Correct' : 'Incorrect'}): ${choice.answer} \n    ‣ Feedback: ${choice.feedback}`))
  await api.lessons.updateQuiz(tutorial, lesson, { question, choices })
  await afterQuizCreate(tutorial, lesson, { createLesson, createTutorial, createResource })
} // end createQuiz

// *** TRANSITIONAL DIALOGS & PROMPTS ***

async function createQuizIntro ({ createLesson, createTutorial, createResource }) {
  log.info("Let's create a multiple-choice quiz! This will only work if you've already created the tutorial and lesson files.")

  if (await promptFilesReady()) {
    const tutorial = await selectTutorial('quiz', { createTutorial, createResource, createLesson, createQuiz })
    const lesson = await selectLesson(tutorial)

    if (lesson) { // skip if value is null because there weren't multiple choice lessons in tutorial
      logList(`Great! You've chosen to build a quiz for`, [`Tutorial: ${tutorial.title}`, `Lesson: ${lesson.title}`])

      const overwrite = api.lessons.isQuizPristine(tutorial, lesson)
        ? await promptOverwritePristineQuiz(tutorial, lesson)
        : await promptOverwriteQuiz(tutorial, lesson)

      if (overwrite) {
        return createQuiz(tutorial, lesson, { createLesson, createTutorial, createResource })
      } else {
        logEditQuizManually(tutorial, lesson)
      }
    }
  } else {
    log.info('No worries. Please run the ProtoWizard again to create your tutorial and lesson. Once you have the necessary files, you can run this script again to build your quiz.')
  }
} // end createQuizIntro

async function promptOverwriteQuiz (tutorial, lesson) {
  log.info("It looks like you've already created the quiz for this lesson.")
  logPreview('the existing version', tutorial.url, lesson.formattedId)
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Do you want to overwrite the existing quiz?`
    }
  ])
  return confirm
}

async function promptOverwritePristineQuiz (tutorial, lesson) {
  log.info('When we create a quiz using the ProtoWizard, it will overwrite any existing content. If you think you may have previously updated this quiz manually, you may want to double check before proceeding.')
  logPreview('the quiz in its current state', tutorial.url, lesson.formattedId)

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Would you like to continue?`
    }
  ])

  return confirm
}

async function afterQuizCreate (tutorial, lesson, { createLesson, createTutorial, createResource }) {
  logPreview('your quiz', tutorial.url, lesson.formattedId)
  log.info(`To make changes to your quiz, you can edit this file directly: src/tutorials/${tutorial.formattedId}-${tutorial.url}/${lesson.formattedId}.js`)
  if (await promptRepeat('quiz')) {
    return createQuizIntro({ createLesson, createTutorial, createResource })
  } else {
    logCreateLater('quizzes')
  }
}

function logEditQuizManually (tutorial, lesson) {
  log.info(`Okay, no problem. You can edit your existing quiz directly in this file: src/tutorials/${tutorial.formattedId}-${tutorial.url}/${lesson.formattedId}.js`)
}

module.exports = { createQuizIntro, createQuiz, afterQuizCreate, promptOverwriteQuiz, promptOverwritePristineQuiz }
