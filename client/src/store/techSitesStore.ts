import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '../api/api';
import type { TechSiteFormModel } from '../logic/types/forms/TechSiteFormModel';
import { useAlertStore } from './alertStore';
import { getErrorMessage, showError } from '@/logic/utils/errorUtils';

export const useTechSitesStore = defineStore('techSites', () => {
  const sites = ref<TechSiteFormModel[]>([]);
  const loading = ref(false);
  const alertStore = useAlertStore();

  async function getSites() {
    loading.value = true;
    try {
      const response = await api.get('/tech-sites');
      sites.value = response.data;
    } catch (error: any) {
      alertStore.error(getErrorMessage(error));
    } finally {
      loading.value = false;
    }
  }

  async function createSite(data: Omit<TechSiteFormModel, 'id'>) {
    loading.value = true;
    try {
      const response = await api.post('/tech-sites', data);
      sites.value.push(response.data);
      return response.data;
    } catch (error: any) {
      showError(error);
    } finally {
      loading.value = false;
    }
  }

  async function deleteSite(id: number) {
    loading.value = true;
    try {
      await api.delete(`/tech-sites/${id}`);
      sites.value = sites.value.filter((s) => s.id !== id);
    } catch (error: any) {
      showError(error);
    } finally {
      loading.value = false;
    }
  }

  return { sites, loading, getSites, createSite, deleteSite };
});
