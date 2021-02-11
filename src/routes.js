const moment = require('moment')

const lastmod = moment().format('YYYY-MM-DD')

function addSitemapLoc (route) {
  if (route.sitemap) {
    route.sitemap.loc = route.path
  }

  return route
}

// Route types - used to choose which routes are prerendered or added to the sitemap
const TYPES = {
  STATIC: 'static',
  TUTORIAL: 'tutorial',
  LESSON: 'lesson',
  RESOURCES: 'resources',
  COURSE: 'course',
  ERROR: 'error',
  REDIRECT: 'redirect'
}

// Static routes
function statics () {
  return [
    {
      path: '/',
      component: () => import(/* webpackChunkName: "home" */ './pages/Home'),
      name: 'Home',
      sitemap: { priority: 1, changefreq: 'weekly', lastmod }
    },
    {
      path: '/tutorials/',
      component: () => import(/* webpackChunkName: "tutorials" */ './pages/Tutorials'),
      name: 'Tutorials',
      props: (route) => ({ code: route.query.code, course: route.query.course }),
      sitemap: { priority: 0.9, changefreq: 'weekly', lastmod }
    },
    {
      path: '/events/',
      component: () => import(/* webpackChunkName: "events" */ './pages/Events'),
      name: 'Events',
      sitemap: { priority: 0.8, changefreq: 'weekly', lastmod }
    },
    {
      path: '/news/',
      component: () => import(/* webpackChunkName: "news" */ './pages/News'),
      name: 'News',
      sitemap: { priority: 0.7, changefreq: 'monthly', lastmod }
    },
    {
      path: '/host/',
      component: () => import(/* webpackChunkName: "host" */ './pages/Host'),
      name: 'Host',
      sitemap: { priority: 0.6, changefreq: 'monthly', lastmod }
    },
    {
      path: '/build/',
      component: () => import(/* webpackChunkName: "build" */ './pages/Build'),
      name: 'Build',
      sitemap: { priority: 0.6, changefreq: 'monthly', lastmod }
    },
    {
      path: '/contribute/',
      component: () => import(/* webpackChunkName: "contribute" */ './pages/Contribute'),
      name: 'Contribute',
      sitemap: { priority: 0.6, changefreq: 'monthly', lastmod }
    }
  ].map(route => ({ ...route, type: TYPES.STATIC })).map(addSitemapLoc)
}

// Redirect routes
// Redirects that need to return a 301 status code need to be configured in the server as well
function redirects () {
  // TODO Use API to get the tutorials (needs API to be universal)
  // https://github.com/ProtoSchool/protoschool.github.io/issues/589
  // const api = require('./api')

  // const tutorialRedirects = Object.values(api.tutorials.list()).reduce((redirects, tutorial) => {
  //   if (tutorial.redirectUrls && tutorial.redirectUrls.length) {
  //     tutorial.redirectUrls.forEach(url => {
  //       redirects.push({ path: `/${url}/`, redirect: `/${tutorial.url}` })
  //       redirects.push({ path: `/${url}/resources/`, redirect: `/${tutorial.url}/resources/` })

  //       tutorial.lessons.forEach(lesson => {
  //         redirects.push({ path: `/${url}/${lesson.formattedId}/`, redirect: `/${lesson.url}/` })
  //       })
  //     })
  //   }

  //   return redirects
  // }, [])

  return [
    // ...tutorialRedirects,
    { path: '/chapters/', redirect: '/events/' },
    { path: '/data-structures/', redirect: '/content-addressing/' },
    { path: '/data-structures/resources/', redirect: '/content-addressing/resources/' },
    { path: '/data-structures/01/', redirect: '/content-addressing/01/' },
    { path: '/data-structures/02/', redirect: '/content-addressing/02/' },
    { path: '/data-structures/03/', redirect: '/content-addressing/03/' },
    { path: '/data-structures/04/', redirect: '/content-addressing/04/' },
    { path: '/data-structures/05/', redirect: '/content-addressing/05/' }
  ].map(route => ({ ...route, type: TYPES.REDIRECT }))
}

// Error routes
function errors () {
  return [
    {
      path: '/404/',
      name: '404',
      component: () => import(/* webpackChunkName: "error" */ './pages/NotFound')
    }
  ].map(route => ({ ...route, type: TYPES.ERROR })).map(addSitemapLoc)
}

/* Tutorials routes. These are used to prerender and to be added to the sitemap
  e.g.
  /data-structures
  /data-structures/01
  /data-structures/resources

  `redirectUrls` property will also be read to generate equivalent redirect routes
*/
function tutorials () {
  const api = require('./api')

  return Object.values(api.tutorials.list.get()).reduce((routes, tutorial) => {
    routes.push({
      type: TYPES.TUTORIAL,
      path: `/${tutorial.url}/`,
      sitemap: { priority: 1, changefreq: 'monthly', lastmod }
    })
    routes.push({
      type: TYPES.RESOURCES,
      path: `/${tutorial.url}/resources/`
    })

    return routes.concat(tutorial.lessons.map(lesson => ({
      type: TYPES.LESSON,
      path: `/${lesson.url}/`,
      sitemap: { priority: 1, changefreq: 'monthly', lastmod }
    })))
  }, []).map(addSitemapLoc)
}

/* Course routes. These are used to prerender and to be added to the sitemap
  e.g.
  /ipfs
  /filecoin

*/
function courses () {
  const api = require('./api')

  return api.courses.getCourseNames().map(course => {
    return {
      type: TYPES.COURSE,
      path: `/course/${course}/`,
      sitemap: { priority: 1, changefreq: 'monthly', lastmod }
    }
  }).map(addSitemapLoc)
}

function all () {
  return [
    ...statics(),
    ...tutorials(),
    ...courses(),
    ...errors(),
    ...redirects()
  ]
}

module.exports = {
  statics,
  tutorials,
  courses,
  errors,
  redirects,
  all,
  TYPES
}
