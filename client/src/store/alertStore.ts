import { defineStore } from 'pinia';
import { ref } from 'vue';

interface Alert {
  message: string;
  type?: 'error';
  id?: number;
}

export const useAlertStore = defineStore('alert', () => {
  const alert = ref<Alert | null>(null);

  function error(message: string) {
    alert.value= {
      message,
      type: 'error',
      id: Date.now(),
    };
  }
  function clear() {
    alert.value= null;
  }
  return {
    alert,
    error,
    clear,
  }
});
