import { defineStore } from 'pinia';
import { api } from '@/api/api';
import type { AuthFormModel } from '../logic/types/forms/AuthFormModel';
import router from '@/router';
import { computed, ref } from 'vue';
import { useAlertStore } from './alertStore';
import { getErrorMessage, showError } from '@/logic/utils/errorUtils';


interface AuthResponse {
  user: AuthFormModel;
  token: string;
}

export const useAuthStore = defineStore('auth', () => {
  const authUsers = ref<AuthFormModel[]>([]);
  const loading = ref(false);
  const alertStore = useAlertStore();
  const currentUser = ref<AuthFormModel | null>(JSON.parse(
      localStorage.getItem('currentUser') || 'null',
    ));
  const token = ref<string | null>(localStorage.getItem('token'));

  const list = computed(() => authUsers.value);
  const isAuthenticated = computed(() => !!token.value);
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

      const response = await api.post<AuthResponse>('/login', credentials);
      const { user: userData, token: authToken } = response.data;

      currentUser.value = userData;
      token.value = authToken;

      localStorage.setItem('token', authToken);
      localStorage.setItem('currentUser', JSON.stringify(userData));

      return { success: true, data: response.data };
    } catch (error: any) {
      showError(error);
      clearAuth();
    } finally {
      loading.value = false;
    }
  }

  async function register(data: AuthFormModel) {
    try {
      loading.value = true;
      const response = await api.post('/register', data);
      return response.data;
    } catch (error: any) {
      alertStore.error(getErrorMessage(error));
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    clearAuth();
    router.push('/');
  }

  async function updateAuthUser(id: number, data: AuthFormModel) {
    loading.value = true;
    try {
      const response = await api.put(`/users/${id}`, data);
      const updatedUser = response.data;
      const index = authUsers.value.findIndex((u) => u.id === id);
      if (index !== -1) {
        authUsers.value[index] = updatedUser;
      }
      return updatedUser;
    } catch (error: any) {
      showError(error);
    } finally {
      loading.value = false;
    }
  }
  async function getAuthUsers() {
    loading.value = true;
    try {
      authUsers.value = [];
      const response = await api.get('/users');
      authUsers.value = response.data;
    } catch (error: any) {
      alertStore.error(getErrorMessage(error));
    } finally {
      loading.value = false;
    }
  }

  async function deleteAuthUser(id: number) {
    loading.value = true;
    try {
      await api.delete(`/users/${id}`);
      authUsers.value = authUsers.value.filter((u) => u.id !== id);
    } catch (error: any) {
      showError(error);
    } finally {
      loading.value = false;
    }
  }

  return {
    list,
    isAuthenticated,
    isAdmin,
    authUser,
    clearAuth,
    login,
    register,
    logout,
    updateAuthUser,
    getAuthUsers,
    deleteAuthUser,
  };
});
