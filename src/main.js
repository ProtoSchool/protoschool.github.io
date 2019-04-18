// Global styles. Opt-in single-purpose atoms only, no hairy css "frameworks".
import 'tachyons'
import 'ipfs-css'

import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
// Pages
import Home from './pages/Home.vue'
import Tutorials from './pages/Tutorials.vue'
import Chapters from './pages/Chapters.vue'
import Contribute from './pages/Contribute.vue'
import Host from './pages/Host.vue'
import Build from './pages/Build.vue'
// Lessons
import Landing from './tutorials/landing.vue'
import LessonBasics01 from './tutorials/Basics/01.vue'
import LessonBasics02 from './tutorials/Basics/02.vue'
import LessonBasics03 from './tutorials/Basics/03.vue'
import LessonBlog01 from './tutorials/Blog/01.vue'
import LessonBlog02 from './tutorials/Blog/02.vue'
import LessonBlog03 from './tutorials/Blog/03.vue'
import LessonBlog04 from './tutorials/Blog/04.vue'
import LessonBlog05 from './tutorials/Blog/05.vue'
import LessonBlog06 from './tutorials/Blog/06.vue'
import LessonBlog07 from './tutorials/Blog/07.vue'
import LessonDataStructures01 from './tutorials/Data-Structures/01.vue'
import LessonDataStructures02 from './tutorials/Data-Structures/02.vue'
import LessonDataStructures03 from './tutorials/Data-Structures/03.vue'
import LessonDataStructures04 from './tutorials/Data-Structures/04.vue'
import LessonDataStructures05 from './tutorials/Data-Structures/05.vue'
// import MutableFileSystem01 from './tutorials/Mutable-File-System/01.vue'
// import MutableFileSystem02 from './tutorials/Mutable-File-System/02.vue'
// import MutableFileSystem03 from './tutorials/Mutable-File-System/03.vue'
// import MutableFileSystem04 from './tutorials/Mutable-File-System/04.vue'
// import MutableFileSystem05 from './tutorials/Mutable-File-System/05.vue'

Vue.use(VueRouter)

const routes = [
  // Pages
  { path: '/', component: Home, name: 'Home' },
  { path: '/tutorials', component: Tutorials, name: 'Tutorials' },
  { path: '/chapters', component: Chapters, name: 'Chapters' },
  { path: '/host', component: Host, name: 'Host' },
  { path: '/build', component: Build, name: 'Build' },
  { path: '/contribute', component: Contribute, name: 'Contribute' },
  // Lessons - Data Structures
  { path: '/data-structures', component: Landing, props: { tutorialId: 'dataStructures' } },
  { path: '/data-structures/01', component: LessonDataStructures01 },
  { path: '/data-structures/02', component: LessonDataStructures02 },
  { path: '/data-structures/03', component: LessonDataStructures03 },
  { path: '/data-structures/04', component: LessonDataStructures04 },
  { path: '/data-structures/05', component: LessonDataStructures05 },
  // Lessons - Basics
  { path: '/basics', component: Landing, props: { tutorialId: 'basics' } },
  { path: '/basics/01', component: LessonBasics01 },
  { path: '/basics/02', component: LessonBasics02 },
  { path: '/basics/03', component: LessonBasics03 },
  // Lessons - Blog
  { path: '/blog', component: Landing, props: { tutorialId: 'blog' } },
  { path: '/blog/01', component: LessonBlog01 },
  { path: '/blog/02', component: LessonBlog02 },
  { path: '/blog/03', component: LessonBlog03 },
  { path: '/blog/04', component: LessonBlog04 },
  { path: '/blog/05', component: LessonBlog05 },
  { path: '/blog/06', component: LessonBlog06 },
  { path: '/blog/07', component: LessonBlog07 },
  // Lessons - MFS
  // { path: '/mutable-file-system', component: Landing, props: { tutorialId: 'mutableFileSystem' } },
  // { path: '/mutable-file-system/01', component: MutableFileSystem01 },
  // { path: '/mutable-file-system/02', component: MutableFileSystem02 },
  // { path: '/mutable-file-system/03', component: MutableFileSystem03 },
  // { path: '/mutable-file-system/04', component: MutableFileSystem04 },
  // { path: '/mutable-file-system/05', component: MutableFileSystem05 },
  // 404
  { path: '*', name: '404' }
]

const router = new VueRouter({
  routes,
  scrollBehavior (to, from) {
    return { x: 0, y: 0 }
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
