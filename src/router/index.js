import Vue          from 'vue'
import Router       from 'vue-router'
import Home         from '@/view/Home.vue'
import Login        from '@/view/Login.vue'
import * as Post    from '@/view/Post'
import * as Stock   from '@/view/Stock'
import * as Coupon   from '@/view/Coupon'
import * as Order   from '@/view/Order'

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
        },
        {
          name: 'Coupon',
          path: '/coupon',
          component: Coupon.Index,
          children: [
            {
              name: 'CouponList',
              meta: { title: '優惠券列表' },
              path: '/',
              component: Coupon.List
            },
            {
              name: 'CreateCoupon',
              meta: { title: '新增優惠券' },
              path: 'new',
              component: Coupon.Coupon
            },
            {
              name: 'Coupon-ID',
              meta: { title: '編輯優惠券' },
              path: ':id',
              component: Coupon.Coupon
            }
          ]
        },
        {
          path: '/transaction',
          name: 'OrderList',
          component: Order.List
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
