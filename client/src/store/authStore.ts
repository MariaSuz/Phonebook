import { defineStore } from 'pinia';
import { api } from '@/api/api';
import router from '@/router';
import { computed, ref } from 'vue';
import { useAlertStore } from './alertStore';
import { getErrorMessage } from '@/logic/utils/errorUtils';
import { isTokenExpired } from '@/logic/utils/tokenUtils';
import type { UserFormModel } from '@/logic/types/forms/UserFormModel';


interface AuthResponse {
  id: number;
  userName: string;
  roleId: number;
  token: string;
}

function getStoredUser(): UserFormModel | null {
  try {
    const stored = localStorage.getItem('currentUser');
    if (!stored || stored === 'undefined' || stored === 'null') return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export const useAuthStore = defineStore('auth', () => {
  const loading = ref(false);
  const currentUser = ref<UserFormModel | null>(getStoredUser());
  const token = ref<string | null>(localStorage.getItem('token'));

  const isAuthenticated = computed(() => {
    if (!token.value) return false;
    return !isTokenExpired(token.value);
  });
  const isAdmin = computed(() => currentUser.value?.roleId === 1);
  const authUser = computed(() => currentUser.value);

  function clearAuth() {
    currentUser.value = null;
    token.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }

  async function login(credentials: { userName: string; password: string }) {
    try {
      loading.value = true;

      const response = await api.post<AuthResponse>('/auth/login', credentials);
      const { id, userName, roleId, token: authToken } = response.data;

      const userData: UserFormModel = { id, userName, roleId };
      currentUser.value = userData;
      token.value = authToken;

      localStorage.setItem('token', authToken);
      localStorage.setItem('currentUser', JSON.stringify(userData));

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

  function checkToken():boolean {
    if(token && isTokenExpired(token.value)) {
      clearAuth();
      return false;
    }
    return !!token.value;
  }


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
