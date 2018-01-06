import request from '@/utils/request'

export const fetchUser = async(id) => {
  const res = await request({ url: `/user/${id}`, method: 'get' })
  return res.data
}
