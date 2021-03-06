import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteRecordRaw,
} from 'vue-router';

const base: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue'),
  },
  {
    path: '/',
    name: '/',
    component: () => import('@/views/layout/layout.vue'),
  },
];
export const routes: Array<RouteRecordRaw> = [
  {
    path: '/project',
    name: '项目管理',
    component: () => import('@/views/layout/layout.vue'),
    children: [
      {
        path: 'project',
        name: 'project',
        component: () => import('@/views/project.vue'),
      },
    ],
  },
  {
    path: '/wordMng',
    name: '词库管理',
    component: () => import('@/views/layout/layout.vue'),
    children: [
      {
        path: 'wordMng',
        name: 'wordMng',
        component: () => import('@/views/wordMng.vue'),
      },
    ],
  },
  {
    path: '/msg',
    name: '内容管理',
    component: () => import('@/views/layout/layout.vue'),
    children: [
      {
        path: 'msg',
        name: 'msg',
        component: () => import('@/views/msg.vue'),
      },
    ],
  },
];
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: base.concat(routes),
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('jwt');
  if (!token && to.fullPath !== '/login') {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
