<template>
  <Modal
    v-model="show"
    width="420"
    :hide-close="isSubmitting"
    :persistent="isSubmitting"
    @close="close"
  >
    <div class="change-password__header">
      <span class="change-password__eyebrow">Учётная запись</span>
      <h3 class="change-password__title font-heading">Изменение пароля</h3>
      <p class="change-password__subtitle">{{ userLabel }}</p>
    </div>
    <div class="change-password__content">
      <TextField
        v-model="authForm.password"
        label="Новый пароль"
        placeholder="Введите пароль"
        icon="mdi-lock"
        type="password"
        hide-details
        :disabled="isSubmitting"
        :error="v.password.$error"
        @blur="v.password.$touch"
        @keydown.enter="sendChangePasswordForm"
      />
      <div
        v-if="v.password.$error"
        class="change-password__error"
      >
        <VIcon
          icon="mdi-alert-circle-outline"
          size="14"
        />
        {{ v.password.$errors[0]?.$message }}
      </div>
      <div
        v-if="isSubmitting"
        class="change-password__status"
      >
        <VProgressCircular
          indeterminate
          size="16"
          width="2"
          color="primary"
        />
        <span>Сохраняем новый пароль. Повторный вход не потребуется.</span>
      </div>
      <ul
        v-else
        class="change-password__rules"
      >
        <li
          v-for="rule in passwordRules"
          :key="rule.key"
          class="change-password__rule"
          :class="ruleStateClass(rule.valid)"
        >
          <VIcon
            :icon="ruleIcon(rule.valid)"
            size="14"
          />
          {{ rule.label }}
        </li>
      </ul>
    </div>
    <template #footer>
      <div class="change-password__actions">
        <ButtonComponent
          title="Отмена"
          buttonType="cancel"
          :disabled="isSubmitting"
          @click="close"
        />
        <ButtonComponent
          :title="isSubmitting ? 'Сохранение...' : 'Сохранить'"
          :loading="isSubmitting"
          :disabled="!authForm.password || isSubmitting"
          buttonType="save"
          @click="sendChangePasswordForm"
        />
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import Modal from '@/components/modals/Modal.vue';
import TextField from '@/components/inputs/TextField.vue';
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import { userRules } from '@/logic/validation/userValidation';
import { useAuthStore } from '@/store/authStore';
import { showError } from '@/logic/utils/errorUtils';
import { api } from '@/api/api';

interface ChangePasswordProps {
  modelValue?: boolean;
}

interface ChangePasswordEmits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save'): void;
  (e: 'cancel'): void;
}

const props = defineProps<ChangePasswordProps>();
const emits = defineEmits<ChangePasswordEmits>();

const authStore = useAuthStore();

const authForm = ref({ password: '' });
const isSubmitting = ref(false);
const v = useVuelidate({ password: userRules.password }, authForm);

const show = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
});

const roleName = computed(() => {
  switch (authStore.authUser?.roleId) {
    case 1: return 'Администратор';
    case 2: return 'Редактор';
    default: return '';
  }
});

const userLabel = computed(() => [authStore.authUser?.userName, roleName.value].filter(Boolean).join(' · '));

const isDirty = computed(() => authForm.value.password.length > 0);

const passwordRules = computed(() => [
  {
    key: 'minLength',
    label: 'Минимум 2 символа',
    valid: isDirty.value ? authForm.value.password.length >= 2 : null,
  },
  {
    key: 'noSpaces',
    label: 'Без пробелов',
    valid: isDirty.value ? !/\s/.test(authForm.value.password) : null,
  },
]);

const ruleStateClass = (valid: boolean | null) => {
  if (valid === null) return 'is-neutral';
  return valid ? 'is-valid' : 'is-invalid';
};

const ruleIcon = (valid: boolean | null) => {
  if (valid === null) return 'mdi-circle-outline';
  return valid ? 'mdi-check' : 'mdi-close';
};

const resetForm = () => {
  authForm.value.password = '';
  v.value.$reset();
};

const close = () => {
  if (isSubmitting.value) return;
  show.value = false;
  resetForm();
  emits('cancel');
};

const sendChangePasswordForm = async () => {
  if (isSubmitting.value) return;
  const isValid = await v.value.$validate();
  if (!isValid) {
    v.value.$touch();
    return;
  }
  isSubmitting.value = true;
  try {
    await api.put(`/users/${authStore.authUser?.id}`, { password: authForm.value.password });
    show.value = false;
    resetForm();
    emits('save');
  } catch (error) {
    showError(error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
<style scoped lang="scss">
@import '@/styles/colors';

.change-password {
  &__header {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 28px 32px 20px;
    border-bottom: 1px solid $color-line;
  }

  &__eyebrow {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: $color-secondary-text;
  }

  &__title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 700;
    color: $color-primary-text;
  }

  &__subtitle {
    margin: 0;
    font-size: 0.85rem;
    color: $color-secondary-text;
  }

  &__content {
    padding: 24px 28px 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__error {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    color: rgb(var(--v-theme-error));
    margin-top: -4px;
  }

  &__status {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    background: $color-bg-muted;
    border-radius: 4px;
    font-size: 0.85rem;
    color: $color-secondary-text;
    line-height: 1.4;
  }

  &__rules {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 0;
    padding: 12px 14px;
    list-style: none;
    background: $color-bg-muted;
    border-radius: 4px;
  }

  &__rule {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.82rem;
    color: $color-secondary-text;

    .v-icon {
      color: $color-muted;
    }

    &.is-valid {
      color: $color-primary-text;

      .v-icon {
        color: rgb(var(--v-theme-success));
      }
    }

    &.is-invalid {
      color: rgb(var(--v-theme-error));

      .v-icon {
        color: rgb(var(--v-theme-error));
      }
    }
  }

  &__actions {
    display: flex;
    gap: 16px;
    padding: 20px 28px 28px;

    .btn {
      flex: 1;
    }
  }
}
</style>
