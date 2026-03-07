import { defineStore } from 'pinia';
import type { FileFormModel, FileUploadModel } from './forms/FileFormModel';
import { api } from "../api/api";

export const useFileStore = defineStore('file', {
  state: () => ({
    files: [] as FileFormModel[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async getFiles() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/files');
        this.files = response.data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async downloadFile(id: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/files/${id}/download`, {
          responseType: 'blob',
        });
        // Получаем имя файла из заголовка
        const contentDisposition = response.headers['content-disposition'];
        let filename = 'file';
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
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async uploadFile(data: FileUploadModel) {
      this.loading = true;
      this.error = null;
      try {
        const formData = new FormData();
        if (data.fileContent) {
          formData.append('document', data.fileContent);
        }
        if (data.description) {
          formData.append('description', data.description);
        }
        const response = await api.post('/files/upload', formData);
        const newDoc = response.data;
        this.files.push(newDoc);
        return newDoc;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteFile(id: string) {
      this.loading = true;
      this.error = null;
      try {
        await api.delete(`/files/${id}`);
        this.files = this.files.filter((d) => d.id !== id);
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },

  getters: {
    list: (state) => state.files,
  },
});
