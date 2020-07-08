import _ from 'lodash'
import tutorials, { getTutorialType, correctedCases } from './tutorials'
import courses from '../static/courses.json'

function listCourses () {
  const courseList = {}
  let standardCourses = _.omit(courses, ['featured'])
  for (const course in standardCourses) {
    courseList[course] = {
      key: course,
      name: correctedCases[course] || _.capitalize(course),
      count: courses[course].length,
      tutorials: courses[course]
    }
  }
  return courseList
}

export const courseList = listCourses()

export function filterTutorials (courseKey, includeCodingTutorials) {
  const courseTutorials = courseList[courseKey].tutorials.map(tutorialId => ({ ...tutorials[tutorialId], tutorialId }))
  if (!includeCodingTutorials) {
    return courseTutorials.filter(tutorial => {
      const tutorialType = getTutorialType(tutorial.tutorialId)
      return tutorialType !== 'code' && tutorialType !== 'file-upload'
    })
  } else {
    return courseTutorials
  }
}
