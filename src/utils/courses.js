const coursesJson = require('../static/courses.json')
const courses = (window.__DATA__ && window.__DATA__.courses) || coursesJson

// returns unsorted array of course ids (eg. [ipfs, multiformats, filecoin])
export function getCourseNames () {
  return Object.keys(courses).filter(course => (course !== 'all' && course !== 'featured'))
}

// returns number of tutorials for given course id
export function getTutorialCount (courseId) {
  return courses[courseId].length
}

export default courses
