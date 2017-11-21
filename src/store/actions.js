import * as types   from './mutation-types'

export const user = ({ commit },
  user) => commit(types.SET_USER, user)

export const allPost = ({ commit },
  allPost) => commit(types.ALL_POST, allPost)
