import VueRouter from 'vue-router'

import { migrateCache } from './utils/paths'

const routes = require('./routes')

// Migrate cache using configured redirects
migrateCache()

const router = new VueRouter({
  routes: [
    ...routes.statics(),
    ...routes.errors(),
    ...routes.redirects(),
    // Dynamic routes
    {
      path: '/:tutorialUrl',
      component: () => import(/* webpackChunkName: "tutorial" */ './pages/Landing'),
      props: true
    },
    {
      path: '/:tutorialUrl/resources',
      component: () => import(/* webpackChunkName: "resources" */ './pages/ResourcesLesson'),
      props: true,
      name: 'Resources'
    },
    {
      path: '/:tutorialUrl/:lessonId',
      component: () => import(/* webpackChunkName: "lessons" */ './pages/Lesson'),
      props: true
    },
    // 404
    {
      path: '*',
      redirect: '404'
    }
  ],
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 }
  }
})

// track page view via Countly when route changes
router.afterEach((to) => {
  if (!window.Countly) return
  window.Countly.q.push(['track_pageview', to.path])
})

router.beforeEach((to, from, next) => {
  // Remove trailing slash on client side only
  if (to.path !== '/' && to.path.endsWith('/')) {
    next({ path: to.path.substring(0, to.path.length - 1), replace: true })
  } else {
    next()
  }
})

export default router
