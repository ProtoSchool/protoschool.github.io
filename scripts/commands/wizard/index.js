#!/usr/bin/env node

const run = require('../../modules/run')

const { createLessonIntro } = require('./lesson.js')
const { createTutorial } = require('./tutorial.js')
const { createResourceIntro } = require('./resource.js')

const inquirer = require('inquirer')
const log = require('npmlog')

// customize log styling
log.addLevel('info', 2000, { fg: 'blue', bold: true }, '🧙‍♂️ ProtoWizard')

async function command (options) {
  log.info(`Welcome to the ProtoWizard! We're excited to help you build your ProtoSchool tutorial.`)
  const item = await inquirer
    .prompt([
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
    await createTutorial()
  } else if (item.type === 'lesson') {
    await createLessonIntro()
  } else if (item.type === 'resource') {
    await createResourceIntro()
  }
}

run(command)
