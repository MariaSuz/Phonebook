<template>
  <VAlert
      v-if="alertStore.alert"
      :type="alertStore.alert.type"
      class="mb-4"
      closable
      @click:close="alertStore.clear()"
    >
      {{ alertStore.alert.message }}
  </VAlert>
</template>

<script setup lang="ts">
import { useAlertStore } from '@/store/alertStore';

const alertStore = useAlertStore();
</script>
