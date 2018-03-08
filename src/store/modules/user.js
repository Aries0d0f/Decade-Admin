import { loginByUsername, fetchUser, createUserData, patchUser } from '@/api/user'
import { fetchUData } from '@/api/udata'
import { setToken, removeToken } from '@/utils/auth'
const user = {
  state: {
    id: '',
    cid: '',
    role: '',
    state: '',
    username: '',
    udata: {}
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
    },
    SET_UDATA: (state, udata) => {
      state.udata = udata
    }
  },

  actions: {
    async LoginByUsername({ commit }, userInfo) {
      try {
        const data = await loginByUsername(userInfo.username, userInfo.password)
        if (!data.success) {
          throw new Error(data.err.message)
        } else if (data.result.role === 999) {
          throw new Error('錯誤: 會員權限不足')
        }
        setToken(data.result.id)
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
        if (res.role === 999) {
          throw new Error('錯誤: 會員權限不足')
        }
        // 檢查是否存在 udata ，如否則新增
        if (!res.cid) {
          const udata = await createUserData({ name: res.username, region: 0 })
          await patchUser(res.id, { cid: udata.id })
          res.cid = udata.id
        }
        const uData = await fetchUData(res.cid)
        commit('SET_ID', res.id)
        commit('SET_CID', res.cid)
        commit('SET_ROLE', res.role)
        commit('SET_STATE', res.state)
        commit('SET_USERNAME', res.username)
        commit('SET_UDATA', uData)
        return true
      } catch (err) {
        console.log(err)
        return false
      }
    },

    LogOut({ commit, state }) {
      commit('SET_ID', '')
      commit('SET_CID', '')
      commit('SET_ROLE', '')
      commit('SET_STATE', '')
      commit('SET_USERNAME', '')
      delete localStorage.uid
      removeToken()
    },

    createUserData() {
    }
  }
}

export default user
