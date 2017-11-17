import Vue from 'vue'
import Vuex from 'vuex'

import * as actions from './actions'
import * as getters from './getters'
import mutations    from './mutation-types'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true,
  state: {
    user: {}
  },
  mutations,
  actions,
  getters
})

export default store
