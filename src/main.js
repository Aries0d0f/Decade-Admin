import Vue from 'vue'

import 'normalize.css/normalize.css'

import Element from 'element-ui'
import locale from 'element-ui/lib/locale/lang/zh-TW'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss'

import App from './App'
import router from './router'
import './permission'
import store from './store'

import './icons'

import * as filters from './filters'

Vue.use(Element, {
  size: 'medium',
  locale
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
