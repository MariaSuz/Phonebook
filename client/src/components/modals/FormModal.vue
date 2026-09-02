<template>
  <Modal
      v-model="modalValue"
      backgroundColor="white"
      width="750"
    >
      <Component
        :is="formComponent"
        :data="data"
        :id="id"
        :department-id="departmentId"
        :form-type="formType"
        @cancel="closeModalEmit"
      />
  </Modal>
</template>

<script setup lang="ts">
import Modal from '@/components/modals/Modal.vue';
import { FormTypes } from '@/logic/types/FormTypes';
import { computed } from 'vue';
import type { Component } from 'vue';

interface ModalProps {
  modelValue: boolean;
  data?: any;
  formComponent: Component;
  formType: FormTypes;
  id?: number;
  departmentId?: number;
}

const props = defineProps<ModalProps>();

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'cancel'): void;
}

const emit = defineEmits<Emits>();

const modalValue = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
});

const closeModalEmit = () => {
  modalValue.value = false;
  emit('cancel');
};
</script>

<style lang="scss">
</style>

