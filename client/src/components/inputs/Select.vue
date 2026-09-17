<template>
  <VSelect
    :model-value="modelValue"
    :label="label"
    :items="items"
    :item-title="itemTitle"
    :item-value="itemValue"
    variant="outlined"
    class="select"
    :placeholder="placeholder"
    persistent-placeholder
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template v-slot:prepend-inner>
      <VIcon
      :icon="icon"
      size="small"
      />
    </template>
    <template v-if="$slots.item" v-slot:item="slotProps">
      <slot name="item" v-bind="slotProps" />
    </template>
  </VSelect>
</template>

<script setup lang="ts">

interface SelectProps {
  modelValue: any;
  items: any[];
  itemTitle?: string;
  itemValue?: string;
  label?: string;
  placeholder?: string;
  icon?: string;
}

const props = withDefaults(defineProps<SelectProps>(), {});
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();
</script>

<style lang="scss">
@import '@/styles/colors';

.select {
  .v-field {
    border-radius: 4px;
    background: $color-bg-muted;
  }
  .v-field__outline {
    color: $color-line !important;
    opacity: 1 !important;
  }
  .v-field--focused .v-field__outline {
    color: rgb(var(--v-theme-primary)) !important;
  }
  .v-field--error .v-field__outline {
    color: rgb(var(--v-theme-error)) !important;
  }
  .v-field__prepend-inner .v-icon {
    color: $color-secondary-text;
  }
  .v-field--error .v-field__prepend-inner .v-icon {
    color: rgb(var(--v-theme-error));
  }
  .v-label {
    color: $color-secondary-text !important;
    opacity: 1 !important;
  }
}
</style>
