// Global styles. Opt-in single-purpose atoms only, no hairy css "frameworks".
import 'tachyons'
import 'ipfs-css'

import Vue from 'vue'
import VueRouter from 'vue-router'
import VueHighlightJS from 'vue-highlight.js'
import App from './App.vue'
// Utils
import { migrateCache } from './utils/paths'
// Pages
import Home from './pages/Home.vue'
import Tutorials from './pages/Tutorials.vue'
import Chapters from './pages/Chapters.vue'
import Contribute from './pages/Contribute.vue'
import Host from './pages/Host.vue'
import Build from './pages/Build.vue'
import NotFound from './pages/NotFound.vue'
// Components
import Landing from './components/Landing.vue'
import ResourcesLesson from './components/ResourcesLesson.vue'
// Lessons
import T0001L01 from './tutorials/0001/01.vue'
import T0001L02 from './tutorials/0001/02.vue'
import T0001L03 from './tutorials/0001/03.vue'
import T0001L04 from './tutorials/0001/04.vue'
import T0001L05 from './tutorials/0001/05.vue'
import T0002L01 from './tutorials/0002/01.vue'
import T0002L02 from './tutorials/0002/02.vue'
import T0002L03 from './tutorials/0002/03.vue'
import T0003L01 from './tutorials/0003/01.vue'
import T0003L02 from './tutorials/0003/02.vue'
import T0003L03 from './tutorials/0003/03.vue'
import T0003L04 from './tutorials/0003/04.vue'
import T0003L05 from './tutorials/0003/05.vue'
import T0003L06 from './tutorials/0003/06.vue'
import T0003L07 from './tutorials/0003/07.vue'
import T0004L01 from './tutorials/0004/01.vue'
import T0004L02 from './tutorials/0004/02.vue'
import T0004L03 from './tutorials/0004/03.vue'
import T0004L04 from './tutorials/0004/04.vue'
import T0004L05 from './tutorials/0004/05.vue'
import T0004L06 from './tutorials/0004/06.vue'
import T0004L07 from './tutorials/0004/07.vue'
import T0004L08 from './tutorials/0004/08.vue'
import T0004L09 from './tutorials/0004/09.vue'
import T0004L10 from './tutorials/0004/10.vue'
import T0004L11 from './tutorials/0004/11.vue'
import T0005L01 from './tutorials/0005/01.vue'
import T0005L02 from './tutorials/0005/02.vue'
import T0005L03 from './tutorials/0005/03.vue'
import T0005L04 from './tutorials/0005/04.vue'
import T0005L05 from './tutorials/0005/05.vue'
import T0005L06 from './tutorials/0005/06.vue'
import T0005L07 from './tutorials/0005/07.vue'
import T0005L08 from './tutorials/0005/08.vue'

Vue
  .use(VueRouter)
  .use(VueHighlightJS)

const routes = [
  // Pages
  { path: '/', component: Home, name: 'Home' },
  { path: '/tutorials', component: Tutorials, name: 'Tutorials' },
  { path: '/chapters', component: Chapters, name: 'Chapters' },
  { path: '/host', component: Host, name: 'Host' },
  { path: '/build', component: Build, name: 'Build' },
  { path: '/contribute', component: Contribute, name: 'Contribute' },
  // Tutorial 0001
  { path: '/data-structures', component: Landing, props: { tutorialId: '0001' } },
  { path: '/data-structures/resources', component: ResourcesLesson, props: { tutorialId: '0001' } },
  { path: '/data-structures/01', component: T0001L01 },
  { path: '/data-structures/02', component: T0001L02 },
  { path: '/data-structures/03', component: T0001L03 },
  { path: '/data-structures/04', component: T0001L04 },
  { path: '/data-structures/05', component: T0001L05 },
  // Tutorial 0002
  { path: '/basics', component: Landing, props: { tutorialId: '0002' } },
  { path: '/basics/resources', component: ResourcesLesson, props: { tutorialId: '0002' } },
  { path: '/basics/01', component: T0002L01 },
  { path: '/basics/02', component: T0002L02 },
  { path: '/basics/03', component: T0002L03 },
  // Tutorial 0003
  { path: '/blog', component: Landing, props: { tutorialId: '0003' } },
  { path: '/blog/resources', component: ResourcesLesson, props: { tutorialId: '0003' } },
  { path: '/blog/01', component: T0003L01 },
  { path: '/blog/02', component: T0003L02 },
  { path: '/blog/03', component: T0003L03 },
  { path: '/blog/04', component: T0003L04 },
  { path: '/blog/05', component: T0003L05 },
  { path: '/blog/06', component: T0003L06 },
  { path: '/blog/07', component: T0003L07 },
  // Tutorial 0004
  { path: '/mutable-file-system', component: Landing, props: { tutorialId: '0004' } },
  { path: '/mutable-file-system/resources', component: ResourcesLesson, props: { tutorialId: '0004' } },
  { path: '/mutable-file-system/01', component: T0004L01 },
  { path: '/mutable-file-system/02', component: T0004L02 },
  { path: '/mutable-file-system/03', component: T0004L03 },
  { path: '/mutable-file-system/04', component: T0004L04 },
  { path: '/mutable-file-system/05', component: T0004L05 },
  { path: '/mutable-file-system/06', component: T0004L06 },
  { path: '/mutable-file-system/07', component: T0004L07 },
  { path: '/mutable-file-system/08', component: T0004L08 },
  { path: '/mutable-file-system/09', component: T0004L09 },
  { path: '/mutable-file-system/10', component: T0004L10 },
  { path: '/mutable-file-system/01', component: T0004L11 },
  // Tutorial 0005
  { path: '/regular-files-api', component: Landing, props: { tutorialId: '0005' } },
  { path: '/regular-files-api/resources', component: ResourcesLesson, props: { tutorialId: '0005' } },
  { path: '/regular-files-api/01', component: T0005L01 },
  { path: '/regular-files-api/02', component: T0005L02 },
  { path: '/regular-files-api/03', component: T0005L03 },
  { path: '/regular-files-api/04', component: T0005L04 },
  { path: '/regular-files-api/05', component: T0005L05 },
  { path: '/regular-files-api/06', component: T0005L06 },
  { path: '/regular-files-api/07', component: T0005L07 },
  { path: '/regular-files-api/08', component: T0005L08 },
  // 404
  { path: '*', name: '404', component: NotFound, props: { notFound: true } }
]

const MIGRATIONS = [
  // { tutorialId: '0002', pastUrl: 'basics' }
]

MIGRATIONS.forEach((m) => migrateCache(m.tutorialId, m.pastUrl))

const router = new VueRouter({
  routes,
  scrollBehavior (to, from) {
    return { x: 0, y: 0 }
  }
})

// track page view via Countly when route changes
router.afterEach((to) => {
  if (!window.Countly) return
  window.Countly.q.push(['track_pageview', '/#' + to.path])
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
