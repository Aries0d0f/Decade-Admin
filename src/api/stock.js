import request from '@/utils/request'

export const fetchStockList = async() => {
  const res = await request({ url: '/stock?limit=9999', method: 'GET' })
  return res.data
}

export const fetchStockQuery = async(query) => {
  const res = await request({ url: `/stock?${query}`, method: 'get' })
  return res.data
}

export const fetchStock = async(id) => {
  const res = await request({ url: `/stock/${id}`, method: 'GET' })
  return res.data
}

export const createStock = async(data) => {
  const res = await request({ url: `/stock`, method: 'POST', data })
  return res.data
}

export const updateStock = async(id, data) => {
  const res = await request({ url: `/stock/${id}`, method: 'PATCH', data })
  return res.data
}

export const deleteStock = async(id) => {
  const res = await request({ url: `/stock/${id}`, method: 'DELETE' })
  return res.data
}
