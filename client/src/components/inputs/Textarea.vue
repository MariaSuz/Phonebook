<template>
  <VTextarea
    :model-value="modelValue"
    :label="label"
    :placeholder="placeholder"
    :rows="rows"
    :auto-grow="autoGrow"
    :counter="counter"
    :maxlength="maxlength"
    variant="outlined"
    persistent-placeholder
    persistent-hint
    :readonly="readonly"
    :disabled="disabled"
    :clearable="!readonly && clearable"
    class="textarea"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template
      v-if="icon"
      v-slot:prepend-inner
    >
      <VIcon
        :icon="icon"
        size="small"
      />
    </template>
  </VTextarea>
</template>

<script setup lang="ts">
interface TextareaProps {
  modelValue: any;
  label?: string;
  placeholder?: string;
  icon?: string;
  clearable?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  rows?: number | string;
  autoGrow?: boolean;
  counter?: number | string | boolean;
  maxlength?: number | string;
}

withDefaults(defineProps<TextareaProps>(), {
  clearable: false,
  rows: 3,
  autoGrow: true,
});
defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<style lang="scss">
@import '@/styles/colors';

.textarea {
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
  .v-field__input {
    color: $color-primary-text !important;
    opacity: 1 !important;

    &::placeholder {
      color: $color-muted !important;
      opacity: 1 !important;
    }
  }
  .v-counter,
  .v-messages {
    color: $color-muted;
  }
}
</style>