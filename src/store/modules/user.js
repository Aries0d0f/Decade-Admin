import { loginByUsername, fetchUser } from '@/api/user'

const user = {
  state: {
    id: '',
    cid: '',
    role: '',
    state: '',
    username: ''
  },

  mutations: {
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_CID: (state, cid) => {
      state.cid = cid
    },
    SET_ROLE: (state, role) => {
      state.role = role
    },
    SET_STATE: (state, states) => {
      state.state = states
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    }
  },

  actions: {
    // 用户名登录
    async LoginByUsername({ commit }, userInfo) {
      try {
        const data = await loginByUsername(userInfo.username, userInfo.password)
        if (!data.success) {
          console.log(data.success)
          throw new Error(data.err.message)
        }
        console.log('object')
        commit('SET_ID', data.result.id)
        commit('SET_CID', data.result.cid)
        commit('SET_ROLE', data.result.role)
        commit('SET_STATE', data.result.state)
        commit('SET_USERNAME', data.result.username)
        localStorage.uid = data.result.id
      } catch (err) {
        throw err
      }
    },

    async checkAuth({ commit }) {
      if (!localStorage.uid) return false
      try {
        const res = await fetchUser(localStorage.uid)
        commit('SET_ID', res.id)
        commit('SET_CID', res.cid)
        commit('SET_ROLE', res.role)
        commit('SET_STATE', res.state)
        commit('SET_USERNAME', res.username)
        return true
      } catch (err) {
        console.log(err)
        return false
      }
    },

    // 登出
    LogOut({ commit, state }) {
      commit('SET_ID', '')
      commit('SET_CID', '')
      commit('SET_ROLE', '')
      commit('SET_STATE', '')
      commit('SET_USERNAME', '')
      delete localStorage.uid
    }
  }
}

export default user
