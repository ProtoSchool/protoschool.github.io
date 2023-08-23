import { prompt } from 'inquirer'
import { info } from 'npmlog'

import { tutorials, resources as _resources } from '../../../src/api'
import { promptRepeat, validateStringPresent, selectTutorial, promptCreateFirst, logEverythingDone, logList, logPreview, logCreateLater } from './utils.js'

// *** LOGGING ***

function logResources (message, resources) {
  logList(message, resources.map(resource => `${resource.title} (${resource.type})`))
}

// *** INPUT VALIDATION ***

function validateUrl (tutorial, link) {
  if (tutorial.resources.some(resource => resource.link.toLowerCase() === link.toLowerCase())) {
    return `Looks like you've already added a resource with that URL. Please pick another.`
  } else if (link.startsWith('http://') || link.startsWith('https://') || link.startsWith('ipfs://')) {
    return true
  } else {
    return `That URL doesn't look right. Please be sure to start with \`http://\` or \`https://\`.`
  }
}

// *** TRANSITIONAL DIALOGS & PROMPTS ***

async function createResourceIntro ({ createLesson, createTutorial }) {
  // determine new tutorial number
  info("Let's add resources to your tutorial.")

  const tutorial = await selectTutorial('resources', { createTutorial, createResource, createLesson })

  // print existing resources if present
  if (tutorial.resources.length === 0) {
    info("Let's create your first resource!")
  } else {
    logResources("Here are the resources you've created so far", tutorial.resources)
  }

  return createResource(tutorial.id, { createLesson }) // loops until user declines to repeat, then offers closing statements
}

async function afterResourceCreate (tutorialId, { createLesson }) {
  const tutorial = await tutorials.get(tutorialId)

  logPreview('your resources page', tutorial.url, 'resources')
  info('Need to change something? You can edit your resources in the file `src/static/tutorials.json`.')

  // prompt to create lessons if not yet done
  if (tutorial.lessons.length === 0) {
    info(`Looks like your "${tutorial.title}" tutorial doesn't have any lessons yet.`)

    if (await promptCreateFirst('lesson', tutorial.id)) {
      await createLesson(tutorial, { createResource })
    } else {
      logCreateLater('lessons')
    }
  } else {
    logEverythingDone(tutorial)
  }
}

// *** RESOURCE CREATION ***

async function createResource (tutorialId, { createLesson }) {
  const tutorial = await tutorials.get(tutorialId)

  const responses = await prompt([
    {
      type: 'input',
      name: 'title',
      message: "What's the title of this resource?",
      validate: validateStringPresent
    },
    {
      type: 'input',
      name: 'link',
      message: "What's the URL of this resource?",
      validate: (link) => validateUrl(tutorial, link)
    },
    {
      type: 'input',
      name: 'description',
      message: 'Add a description of this resource.',
      validate: validateStringPresent
    },
    {
      type: 'list',
      name: 'type',
      message: "What's the format of this resource?",
      choices: [ 'article', 'demo', 'docs', 'tool', 'tutorial', 'video' ]
    }
  ])

  // create resource in tutorials.json
  const newResource = {
    title: responses.title,
    link: responses.link.toLowerCase(),
    type: responses.type,
    description: responses.description
  }

  await _resources.add(tutorial.id, newResource)

  // log success
  info(`I've added "${responses.title}" to your resources list.`)

  // prompt to repeat process until user declines, then log results
  if (await promptRepeat('resource')) {
    return createResource(tutorial.id, { createLesson })
  } else {
    logResources(
      `Okay, sounds like we're done. Here are all the resources now included in "${tutorial.title}"`,
      await _resources.get(tutorial.id)
    )

    await afterResourceCreate(tutorial.id, { createLesson })
  }
}

export default { createResourceIntro, createResource, afterResourceCreate }
