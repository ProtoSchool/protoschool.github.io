// USER FLOW:

// DONE let's create a quiz
// DONE do the lesson and tutorial exist?
// DONE if not, bounce back to main menu
// DONE confirm which tutorial
// DONE confirm which lesson in an existing tutorial
// DONE if no mult choice lesson there, bounce back to main menu
// TODO confirm overwrite existing quiz if there's real data
// DONE prompt for question
// DONE prompt for correct answer (text, success message)
// DONE prompt repetitively for 2-4 wrong answers (text, failure message)
// DONE randomly sort order of wrong answers
// TODO store data to js file (remember to deal with quotes correctly)
// DONE log randomized questions?
// DONE show link to preview
// DONE show which file to go to to edit text
// DONE create another quiz OR exit

const log = require('npmlog')
const inquirer = require('inquirer')

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
  logList(`Great! You've chosen to build a quiz for`, [`Tutorial: ${tutorial.title}`, `Lesson: ${lesson.title}`])
  log.info("Now it's time to write the question for your multiple-choice quiz and provide answer choices, with positive or negative feedback for each. Wrong answers, and the feedback associated with them, are a great way to address common misconceptions about the topic. Be sure to make your feedback as helpful as possible, to guide the learner to the right choice. You'll need to create 1 correct answer and 2-3 incorrect answers. (I'll take care of randomizing their order later.")
  const responses1 = await inquirer.prompt([
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

  const question = {
    question: responses1.question
  }

  const choices = [
    {
      choice: responses1.correctAnswer,
      correct: true,
      feedback: responses1.correctFeedback
    }
  ]
  log.info(`Your question is: "${question.question}"`)
  log.info(`The correct answer is: "${choices[0].choice}"`)
  log.info(`The correct answer is: "${choices[0].feedback}"`)

  let askAgain = true
  let responses2
  let wrongAnswer

  while (askAgain) {
    // repeat as many times as they want to create new wrong answers
    responses2 = await inquirer.prompt([
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
      choice: responses2.incorrectAnswer,
      correct: false,
      feedback: responses2.incorrectFeedback
    }

    log.info(`Your new wrong answer is: "${wrongAnswer.choice}"`)
    log.info(`The feedback provided will be: "${wrongAnswer.feedback}"`)

    choices.push(wrongAnswer)

    log.info(`You currently have 1 correct answer and ${choices.length - 1} wrong answers. (We recommend providing 2-3 incorrect options.)`)

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
  logList(`Cool! Here's what we get when we mix up the order of the answer choices:`, choices.map((choice, index) => `Option ${index + 1}: \n    ‣ Answer: ${choice.choice} \n    ‣ Feedback [${choice.correct ? 'Correct' : 'Incorrect'}]: ${choice.feedback}`))
  log.info(`Pretend we're saving that to the file so it's actually useful!`)
  afterQuizCreate(tutorial, lesson, { createLesson, createTutorial, createResource })
} // end createQuiz

// *** TRANSITIONAL DIALOGS & PROMPTS ***

async function createQuizIntro ({ createLesson, createTutorial, createResource }) {
  log.info("Let's create a multiple-choice quiz! This will only work if you've already created the tutorial and lesson files.")
  if (await promptFilesReady()) {
    const tutorial = await selectTutorial('quiz', { createTutorial, createResource, createLesson, createQuiz })
    // CHOOSE A LESSON
    const lesson = await selectLesson(tutorial)
    if (lesson) { // skip if value is null because there weren't mult choice lessons in tutorial
      return createQuiz(tutorial, lesson, { createLesson, createTutorial, createResource })
    }
    // return createQuiz(tutorial.id, { createLesson }) // loops until user declines to repeat, then offers closing statements
  } else {
    log.info('No worries. Please run the ProtoWizard again to create your tutorial and lesson. Once you have the necessary files, you can run this script again to build your quiz.')
  }
} // end createQuizIntro

async function afterQuizCreate (tutorial, lesson, { createLesson, createTutorial, createResource }) {
  logPreview('your quiz', tutorial.url, lesson.formattedId)
  log.info(`To make changes to your quiz, you can edit this file directly: src/tutorials/${tutorial.formattedId}-${tutorial.url}/${lesson.formattedId}.js`)
  if (await promptRepeat('quiz')) {
    return createQuizIntro({ createLesson, createTutorial, createResource }) // TODO
  } else {
    logCreateLater('quizzes')
  }
}

module.exports = { createQuizIntro, createQuiz, afterQuizCreate }
