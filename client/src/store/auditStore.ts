import { defineStore } from 'pinia';
import { api } from "../api/api";
import type { AuditFormModel } from '@/logic/types/forms/AuditFormModel';
import { computed, ref } from 'vue';
import { useAlertStore } from './alertStore';
import { getErrorMessage } from '@/logic/utils/errorUtils';

interface AuditMeta {
  limit: number;
  offset: number;
  total: number;
  hasMore: boolean;
}

export const useAuditLogStore = defineStore('audit', () => {
  const auditLog = ref<AuditFormModel[]>([]);
  const loading = ref(false);
  const alertStore = useAlertStore();
  const meta = ref<AuditMeta>({
    limit: 25,
    offset: 0,
    total: 0,
    hasMore: false,
  });


  async function getlogs(params?: {
    limit?: number;
    offset?: number;
    action?: string;
    month?: string;
  }) {
    loading.value = true;
    try {
      const response = await api.get('/audit', {
        params: {
          limit: params?.limit ?? meta.value.limit,
          offset: params?.offset ?? 0,
          action: params?.action,
          month: params?.month,
        },
      });
      auditLog.value = response.data.data;
      meta.value = response.data.meta;
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
    meta,
    loading,
  };
});
