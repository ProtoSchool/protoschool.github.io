const api = require('./api')

// compute routes for tutorials
const tutorialRoutes = Object.values(api.tutorials.list.get()).map(tutorial => `/${tutorial.url}`)

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
  ...tutorialRoutes
]
