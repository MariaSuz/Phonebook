import { defineStore } from 'pinia';
import type {
  FileFormModel,
  FileUploadModel,
} from '../logic/types/forms/FileFormModel';
import { api } from '../api/api';
import { useAlertStore } from './alertStore';
import { computed, ref } from 'vue';
import { getErrorMessage, showError } from '@/logic/utils/errorUtils';

export const useFileStore = defineStore('file', () => {
  const files = ref<FileFormModel[]>([]);
  const loading = ref(false);
  const alertStore = useAlertStore();

  const list = computed(() => files.value);

  async function getFiles() {
    loading.value = true;
    try {
      const response = await api.get('/files');
      files.value = response.data;
    } catch (error: any) {
      alertStore.error(getErrorMessage(error));
    } finally {
      loading.value = false;
    }
  }

  async function downloadFile(id: string) {
    loading.value = true;
    try {
      const response = await api.get(`/files/${id}/download`, {
        responseType: 'blob',
      });
      // Получаем имя файла из заголовка
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'download';
      if (contentDisposition) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
          contentDisposition,
        );
        if (matches && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }
      // Создаем ссылку для скачивания
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      showError(error);
    } finally {
      loading.value = false;
    }
  }

  async function uploadFile(data: FileUploadModel) {
    loading.value = true;
    try {
      const formData = new FormData();
      if (data.fileContent) {
        formData.append('document', data.fileContent);
      }
      if (data.description) {
        formData.append('description', data.description);
      }
      if (data.groupId) {
        formData.append('groupId', data.groupId.toString());
      }
      if (data.fileName) {
        formData.append('fileName', data.fileName);
      }
      const response = await api.post('/files/upload', formData);
      const newDoc = response.data;
      files.value.push(newDoc);
      return newDoc;
    } catch (error: any) {
      showError(error);
    } finally {
      loading.value = false;
    }
  }

  async function deleteFile(id: string) {
    loading.value = true;
    try {
      await api.delete(`/files/${id}`);
      files.value = files.value.filter((d) => d.id !== id);
    } catch (error: any) {
      showError(error);
    } finally {
      loading.value = false;
    }
  }

  return {
    list,
    getFiles,
    downloadFile,
    uploadFile,
    deleteFile,
  };
});
