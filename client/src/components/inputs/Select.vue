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
  .v-field {
    border-radius: 12px;
  }
  .v-field__outline {
    color: #C06060 !important;
  }
}
</style>
