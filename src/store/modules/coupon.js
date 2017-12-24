import axios from 'axios'
import * as types from '../mutation-types'

// initial state
// shape: [{ id, quantity }]
const state = {
  coupons: []
}

// getters
const getters = {
  allCoupon: state => state.coupons
}

// actions
const actions = {
  async getAllCoupon({ commit }) {
    try {
      const res = await axios.get('http://60.249.179.125:1337/coupon')
      commit(types.GET_ALL_COUPONS, res.data.data)
    } catch (error) {
      return false
    }
  },
  async getCoupon({ commit }, _id) {
    const res = await axios.get(`http://60.249.179.125:1337/coupon/${_id}`)
    return res.data.coupon
  },
  async destroyCoupon({ commit }, _id) {
    try {
      await axios.delete(`http://60.249.179.125:1333/coupon/${_id}`)
      return true
    } catch (e) {
      return false
    }
  }
}

const mutations = {
  [types.GET_ALL_COUPONS] (state, coupons) {
    state.coupons = coupons
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
