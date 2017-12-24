import axios from '../../plugins/axios'
// import * as types from '../mutation-types'

const state = {
}

const getters = {
}

const actions = {
  async updateUser({ commit }, data) {
    const res = await axios.get('/stock')
    console.log(res)
  }
}

const mutations = {
}

export default {
  state,
  getters,
  actions,
  mutations
}
