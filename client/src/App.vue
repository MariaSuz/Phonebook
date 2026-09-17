<template>
  <VApp>
    <AppHeader />
    <VMain>
      <div class="app-content">
        <div class="app-content__wrapper">
          <AlertMessage />
          <RouterView />
        </div>
      </div>
    </VMain>
  </VApp>
</template>

<script setup lang="ts">
import AppHeader from '@/layouts/AppHeader.vue';
import AlertMessage from './components/widgets/AlertMessage.vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';

const authStore = useAuthStore();
const router = useRouter();
onMounted(() => {
  const isValid = authStore.checkToken();
  if (!isValid && router.currentRoute.value.meta.requiresAuth) {
    router.push('/login');
  }
});
</script>

<style lang="scss">
@import '@/styles/style.scss';
.app-content {
  min-height: calc(100vh - 64px);
  background: rgb(var(--v-theme-background));

  &__wrapper {
    max-width: 1600px;
    margin: 0 auto;
    padding: 24px;
  }
}
</style>
