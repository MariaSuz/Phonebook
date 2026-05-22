<template>
  <VCard>
    <div class="base-form">
      <div class="base-form__header">
        <h2 class="base-form__title">{{ title }}</h2>
      </div>
      <VForm @submit.prevent="onSubmitForm">
        <div
          class="base-form__content"
          :class="contentClass"
        >
          <slot></slot>
        </div>
        <div class="base-form__actions">
          <ButtonComponent
            @click="cancelAction"
            title="Отмена"
            buttonType="cancel"
          />
          <ButtonComponent
            v-if="formType !== FormTypes.SHOW"
            title="Сохранить"
            type="submit"
            :disabled="isLoading"
            buttonType="save"
          />
        </div>
      </VForm>
    </div>
  </VCard>
</template>

<script setup lang="ts">
import { FormTypes } from '@/logic/types/FormTypes';
import ButtonComponent from '../ButtonComponent.vue';
import { computed } from 'vue';

interface BaseFormProps {
  title: string;
  formType: FormTypes;
  layout?: 'grid' | 'flex';
  isLoading?: boolean;
}

const props = withDefaults(defineProps<BaseFormProps>(), {
  layout: 'flex',
  isLoading: false,
});

const contentClass = computed(() => ({
  'base-form__content--grid': props.layout === 'grid',
  'base-form__content--flex': props.layout === 'flex'
}));

const emit = defineEmits(['cancel', 'submit']);
const cancelAction = () => {
  if (!props.isLoading) {
    emit('cancel');
  }
};
const onSubmitForm = () => {
  if (!props.isLoading) {
    emit('submit');
  }
};
</script>

<style lang="scss">
.base-form {
  display: flex;
  flex-direction: column;
  background: #ffffff;

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
  }

  &__content {
    padding: 28px;
    &--flex {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    &--grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    padding: 20px 28px 28px;
    background: #FDF5F5;
  }
}
</style>
