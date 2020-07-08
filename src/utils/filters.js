import _ from 'lodash'
import { correctedCases } from './tutorials'
import courseList from '../static/courses.json'

export function listCourses () {
  const courses = {}
  let standardCourses = _.omit(courseList, ['featured'])
  for (const course in standardCourses) {
    courses[course] = {
      key: course,
      name: correctedCases[course] || _.capitalize(course),
      count: courseList[course].length
    }
  }
  return courses
}
