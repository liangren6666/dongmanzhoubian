import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '控制台' }
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/category/index.vue'),
        meta: { title: '分类管理', parent: '商品管理' }
      },
      {
        path: 'product',
        name: 'Product',
        component: () => import('@/views/product/index.vue'),
        meta: { title: '商品列表', parent: '商品管理' }
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/user/index.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: 'order',
        name: 'Order',
        component: () => import('@/views/order/index.vue'),
        meta: { title: '订单管理' }
      },
      {
        path: 'review',
        name: 'Review',
        component: () => import('@/views/review/index.vue'),
        meta: { title: '评价管理' }
      },
      {
        path: 'announcement',
        name: 'Announcement',
        component: () => import('@/views/announcement/index.vue'),
        meta: { title: '公告管理' }
      },
      {
        path: 'chat',
        name: 'Chat',
        component: () => import('@/views/chat/index.vue'),
        meta: { title: '客服管理' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('admin_token')
  if (!token && to.path !== '/login') {
    next('/login')
  } else {
    next()
  }
})

export default router
