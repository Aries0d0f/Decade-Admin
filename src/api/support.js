import request from '@/utils/request'

export const fetchSupportList = async(query) => {
  const res = await request({ url: 'support', method: 'get' })
  return res.data
}

export const ReplySupport = async(sid, uid, msg) => {
  const res = await request({ url: `/support/${sid}/reply`, method: 'put', data: { msg, uid }})
  return res.data
}
