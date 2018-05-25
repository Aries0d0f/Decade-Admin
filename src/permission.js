import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/authredirect']// no redirect whitelist

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  await Promise.all([store.dispatch('setStockClass'), store.dispatch('setPostClass')])
  next()
  if (getToken()) {
    if (to.name === 'login') {
      next({ name: 'dashboard' })
      NProgress.done()
    } else if (store.getters.userInfo.role === '') {
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
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
