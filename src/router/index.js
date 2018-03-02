import Vue from 'vue'
import Router from 'vue-router'

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
    // hidden: true,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: '首頁', icon: 'dashboard', noCache: true, auth: false }
    }]
  },
  {
    path: '/user/me',
    component: Layout,
    children: [{
      path: '',
      component: _import('user/me'),
      name: 'UserInfo-Me',
      meta: { title: '個人資料', icon: 'people', noCache: true }
    }]
  }
]
const router = new Router({
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export default router

export const asyncRouterMap = [
  {
    path: '/post',
    component: Layout,
    redirect: '/post/post-list',
    name: 'post',
    meta: {
      title: '文章管理',
      icon: 'form',
      auth: 4,
      noCache: true
    },
    children: [
      {
        path: 'post-list',
        component: _import('post/list'),
        name: 'postList',
        meta: {
          title: '文章列表',
          noCache: true
        }
      },
      {
        path: 'post-create',
        component: _import('post/create'),
        name: 'postCreate',
        meta: {
          title: '新增文章',
          noCache: true
        }
      },
      {
        path: ':id',
        component: _import('post/edit'),
        hidden: true,
        name: 'postEdit',
        meta: {
          title: '文章編輯',
          noCache: true
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
      icon: 'shoppingCard',
      auth: 0,
      noCache: true
    },
    children: [
      {
        path: 'stock-list',
        component: _import('stock/list'),
        name: 'StockList',
        meta: {
          title: '商品列表',
          noCache: true
        }
      },
      {
        path: 'stock-create',
        component: _import('stock/create'),
        name: 'StockCreate',
        meta: {
          title: '新增商品',
          noCache: true
        }
      },
      {
        path: ':id',
        component: _import('stock/edit'),
        hidden: true,
        name: 'StockEdit',
        meta: {
          title: '商品編輯',
          noCache: true
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
      auth: 0,
      icon: 'example'
    },
    children: [
      {
        path: 'coupon-list',
        component: _import('coupon/list'),
        name: 'CouponList',
        meta: {
          title: '優惠券列表',
          noCache: true
        }
      },
      {
        path: 'coupon-create',
        component: _import('coupon/create'),
        name: 'CouponCreate',
        meta: {
          title: '新增優惠券',
          noCache: true
        }
      },
      {
        path: ':id',
        component: _import('coupon/edit'),
        hidden: true,
        name: 'CouponEdit',
        meta: {
          title: '優惠券編輯',
          noCache: true
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
      auth: 3,
      title: '訂單管理',
      icon: 'tab',
      noCache: true
    },
    children: [
      {
        path: 'order-list',
        component: _import('order/list'),
        name: 'orderList',
        meta: {
          title: '訂單列表',
          noCache: true
        }
      },
      {
        path: ':id',
        component: _import('order/item'),
        name: 'orderItem',
        hidden: true,
        meta: {
          title: '訂單詳情',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/user-list',
    name: 'user',
    meta: {
      auth: 0,
      title: '會員管理',
      icon: 'lock',
      noCache: true
    },
    children: [
      {
        path: 'user-list',
        component: _import('user/list'),
        name: 'userList',
        meta: {
          title: '會員列表',
          noCache: true
        }
      },
      {
        path: 'vendor-list',
        component: _import('user/vendor'),
        name: 'vendorList',
        meta: {
          title: '廠商管理',
          noCache: true
        }
      },
      {
        path: ':id',
        component: _import('user/edit'),
        name: 'userItem',
        hidden: true,
        meta: {
          title: '會員編輯',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/advert',
    component: Layout,
    redirect: '/advert/advert-list',
    name: 'advert',
    meta: {
      auth: 0,
      title: '廣告管理',
      icon: 'star',
      noCache: true
    },
    children: [
      {
        path: 'advert-list',
        component: _import('advert/index'),
        name: 'advertList',
        meta: {
          auth: 0,
          title: '廣告列表',
          icon: 'star',
          noCache: true
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true, meta: { auth: false }}
]
