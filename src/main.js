import Vue from 'vue'
import App from './App.vue'

import Utils from './utils'

Vue.config.productionTip = false
Vue.use(Utils)

new Vue({
  render: h => h(App),
}).$mount('#app')
