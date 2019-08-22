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
// Components
import Landing from './components/Landing.vue'
import ResourcesLesson from './components/ResourcesLesson.vue'
// Lessons
import T001L01 from './tutorials/001/01.vue'
import T001L02 from './tutorials/001/02.vue'
import T001L03 from './tutorials/001/03.vue'
import T001L04 from './tutorials/001/04.vue'
import T001L05 from './tutorials/001/05.vue'
import T002L01 from './tutorials/002/01.vue'
import T002L02 from './tutorials/002/02.vue'
import T002L03 from './tutorials/002/03.vue'
import T003L01 from './tutorials/003/01.vue'
import T003L02 from './tutorials/003/02.vue'
import T003L03 from './tutorials/003/03.vue'
import T003L04 from './tutorials/003/04.vue'
import T003L05 from './tutorials/003/05.vue'
import T003L06 from './tutorials/003/06.vue'
import T003L07 from './tutorials/003/07.vue'
import T004L01 from './tutorials/004/01.vue'
import T004L02 from './tutorials/004/02.vue'
import T004L03 from './tutorials/004/03.vue'
import T004L04 from './tutorials/004/04.vue'
import T004L05 from './tutorials/004/05.vue'
import T004L06 from './tutorials/004/06.vue'
import T004L07 from './tutorials/004/07.vue'
import T004L08 from './tutorials/004/08.vue'
import T004L09 from './tutorials/004/09.vue'
import T004L10 from './tutorials/004/10.vue'
import T004L11 from './tutorials/004/11.vue'

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
  // Lessons - Data Structures
  { path: '/data-structures', component: Landing, props: { tutorialId: '001' } },
  { path: '/data-structures/01', component: T001L01 },
  { path: '/data-structures/02', component: T001L02 },
  { path: '/data-structures/03', component: T001L03 },
  { path: '/data-structures/04', component: T001L04 },
  { path: '/data-structures/05', component: T001L05 },
  { path: '/data-structures/resources', component: ResourcesLesson, props: { tutorialId: '001' } },
  // Lessons - Basics
  { path: '/xxx', component: Landing, props: { tutorialId: '002' } },
  { path: '/xxx/01', component: T002L01 },
  { path: '/xxx/02', component: T002L02 },
  { path: '/xxx/03', component: T002L03 },
  { path: '/xxx/resources', component: ResourcesLesson, props: { tutorialId: '002' } },
  // Lessons - Blog
  { path: '/blog', component: Landing, props: { tutorialId: '003' } },
  { path: '/blog/01', component: T003L01 },
  { path: '/blog/02', component: T003L02 },
  { path: '/blog/03', component: T003L03 },
  { path: '/blog/04', component: T003L04 },
  { path: '/blog/05', component: T003L05 },
  { path: '/blog/06', component: T003L06 },
  { path: '/blog/07', component: T003L07 },
  { path: '/blog/resources', component: ResourcesLesson, props: { tutorialId: '003' } },
  // Lessons - MFS
  { path: '/mutable-file-system', component: Landing, props: { tutorialId: '004' } },
  { path: '/mutable-file-system/01', component: T004L01 },
  { path: '/mutable-file-system/02', component: T004L02 },
  { path: '/mutable-file-system/03', component: T004L03 },
  { path: '/mutable-file-system/04', component: T004L04 },
  { path: '/mutable-file-system/05', component: T004L05 },
  { path: '/mutable-file-system/06', component: T004L06 },
  { path: '/mutable-file-system/07', component: T004L07 },
  { path: '/mutable-file-system/08', component: T004L08 },
  { path: '/mutable-file-system/09', component: T004L09 },
  { path: '/mutable-file-system/10', component: T004L10 },
  { path: '/mutable-file-system/11', component: T004L11 },
  { path: '/mutable-file-system/resources', component: ResourcesLesson, props: { tutorialId: '004' } },
  // 404
  { path: '*', name: '404' }
]

const MIGRATIONS = [
  { tutorialId: '002', pastUrl: 'basics' }
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
