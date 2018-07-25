import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Home from './components/home/Home.vue'
import Lesson01 from './lessons/Basics/01.vue'
import Lesson02 from './lessons/Basics/02.vue'
import LessonPw01 from './lessons/Pw/01.vue'
import LessonPw02 from './lessons/Pw/02.vue'
import LessonPw03 from './lessons/Pw/03.vue'
import LessonPw04 from './lessons/Pw/04.vue'
import LessonPw05 from './lessons/Pw/05.vue'
import LessonPw06 from './lessons/Pw/06.vue'

// Global styles. Opt-in single-purpose atoms only, no hairy css "frameworks".
import 'tachyons'
import 'ipfs-css'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Home },
  { path: '/basics/01', component: Lesson01 },
  { path: '/basics/02', component: Lesson02 },
  { path: '/Pweb/01', component: LessonPw01 },
  { path: '/Pweb/02', component: LessonPw02 },
  { path: '/Pweb/03', component: LessonPw03 },
  { path: '/Pweb/04', component: LessonPw04 },
  { path: '/Pweb/05', component: LessonPw05 },
  { path: '/Pweb/06', component: LessonPw06 }
]

const router = new VueRouter({ routes })

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
