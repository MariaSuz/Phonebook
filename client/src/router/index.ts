import { createRouter, createWebHistory } from 'vue-router';
import DepartmentsList from '@/pages/DepartmentList.vue';
import PhoneBookList from '@/pages/PhoneBookList.vue';
import Login from '@/pages/Login.vue';
import Settings from '@/pages/Settings.vue';
import AuditLog from '@/pages/AuditLog.vue';
import { isTokenExpired } from '@/logic/utils/tokenUtils';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'main',
      component: PhoneBookList,
      meta: { requiresAuth: false },
    },
    {
      path: '/departments/:departmentId',
      name: 'departments',
      component: DepartmentsList,
      props: true,
      meta: { requiresAuth: false },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiresAuth: false },
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
      meta: { requiresAuth: true },
    },
    {
      path: '/audit',
      name: 'audit',
      component: AuditLog,
      meta: { requiresAuth: true },
    },
  ],
});


router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const isValid = token && !isTokenExpired(token);
  if (to.meta.requiresAuth && !isValid) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else if (to.name === 'login' && isValid) {
    next({ name: 'main' });
  } else {
    next();
  }
});

export default router;