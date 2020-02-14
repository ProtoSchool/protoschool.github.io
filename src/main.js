// Global styles. Opt-in single-purpose atoms only, no hairy css "frameworks".
import 'tachyons'
import 'ipfs-css'
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueTooltip from 'v-tooltip'
import VueHighlightJS from 'vue-highlight.js'

import App from './App.vue'
import router from './router'

Vue
  .use(VueRouter)
  .use(VueHighlightJS)
  .use(VueTooltip)

Vue.config.productionTip = false
Vue.config.errorHandler = (error, vm, info) => {
  console.error(error)
  console.info(vm)
  console.info(info)
}

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
