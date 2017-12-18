import Vue          from 'vue'
import Router       from 'vue-router'
import Home         from '@/view/Home.vue'
import Login        from '@/view/Login.vue'
import * as Post    from '@/view/Post'
import * as Stock   from '@/view/Stock'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/posts',
          name: 'Post',
          component: Post.List
        },
        {
          path: '/posts/new',
          name: 'New Post',
          component: Post.New
        },
        {
          path: '/stock',
          name: 'Stock',
          component: Stock.List
        },
        {
          path: '/stock/new',
          name: 'Stock',
          component: Stock.New
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})

export default router
