import request from '@/utils/request'

export const fetchPostList = async(query = '') => {
  const res = await request({ url: `/post/${query}`, method: 'GET' })
  return res.data
}

export const fetchPost = async(id) => {
  const res = await request({ url: `/post/${id}`, method: 'GET' })
  return res.data
}

export const createPost = async(data) => {
  const res = await request({ url: `/post`, method: 'POST', data })
  return res.data
}

export const updatePost = async(id, data) => {
  const res = await request({ url: `/post/${id}`, method: 'patch', data })
  return res.data
}

export const deletePost = async(id) => {
  const res = await request({ url: `/post/${id}`, method: 'DELETE' })
  return res.data
}
