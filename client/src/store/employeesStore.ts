import { defineStore } from 'pinia';
import { api } from '@/api/api';
import type { EmployeeFormModel } from '../logic/types/forms/EmployeeFormModel';
import type { DepartmentFormModel } from '../logic/types/forms/DepartmentFormModel';

export const useEmployeesStore = defineStore('employee', {
  state: () => ({
    employees: [] as EmployeeFormModel[],
    employeesByDepartment: new Map<number, EmployeeFormModel[]>(),
    loading: false,
    error: null as string | null,
  }),

  getters: {
    list: (state) => state.employees,
  },

  actions: {
    async getEmployees() {
      this.loading = true;
      this.error = null;
      try {
        this.employees = [];
        const response = await api.get('/employees');
        this.employees = response.data;
      } catch (error) {
        this.error = error.message;
        console.error('Ошибка загрузки пользователей справочника:', error);
      } finally {
        this.loading = false;
      }
    },

    async addEmployees(data: EmployeeFormModel) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/employees', data);
        const newUser = response.data;
        this.employees.push(newUser);
        return newUser;
      } catch (error) {
        this.error = error.message;
        console.error('Ошибка создания пользователя справочника:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateEmployee(id: number, data: EmployeeFormModel) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.put(`/employees/${id}`, data);
        const updatedEmployee = response.data;
        const index = this.employees.findIndex((u) => u.id === id);
        if (index !== -1) {
          this.employees[index] = updatedEmployee;
        }
        return updatedEmployee;
      } catch (error) {
        this.error = error.message;
        console.error('Ошибка обновления пользователя справочника:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteEmployee(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await api.delete(`/employees/${id}`);
        this.employees = this.employees.filter((u) => u.id !== id);
      } catch (error) {
        this.error = error.message;
        console.error('Ошибка удаления пользователя справочника:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getEmployeesByDepartment(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/employees/department/${id}`);
        const users = response.data;
        this.employeesByDepartment.set(id, users);
        return users;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async allDepartmentsEmployees(departments: DepartmentFormModel[]) {
      this.loading = true;
      this.error = null;
      try {
        const promises = departments.map((dept) =>
          this.getEmployeesByDepartment(dept.id),
        );
        await Promise.all(promises);
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
