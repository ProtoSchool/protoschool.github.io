// Global styles. Opt-in single-purpose atoms only, no hairy css "frameworks".
import 'tachyons'
import 'ipfs-css'

import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Home from './components/home/Home.vue'
import Lesson01 from './lessons/Basics/01.vue'
import Lesson02 from './lessons/Basics/02.vue'
import Lesson03 from './lessons/Basics/03.vue'
import LessonPw01 from './lessons/Pw/01.vue'
import LessonPw02 from './lessons/Pw/02.vue'
import LessonPw03 from './lessons/Pw/03.vue'
import LessonPw04 from './lessons/Pw/04.vue'
import LessonPw05 from './lessons/Pw/05.vue'
import LessonPw06 from './lessons/Pw/06.vue'
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
  { path: '/basics/01', component: Lesson01 },
  { path: '/basics/02', component: Lesson02 },
  { path: '/basics/03', component: Lesson03 },
  { path: '/Pweb/01', component: LessonPw01 },
  { path: '/Pweb/02', component: LessonPw02 },
  { path: '/Pweb/03', component: LessonPw03 },
  { path: '/Pweb/04', component: LessonPw04 },
  { path: '/Pweb/05', component: LessonPw05 },
  { path: '/Pweb/06', component: LessonPw06 },
  { path: '/Blog/01', component: LessonBlog01 },
  { path: '/Blog/02', component: LessonBlog02 },
  { path: '/Blog/03', component: LessonBlog03 },
  { path: '/Blog/04', component: LessonBlog04 },
  { path: '/Blog/05', component: LessonBlog05 },
  { path: '/Blog/06', component: LessonBlog06 },
  { path: '/Blog/07', component: LessonBlog07 }
]

const router = new VueRouter({ routes })

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
