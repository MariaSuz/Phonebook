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
        <VBtn
          @click="close"
          class="confirm-delete__btn confirm-delete__btn--cancel"
        > Отмена
        </VBtn>
        <VBtn
          @click="confirmDelete"
          class="confirm-delete__btn confirm-delete__btn--delete"
        >  Удалить
        </VBtn>
      </div>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

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
    background: linear-gradient(135deg, #f8fff8, #f0f7f0);
    border-bottom: 1px solid #ddebe0;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e3c2c;
    margin: 0 0 4px 0;
    letter-spacing: -0.01em;
  }

  &__content {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 14px;
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

  &__btn {
    border-radius: 30px !important;
    padding: 0 28px !important;
    height: 44px !important;
    font-weight: 600 !important;
    text-transform: none !important;
    letter-spacing: 0.3px !important;
      &--cancel {
        background: transparent !important;
        color: #5a7a6a !important;
        border: 1px solid #c0d6c0 !important;

        &:hover {
          background: #f0f7f0 !important;
          border-color: #7ccf7c !important;
        }
      }
      &--delete {
        background: linear-gradient(135deg, #9c2e2e, #7a1f1f) !important;
        color: white !important;
        border: none !important;
        box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3) !important;
        &:hover {
          background: linear-gradient(135deg, #7a1f1f, #9c2e2e) !important;
          box-shadow: 0 6px 16px rgba(46, 125, 50, 0.4) !important;
        }
      }
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