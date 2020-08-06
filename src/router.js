import VueRouter from 'vue-router'

import { migrateCache } from './utils/paths'

const routes = [
  // Pages
  {
    path: '/',
    component: () => import(/* webpackChunkName: "home" */ './pages/Home'),
    name: 'Home'
  },
  {
    path: '/tutorials',
    component: () => import(/* webpackChunkName: "tutorials" */ './pages/Tutorials'),
    name: 'Tutorials',
    props: (route) => ({ code: route.query.code, course: route.query.course })
  },
  {
    path: '/events',
    component: () => import(/* webpackChunkName: "events" */ './pages/Events'),
    name: 'Events'
  },
  {
    path: '/chapters',
    redirect: '/events'
  },
  {
    path: '/host',
    component: () => import(/* webpackChunkName: "host" */ './pages/Host'),
    name: 'Host'
  },
  {
    path: '/build',
    component: () => import(/* webpackChunkName: "build" */ './pages/Build'),
    name: 'Build'
  },
  {
    path: '/contribute',
    component: () => import(/* webpackChunkName: "contribute" */ './pages/Contribute'),
    name: 'Contribute'
  },
  {
    path: '/news',
    component: () => import(/* webpackChunkName: "news" */ './pages/News'),
    name: 'News'
  },
  {
    path: '/404',
    name: '404',
    component: () => import(/* webpackChunkName: "not-found" */ './pages/NotFound')
  },
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
]

// Migrate cache using configured redirects
migrateCache()

const router = new VueRouter({
  routes,
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

export default router
