<template>
  <VDialog
    v-model="show"
    class="modal"
    overlay-color="#000"
    overlay-opacity="1"
    scroll-strategy="none"
  >
    <VCard :style="{ background: backgroundColor }">
      <h3
        v-if="headerMessage"
        class="modal__header-message"
      >
        {{ headerMessage }}
      </h3>
      <VBtn
        class="modal__close"
        icon="mdi-close"
        variant="text"
        @click="close"
      >
      </VBtn>
      <div class="modal__content">
        <slot />
      </div>
      <div class="modal__footer">
        <slot name="footer" />
      </div>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface ModalProps {
  modelValue?: boolean;
  headerMessage?: string;
  backgroundColor?: string;
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
.modal {
  &__header-message {
    text-align: center;
    font-size: 20px;
    font-weight: 400;
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