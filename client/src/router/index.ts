import { createRouter, createWebHistory } from 'vue-router';
import Documents from '@/pages/Documents.vue';
import TechSites from '@/pages/TechSites.vue';
import PhoneBookList from '@/pages/PhoneBookList.vue';
import Login from '@/pages/Login.vue';
import Settings from '@/pages/Settings.vue';
import AuditLog from '@/pages/AuditLog.vue';
import { isTokenExpired } from '@/logic/utils/tokenUtils';
import { getStoredUser, getToken } from '@/logic/utils/authStorage';
import { ROLE_ADMIN } from '@/logic/constants/roles';

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
      path: '/documents',
      name: 'documents',
      component: Documents,
      meta: { requiresAuth: false },
    },
    {
      path: '/tech-sites',
      name: 'techSites',
      component: TechSites,
      meta: { requiresAuth: false, requiresAdmin: true },
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
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/audit',
      name: 'audit',
      component: AuditLog,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
  ],
});


router.beforeEach((to) => {
  const token = getToken();
  const isValid = !!token && !isTokenExpired(token);

  if (to.meta.requiresAuth && !isValid) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }
  if (to.meta.requiresAdmin && getStoredUser()?.roleId !== ROLE_ADMIN) {
    return { name: 'main' };
  }
  if (to.name === 'login' && isValid) {
    return { name: 'main' };
  }
});

export default router;