const api = require('./api')

const types = {
  STATIC: 'static',
  TUTORIAL: 'tutorial',
  LESSON: 'lesson',
  RESOURCES: 'resources',
  ERROR: 'error'
}

// compute routes for tutorials
const tutorialRoutes = Object.values(api.tutorials.list.get()).reduce((routes, tutorial) => {
  routes.push({
    type: types.TUTORIAL,
    path: `/${tutorial.url}/`
  })
  routes.push({
    type: types.RESOURCES,
    path: `/${tutorial.url}/resources/`
  })

  return routes.concat(tutorial.lessons.map(lesson => ({
    type: types.LESSON,
    path: `/${lesson.url}/`
  })))
}, [])

const routes = [
  // Pages
  { type: types.STATIC, path: '/' },
  { type: types.STATIC, path: '/events/' },
  { type: types.STATIC, path: '/host/' },
  { type: types.STATIC, path: '/build/' },
  { type: types.STATIC, path: '/contribute/' },
  { type: types.STATIC, path: '/news/' },
  { type: types.STATIC, path: '/tutorials/' },
  ...tutorialRoutes,
  { type: types.ERROR, path: '/404/' }
]

routes.types = types

module.exports = routes
