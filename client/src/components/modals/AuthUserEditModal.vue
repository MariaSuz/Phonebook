<template>
  <Modal
      v-model="modalValue"
      backgroundColor="white"
      width="750"
    >
      <AuthUserForm
        @cancel="closeModalEmit"
        :user-data="userData"
        :user-id="userId"
        :form-type="FormTypes.EDIT"
      />
  </Modal>
</template>

<script setup lang="ts">
import Modal from '@/components/modals/Modal.vue';
import AuthUserForm from '@/components/forms/AuthUserForm.vue';
import { FormTypes } from '@/store/forms/FormTypes';
import { computed } from 'vue';
import type { AuthFormModel } from '@/store/forms/AuthFormModel';

interface ModalProps {
  modelValue: boolean;
  userData: AuthFormModel;
  userId: number;
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
