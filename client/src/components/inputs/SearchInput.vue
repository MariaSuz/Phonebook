<template>
  <div class="search-input">
    <VTextField
      :modelValue="modelValue"
      @update:modelValue="updateValue"
      :label="label"
      :disabled="disabled"
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
  disabled?: boolean;
}

defineProps<SearchInputProps>();

const emit = defineEmits(['update:modelValue']);
const clearMessage = () => emit('update:modelValue', '');
const updateValue = debounce((value: string) => {
  emit('update:modelValue', value);
}, 300);
</script>

<style lang="scss">
@import '@/styles/colors';

.search-input {
  flex: 1;
  min-width: 0;
  background: rgb(var(--v-theme-surface));
  .v-field {
    border-radius: 4px;
  }

  .v-field__outline {
    color: $color-line !important;
    opacity: 1 !important;
  }

  .v-field--focused .v-field__outline {
    color: rgb(var(--v-theme-primary)) !important;
  }

  .v-field__prepend-inner .v-icon {
    color: $color-secondary-text;
  }

  .v-label {
    color: $color-secondary-text !important;
    opacity: 1 !important;
  }
}
</style>
