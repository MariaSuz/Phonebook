import { defineStore } from 'pinia';
import { ref } from 'vue';

interface Alert {
  message: string;
  type?: 'error';
  id?: number;
}

export const useAlertStore = defineStore('alert', () => {
  const alert = ref<Alert | null>(null);
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  function clearTimer() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }

  function error(message: string) {
    clearTimer();
    alert.value= {
      message,
      type: 'error',
      id: Date.now(),
    };
    timeoutId = setTimeout(() => {
      clear();
    }, 7000);
  }
  function clear() {
    clearTimer();
    alert.value= null;
  }
  return {
    alert,
    error,
    clear,
  }
});
