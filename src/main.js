// Global styles. Opt-in single-purpose atoms only, no hairy css "frameworks".
import 'tachyons'
import 'ipfs-css'
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'
import VueTooltip from 'v-tooltip'
import VueHighlightJS from 'vue-highlight.js'
import VueSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import 'highlight.js/styles/github.css'

import App from './App.vue'
import router from './router'

Vue
  .use(VueRouter)
  .use(VueMeta, { keyName: 'head', refreshOnceOnNavigation: true })
  .use(VueHighlightJS)
  .use(VueTooltip)

Vue.component('v-select', VueSelect)

Vue.config.productionTip = false
Vue.config.errorHandler = (error, vm, info) => {
  console.error(error)
  console.info(vm)
  console.info(info)
}

const root = new Vue({
  router,
  mounted: function () {
    // support redirects from old hash routes
    if (window.location.hash.startsWith('#/')) {
      this.$router.replace({ path: window.location.hash.replace('#', '') })
    }
  },
  render: h => h(App)
})

document.addEventListener('DOMContentLoaded', function () {
  root.$mount('#app')
})
