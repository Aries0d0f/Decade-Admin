import Vue from 'vue'
import Router from 'vue-router'
import { fetchUser } from '@/api/user'

const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router)

import Layout from '../views/layout/Layout'

export const constantRouterMap = [
  { path: '/login', name: 'login', component: _import('login/index'), hidden: true, meta: { auth: false }},
  { path: '/404', component: _import('errorPage/404'), hidden: true, meta: { auth: false }},
  { path: '/401', component: _import('errorPage/401'), hidden: true, meta: { auth: false }},
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: '首頁', icon: 'dashboard', noCache: true }
    }]
  },
  {
    path: '/post',
    component: Layout,
    redirect: '/post/post-list',
    name: 'post',
    meta: {
      title: '文章管理',
      icon: 'form'
    },
    children: [
      {
        path: 'post-list',
        component: _import('post/list'),
        name: 'postList',
        meta: {
          title: '文章列表'
        }
      },
      {
        path: 'post-create',
        component: _import('post/create'),
        name: 'postCreate',
        meta: {
          title: '新增文章'
        }
      },
      {
        path: ':id',
        component: _import('post/edit'),
        hidden: true,
        name: 'postEdit',
        meta: {
          title: '文章編輯'
        }
      }
    ]
  },
  {
    path: '/stock',
    component: Layout,
    redirect: '/stock/stock-list',
    name: 'stock',
    meta: {
      title: '商品管理',
      icon: 'example'
    },
    children: [
      {
        path: 'stock-list',
        component: _import('stock/list'),
        name: 'StockList',
        meta: {
          title: '商品列表'
        }
      },
      {
        path: 'stock-create',
        component: _import('stock/create'),
        name: 'StockCreate',
        meta: {
          title: '新增商品'
        }
      },
      {
        path: ':id',
        component: _import('stock/edit'),
        hidden: true,
        name: 'StockEdit',
        meta: {
          title: '商品編輯'
        }
      }
    ]
  },
  {
    path: '/coupone',
    component: Layout,
    redirect: '/coupon/coupone-list',
    name: 'Coupon',
    meta: {
      title: '優惠券',
      icon: 'example'
    },
    children: [
      {
        path: 'coupon-list',
        component: _import('coupon/list'),
        name: 'CouponList',
        meta: {
          title: '優惠券列表'
        }
      },
      {
        path: 'coupon-create',
        component: _import('coupon/create'),
        name: 'CouponCreate',
        meta: {
          title: '新增優惠券'
        }
      },
      {
        path: ':id',
        component: _import('coupon/edit'),
        hidden: true,
        name: 'CouponEdit',
        meta: {
          title: '優惠券編輯'
        }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/order-list',
    name: 'order',
    meta: {
      title: '訂單管理',
      icon: 'tab'
    },
    children: [
      {
        path: 'order-list',
        component: _import('order/list'),
        name: 'orderList',
        meta: {
          title: '訂單列表'
        }
      },
      {
        path: ':id',
        component: _import('order/item'),
        name: 'orderItem',
        hidden: true,
        meta: {
          title: '訂單詳情'
        }
      }
    ]
  }
]
const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

// router.beforeEach(async(to, from, next) => {
//   if (to.meta.auth || to.meta.auth !== false) {
//     if (!localStorage.uid) {
//       console.log('unauth!')
//       next({ name: 'login' })
//     }
//     try {
//       await fetchUser(localStorage.uid)
//     } catch (err) {
//       console.log('unauth!')
//       next({ name: 'login' })
//     }
//   }
//   next()
// })

export default router

export const asyncRouterMap = [
  { path: '*', redirect: '/404', hidden: true, meta: { auth: false }}
]
