import request from '@/utils/request'

export const fetchCouponList = async() => {
  const res = await request({ url: '/coupon', method: 'GET' })
  return res.data
}

export const fetchCoupon = async(id) => {
  const res = await request({ url: `/coupon/${id}`, method: 'GET' })
  return res.data
}

export const createCoupon = async(data) => {
  const res = await request({ url: `/coupon`, method: 'POST', data })
  return res.data
}

export const updateCoupon = async(id, data) => {
  const res = await request({ url: `/coupon/${id}`, method: 'PATCH', data })
  return res.data
}

export const deleteCoupon = async(id) => {
  const res = await request({ url: `/coupon/${id}`, method: 'DELETE' })
  return res.data
}
