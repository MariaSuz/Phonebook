import { createRouter, createWebHistory } from 'vue-router';
import DepartmentsList from '@/pages/DepartmentList.vue';
import PhoneBookList from '@/pages/PhoneBookList.vue';
import Login from '@/pages/Login.vue';
import Settings from '@/pages/Settings.vue';
import { useAuthStore } from '@/store/authStore';
import AuditLog from '@/pages/AuditLog.vue';

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
  const store = useAuthStore();
  if (to.meta.requiresAuth && !store.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else if (to.name === 'login' && store.isAuthenticated) {
    next({ name: 'main' });
  } else {
    next();
  }
});

export default router;