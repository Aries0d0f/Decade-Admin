import md5 from 'blueimp-md5'
import request from '@/utils/request'

export const fetchUser = async(id) => {
  const res = await request({ url: `/user/${id}`, method: 'get' })
  return res.data
}

export const fetchUserQuery = async(query) => {
  const res = await request({ url: `/user?${query}`, method: 'get' })
  return res.data
}

export const loginByUsername = async(username, pwd) => {
  const res = await request({
    url: '/user/login',
    method: 'POST',
    data: { username: username, pwd: md5(pwd) }
  })
  return res.data
}

export const patchUser = async(uid, data) => {
  const res = await request({
    url: `/user/${uid}`,
    method: 'PATCH',
    data
  })
  return res.data
}

export const createUserData = async(data) => {
  const res = await request({
    url: '/udata',
    method: 'POST',
    data
  })
  return res.data
}

export const patchUserData = async(uid, data) => {
  const res = await request({
    url: `/udata/${uid}`,
    method: 'PATCH',
    data
  })
  return res.data
}
