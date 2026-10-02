<template>
  <div
    class="strip"
    :class="`strip--${phase}`"
  >
    <span
      v-if="phase === 'active'"
      class="strip__dot"
    />
    <VIcon
      v-else
      icon="mdi-wrench-outline"
      size="16"
      class="strip__icon"
    />
    <span class="strip__message">
      <template v-if="phase === 'upcoming'">
        <b>{{ period }}</b> - {{ message }}
      </template>
      <template v-else>
        <b>Идут работы до {{ endTime }}.</b> {{ message }}
      </template>
    </span>
    <span class="strip__spacer" />
    <VBtn
      v-if="closable && phase === 'upcoming'"
      icon="mdi-close"
      size="x-small"
      variant="text"
      title="Скрыть"
      @click="emit('close')"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  phase: 'upcoming' | 'active';
  message: string;
  period: string;
  endTime: string;
  closable?: boolean;
}>();
const emit = defineEmits(['close']);
</script>

<style scoped lang="scss">
@import '@/styles/colors';

.strip {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 38px;
  padding: 6px 18px;
  font-size: 0.8125rem;

  b {
    font-weight: 600;
  }

  &--upcoming {
    background: $color-bg-muted;
    color: $color-primary-text;
  }

  &--active {
    background: $color-border;
    color: #fff;
  }

  &__icon {
    color: $color-border;
    flex-shrink: 0;
  }

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.25);
    flex-shrink: 0;
  }

  &__spacer {
    flex: 1;
  }

}
</style>
