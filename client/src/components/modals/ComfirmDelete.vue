<template>
  <VDialog
    v-model="show"
    overlay-color="#000"
    overlay-opacity="1"
    scroll-strategy="none"
    class="confirm-delete"
    max-width="400"
  >
    <VCard>
      <div class="confirm-delete__header">
        <h3 class="confirm-delete__title">Подтверждение удаления</h3>
        <VBtn
          class="modal__close"
          icon="mdi-close"
          variant="text"
          @click="close"
        >
      </VBtn>
      </div>
      <div class="confirm-delete__content">
        <span>{{ title }}</span>
      </div>
      <div class="confirm-delete__footer">
        <ButtonComponent
          @click="close"
          title="Отмена"
          buttonType="cancel"
        />
        <ButtonComponent
          title="Удалить"
          @click="confirmDelete"
          buttonType="save"
        />
      </div>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ButtonComponent from '../ButtonComponent.vue';

interface ConfirmDeleteProps {
  modelValue?: boolean;
  title?: string;
}

interface ConfirmDeleteEmits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}

const props = defineProps<ConfirmDeleteProps>();
const emits = defineEmits<ConfirmDeleteEmits>();

const show = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
});

const title = computed(() => `Вы уверены, что хотите удалить ${props.title}?`);

const close = () => {
  show.value = false;
  emits('cancel');
};
const confirmDelete = () => {
  emits('confirm');
  close();
};
</script>
<style lang="scss">
.confirm-delete {
  padding: 24px;
  &__header {
    padding: 24px 28px 16px;
    background: linear-gradient(135deg, #FDF5F5, #FCE9E9);
    border-bottom: 1px solid #E5C7C7;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #722F37;
    margin: 0 0 4px 0;
    letter-spacing: -0.01em;
  }

  &__content {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 32px 20px;
  }

  &__close {
    position: absolute;
    right: 16px;
    top: 16px;
    z-index: 100;
    height: 24px !important;
    width: 24px !important;
    border-radius: 50% !important;
    background: rgba(0, 0, 0, 0.05) !important;
    transition: all 0.3s ease !important;
    &:hover {
      background: rgba(0, 0, 0, 0.1) !important;
      transform: rotate(90deg);
    }
  }
  .modal__close {
    position: absolute !important;
    right: 16px !important;
    top: 16px !important;
    z-index: 100 !important;
  }
  &__footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 14px;
  }
}
</style>