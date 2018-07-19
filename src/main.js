import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Home from './components/Home.vue'
import Lesson01 from './components/lessons/01.vue'
import Lesson02 from './components/lessons/02.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Home },
  { path: '/01', component: Lesson01 },
  { path: '/02', component: Lesson02 }
]

const router = new VueRouter({ routes })

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
