<template>
  <VCard>
    <VProgressLinear
      v-if="isLoading"
      :model-value="isLoading"
      color="primary"
      height="3"
      absolute
      location="top"
    />
    <div class="base-form">
      <div class="base-form__header">
        <slot name="header">
          <h2 class="base-form__title">{{ title }}</h2>
        </slot>
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
            :disabled="isLoading"
          />
          <ButtonComponent
            v-if="formType !== FormTypes.SHOW"
            title="Сохранить"
            prepend-icon="mdi-check"
            type="submit"
            :loading="isLoading"
            :disabled="isLoading || disabled"
            buttonType="save"
          />
        </div>
      </VForm>
    </div>
  </VCard>
</template>

<script setup lang="ts">
import { FormTypes } from '@/logic/types/FormTypes';
import ButtonComponent from '../buttons/ButtonComponent.vue';
import { computed } from 'vue';

interface BaseFormProps {
  title: string;
  formType: FormTypes;
  layout?: 'grid' | 'flex';
  isLoading?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<BaseFormProps>(), {
  layout: 'flex',
  isLoading: false,
  disabled: false,
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
@import '@/styles/colors';

.base-form {
  display: flex;
  flex-direction: column;
  background: rgb(var(--v-theme-surface));

  &__header {
    padding: 24px 28px 16px;
    border-bottom: 1px solid $color-line;
    background: rgb(var(--v-theme-background));
  }

  &__status {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 28px;
    background: $color-bg-muted;
    color: $color-secondary-text;
    font-size: 0.85rem;
    border-bottom: 1px solid $color-line;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: $color-primary-text;
    margin: 0;
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
    background: rgb(var(--v-theme-background));
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    padding: 20px 28px 28px;
    border-top: 1px solid $color-line;
  }
}
</style>
