import request from '@/utils/request'

export const fetchUData = async(id) => {
  const res = await request({ url: `/udata/${id}`, method: 'get' })
  return res.data
}

export const createUData = async(data) => {
  const res = await request({
    url: '/udata',
    method: 'POST',
    data
  })
  return res.data
}

export const patchUData = async(uid, data) => {
  const res = await request({
    url: `/udata/${uid}`,
    method: 'PATCH',
    data
  })
  return res.data
}
