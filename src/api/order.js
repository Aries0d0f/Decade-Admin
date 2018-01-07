import request from '@/utils/request'

export const fetchOrderList = async() => {
  const res = await request({ url: '/order', method: 'get' })
  return res.data
}

export const fetchOrder = async(id) => {
  const res = await request({ url: `/order/${id}`, method: 'get' })
  return res.data
}