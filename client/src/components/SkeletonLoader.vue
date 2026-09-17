<template>
  <span
    class="skeleton-block"
    :style="{ width, height }"
  ></span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  width?: string;
  height?: string;
}>(), {
  width: '100%',
  height: '14px',
});
</script>

<style scoped lang="scss">
@import '@/styles/colors';

.skeleton-block {
  display: inline-block;
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    $color-bg-muted 25%,
    $color-line 37%,
    $color-bg-muted 63%
  );
  background-size: 400% 100%;
  animation: skeleton-shimmer 1.4s ease infinite;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}
</style>
