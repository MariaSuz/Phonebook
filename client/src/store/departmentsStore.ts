import { defineStore } from 'pinia';
import type { DepartmentFormModel } from '../logic/types/forms/DepartmentFormModel';
import { api } from '../api/api';
import { computed, ref } from 'vue';
import { useAlertStore } from './alertStore';
import { getErrorMessage, showError } from '@/logic/utils/errorUtils';

export const useDepartmentStore = defineStore('departments', () => {
  const departments = ref<DepartmentFormModel[]>([]);
  const loading = ref(false);
  const alertStore = useAlertStore();

  async function getDepartments() {
    loading.value = true;
    try {
      const response = await api.get('/departments');
      departments.value = response.data;
    } catch (error: any) {
      alertStore.error(getErrorMessage(error));
    } finally {
      loading.value = false;
    }
  }
  async function createDepartment(data: DepartmentFormModel) {
    loading.value = true;
    try {
      const response = await api.post('/departments', data);
      const newDept = response.data;
      departments.value.push(newDept);
      return newDept;
    } catch (error: any) {
      showError(error);
    } finally {
      loading.value = false;
    }
  }

  async function updateDepartment(id: number, data: DepartmentFormModel) {
    loading.value = true;
    try {
      const response = await api.put(`/departments/${id}`, data);
      const updatedDept = response.data;
      const index = departments.value.findIndex((d) => d.id === id);
      if (index !== -1) {
        departments.value[index] = updatedDept;
      }
      return updatedDept;
    } catch (error: any) {
      showError(error);
    } finally {
      loading.value = false;
    }
  }

  async function deleteDepartment(id: number) {
    loading.value = true;
    try {
      await api.delete(`/departments/${id}`);
      departments.value = departments.value.filter((d) => d.id !== id);
    } catch (error: any) {
      showError(error);
    } finally {
      loading.value = false;
    }
  }

  const list = computed(() => departments.value);
  return {
    list,
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  };
});
