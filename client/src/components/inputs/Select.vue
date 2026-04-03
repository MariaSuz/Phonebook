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
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template v-slot:prepend>
      <VIcon
      :icon="icon"
      color="#C06060"
      size="small"
      />
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
.select {
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
