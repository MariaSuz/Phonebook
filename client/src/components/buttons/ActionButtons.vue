<template>
  <div class="action-buttons">
    <VIcon
      v-if="showView"
      icon="mdi-eye"
      size="small"
      class="action-buttons-icon"
      @click="$emit('view')"
    ></VIcon>
    <VIcon
      v-if="canEdit"
      icon="mdi-pencil"
      size="small"
      class="action-buttons-icon"
      @click="$emit('edit')"
    ></VIcon>
    <VIcon
      v-if="canEdit"
      icon="mdi-delete"
      size="small"
      class="action-buttons-icon"
      :class="{ 'action-buttons-icon--disabled': !canDelete }"
      @click="canDelete && $emit('delete')"
    ></VIcon>
  </div>
</template>

<script setup lang="ts">
interface ActionButtonsProps {
  canEdit?: boolean;
  canDelete?: boolean;
  showView?: boolean;
}

withDefaults(defineProps<ActionButtonsProps>(), {
  showView: true,
  canDelete: true,
});
defineEmits<{
  (e: 'view'): void;
  (e: 'edit'): void;
  (e: 'delete'): void;
}>();
</script>

<style scoped lang="scss">
@import '@/styles/colors';
.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  &-icon {
    transition: color 0.2s ease, background 0.2s ease;
    color: $color-muted;
    cursor: pointer;

    &:hover {
      color: rgb(var(--v-theme-primary));
      background: $color-bg-muted;
    }

    &--disabled {
      opacity: 0.35;
      cursor: not-allowed;
      pointer-events: none;
    }
  }
}
</style>
