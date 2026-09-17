<template>
  <BaseForm
    :title="formTitle"
    :form-type="formType"
    :is-loading="isLoading"
    :disabled="v.$invalid"
    @cancel="emit('cancel')"
    @submit="onSubmitForm"
  >
    <template v-slot:header>
      <div class="user-form__eyebrow">Пользователи</div>
      <h2 class="user-form__title font-heading">{{ formTitle }}</h2>
      <div
        v-if="showDefaultRoleHint"
        class="user-form__subtitle"
      >
        Роль по умолчанию — редактор
      </div>
    </template>
    <TextField
      v-model="user.userName"
      label="Имя пользователя"
      placeholder="Введите логин"
      icon="mdi-account"
      :disabled="isLoading"
      :readonly="disabled"
      :error-messages="v.userName.$errors.map((e: any) => e.$message)"
      :error="v.userName.$error"
      @blur="v.userName.$touch"
    />
    <TextField
      v-model="user.password"
      label="Пароль пользователя"
      placeholder="Введите пароль"
      type="password"
      icon="mdi-lock"
      :disabled="isLoading"
      :readonly="disabled"
      :error-messages="v.password.$errors.map((e: any) => e.$message)"
      :error="v.password.$error"
      @blur="v.password.$touch"
    />
    <Select
      v-model="user.roleId"
      label="Роль"
      :items="roleOptions"
      item-title="title"
      item-value="value"
      :disabled="isLoading"
      :readonly="disabled"
      icon="mdi-shield-account"
    >
      <template v-slot:item="{ item, props: itemProps }">
        <VListItem
          v-bind="itemProps"
          :title="item.raw.title"
          :subtitle="item.raw.description"
          class="user-form__role-item"
        >
          <template v-slot:prepend>
            <span
              class="user-form__role-radio"
              :class="{ 'user-form__role-radio--active': item.raw.value === user.roleId }"
            />
          </template>
        </VListItem>
      </template>
    </Select>
    <div
      v-if="user.roleId === adminRoleId"
      class="user-form__role-info"
    >
      <VIcon icon="mdi-information-outline" size="16" />
      <span>Администратор получит доступ к учётным записям и журналу аудита.</span>
    </div>
  </BaseForm>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/usersStore';
import type { UserFormModel } from '@/logic/types/forms/UserFormModel';
import { FormTypes } from '@/logic/types/FormTypes';
import { ref, computed } from 'vue';
import TextField from '../inputs/TextField.vue';
import useVuelidate from '@vuelidate/core';
import { userRules } from '@/logic/validation/userValidation';
import Select from '../inputs/Select.vue';
import BaseForm from './BaseForm.vue';

interface UserProps {
  data?: UserFormModel;
  formType: FormTypes;
  id?: number;
}
interface RoleOption {
  title: string;
  description: string;
  value: number;
}

const adminRoleId = 1;
const editorRoleId = 2;

const roleOptions: RoleOption[] = [
  {
    title: 'Администратор',
    description: 'Управление пользователями, документами и журналом аудита',
    value: adminRoleId,
  },
  {
    title: 'Редактор',
    description: 'Правка сотрудников и подразделений без доступа к учётным записям',
    value: editorRoleId,
  },
];

const props = defineProps<UserProps>();
const store = useUserStore();

const createUser = (): UserFormModel => ({
  userName: '',
  password: '',
  roleId: editorRoleId,
  avatar: '',
});
const user = ref<UserFormModel>(props.data ? { ...props.data } : createUser());
const v = useVuelidate(userRules, user);
const disabled = computed(() => props.formType === FormTypes.SHOW);
const isLoading = ref(false);

const showDefaultRoleHint = computed(
  () => props.formType === FormTypes.ADD && user.value.roleId === editorRoleId,
);

const formTitle = computed(() => {
   switch (props.formType) {
    case FormTypes.EDIT:
      return `Редактирование пользователя`;
    case FormTypes.ADD:
      return `Добавление пользователя`;
    default:
      return `Просмотр пользователя`;
  };
});

const emit = defineEmits(['cancel']);

const onSubmitForm = async () => {
  if (isLoading.value) return;
  v.value.$reset();
  const isValid = await v.value.$validate();
  if (!isValid) {
    v.value.$touch();
    return;
  }
  isLoading.value = true;
  try {
    if (props.formType === FormTypes.EDIT) {
      await store.updateUser(props.id!, user.value);
    } else if (props.formType === FormTypes.ADD) {
      await store.createUser(user.value);
      await store.getUsers();
    }
    emit('cancel');
  } catch (error) {
    console.error('Ошибка при сохранении:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors';

.user-form {
  &__eyebrow {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: rgb(var(--v-theme-primary));
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    color: $color-primary-text;
    margin: 4px 0 0;
  }

  &__subtitle {
    font-size: 0.85rem;
    color: $color-secondary-text;
    margin-top: 4px;
  }

  &__role-info {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 10px 12px;
    background: $color-bg-muted;
    border-radius: 4px;
    color: $color-secondary-text;
    font-size: 0.85rem;
    margin-top: -8px;

    .v-icon {
      margin-top: 1px;
      flex-shrink: 0;
      color: rgb(var(--v-theme-primary));
    }
  }
}

.user-form__role-radio {
  display: inline-flex;
  width: 16px;
  height: 16px;
  margin-top: 2px;
  border-radius: 50%;
  border: 1.5px solid $color-line;
  flex-shrink: 0;

  &--active {
    border-color: rgb(var(--v-theme-primary));
    border-width: 5px;
  }
}

.user-form__role-item {
  align-items: flex-start;

  :deep(.v-list-item-title) {
    font-weight: 600;
    color: $color-primary-text;
  }

  :deep(.v-list-item-subtitle) {
    white-space: normal;
    font-size: 0.8rem;
    color: $color-secondary-text;
    opacity: 1;
  }
}
</style>
