import request from '@/utils/request'

export const fetchStock = async(id) => {
  const res = await request({ url: `/stock/${id}`, method: 'get' })
  return res.data
}
