import { defineStore } from 'pinia';
import type { DepartmentFormModel } from '../logic/types/forms/DepartmentFormModel';
import { api } from "../api/api";

export const useDepartmentStore = defineStore('departments', {
  state: () => ({
    departments: [] as DepartmentFormModel[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async getDepartments() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/departments');
        this.departments = response.data;
      } catch (error) {
        this.error = error.message;
        console.error('Ошибка при загрузке отделов:', error);
      } finally {
        this.loading = false;
      }
    },

    async createDepartment(data: DepartmentFormModel) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/departments', data);
        const newDept = response.data;
        this.departments.push(newDept);
        return newDept;
      } catch (error) {
        this.error = error.message;
        console.error('Ошибка при добавлении отдела', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateDepartment(id: number, data: DepartmentFormModel) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.put(`/departments/${id}`, data);
        const updatedDept = response.data;
        const index = this.departments.findIndex((d) => d.id === id);
        if (index !== -1) {
          this.departments[index] = updatedDept;
        }
        return updatedDept;
      } catch (error) {
        this.error = error.message;
        console.error('Ошибка при обновлении отдела:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteDepartment(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await api.delete(`/departments/${id}`);
        this.departments = this.departments.filter((d) => d.id !== id);
      } catch (error) {
        this.error = error.message;
        console.error('Ошибка при удалении отдела:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },

  getters: {
    list: (state) => state.departments,
  },
});
