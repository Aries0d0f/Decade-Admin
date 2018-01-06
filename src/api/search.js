import request from '@/utils/request'

export const querySearch = async(text) => {
  const res = await request({ url: `/search/${text}`, method: 'get' })
  return res.data
}
