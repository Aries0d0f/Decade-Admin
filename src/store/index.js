import Vue from 'vue'
import Vuex from 'vuex'

import * as actions from './actions'
import * as getters from './getters'
import mutations    from './mutation-types'
import Coupone      from './modules/coupon.js'
import Order        from './modules/order.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true,
  state: {
    user: {},
    allPost: []
  },
  modules: {
    Coupone,
    Order
  },
  mutations,
  actions,
  getters
})

export default store
