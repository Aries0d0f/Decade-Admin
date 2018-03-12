import request from '@/utils/request'

const app = {
  state: {
    class: {}
  },
  getters: {
    StockClass: state => state.class
  },
  mutations: {
    SET_STOCK_CLASS: (state, data) => {
      state.class = data
    }
  },
  actions: {
    async setStockClass({ commit }) {
      const res = await request.get('/ad')
      const classList = res.data.data.stock.main.map(item => {
        return {
          name: item.name,
          title: item.title,
          type: item.type,
          children: item.children.map(subItem => {
            return {
              name: subItem.name,
              title: subItem.title,
              type: subItem.type,
              children: subItem.children.map(subItem3 => {
                return {
                  name: subItem3.name,
                  title: subItem3.title,
                  type: subItem3.type
                }
              })
            }
          })
        }
      })
      commit('SET_STOCK_CLASS', classList)
    }
  }
}

export default app
