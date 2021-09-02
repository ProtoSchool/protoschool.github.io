import moment from 'moment'

import marked from './marked'
import projects from './projects'
import { DOMAIN } from '../config'

// Load data from the window variable
// This supports data overriding and custom SSR
const tutorialsJson = require('../static/tutorials.json')
const tutorials = (window.__DATA__ && window.__DATA__.tutorials) || tutorialsJson

// SET CASING OVERRIDES HERE
// If a word in a URL would not be appropriate if only the first letter were capitalized,
// add that word here as a property with the correct capitalization (string) as its value.
// This is to be used for single words, not full hyphenated paths. Capitalization of that
// word will apply throughout all tutorial shortnames that include it.
export const correctedCases = {
  api: 'API',
  cid: 'CID',
  of: 'of',
  a: 'a',
  on: 'on',
  to: 'to',
  ipfs: 'IPFS',
  libp2p: 'libp2p',
  ipld: 'IPLD',
  dag: 'DAG',
  dags: 'DAGs'
}

function deriveShortname (path) {
  return path.split('-').map(word => (
    correctedCases[word] ? correctedCases[word] : (word.charAt(0).toUpperCase() + word.slice(1))
  )).join(' ')
}

// Preprocess the tutorials.json file with all the needed info
for (const tutorialId in tutorials) {
  tutorials[tutorialId].formattedId = tutorialId
  tutorials[tutorialId].id = parseInt(tutorialId, 10)
  tutorials[tutorialId].shortTitle = deriveShortname(tutorials[tutorialId].url)
  tutorials[tutorialId].lessons = getTutorialLessons(tutorials[tutorialId])
  tutorials[tutorialId].project = projects.get(tutorials[tutorialId].project)
  tutorials[tutorialId].newMessage = tutorials[tutorialId].newMessage
    ? marked(tutorials[tutorialId].newMessage).html.replace('<p>', '').replace('</p>', '')
    : tutorials[tutorialId].newMessage
  tutorials[tutorialId].updateMessage = tutorials[tutorialId].updateMessage
    ? marked(tutorials[tutorialId].updateMessage).html.replace('<p>', '').replace('</p>', '')
    : tutorials[tutorialId].updateMessage
}

// TODO Move this to a build script in the future to avoid heavy processing on the client.
// This will only become a problem when the number of tutorials and lessons increases
export function getTutorialLessons (tutorial, lessons = [], lessonNumber = 1) {
  const formattedId = lessonNumber.toString().padStart(2, 0)
  const lessonFilePrefix = `${tutorial.formattedId}-${tutorial.url}/${formattedId}`

  let lessonMd
  let lesson

  try {
    lessonMd = marked(require(`../tutorials/${lessonFilePrefix}.md`))

    lesson = {
      id: lessonNumber,
      formattedId,
      url: `/${tutorial.url}/${formattedId}`,
      ...lessonMd.meta,
      html: lessonMd.html
    }
  } catch (error) {
    // lesson not found, we reached the end
    if (error.code === 'MODULE_NOT_FOUND') {
      return lessons
    }

    // data not well formatted
    if (error.name === 'YAMLException') {
      console.error(
        new Error(`Data improperly formatted in the lesson markdown file "${lessonFilePrefix}.md". Check that the YAML syntax is correct.`)
      )
    }
    throw error
  }

  if (lesson.type !== 'text') {
    try {
      lesson.logic = require(`../tutorials/${lessonFilePrefix}.js`).default
    } catch (error) {
      if (error.code === 'MODULE_NOT_FOUND') {
        console.error(
          new Error(`You are missing the file "${lessonFilePrefix}.js" required for lessons of type ${lesson.type}.`)
        )
      }
      throw error
    }
  }
  lessons.push(lesson)
  return getTutorialLessons(tutorial, lessons, lessonNumber + 1)
}

// SAMPLE LESSON OBJECT
// {
//   id: 1,
//   formattedId: "01",
//   title: "Data structures",
//   type: "text"
// }

