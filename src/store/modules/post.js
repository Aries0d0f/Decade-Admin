import request from '@/utils/request'

const app = {
  state: {
    class: {}
  },
  getters: {
    PostClass: state => state.class
  },
  mutations: {
    SET_POST_CLASS: (state, data) => {
      state.class = data
    }
  },
  actions: {
    async setPostClass({ commit }) {
      const res = await request.get('/ad')
      const classList = res.data.data.post.main.map(item => {
        return {
          name: item.name,
          title: item.title,
          type: item.type,
          children: item.children.map(subItem => {
            return {
              name: subItem.name,
              title: subItem.title,
              type: subItem.type
            }
          })
        }
      })
      commit('SET_POST_CLASS', classList)
    }
  }
}

export default app
