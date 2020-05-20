#!/usr/bin/env node

const inquirer = require('inquirer')
const log = require('npmlog')

const run = require('../../modules/run')

const tutorials = require('./tutorial')
const lessons = require('./lesson')
const resources = require('./resource')

// customize log styling
log.addLevel('info', 2000, { fg: 'blue', bold: true }, '🧙‍♂️ ProtoWizard')

async function command (options) {
  log.info(`Welcome to the ProtoWizard! We're excited to help you build your ProtoSchool tutorial.`)

  const item = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: 'What would you like to create?',
      choices: [
        {
          name: 'Tutorial',
          value: 'tutorial'
        },
        {
          name: 'Lesson',
          value: 'lesson'
        },
        {
          name: 'Resource',
          value: 'resource'
        }
      ]
    }
  ])

  if (item.type === 'tutorial') {
    await tutorials.createTutorial({ onAddLesson: lessons.createLesson, onAddResource: resources.createResource })
  } else if (item.type === 'lesson') {
    await lessons.createLessonIntro({ onAddResource: resources.createResource })
  } else if (item.type === 'resource') {
    await resources.createResourceIntro({ onAddLesson: lessons.createLesson })
  }
}

run(command)
