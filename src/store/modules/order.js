import axios from '../../plugins/axios'
import * as types from '../mutation-types'

const state = {
  order: '',
  orders: []
}

const getters = {
  allCoupon: state => state.orders,
  order: state => state.order
}

const actions = {
  async getAllOrder({ commit }) {
    try {
      const res = await axios.get('order')
      commit(types.GET_ALL_ORDERS, res.data)
    } catch (error) {
      return false
    }
  },
  async getOrder({ commit }, id) {
    const reload = id.reload ? 1 : 0
    if (state.order.id !== id || reload) {
      const res = await axios.get(`order/${id}`)
      commit(types.GET_ORDER, res.data)
    }
    return state.coupon
  }
}

const mutations = {
  [types.GET_ALL_ORDERS] (state, orders) {
    state.orders = orders
  },
  [types.GET_ORDER] (state, order) {
    state.order = order
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
