import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false })// NProgress Configuration

// permissiom judge function
// function hasPermission(roles, permissionRoles) {
//   if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
//   if (!permissionRoles) return true
//   return roles.some(role => permissionRoles.indexOf(role) >= 0)
// }

const whiteList = ['/login', '/authredirect']// no redirect whitelist

router.beforeEach(async(to, from, next) => {
  console.log(to.path)
  NProgress.start()
  next()
  if (getToken()) {
    if (to.name === 'login') {
      next({ name: 'dashboard' })
      NProgress.done()
    } else {
      const status = await store.dispatch('checkAuth')
      if (status) {
        const role = store.getters.userInfo.role
        await store.dispatch('GenerateRoutes', role)
        router.addRoutes(store.getters.addRouters)
        next({ ...to, replace: true })
      } else {
        await store.dispatch('LogOut')
        Message.error('錯誤：驗證失敗，請重新登入！')
        next({ path: '/login' })
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
