import _ from 'lodash'
import tutorials, { getTutorialType, correctedCases } from './tutorials'
import courses from '../static/courses.json'

function listCourses () {
  const courseList = []
  let standardCourses = _.omit(courses, ['featured'])
  for (const course in standardCourses) {
    courseList.push({
      key: course,
      name: correctedCases[course] || _.capitalize(course),
      count: courses[course].length,
      tutorials: courses[course]
    })
  }
  return courseList.sort((a, b) => (b.count - a.count))
}

export const courseList = listCourses()

export function filterTutorials (course, includeCodingTutorials) {
  const courseTutorials = course.tutorials.map(tutorialId => ({ ...tutorials[tutorialId], tutorialId }))
  if (!includeCodingTutorials) {
    return courseTutorials.filter(tutorial => {
      const tutorialType = getTutorialType(tutorial.tutorialId)
      return tutorialType !== 'code' && tutorialType !== 'file-upload'
    })
  } else {
    return courseTutorials
  }
}
