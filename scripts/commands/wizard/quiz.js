import { info } from 'npmlog'
import { prompt } from 'inquirer'
import { lessons } from '../../../src/api'

import { selectTutorial, promptFilesReady, selectMultipleChoiceLesson, logList, validateStringPresent, promptRepeat, logPreview, logCreateLater } from './utils.js'

// *** QUIZ CREATION ***

export async function createQuiz (tutorial, lesson, { createLesson, createTutorial, createResource }) {
  info("Now it's time to write the question for your multiple-choice quiz and provide answer choices, with positive or negative feedback for each. Wrong answers, and the feedback associated with them, are a great way to address common misconceptions about the topic. Be sure to make your feedback as helpful as possible, to guide the learner to the right choice. You'll need to create 1 correct answer and 2-3 incorrect answers. (I'll take care of randomizing their order later.)")

  let responses = await prompt([
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
  info(`Question: "${question}"`)
  info(`Answer (Correct): "${choices[0].answer}"`)
  info(`Feedback: "${choices[0].feedback}"`)

  let askAgain = true
  let wrongAnswer

  while (askAgain) {
    // repeat as many times as they want to create new wrong answers
    responses = await prompt([
      {
        type: 'input',
        name: 'incorrectAnswer',
        message: 'What incorrect option should be presented to the learner?',
        validate: validateStringPresent
      },
      {
        type: 'input',
        name: 'incorrectFeedback',
        message: 'What failure message should the learner see if they pick this option? Be sure to explain why this choice is wrong so they can feel more confident when choosing again.',
        validate: validateStringPresent
      }
    ])

    wrongAnswer = {
      answer: responses.incorrectAnswer,
      correct: false,
      feedback: responses.incorrectFeedback
    }

    info(`Answer (Incorrect): "${wrongAnswer.answer}"`)
    info(`Feedback: "${wrongAnswer.feedback}"`)

    choices.push(wrongAnswer)

    info(`You currently have 1 correct answer and ${choices.length - 1} wrong answer${choices.length > 2 ? 's' : ''}. (I recommend providing 2-3 incorrect options.)`)

    askAgain = await promptRepeat('wrong answer') // prompt to repeat adding a wrong answer
  } // end while loop

  // shuffle right and wrong answers to change position of correct one
  for (let i = (choices.length - 1); i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = choices[i]
    choices[i] = choices[j]
    choices[j] = temp
  }

  logList(`Cool! Here's what we get when we mix up the order of the answer choices`, choices.map((choice, index) => `Option ${index + 1}: \n    ‣ Answer (${choice.correct ? 'Correct' : 'Incorrect'}): ${choice.answer} \n    ‣ Feedback: ${choice.feedback}`))
  await lessons.updateQuiz(tutorial, lesson, { question, choices })
  await afterQuizCreate(tutorial, lesson, { createLesson, createTutorial, createResource })
} // end createQuiz

// *** TRANSITIONAL DIALOGS & PROMPTS ***

export async function createQuizIntro ({ createLesson, createTutorial, createResource }) {
  info("Let's create a multiple-choice quiz! This will only work if you've already created the tutorial and lesson files.")

  if (await promptFilesReady()) {
    const tutorial = await selectTutorial('quiz', { createTutorial, createResource, createLesson, createQuiz })
    const lesson = await selectMultipleChoiceLesson(tutorial)

    if (lesson) { // skip if value is null because there weren't multiple choice lessons in tutorial
      logList(`Great! You've chosen to build a quiz for`, [`Tutorial: ${tutorial.title}`, `Lesson: ${lesson.title}`])

      const shouldOverwrite = lessons.isQuizPristine(tutorial, lesson)
        ? await promptOverwritePristineQuiz(tutorial, lesson)
        : await promptOverwriteQuiz(tutorial, lesson)

      if (shouldOverwrite) {
        return createQuiz(tutorial, lesson, { createLesson, createTutorial, createResource })
      } else {
        logEditQuizManually(tutorial, lesson)
      }
    }
  } else {
    info('No worries. Please summon me again to create your tutorial and lesson. Once you have the necessary files, I can help you build your quiz.')
  }
} // end createQuizIntro

export async function promptOverwriteQuiz (tutorial, lesson) {
  info("It looks like you've already created the quiz for this lesson.")
  logPreview('the existing version', tutorial.url, lesson.formattedId)
  const { confirm } = await prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Do you want to overwrite the existing quiz?`
    }
  ])
  return confirm
}

export async function promptOverwritePristineQuiz (tutorial, lesson) {
  info('When we create a quiz together, it will overwrite any existing content. If you think you may have previously updated this quiz manually, you may want to double check before proceeding.')
  logPreview('the quiz in its current state', tutorial.url, lesson.formattedId)

  const { confirm } = await prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Would you like to continue?`
    }
  ])

  return confirm
}

export async function afterQuizCreate (tutorial, lesson, { createLesson, createTutorial, createResource }) {
  logPreview('your quiz', tutorial.url, lesson.formattedId)
  info(`To make changes to your quiz, you can edit this file directly: src/tutorials/${tutorial.formattedId}-${tutorial.url}/${lesson.formattedId}.js`)
  if (await promptRepeat('quiz')) {
    return createQuizIntro({ createLesson, createTutorial, createResource })
  } else {
    logCreateLater(' more quizzes')
  }
}

function logEditQuizManually (tutorial, lesson) {
  info(`Okay, no problem. You can edit your existing quiz directly in this file: src/tutorials/${tutorial.formattedId}-${tutorial.url}/${lesson.formattedId}.js`)
}
