import marked from 'meta-marked'

import tutorials from '../static/tutorials.json'
import { deriveShortname } from './paths'

// Preprocess the tutorials.json file with all the needed info
for (const tutorialId in tutorials) {
  tutorials[tutorialId].formattedId = tutorialId
  tutorials[tutorialId].id = parseInt(tutorialId, 10)
  tutorials[tutorialId].shortTitle = deriveShortname(tutorials[tutorialId].url)
  tutorials[tutorialId].lessons = getTutorialLessons(tutorials[tutorialId])
}

// TODO move this to a build script in the future to avoid heavy processing on the client
export function getTutorialLessons (tutorial, lessons = [], lessonNumber = 1) {
  const lessonfileName = `${tutorial.formattedId}-${tutorial.url}/${lessonNumber.toString().padStart(2, 0)}.md`
  let lesson

  try {
    lesson = require(
      `../tutorials/${lessonfileName}`
    )

    lessons.push(marked(lesson).meta)
  } catch (error) {
    // lesson not found, we reached the end
    if (error.code === 'MODULE_NOT_FOUND') {
      return lessons
    }

    // data not well formatted
    if (error.name === 'YAMLException') {
      console.error(
        new Error(`Data not well formatted in the lesson markdown file "${lessonfileName}". Check the syntax is correct.`)
      )
    }

    throw error
  }

  return getTutorialLessons(tutorial, lessons, lessonNumber + 1)
}

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
  return `${window.location.origin}/#/${tutorials[tutorialId].url}`
}

// returns boolean - true if user has passed all lessons in the tutorial
export function isTutorialPassed (tutorial) {
  return !!localStorage[`passed/${tutorial.url}`]
}

// returns string representing tutorial type
export function getTutorialType (tutorialId) {
  if (tutorials[tutorialId].lessons.some(lesson => lesson.type === ('code' || 'file-upload'))) {
    return 'code'
  } else if (tutorials[tutorialId].lessons.some(lesson => lesson.type === 'multiple-choice')) {
    return 'multiple-choice'
  } else {
    return 'text'
  }
}

// returns string representing lesson type
export function getLessonType (tutorialId, lessonId) {
  if (lessonId === 'resources') {
    return 'resources'
  }
  const type = getLesson(tutorialId, lessonId).type

  if (type === 'file-upload') {
    return 'code'
  } else {
    return type
  }
}

export function getTutorialByUrl (tutorialUrl) {
  return Object.values(tutorials).find(({ url }) => url === tutorialUrl)
}

// Get all redirects for each tutorial through the `redirects` attribute
export function getRedirects () {
  return Object.values(tutorials).reduce((redirects, tutorial) => {
    if (tutorial.redirects) {
      redirects = redirects.concat(
        ...tutorial.redirects.map(redirect => [
          {
            path: `/${redirect}`,
            redirect: `/${tutorial.url}`
          }, {
            path: `/${redirect}/resources`,
            redirect: `/${tutorial.url}/resources`
          }, {
            path: `/${redirect}/:lessonId`,
            redirect: `/${tutorial.url}/:lessonId`
          }
        ])
      )
    }

    return redirects
  }, [])
}

export default tutorials
