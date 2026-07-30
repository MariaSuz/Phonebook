import { defineStore } from 'pinia';
import { api } from '@/api/api';
import { computed, ref } from 'vue';
import { useAlertStore } from './alertStore';
import { getErrorMessage, showError } from '@/logic/utils/errorUtils';
import type { UserFormModel } from '@/logic/types/forms/UserFormModel';


export const useUserStore = defineStore('user', () => {
  const users = ref<UserFormModel[]>([]);
  const loading = ref(false);
  const alertStore = useAlertStore();

  const list = computed(() => users.value);

  async function createUser(data: UserFormModel) {
    try {
      loading.value = true;
      const response = await api.post('/users', data);
      users.value.push(response.data);
      return response.data;
    } catch (error: any) {
      alertStore.error(getErrorMessage(error));
    } finally {
      loading.value = false;
    }
  }

  async function updateUser(id: number, data: UserFormModel) {
    loading.value = true;
    try {
      const response = await api.put(`/users/${id}`, data);
      const updatedUser = response.data;
      const index = users.value.findIndex((u) => u.id === id);
      if (index !== -1) {
        users.value[index] = updatedUser;
      }
      return updatedUser;
    } catch (error: any) {
      showError(error);
    } finally {
      loading.value = false;
    }
  }

  async function getUsers() {
    loading.value = true;
    try {
      const response = await api.get('/users');
      users.value = response.data;
    } catch (error: any) {
      users.value = [];
      alertStore.error(getErrorMessage(error));
    } finally {
      loading.value = false;
    }
  }

  async function deleteUser(id: number) {
    loading.value = true;
    try {
      await api.delete(`/users/${id}`);
      users.value = users.value.filter((u) => u.id !== id);
    } catch (error: any) {
      showError(error);
    } finally {
      loading.value = false;
    }
  }

  return {
    list,
    updateUser,
    getUsers,
    deleteUser,
    createUser,
  };
});
