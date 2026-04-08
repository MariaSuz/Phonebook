import { defineStore } from 'pinia';
import { api } from '@/api/api';
import type { EmployeeFormModel } from '../logic/types/forms/EmployeeFormModel';
import type { DepartmentFormModel } from '../logic/types/forms/DepartmentFormModel';
import { useAlertStore } from './alertStore';
import { computed, ref } from 'vue';
import { getErrorMessage, showError } from '@/logic/utils/errorUtils';

export const useEmployeesStore = defineStore('employee', () => {

  const employees = ref<EmployeeFormModel[]>([]);
  const employeesByDepartment = ref<Map<number, EmployeeFormModel[]>>(new Map());
  const loading = ref(false);
  const alertStore = useAlertStore();

  const list = computed(() => employees.value);

  async function getEmployees() {
    loading.value = true;
    try {
      const response = await api.get('/employees');
      employees.value = response.data;
    } catch (error: any) {
      alertStore.error(getErrorMessage(error));
    } finally {
      loading.value = false;
    }
  }

  async function addEmployees(data: EmployeeFormModel) {
    loading.value = true;
    try {
      const response = await api.post('/employees', data);
      const newUser = response.data;
      employees.value.push(newUser);
      return newUser;
    } catch (error: any) {
      showError(error);
    } finally {
      loading.value = false;
    }
  }

  async function updateEmployee(id: number, data: EmployeeFormModel) {
    loading.value = true;
    try {
      const response = await api.put(`/employees/${id}`, data);
      const updatedEmployee = response.data;
      const index = employees.value.findIndex((u) => u.id === id);
      if (index !== -1) {
        employees.value[index] = updatedEmployee;
      }
      return updatedEmployee;
    } catch (error: any) {
      showError(error);
    } finally {
      loading.value = false;
    }
  }

  async function deleteEmployee(id: number) {
    loading.value = true;
    try {
      await api.delete(`/employees/${id}`);
      employees.value = employees.value.filter((u) => u.id !== id);
    } catch (error: any) {
      showError(error);
    } finally {
      loading.value = false;
    }
  }

  async function getEmployeesByDepartment(id: number) {
    loading.value = true;
    try {
      const response = await api.get(`/employees/department/${id}`);
      const users = response.data;
      employeesByDepartment.value.set(id, users);
      return users;
    } catch (error: any) {
      alertStore.error(getErrorMessage(error));
    } finally {
      loading.value = false;
    }
  }

  async function allDepartmentsEmployees(departments: DepartmentFormModel[]) {
    loading.value = true;
    try {
      const promises = departments.map((dept) =>
        getEmployeesByDepartment(dept.id),
      );
      await Promise.all(promises);
    } catch (error: any) {
      alertStore.error(getErrorMessage(error));
    } finally {
      loading.value = false;
    }
  }

  return {
    list,
    employees,
    employeesByDepartment,
    getEmployees,
    addEmployees,
    updateEmployee,
    deleteEmployee,
    getEmployeesByDepartment,
    allDepartmentsEmployees,
  };
});
