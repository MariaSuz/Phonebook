import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useSidebarStore = defineStore('sidebar', () => {
  // State
  const isSidebarOpen = ref(false);
  // Getters
  const sidebarState = computed(() => isSidebarOpen.value);
  // Actions
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };
  return {
    // State
    isSidebarOpen,
    // Getters
    sidebarState,
    // Actions
    toggleSidebar,

  };
});