#!/usr/bin/env node

const inquirer = require('inquirer')
const log = require('npmlog')

const run = require('../../modules/run')

const tutorials = require('./tutorial')
const lessons = require('./lesson')
const resources = require('./resource')
const quizzes = require('./quiz')

// customize log styling
log.addLevel('info', 2000, { fg: 'blue', bold: true }, '🧙‍♂️ ProtoWizard')

async function command (options) {
  log.info(`Welcome to the ProtoWizard! We're excited to help you build your ProtoSchool tutorial.`)

  const item = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: 'What would you like to do?',
      choices: [
        {
          name: 'Create a new tutorial',
          value: 'tutorial'
        },
        {
          name: 'Add a new lesson to an existing tutorial',
          value: 'lesson'
        },
        {
          name: 'Add resources to an existing tutorial',
          value: 'resource'
        },
        {
          name: 'Add a multiple-choice quiz to an existing lesson',
          value: 'quiz'
        }
      ]
    }
  ])

  if (item.type === 'tutorial') {
    await tutorials.createTutorial({
      createLesson: lessons.createLesson,
      createResource: resources.createResource
    })
  } else if (item.type === 'lesson') {
    await lessons.createLessonIntro({
      createResource: resources.createResource,
      createTutorial: tutorials.createTutorial,
      createLesson: lessons.createLesson,
      createQuiz: quizzes.createQuiz
    })
  } else if (item.type === 'resource') {
    await resources.createResourceIntro({
      createLesson: lessons.createLesson,
      createTutorial: tutorials.createTutorial,
      createResource: resources.createResource,
      createQuiz: quizzes.createQuiz
    })
  } else if (item.type === 'quiz') {
    await quizzes.createQuizIntro({
      createLesson: lessons.createLesson,
      createTutorial: tutorials.createTutorial,
      createResource: resources.createResource,
      createQuiz: quizzes.createQuiz
    })
  }
}

if (process.env.NODE_ENV !== 'test') {
  run(command)
}

module.exports = command
