const api = require('./api')

// compute routes for tutorials
const tutorialRoutes = Object.values(api.tutorials.list.get()).reduce((routes, tutorial) => {
  routes.push(`/${tutorial.url}`)
  routes.push(`/${tutorial.url}/resources`)

  return routes.concat(tutorial.lessons.map(lesson => `/${lesson.url}`))
}, [])

module.exports = [
  // Pages
  '/',
  '/events',
  '/chapters',
  '/host',
  '/build',
  '/contribute',
  '/tutorials',
  '/news',
  ...tutorialRoutes,
  '/404'
]
