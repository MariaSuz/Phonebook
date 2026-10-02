import router from '@/router';
import { useAuthStore } from '@/store/authStore';
import { getToken } from '@/logic/utils/authStorage';
import axios from 'axios';

const API_BASE_URL = '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

//  интерцептор для добавления токена к каждому запросу
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//  интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/auth/login');

    if (error.response?.status === 401 && !isLoginRequest) {
      const authStore = useAuthStore();
      authStore.clearAuth();

      const current = router.currentRoute.value;
      if (current.name !== 'login') {
        router.push({ name: 'login', query: { redirect: current.fullPath } });
      }
    }
    return Promise.reject(error);
  },
);