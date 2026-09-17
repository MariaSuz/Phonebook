<template>
  <VTextField
    :model-value="modelValue"
    :label="label"
    :placeholder="placeholder"
    :type="isPassword ? (showPassword ? 'text' : 'password') : type"
    :min="min"
    :max="max"
    variant="outlined"
    persistent-placeholder
    :readonly="readonly"
    :disabled="disabled"
    :clearable="!readonly && clearable"
    class="text-field"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template v-slot:prepend-inner>
      <VIcon
        :icon="icon"
        size="small"
      />
    </template>
    <template
      v-if="isPassword"
      v-slot:append-inner
    >
      <VIcon
        :icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        size="small"
        style="cursor: pointer;"
        @click="showPassword = !showPassword"
      />
    </template>
  </VTextField>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface TextFieldProps {
  modelValue: any;
  label?: string;
  placeholder?: string;
  icon?: string;
  clearable?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  type?: string;
  min?: number;
  max?: number;
}

const props = withDefaults(defineProps<TextFieldProps>(), {
  clearable: true
});
defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();

const showPassword = ref(false);
const isPassword = computed(() => props.type === 'password');
</script>

<style lang="scss">
@import '@/styles/colors';

.text-field {
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
}
</style>
