import Vue          from 'vue'
import Router       from 'vue-router'
import Home         from '@/view/Home.vue'
import Login        from '@/view/Login.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})

export default router
