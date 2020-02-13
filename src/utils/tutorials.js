import tutorialsList from '../static/tutorials.json'

// returns tutorial object
export const getTutorial = tutorialId => {
  return tutorialsList[tutorialId]
}

// returns lesson object
export const getLesson = (tutorialId, lessonId) => {
  let lesson
  if (!lessonId) {
    lesson = {
      title: 'Resources',
      type: 'resources'
    }
  } else {
    // get lesson object from tutorials.json
    lesson = getTutorial(tutorialId).lessons[(lessonId - 1)]
  }
  // add more useful properties to it // BUT MAKE SURE THEY WORK FOR RESOURCES PAGE
  // lesson.path = `/${getTutorial(route).url}/${route.props.default.lessonId}`
  return lesson
}

// returns URL for tutorial's landing page
export const getTutorialFullUrl = tutorialId => {
  return `${window.location.origin}/#/${getTutorial(tutorialId).url}`
}

// returns boolean - true if user has passed all lessons in the tutorial
export const isTutorialPassed = tutorial => !!localStorage[`passed/${tutorial.url}`]

// returns array of all lesson objects for specified tutorial
export const getAllLessonsInTutorial = tutorialId => {
  return tutorialsList[tutorialId].lessons
}

// returns string representing tutorial type
export const getTutorialType = tutorialId => {
  if (tutorialsList[tutorialId].lessons.some(lesson => lesson.type === ('code' || 'file-upload'))) {
    return 'code'
  } else if (tutorialsList[tutorialId].lessons.some(lesson => lesson.type === 'multiple-choice')) {
    return 'multiple-choice'
  } else {
    return 'text'
  }
}

// returns string representing lesson type
export const getLessonType = (tutorialId, lessonId) => {
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

// SAMPLE TUTORIAL DATA FORMAT FROM TUTORIALS.JSON
// "0002": {
//   "url": "basics",
//   "project": "IPFS",
//   "title": "P2P Data Links with Content Addressing",
//   "description": "Store, fetch, and create verifiable links between peer-hosted datasets using the IPFS DAG API and CIDs. It’s graphs with friends!",
//   "lessons": [
//     {
//       "title": "Create a node and return a Content Identifier (CID)",
//       "type": "code"
//     },
//     {
//       "title": "Create a new node that's linked to an old one",
//       "type": "file-upload"
//     },
//     {
//       "title": "Read nested data using link",
//       "type": "multiple-choice"
//     },
//     {
//       "title": "Read nested data using link",
//       "type": "text"
//     }
//   ],
//   "resources": [
//     {
//       "title": "JS-IPFS DAG API",
//       "link": "https://github.com/ipfs/interface-js-ipfs-core/blob/master/SPEC/DAG.md",
//       "type": "docs"
//     },
//     {
//       "title": "Blogging on the Decentralized Web",
//       "link": "https://proto.school/#/blog/",
//       "type": "tutorial",
//       "description": "Ready for a bigger challenge with the IPFS DAG API? Use CIDs to build and update a complex web of data."
//     }
//   ]
// },
