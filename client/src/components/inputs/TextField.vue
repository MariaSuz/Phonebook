<template>
  <VTextField
    :model-value="modelValue"
    :label="label"
    :placeholder="placeholder"
    variant="outlined"
    :readonly="readonly"
    :clearable="!readonly && clearable"
    class="text-field"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template v-slot:prepend>
      <VIcon
        :icon="icon"
        color="#7ccf7c"
        size="small"
      />
    </template>
  </VTextField>
</template>

<script setup lang="ts">

interface TextFieldProps {
  modelValue: any;
  label?: string;
  placeholder?: string;
  icon?: string;
  clearable?: boolean;
  readonly?: boolean;
}

const props = withDefaults(defineProps<TextFieldProps>(), {
  clearable: true
});
defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();
</script>

<style lang="scss">
.text-field {
  :deep(.v-field) {
    border-radius: 12px;
    background: #ffffff;
    transition: all 0.2s ease;
    border: 1px solid #e0eee0;

    &:hover {
      border-color: #7ccf7c;
      background: #fafffa;
    }

    &.v-field--focused {
      border-color: #2e7d32;
      box-shadow: 0 0 0 4px rgba(46, 125, 50, 0.1);
    }
  }

  :deep(.v-field__prepend) {
    padding-left: 12px;
    i {
      opacity: 0.8;
    }
  }

  :deep(.v-label) {
    color: #5a7a6a;
    font-weight: 500;
    font-size: 0.95rem;
  }

  :deep(input) {
    font-size: 1rem;
    color: #1e3c2c;
    &::placeholder {
      color: #a0b8a8;
      opacity: 1;
    }
  }
}
</style>
