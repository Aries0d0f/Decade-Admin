import axios from '../../plugins/axios'
import * as types from '../mutation-types'

const state = {
  coupon: '',
  coupons: []
}

const getters = {
  allCoupon: state => state.coupons,
  coupon: state => state.coupon
}

const actions = {
  async getAllCoupon({ commit }) {
    try {
      const res = await axios.get('coupon')
      commit(types.GET_ALL_COUPONS, res.data)
    } catch (error) {
      return false
    }
  },
  async createCoupon({ commit }, data) {
    try {
      const res = await axios.post('coupon', data)
      return res
    } catch (e) {
      throw e
    }
  },
  async updateCoupon({ commit }, data) {
    try {
      await axios.put(`coupon/${data.id}`, data)
      return true
    } catch (e) {
      throw e
    }
  },
  async getCoupon({ commit }, cid) {
    const reload = cid.reload ? 1 : 0
    if (state.coupon.id !== cid || reload) {
      const res = await axios.get(`coupon/${cid}`)
      commit(types.GET_COUPON, res.data)
    }
    return state.coupon
  },
  async destroyCoupon({ commit }, cid) {
    try {
      await axios.delete(`coupon/${cid}`)
      return true
    } catch (e) {
      return false
    }
  }
}

const mutations = {
  [types.GET_ALL_COUPONS] (state, coupons) {
    state.coupons = coupons
  },
  [types.GET_COUPON] (state, coupon) {
    state.coupon = coupon
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
