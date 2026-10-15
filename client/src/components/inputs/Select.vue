<template>
  <div class="field">
    <label v-if="label" class="field__label">{{ label }}<span v-if="required" class="field__required">*</span></label>
  <VSelect
    :model-value="modelValue"
    :items="items"
    :item-title="itemTitle"
    :item-value="itemValue"
    variant="outlined"
    class="select"
    v-bind="$attrs"
    :placeholder="placeholder"
    persistent-placeholder
    :menu-props="{ contentClass: 'select-menu', offset: 4, maxHeight: 320 }"
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
  </div>
</template>

<script setup lang="ts">

defineOptions({ inheritAttrs: false });

interface SelectProps {
  modelValue: any;
  items: any[];
  itemTitle?: string;
  itemValue?: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  icon?: string;
}

withDefaults(defineProps<SelectProps>(), {});
defineEmits<{
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
  .v-field__append-inner .v-icon {
    color: $color-secondary-text;
    opacity: 1;
  }
}
</style>
