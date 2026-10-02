import { defineStore } from 'pinia';
import { api } from '@/api/api';
import router from '@/router';
import { computed, ref } from 'vue';
import { useAlertStore } from './alertStore';
import { getErrorMessage } from '@/logic/utils/errorUtils';
import { isTokenExpired } from '@/logic/utils/tokenUtils';
import {
  clearAuthStorage,
  getStoredUser,
  getToken,
  setStoredUser,
  setToken,
} from '@/logic/utils/authStorage';
import type { UserFormModel } from '@/logic/types/forms/UserFormModel';
import { ROLE_ADMIN } from '@/logic/constants/roles';


interface AuthResponse {
  id: number;
  userName: string;
  roleId: number;
  token: string;
}

export const useAuthStore = defineStore('auth', () => {
  const loading = ref(false);
  const currentUser = ref<UserFormModel | null>(getStoredUser());
  const token = ref<string | null>(getToken());

  const isAuthenticated = computed(() => {
    if (!token.value) return false;
    return !isTokenExpired(token.value);
  });
  const isAdmin = computed(() => currentUser.value?.roleId === ROLE_ADMIN);
  const authUser = computed(() => currentUser.value);

  function clearAuth() {
    currentUser.value = null;
    token.value = null;
    clearAuthStorage();
  }

  async function login(credentials: { userName: string; password: string }) {
    try {
      loading.value = true;

      const response = await api.post<AuthResponse>('/auth/login', credentials);
      const { id, userName, roleId, token: authToken } = response.data;

      const userData: UserFormModel = { id, userName, roleId };
      currentUser.value = userData;
      token.value = authToken;

      setToken(authToken);
      setStoredUser(userData);

      return { success: true, data: response.data };
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      const alertStore = useAlertStore();
      alertStore.error(errorMessage);
      clearAuth();
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    clearAuth();
    router.push('/');
  }

  function checkToken(): boolean {
    if (token.value && isTokenExpired(token.value)) {
      clearAuth();
      return false;
    }
    return !!token.value;
  }

  // другая вкладка вышла или вошла
  window.addEventListener('storage', (e) => {
    if (e.key === 'token' || e.key === null) {
      token.value = getToken();
      currentUser.value = getStoredUser();
    }
  });

  // автоматический выход по истечении срока токена
  setInterval(() => {
    if (token.value && isTokenExpired(token.value)) {
      clearAuth();
      router.push({ name: 'login' });
    }
  }, 60_000);

  return {
    isAuthenticated,
    isAdmin,
    authUser,
    clearAuth,
    login,
    logout,
    checkToken,
  };
});
