import { prompt } from 'inquirer'
import { info } from 'npmlog'

import { tutorials, lessons as _lessons } from '../../../src/api'
import { promptRepeat, validateStringPresent, selectTutorial, promptCreateFirst, logEverythingDone, logList, logPreview, logCreateLater } from './utils.js'

// *** LOGGING ***

function logLessons (message, lessons) {
  logList(message, lessons.map(lesson => `${lesson.id} - ${lesson.title} (${lesson.type})`))
}

// *** TRANSITIONAL DIALOGS & PROMPTS ***

export async function createLessonIntro ({ createResource, createTutorial, createLesson }) {
  // determine new tutorial number
  info("Let's add lessons to your tutorial.")
  const tutorial = await selectTutorial('lesson', { createTutorial, createResource, createLesson })

  // print existing lessons if present
  if (tutorial.lessons.length === 0) {
    info("Let's create your first lesson!")
  } else {
    logLessons("Here are the lessons you've created so far", tutorial.lessons)
    info("Let's create your next lesson!")
  }

  // loops until you say you don't want more lessons, then offers closing statements
  await createLesson(tutorial.id, { createResource })
}

async function afterLessonCreate (tutorialId, { createResource }) {
  const tutorial = await tutorials.get(tutorialId)

  info(`You can find all the files you'll need for these lessons in the \`src/tutorials/${tutorial.formattedId}-${tutorial.url}/\` directory.`)

  // prompt to create resources if not yet done
  if (tutorial.resources.length === 0) {
    info(`All tutorials have a resources page where users can find opportunities for further learning.`)

    if (await promptCreateFirst('resource', tutorial.id)) {
      await createResource(tutorial.id, { createLesson })
    } else {
      logCreateLater('resources')
    }
  } else {
    logEverythingDone(tutorial)
  }
}

// *** LESSON CREATION ***

export async function createLesson (tutorialId, { createResource }) {
  const tutorial = await tutorials.get(tutorialId)

  const lessonResponses = await prompt([
    {
      type: 'input',
      name: 'title',
      message: "What's the title of this lesson?",
      validate: validateStringPresent
    },
    {
      type: 'list',
      name: 'type',
      message: "What's the format of this lesson?",
      choices: [
        {
          name: 'Text only',
          value: 'text'
        },
        {
          name: 'Multiple-choice quiz',
          value: 'multiple-choice'
        },
        {
          name: 'Code challenge',
          value: 'code'
        },
        {
          name: 'Code challenge with file upload',
          value: 'file-upload'
        }
      ]
    }
  ])

  // create lesson
  const lesson = await _lessons.create(tutorial, lessonResponses)

  let newFileDetails = [`${lesson.formattedId}.md (for writing the text of your lesson)`]

  if (lessonResponses.type === 'code' || lessonResponses.type === 'file-upload') {
    newFileDetails.push(`${lesson.formattedId}-challenge.md (for describing your code challenge)`)
    newFileDetails.push(`${lesson.formattedId}.js (for building your code challenge)`)
  } else if (lessonResponses.type === 'multiple-choice') {
    newFileDetails.push(`${lesson.formattedId}.js (for building your multiple-choice quiz)`)
  }

  // log success
  logList(`Tada! I've created the following files that you'll need for this lesson`, newFileDetails)
  logPreview('this lesson', tutorial.url, lesson.formattedId)

  // prompt to repeat process until user declines, then log results
  if (await promptRepeat('lesson')) {
    await createLesson(tutorial.id, { createResource })
  } else {
    logLessons(
      `Okay, sounds like we're done. Here are all the lessons now included in "${tutorial.title}"`,
      await tutorials.getLessons(tutorial)
    )
    await afterLessonCreate(tutorial.id, { createResource })
  }
}
