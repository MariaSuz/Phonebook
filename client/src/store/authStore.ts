import { defineStore } from 'pinia';
import { api } from '@/api/api';
import type { AuthFormModel } from '../logic/types/forms/AuthFormModel';
import axios from 'axios';
import router from '@/router';


interface AuthResponse {
  user: AuthFormModel;
  token: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authUsers: [] as AuthFormModel[],
    loading: false,
    error: null as string | null,
    currentUser: null as AuthFormModel | null,
    token: localStorage.getItem('token') as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.currentUser?.roleId === 1,
    list: (state) => state.authUsers,
    authUser: (state) => state.currentUser,
  },

  actions: {
    clearAuth() {
      this.currentUser = null;
      this.token = null;
      localStorage.removeItem('token');
    },
    async login(credentials: { userName: string; password: string }) {
      try {
        this.loading = true;
        this.error = null;

        const response = await api.post<AuthResponse>(
          '/auth/login',
          credentials,
        );

        const { user: userData, token: authToken } = response.data;

        this.currentUser = userData;
        this.token = authToken;

        localStorage.setItem('token', authToken);

        return { success: true, data: response.data };
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Ошибка входа';
        this.error = errorMessage;
        this.clearAuth();
        throw new Error(errorMessage);
      } finally {
        this.loading = false;
      }
    },

    async register(data: AuthFormModel) {
      try {
        this.loading = true;
        this.error = null;
        const response = await api.post('/auth/register', data);
        return response.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Ошибка регистрации';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.clearAuth();
      router.push('/');
    },

    async updateAuthUser(id: number, data: AuthFormModel) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.put(`/auth/${id}`, data);
        const updatedUser = response.data;
        const index = this.authUsers.findIndex((u) => u.id === id);
        if (index !== -1) {
          this.authUsers[index] = updatedUser;
        }
        return updatedUser;
      } catch (error) {
        this.error = error.message;
        console.error('Ошибка обновления пользователя:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async getAuthUsers() {
      this.loading = true;
      this.error = null;
      try {
        this.authUsers = [];
        const response = await api.get('/auth/users');
        this.authUsers = response.data;
      } catch (error) {
        this.error = error.message;
        console.error('Ошибка загрузки пользователей:', error);
      } finally {
        this.loading = false;
      }
    },

    async deleteAuthUser(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await api.delete(`/auth/${id}`);
        this.authUsers = this.authUsers.filter((u) => u.id !== id);
      } catch (error) {
        this.error = error.message;
        console.error('Ошибка удаления пользователя:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
