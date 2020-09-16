const inquirer = require('inquirer')
const log = require('npmlog')

const api = require('../../../src/api')
const {
  promptRepeat,
  validateStringPresent,
  selectTutorial
  // promptCreateFirst,
  // logEverythingDone,
  // logList,
  // logPreview,
  // logCreateLater
} = require('./utils.js')

// PSEUDOCODE
// let's create a quiz
// confirm which tutorial
// create new tutorial if needed
// confirm which lesson in tutorial
// create new lesson if needed
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


// *** LOGGING ***

function logQuiz (question, choices) {
  log.info("Here's your quiz, with the order of the answers randomized.")
  log.info("Question: ", question)
  log.info("Answer Choices: ")
  for (choice in choices) {
    log.info(choice.choice)
    log.info(`[${choice.correct}] - ${choice.feedback}`)
  }

}

// *** INPUT VALIDATION ***


// *** TRANSITIONAL DIALOGS & PROMPTS ***


async function createQuizIntro ({ createLesson, createTutorial }) {
  // determine new tutorial number
  // TODO: 1 - let's create a quiz
  log.info("Let's create the multiple-choice quiz for your lesson! First, we'll confirm which tutorial and lesson it's for. Then we'll write the question and provide answer choices, with positive or negative feedback for each. (I'll take care of randomizing the order of the answers, so you can focus on creating one correct option and 2-3 incorrect ones.)")

  // TODO: confirm which tutorial
  const tutorial = await selectTutorial('quiz', { createTutorial, createResource, createLesson, createQuiz })

  // prompt to create lessons if not yet done
  if (tutorial.lessons.length === 0) {
    log.info(`Looks like your "${tutorial.title}" tutorial doesn't have any lessons yet.`)

    if (await promptCreateFirst('lesson', tutorial.id)) {
      await createLesson(tutorial, { createResource })
    } else {
      logCreateLater('lessons')
    }
  } else {
    logEverythingDone(tutorial)
  }
}

// TODO: confirm which lesson in tutorial
// TODO: create new lesson if needed

  return createQuiz(tutorial.id, { createLesson }) // loops until user declines to repeat, then offers closing statements
}



async function afterQuizCreate (tutorialId, { createLesson }) {
  const tutorial = await api.tutorials.get(tutorialId) // get lesson

  logPreview('your resources page', lesson.url, 'resources')
  log.info('Need to change something? You can edit your quiz in the file ___.') // insert path of .js file



// *** QUIZ CREATION ***

async function createQuiz (tutorialId, { createLesson }) {
  const tutorial = await api.tutorials.get(tutorialId)

  // TODO: prompt for question
  // TODO: prompt for correct answer (text, success message)
  // TODO: prompt repetitively for 2-4 wrong answers (text, failure message)
  // TODO: remember to deal with quotes correctly
  // TODO: randomly sort order of wrong answers

  const responses1 = await inquirer.prompt([
    {
      type: 'input',
      name: 'question',
      message: "What question should the learner answer?",
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

  const responses1 = await inquirer.prompt([
    {
      type: 'input',
      name: 'question',
      message: "What question should the learner answer?",
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
    question: responses1.question,
  }

  const choices = [
    {
      answer: responses1.correctAnswer,
      correct: true,
      feedback: responses1.correctFeedback
    }
  ]

  let askAgain = true
  let responses2
  let wrongAnswer

 while (askAgain) {
   // repeat as many times as they want to create new wrong answers
    responses2 = await inquirer.prompt([
      {
        type: 'input',
        name: 'incorrectAnswer',
        message: "What's the correct answer to this question?",
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
      feedback: responses2.feedback
    }

    choices.push(wrongAnswer)

    if (!(await promptRepeat('wrong answer'))) {
      askAgain = false
    }
 }

 // shuffle right and wrong answers to change position of correct one
 for(let i = choices.length — 1; i > 0; i--){
  const j = Math.floor(Math.random() * i)
  const temp = choices[i]
  choices[i] = choices[j]
  choices[j] = temp
}

// TODO: actually save question and choices to the appropriate .js file

  // prompt to repeat process until user declines, then log results
  if (await promptRepeat('quiz')) {
    return createQuiz(tutorial.id, { createLesson  }) //TODO
  } else {
  //   logResources(
  //     `Okay, sounds like we're done. Here are all the resources now included in "${tutorial.title}"`,
  //     await api.resources.get(tutorial.id)
  //   )
  //
  //   await afterResourceCreate(tutorial.id, { createLesson })
  // }



    // create resource in tutorials.json
    await api.resources.add(tutorial.id, newResource)

  // log success
  log.info(`We've added the quiz to your lesson.`)

  // prompt to repeat process until user declines, then log results
  if (await promptRepeat('quiz')) {
    return createQuiz(tutorial.id, { createLesson  }) //TODO
  } else {
  //   logResources(
  //     `Okay, sounds like we're done. Here are all the resources now included in "${tutorial.title}"`,
  //     await api.resources.get(tutorial.id)
  //   )
  //
  //   await afterResourceCreate(tutorial.id, { createLesson })
  // }
}

module.exports = { createQuizIntro, createQuiz }
