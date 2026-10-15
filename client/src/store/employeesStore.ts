import { defineStore } from 'pinia';
import { api } from '@/api/api';
import type {
  Employee,
  EmployeeCreateModel,
  EmployeeUpdateModel,
} from '../logic/types/forms/EmployeeFormModel';
import type { Department } from '../logic/types/forms/DepartmentFormModel';
import { useAlertStore } from './alertStore';
import { computed, ref } from 'vue';
import { getErrorMessage, showError } from '@/logic/utils/errorUtils';

export const useEmployeesStore = defineStore('employee', () => {

  const employees = ref<Employee[]>([]);
  const employeesByDepartment = ref<Map<number, Employee[]>>(new Map());
  const loading = ref(false);
  const listLoading = ref(false);
  const allLoading = ref(false);
  const alertStore = useAlertStore();

  const list = computed(() => employees.value);
  function filterEmployeesByDepartment(departmentId: number) {
    return employees.value.filter((emp) => emp.departmentId === departmentId);
  }

  async function getEmployees() {
    listLoading.value = true;
    try {
      const response = await api.get('/employees');
      employees.value = response.data;
    } catch (error: any) {
      alertStore.error(getErrorMessage(error));
    } finally {
      listLoading.value = false;
    }
  }

  async function addEmployees(data: EmployeeCreateModel) {
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

  async function updateEmployee(id: number, data: EmployeeUpdateModel) {
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
    try {
      const response = await api.get(`/employees/department/${id}`);
      const users = response.data;
      employeesByDepartment.value.set(id, users);
      return users;
    } catch (error: any) {
      alertStore.error(getErrorMessage(error));
    }
  }

  async function allDepartmentsEmployees(departments: Department[]) {
    allLoading.value = true;
    try {
      const promises = departments.map((dept) =>
        getEmployeesByDepartment(dept.id),
      );
      await Promise.all(promises);
    } catch (error: any) {
      alertStore.error(getErrorMessage(error));
    } finally {
      allLoading.value = false;
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
    loading,
    listLoading,
    allLoading,
    filterEmployeesByDepartment,
  };
});
