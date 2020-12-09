const coursesJson = require('../static/courses.json')
const courses = (window.__DATA__ && window.__DATA__.courses) || coursesJson

export function getCourseNames () {
  return Object.keys(courses).filter(course => (course !== 'all' && course !== 'featured'))
}

export default courses
