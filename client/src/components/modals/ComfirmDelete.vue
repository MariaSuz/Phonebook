<template>
  <Modal
    v-model="show"
    class="confirm-delete"
    max-width="400"
    @close="close"
  >
    <div class="confirm-delete__body">
      <div class="confirm-delete__icon">
        <VIcon
          icon="mdi-trash-can-outline"
          size="28"
          color="white"
        />
      </div>
      <h3 class="confirm-delete__title font-heading">Подтверждение удаления</h3>
      <p class="confirm-delete__message">
        Вы уверены, что хотите удалить <strong>{{ title }}</strong>?
      </p>
      <p
        v-if="subtitle"
        class="confirm-delete__subtitle"
      >
        {{ subtitle }}
      </p>
    </div>
    <template #footer>
      <div class="confirm-delete__footer">
        <ButtonComponent
          @click="close"
          title="Отмена"
          buttonType="cancel"
        />
        <ButtonComponent
          title="Удалить"
          prepend-icon="mdi-trash-can-outline"
          @click="confirmDelete"
          buttonType="save"
        />
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ButtonComponent from '../buttons/ButtonComponent.vue';
import Modal from '@/components/modals/Modal.vue';

interface ConfirmDeleteProps {
  modelValue?: boolean;
  title?: string;
  subtitle?: string;
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
const confirmDelete = () => {
  emits('confirm');
  close();
};
</script>
<style lang="scss">
@import '@/styles/colors';

.confirm-delete {
  &__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 8px;
    padding: 28px 32px 28px;
  }

  &__icon {
    width: 56px;
    height: 56px;
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
    font-size: 1.125rem;
    font-weight: 700;
    color: $color-primary-text;
  }

  &__message {
    margin: 4px 0 0;
    font-size: 0.95rem;
    line-height: 1.5;
    color: $color-primary-text;

    strong {
      font-weight: 700;
    }
  }

  &__subtitle {
    margin: 0;
    font-size: 0.85rem;
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
