<template>
  <Modal
      v-model="modalValue"
      backgroundColor="white"
      width="750"
    >
      <DepartmentForm
        @cancel="closeModalEmit"
        :department-data="departmentData"
        :form-type="FormTypes.EDIT"
      />
  </Modal>
</template>

<script setup lang="ts">
import Modal from '@/components/modals/Modal.vue';
import DepartmentForm from '@/components/forms/DepartmentForm.vue';
import { FormTypes } from '@/store/forms/FormTypes';
import { computed } from 'vue';

interface ModalProps {
  modelValue: boolean;
  departmentData: DepartmentForm;
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

