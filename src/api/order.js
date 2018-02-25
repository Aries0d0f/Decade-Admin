import request from '@/utils/request'

export const fetchOrderList = async() => {
  const res = await request({ url: '/order?limit=9999', method: 'get' })
  return res.data
}

export const fetchOrder = async(id) => {
  const res = await request({ url: `/order/${id}`, method: 'get' })
  return res.data
}

export const updateOrder = async(id, data) => {
  const res = await request({ url: `/order/${id}`, method: 'patch', data })
  return res.data
}
