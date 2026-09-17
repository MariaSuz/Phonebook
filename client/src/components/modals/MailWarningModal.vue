<template>
  <Modal
    v-model="show"
    class="mail-warning-modal"
    max-width="440"
    @close="close"
  >
    <div class="mail-warning-modal__eyebrow">Предупреждение</div>
    <div class="mail-warning-modal__body">
      <div class="mail-warning-modal__icon">
        <VIcon
          icon="mdi-exclamation"
          size="32"
          color="white"
        />
      </div>
      <h3 class="mail-warning-modal__title font-heading">
        Почта для ЭДО (RU)
      </h3>
      <p class="mail-warning-modal__warning">
        Внимание! Это специальная почта для документооборота, вы точно хотите её открыть?
      </p>
      <p class="mail-warning-modal__note">
        Ей пользуются отдел кадров, бухгалтерия, экономисты и контрактная служба.
      </p>
    </div>
    <template #footer>
      <div class="mail-warning-modal__footer">
        <ButtonComponent
          title="Отмена"
          buttonType="cancel"
          @click="close"
        />
        <ButtonComponent
          title="Открыть почту"
          append-icon="mdi-arrow-top-right"
          buttonType="save"
          href="http://mail.opera-samara.ru/"
          target="_blank"
          rel="noopener noreferrer"
          @click="close"
        />
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ButtonComponent from '../buttons/ButtonComponent.vue';
import Modal from '@/components/modals/Modal.vue';

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
@import '@/styles/colors';

.mail-warning-modal {
  &__eyebrow {
    padding: 20px 44px 0 24px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: $color-secondary-text;
  }

  &__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 8px;
    padding: 16px 32px 28px;
  }

  &__icon {
    width: 64px;
    height: 64px;
    flex-shrink: 0;
    border-radius: 50%;
    background: rgb(var(--v-theme-primary));
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
  }

  &__title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: $color-primary-text;
  }

  &__warning {
    margin: 4px 0 0;
    font-size: 0.95rem;
    font-weight: 700;
    line-height: 1.5;
    color: rgb(var(--v-theme-accent));
  }

  &__note {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.5;
    color: $color-secondary-text;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 20px 24px 24px;
    border-top: 1px solid $color-line;
  }
}
</style>
