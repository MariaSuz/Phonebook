<template>
  <VDialog
    v-model="show"
    overlay-color="#000"
    overlay-opacity="1"
    scroll-strategy="none"
    class="warning-modal"
    max-width="400"
  >
    <VCard>
      <div class="warning-modal__header">
        <div class="warning-modal__icon">
          <VIcon
            icon="mdi-alert"
            size="20"
            color="white"
          />
        </div>
        <h3 class="warning-modal__title">{{ title || 'Ошибка' }}</h3>
        <VBtn
          class="modal__close"
          icon="mdi-close"
          variant="text"
          @click="close"
        >
      </VBtn>
      </div>
      <div class="warning-modal__content">
        <span>{{ message || "Пожалуйста, повторите попытку позже" }}</span>
      </div>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface ConfirmDeleteProps {
  modelValue?: boolean;
  title?: string;
  message?: string;
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

const close = () => {
  show.value = false;
  emits('cancel');
};

</script>
<style lang="scss">
.warning-modal {
  padding: 24px;
  &__header {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 24px 28px 16px;
    background: linear-gradient(135deg, #FDF5F5, #FCE9E9);
    border-bottom: 1px solid #E5C7C7;
  }

  &__icon {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    border-radius: 50%;
    background: linear-gradient(135deg, #722F37, #B22222);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #722F37;
    margin: 0;
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
}
</style>