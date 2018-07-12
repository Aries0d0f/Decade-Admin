import request from '@/utils/request'

export const fetchSupportList = async(query) => {
  const res = await request({ url: 'support', method: 'get' })
  return res.data
}
