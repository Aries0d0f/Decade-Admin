import request from '@/utils/request'

export const fetchOrderList = async(query) => {
  const res = await request({ url: `/order${query || ''}`, method: 'get' })
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