// returns lesson object
export function getLesson (tutorialId, lessonId) {
  let lesson

  if (!lessonId) {
    lesson = {
      title: 'Resources',
      type: 'resources'
    }
  } else {
    // get lesson object from tutorials.json
    lesson = tutorials[tutorialId].lessons[(parseInt(lessonId, 10) - 1)]
  }

  // add more useful properties to it // BUT MAKE SURE THEY WORK FOR RESOURCES PAGE
  // lesson.path = `/${getTutorial(route).url}/${route.props.default.lessonId}`
  return lesson
}

// returns URL for tutorial's landing page
export function getTutorialFullUrl (tutorialId) {
  return `${DOMAIN}/${tutorials[tutorialId].url}`
}

export const states = {
  NEW: 'new',
  UPDATED: 'updated'
}

export const state = {
  isTutorialPassed,
  hasTutorialBeenUpdatedRecently,
  isTutorialNew,
  get: function get (tutorial) {
    if (isTutorialNew(tutorial)) {
      return {
        type: states.NEW,
        title: 'New',
        message: tutorial.newMessage
      }
    } else if (hasTutorialBeenUpdatedRecently(tutorial)) {
      return {
        type: states.UPDATED,
        title: 'Updated',
        message: tutorial.updateMessage
      }
    }

    return null
  }
}

// returns boolean - true if user has passed all lessons in the tutorial
export function isTutorialPassed (tutorial) {
  return !!localStorage[`passed/${tutorial.url}`]
}

export function isTutorialPartiallyPassed (tutorial) {
  const createdAtDate = new Date(tutorial.createdAt)

  return isTutorialPassed(tutorial) || tutorial.lessons.some(lesson => {
    const lessonPassedAt = localStorage[`passed/${tutorial.url}/${lesson.formattedId}`]

    return new Date(lessonPassedAt) > createdAtDate
  })
}

export function hasTutorialBeenUpdatedRecently (tutorial) {
  const updatedAtDate = new Date(tutorial.updatedAt)
  const tutorialPassedAt = localStorage[`passed/${tutorial.url}`]
  const tutorialHasUpdates =
    tutorial.updatedAt !== tutorial.createdAt ||
    !!tutorial.updateMessage

  const tutorialPassedBeforeUpdate = tutorialPassedAt && (
    tutorialPassedAt === 'passed' ||
    new Date(tutorialPassedAt) < updatedAtDate
  )

  const someLessonPassedBeforeUpdate = tutorial.lessons.some(lesson => {
    const lessonPassedAt = localStorage[`passed/${tutorial.url}/${lesson.formattedId}`]

    return lessonPassedAt && (
      lessonPassedAt === 'passed' ||
      new Date(lessonPassedAt) < updatedAtDate
    )
  })

  return tutorialHasUpdates && (tutorialPassedBeforeUpdate || someLessonPassedBeforeUpdate)
}

export function isTutorialNew (tutorial) {
  return moment().diff(tutorial.createdAt, 'month') === 0 && !isTutorialPartiallyPassed(tutorial)
}

// returns string representing tutorial type
export function getTutorialType (tutorialId) {
  if (tutorials[tutorialId].lessons.some(lesson => lesson.type === 'file-upload')) {
    return 'file-upload'
  } else if (tutorials[tutorialId].lessons.some(lesson => lesson.type === 'code')) {
    return 'code'
  } else if (tutorials[tutorialId].lessons.some(lesson => lesson.type === 'multiple-choice')) {
    return 'multiple-choice'
  } else {
    return 'text'
  }
}

export function getTutorialByUrl (tutorialUrl) {
  return Object.values(tutorials).find(({ url }) => url === tutorialUrl)
}

export function setTutorialPassed (tutorial) {
  localStorage[`passed/${tutorial.url}`] = new Date().toISOString()
}

// returns string representing lesson type
export function getLessonType (tutorialId, lessonId) {
  if (lessonId === 'resources') {
    return 'resources'
  }
  return getLesson(tutorialId, lessonId).type
}

export function setLessonPassed (tutorial, lesson) {
  if (lesson.type === 'resources') {
    localStorage[`passed/${tutorial.url}/resources`] = new Date().toISOString()
  } else {
    localStorage[`passed/${tutorial.url}/${lesson.formattedId}`] = new Date().toISOString()
  }
}

export function isLessonPassed (tutorial, lesson) {
  return !!localStorage[`passed/${tutorial.url}/${lesson.type === 'resources' ? 'resources' : lesson.formattedId}`]
}

export default tutorials
