const moment = require('moment')

const api = require('./api')

const lastmod = moment().format('YYYY-MM-DD')

const types = {
  STATIC: 'static',
  TUTORIAL: 'tutorial',
  LESSON: 'lesson',
  RESOURCES: 'resources',
  ERROR: 'error',
  REDIRECT: 'redirect'
}

// compute routes for tutorials
const tutorialRoutes = Object.values(api.tutorials.list.get()).reduce((routes, tutorial) => {
  routes.push({
    type: types.TUTORIAL,
    loc: `/${tutorial.url}/`,
    priority: 1,
    changefreq: 'monthly',
    lastmod
  })
  routes.push({
    type: types.RESOURCES,
    loc: `/${tutorial.url}/resources/`,
    priority: 0.6,
    changefreq: 'monthly',
    lastmod
  })

  if (tutorial.redirectUrls && tutorial.redirectUrls.length) {
    tutorial.redirectUrls.forEach(url => {
      routes.push({ type: types.REDIRECT, loc: `/${url}` })
      routes.push({ type: types.REDIRECT, loc: `/${url}/resources` })

      tutorial.lessons.forEach(lesson => routes.push({
        type: types.REDIRECT,
        loc: `/${url}/${lesson.formattedId}`
      }))
    })
  }

  return routes.concat(tutorial.lessons.map(lesson => ({
    type: types.LESSON,
    loc: `/${lesson.url}/`,
    priority: 0.6,
    changefreq: 'monthly',
    lastmod
  })))
}, [])

const routes = [
  // Pages
  { type: types.STATIC, loc: '/', priority: 1, changefreq: 'weekly', lastmod },
  { type: types.STATIC, loc: '/tutorials/', priority: 0.9, changefreq: 'weekly', lastmod },
  { type: types.STATIC, loc: '/events/', priority: 0.8, changefreq: 'weekly', lastmod },
  { type: types.STATIC, loc: '/news/', priority: 0.7, changefreq: 'monthly', lastmod },
  { type: types.STATIC, loc: '/host/', priority: 0.6, changefreq: 'monthly', lastmod },
  { type: types.STATIC, loc: '/build/', priority: 0.6, changefreq: 'monthly', lastmod },
  { type: types.STATIC, loc: '/contribute/', priority: 0.6, changefreq: 'monthly', lastmod },
  ...tutorialRoutes,
  // error pages
  { type: types.ERROR, loc: '/404/' },
  // redirect pages
  { type: types.REDIRECT, loc: '/chapters/' }
]

routes.types = types

module.exports = routes
