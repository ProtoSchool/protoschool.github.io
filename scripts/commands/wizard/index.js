#!/usr/bin/env node

const run = require('../../modules/run')

const { createTutorial, createLessonIntro, createResourceIntro } = require('./utils.js')

const inquirer = require('inquirer')
const log = require('npmlog')

// customize log styling
log.addLevel('info', 2000, { fg: 'blue', bold: true }, '🧙‍♂️ ProtoWizard')

async function command (options) {
  log.info(`Welcome to the ProtoWizard! We're excited to help you build your ProtoSchool tutorial.`)
  const wizard = await inquirer
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
  if (wizard.type === 'tutorial') {
    await createTutorial()
  } else if (wizard.type === 'lesson') {
    await createLessonIntro()
  } else if (wizard.type === 'resource') {
    await createResourceIntro()
  }
}

run(command)
