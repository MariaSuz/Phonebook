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
        color="#C06060"
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
  .v-field {
    border-radius: 12px;
    background: #ffffff;
    transition: all 0.2s ease;
    border: 1px solid #E5C7C7;
  }
}
</style>
