<template>
  <VDialog
    v-model="show"
    class="mail-warning-modal"
    overlay-color="#000"
    overlay-opacity="1"
    scroll-strategy="none"
    max-width="420"
  >
    <VCard>
      <div class="mail-warning-modal__header">
        <div class="mail-warning-modal__icon">
          <VIcon
            icon="mdi-alert"
            size="20"
            color="white"
          />
        </div>
        <h3 class="mail-warning-modal__title">
          Почта для ЭДО (RU)
        </h3>
        <VBtn
          class="modal__close"
          icon="mdi-close"
          variant="text"
          @click="close"
        >
        </VBtn>
      </div>
      <div class="mail-warning-modal__content">
        <VIcon
          icon="mdi-email-outline"
          size="22"
          class="mail-warning-modal__content-icon"
        />
        <span>Внимание! Вы открываете почту для обмена ЭДО. Вы точно хотите её открыть?</span>
      </div>
      <div class="mail-warning-modal__footer">
        <ButtonComponent
          title="Отмена"
          buttonType="cancel"
          @click="close"
        />
        <VBtn
          class="btn btn--save"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          @click="close"
        >
          Открыть почту
        </VBtn>
      </div>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ButtonComponent from '../ButtonComponent.vue';

interface ModalProps {
  modelValue?: boolean;
}

interface ModalEmits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
}

const props = defineProps<ModalProps>();
const emits = defineEmits<ModalEmits>();

const show = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
});

const close = () => {
  show.value = false;
  emits('close');
};
</script>
<style lang="scss">
.mail-warning-modal {
  &__header {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 28px 28px 18px;
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
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #722F37;
    letter-spacing: -0.01em;
  }

  &__content {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 24px 28px;
    font-size: 0.95rem;
    line-height: 1.6;
  }

  &__content-icon {
    color: #B22222;
    flex-shrink: 0;
    margin-top: 2px;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 4px 20px 22px;
  }

  .modal__close {
    position: absolute !important;
    right: 16px !important;
    top: 16px !important;
    z-index: 100 !important;
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
}
</style>
