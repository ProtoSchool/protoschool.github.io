import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Home from './components/Home.vue'
import Lesson01 from './lessons/Basics/01.vue'
import Lesson02 from './lessons/Basics/02.vue'
import LessonPw01 from './lessons/Pw/01.vue'
import LessonPw02 from './lessons/Pw/02.vue'
import LessonPw03 from './lessons/Pw/03.vue'
import LessonPw04 from './lessons/Pw/04.vue'
import LessonPw05 from './lessons/Pw/05.vue'
import LessonPw06 from './lessons/Pw/06.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Home },
  { path: '/01', component: Lesson01 },
  { path: '/02', component: Lesson02 },
  { path: '/11', component: LessonPw01 },
  { path: '/12', component: LessonPw02 },
  { path: '/13', component: LessonPw03 },
  { path: '/14', component: LessonPw04 },
  { path: '/15', component: LessonPw05 },
  { path: '/16', component: LessonPw06 }
]

const router = new VueRouter({ routes })

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
