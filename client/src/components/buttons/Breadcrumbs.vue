<template>
  <div class="breadcrumbs">
    <RouterLink to="/" class="breadcrumbs__link">Справочник</RouterLink>
    <span> / </span>
    <span>{{ current }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  current: string
}>()
</script>

<style lang="scss" scoped>
@import '@/styles/colors';

.breadcrumbs {
  font-size: 0.85rem;
  color: $color-muted;
  margin-bottom: 12px;

  &__link {
    color: $color-muted;
    text-decoration: none;
    &:hover {
      color: rgb(var(--v-theme-primary));
    }
  }
}
</style>
