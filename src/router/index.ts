import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const base: Array<RouteRecordRaw> = [
  {
    path     : '/login',
    name     : 'login',
    component: import('@/views/login.vue')
  },
  {
    path     : '/',
    name     : '/',
    component: import('@/views/layout/layout.vue')
  }
]
export const routes: Array<RouteRecordRaw> = [
  {
    path     : '/project',
    name     : '项目管理',
    meta     : { single: true },
    component: import('@/views/layout/layout.vue'),
    children : [
      {
        path     : 'project',
        name     : 'project',
        component: import('@/views/project.vue')
      }
    ]
  }
]
const router = createRouter( {
  history: createWebHistory( process.env.BASE_URL ),
  routes : [ ...base, ...routes ]
} )

router.beforeEach( ( to, from, next ) => {
  const token = localStorage.getItem( 'token' )
  if ( !token && to.fullPath !== '/login' ) {
    next( { name: 'login' } )
  }
  else {
    next()
  }
} )

export default router
