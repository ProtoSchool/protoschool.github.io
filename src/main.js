// Global styles. Opt-in single-purpose atoms only, no hairy css "frameworks".
import 'tachyons'
import 'ipfs-css'

import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Home from './components/home/Home.vue'
import Chapters from './components/chapters/Chapters.vue'
import Workshops from './components/workshops/Workshops.vue'
import LessonBasics01 from './lessons/Basics/01.vue'
import LessonBasics02 from './lessons/Basics/02.vue'
import LessonBasics03 from './lessons/Basics/03.vue'
import LessonBlog01 from './lessons/Blog/01.vue'
import LessonBlog02 from './lessons/Blog/02.vue'
import LessonBlog03 from './lessons/Blog/03.vue'
import LessonBlog04 from './lessons/Blog/04.vue'
import LessonBlog05 from './lessons/Blog/05.vue'
import LessonBlog06 from './lessons/Blog/06.vue'
import LessonBlog07 from './lessons/Blog/07.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Home },
  { path: '/workshops', component: Workshops },
  { path: '/chapters', component: Chapters },
  { path: '/basics/01', component: LessonBasics01 },
  { path: '/basics/02', component: LessonBasics02 },
  { path: '/basics/03', component: LessonBasics03 },
  { path: '/blog/01', component: LessonBlog01 },
  { path: '/blog/02', component: LessonBlog02 },
  { path: '/blog/03', component: LessonBlog03 },
  { path: '/blog/04', component: LessonBlog04 },
  { path: '/blog/05', component: LessonBlog05 },
  { path: '/blog/06', component: LessonBlog06 },
  { path: '/blog/07', component: LessonBlog07 },
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
