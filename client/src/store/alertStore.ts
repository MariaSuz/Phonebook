import { defineStore } from 'pinia';

interface Alert {
  message: string;
  id?: number;
}

export const useAlertStore = defineStore('alert', {
  state: () => ({
    alert: null as Alert | null,
  }),
  actions: {
    error(message: string) {
      this.alert = {
        message,
        id: Date.now(),
      };
    },

    clear() {
      this.alert = null;
    },
  },
});
