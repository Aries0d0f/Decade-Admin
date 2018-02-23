import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通過 meta.role 判斷是否與當前用戶權限匹配
 * role: 0 - 內部管理員
 * role: 3 - 簽約廠商
 * role: 4 - 簽約編輯
 * @param userRole - 當前用戶權限
 * @param route - 當前路由權限
 */
function hasPermission(userRole, route) {
  if (!route.meta || !route.meta.auth && route.meta.auth !== 0) {
    return true
  }
  const { auth: routeRole } = route.meta
  switch (userRole) {
    case 0:
      return true
    case 3:
    case 4:
      return userRole === routeRole
    default:
      return false
  }
}

/**
 * 遞歸過濾異步路由表，返回符合用戶角色權限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    async GenerateRoutes({ commit }, role) {
      return new Promise(resolve => {
        let accessedRouters
        if (role === 0) {
          accessedRouters = asyncRouterMap
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, role)
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
