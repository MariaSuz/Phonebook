<template>
  <VBtn
    @click="click"
    class="btn"
    :prepend-icon="prependIcon"
    :append-icon="appendIcon"
    :class="{
      'btn--save': buttonType === 'save',
      'btn--cancel': buttonType === 'cancel',
      'btn--active': active,
    }"
  > {{ title }}
    <VChip
      v-if="chip"
      class="btn-chip"
      color="primary"
      size="x-small"
    >{{ chip }}</VChip>
  </VBtn>
</template>

<script setup lang="ts">
interface buttonProps {
  title?: string;
  prependIcon?: string;
  appendIcon?: string;
  buttonType?: 'save' | 'cancel';
  active?: boolean;
  chip?: string;
}

const emit = defineEmits(['click']);
defineProps<buttonProps>();

const click = () => {
  emit('click');
};

</script>

<style lang="scss">
@import '@/styles/colors';

.btn {
  border-radius: 4px !important;
  padding: 0 28px !important;
  height: 44px !important;
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: 0.3px !important;
  color: rgb(var(--v-theme-primary)) !important;
  box-shadow: none !important;

  &:hover {
    background: $color-bg-muted !important;
    box-shadow: none !important;
  }

  &--cancel {
    background: transparent !important;
    color: $color-secondary-text !important;
    border: 1px solid $color-line !important;

    &:hover {
      background: $color-bg-muted !important;
      border-color: rgb(var(--v-theme-primary)) !important;
      color: rgb(var(--v-theme-primary)) !important;
    }
  }

  &--active {
    color: rgb(var(--v-theme-primary)) !important;
    border-color: rgb(var(--v-theme-primary)) !important;
  }

  &-chip {
    margin-left: 8px;
    font-weight: 700;
    pointer-events: none;
  }

  &--save {
    background: rgb(var(--v-theme-primary)) !important;
    color: white !important;
    border: none !important;
    box-shadow: none !important;

    &:hover {
      background: $color-border-hover !important;
      box-shadow: none !important;
    }

    &.v-btn--disabled {
      background: rgb(var(--v-theme-primary)) !important;
      color: white !important;
      opacity: 0.45 !important;
    }
  }
}
</style>
