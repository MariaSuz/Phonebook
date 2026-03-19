import { defineStore } from 'pinia';
import { api } from "../api/api";
import type { AuditFormModel } from '@/logic/types/forms/AuditFormModel';

export const useAuditLogStore = defineStore('audit', {
  state: () => ({
    auditLog: [] as AuditFormModel[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async getlogs() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/audit');
        this.auditLog = response.data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },

  getters: {
    list: (state) => state.auditLog,
  },
});
