<template>
  <VApp>
    <AppSidebar />
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
import AppSidebar from '@/layouts/AppSidebar.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AlertMessage from './components/widgets/AlertMessage.vue';
</script>

<style lang="scss">
@import '@/styles/style.scss';
.app-content {
  min-height: calc(100vh - 64px);
  padding: 20px;
  background: #f8f8f8;

  &__wrapper {
    max-width: 1270px;
    margin: 0 auto;
    background: #ffffff;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    padding: 20px;
    border-radius: 8px;
  }
}
</style>
