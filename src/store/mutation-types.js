export const SET_USER = 'USER'

export const ALL_POST = 'ALL_POST'

export const GET_ALL_COUPONS = 'GET_ALL_COUPONS'
export const GET_COUPON = 'GET_COUPON'
export const CREATE_COUPONS = 'CREATE_COUPONS'
export const GET_COUPONS = 'GET_COUPONS'
export const UPDATE_COUPONS = 'UPDATE_COUPONS'
export const DESTORY_COUPONS = 'DESTORY_COUPONS'

export default {
  SET_USER: (state, user) => {
    state.user = user
  }
}
