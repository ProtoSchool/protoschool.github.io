#!/usr/bin/env node

import { prompt } from 'inquirer'
import { addLevel, info } from 'npmlog'

import run from '../../modules/run'

import { createTutorial as _createTutorial } from './tutorial'
import { createLesson as _createLesson, createLessonIntro } from './lesson'
import { createResource as _createResource, createResourceIntro } from './resource'
import { createQuiz as _createQuiz, createQuizIntro } from './quiz'

// customize log styling
addLevel('info', 2000, { fg: 'blue', bold: true }, '🧙‍♂️ ProtoWizard')

async function command (options) {
  info(`Welcome! I'm the ProtoWizard, and I'm excited to help you build your ProtoSchool tutorial.`)

  const item = await prompt([
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
    await _createTutorial({
      createLesson: _createLesson,
      createResource: _createResource
    })
  } else if (item.type === 'lesson') {
    await createLessonIntro({
      createResource: _createResource,
      createTutorial: _createTutorial,
      createLesson: _createLesson,
      createQuiz: _createQuiz
    })
  } else if (item.type === 'resource') {
    await createResourceIntro({
      createLesson: _createLesson,
      createTutorial: _createTutorial,
      createResource: _createResource,
      createQuiz: _createQuiz
    })
  } else if (item.type === 'quiz') {
    await createQuizIntro({
      createLesson: _createLesson,
      createTutorial: _createTutorial,
      createResource: _createResource,
      createQuiz: _createQuiz
    })
  }
}

if (process.env.NODE_ENV !== 'test') {
  run(command)
}

export default command
