const api = require('./api')

const types = {
  STATIC: 'static',
  TUTORIAL: 'tutorial',
  LESSON: 'lesson',
  RESOURCES: 'resources'
}

// compute routes for tutorials
const tutorialRoutes = Object.values(api.tutorials.list.get()).reduce((routes, tutorial) => {
  routes.push({
    type: types.TUTORIAL,
    path: `/${tutorial.url}`
  })
  routes.push({
    type: types.RESOURCES,
    path: `/${tutorial.url}/resources`
  })

  return routes.concat(tutorial.lessons.map(lesson => ({
    type: types.LESSON,
    path: `/${lesson.url}`
  })))
}, [])

const routes = [
  // Pages
  { type: 'static', path: '/' },
  { type: 'static', path: '/events' },
  { type: 'static', path: '/chapters' },
  { type: 'static', path: '/host' },
  { type: 'static', path: '/build' },
  { type: 'static', path: '/contribute' },
  { type: 'static', path: '/news' },
  { type: 'static', path: '/tutorials' },
  ...tutorialRoutes
]

routes.types = types

module.exports = routes
