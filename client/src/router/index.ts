import { createRouter, createWebHistory } from 'vue-router';
import DepartmentsList from '@/pages/DepartmentList.vue';
import PhoneBookList from '@/pages/PhoneBookList.vue';
import Login from '@/pages/Login.vue';
import Settings from '@/pages/Settings.vue';
import { useAuthStore } from '@/store/authStore';

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
  ],
});


router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((auth) => auth.meta.requiresAuth);
  const storeAuth = useAuthStore();

  if (requiresAuth && !storeAuth.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;