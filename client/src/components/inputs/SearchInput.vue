<template>
  <div class="search-input">
    <VTextField
      :modelValue="modelValue"
      @update:modelValue="updateValue"
      :label="label"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      hide-details
      :clearable="clearable"
      @click:clear="clearMessage"
    >
    </VTextField>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';
import { debounce } from 'vuetify/lib/util/helpers.mjs';

interface SearchInputProps {
  modelValue: string;
  label?: string;
  clearable?: boolean;
}

defineProps<SearchInputProps>();

const emit = defineEmits(['update:modelValue']);
const clearMessage = () => emit('update:modelValue', '');
const updateValue = debounce((value: string) => {
  emit('update:modelValue', value);
}, 300);
</script>

<style scoped lang="scss">
</style>