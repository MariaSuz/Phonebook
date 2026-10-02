import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '../api/api';
import type { AnnouncementFormModel } from '../logic/types/forms/AnnouncementFormModel';
import { useAlertStore } from './alertStore';
import { getErrorMessage, showError } from '@/logic/utils/errorUtils';

export const useAnnouncementsStore = defineStore('announcements', () => {
  const items = ref<AnnouncementFormModel[]>([]); // все анонсы
  const current = ref<AnnouncementFormModel[]>([]); // отображается сверху
  const loading = ref(false);
  const alertStore = useAlertStore();

  async function getAll() {
    loading.value = true;
    try {
      const response = await api.get('/announcements');
      items.value = response.data;
    } catch (error: any) {
      alertStore.error(getErrorMessage(error));
    } finally {
      loading.value = false;
    }
  }

  // публичный запрос для полосы, ошибки не показываем
  async function getCurrent() {
    try {
      const response = await api.get('/announcements/current');
      current.value = response.data;
    } catch {
      current.value = [];
    }
  }

  async function createAnnouncement(data: Omit<AnnouncementFormModel, 'id'>) {
    loading.value = true;
    try {
      const response = await api.post('/announcements', data);
      items.value.unshift(response.data);
      await getCurrent();
      return response.data;
    } catch (error: any) {
      showError(error);
    } finally {
      loading.value = false;
    }
  }

  async function updateAnnouncement(id: number, data: Omit<AnnouncementFormModel, 'id'>) {
    loading.value = true;
    try {
      const response = await api.put(`/announcements/${id}`, data);
      items.value = items.value.map((a) => (a.id === id ? response.data : a));
      await getCurrent();
      return response.data;
    } catch (error: any) {
      showError(error);
    } finally {
      loading.value = false;
    }
  }

  async function deleteAnnouncement(id: number) {
    loading.value = true;
    try {
      await api.delete(`/announcements/${id}`);
      items.value = items.value.filter((a) => a.id !== id);
      await getCurrent();
    } catch (error: any) {
      showError(error);
    } finally {
      loading.value = false;
    }
  }

  return { items, current, loading, getAll, getCurrent, createAnnouncement, updateAnnouncement, deleteAnnouncement };
});
