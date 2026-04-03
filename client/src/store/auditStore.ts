import { defineStore } from 'pinia';
import { api } from "../api/api";
import type { AuditFormModel } from '@/logic/types/forms/AuditFormModel';
import { computed, ref } from 'vue';
import { useAlertStore } from './alertStore';
import { getErrorMessage } from '@/logic/utils/errorUtils';

export const useAuditLogStore = defineStore('audit', () => {
  const auditLog = ref<AuditFormModel[]>([]);
  const loading = ref(false);
  const alertStore = useAlertStore();


  async function getlogs() {
    loading.value = true;
    try {
      const response = await api.get('/audit');
      auditLog.value = response.data;
    } catch (error: any) {
      alertStore.error(getErrorMessage(error));
    } finally {
      loading.value = false;
    }
  }

  const list = computed(() => auditLog.value);

  return {
    getlogs,
    list,
  }
});
