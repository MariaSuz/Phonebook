import { defineStore } from 'pinia';
import type { DepartmentFormModel } from '../logic/types/forms/DepartmentFormModel';
import { api } from '../api/api';
import { computed, ref } from 'vue';
import { useAlertStore } from './alertStore';
import { getErrorMessage, showError } from '@/logic/utils/errorUtils';

const ORDER_STORAGE_KEY = 'departmentOrder';

const loadStoredOrder = (): number[] => {
  try {
    const raw = localStorage.getItem(ORDER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const useDepartmentStore = defineStore('departments', () => {
  const departments = ref<DepartmentFormModel[]>([]);
  const loading = ref(false);
  const alertStore = useAlertStore();
  const customOrder = ref<number[]>(loadStoredOrder());

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

  const orderedList = computed(() => {
    return [...departments.value].sort((a, b) => {
      const indexA = customOrder.value.indexOf(a.id);
      const indexB = customOrder.value.indexOf(b.id);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  });

  function updateDepartmentsOrder(newOrder: DepartmentFormModel[]) {
    customOrder.value = newOrder.map((department) => department.id);
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(customOrder.value));
  }

  function resetDepartmentsOrder() {
    customOrder.value = [];
    localStorage.removeItem(ORDER_STORAGE_KEY);
  }

  return {
    list,
    orderedList,
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    updateDepartmentsOrder,
    resetDepartmentsOrder,
    loading,
  };
});
