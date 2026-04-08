<template>
  <BaseForm
    :title="formTitle"
    :form-type="formType"
    @cancel="emit('cancel')"
    @submit="onSubmitForm"
  >
    <TextField
      v-model="user.userName"
      label="Имя пользователя"
      placeholder="Введите логин"
      icon="mdi-account"
      :error-messages="v.userName.$errors.map((e: any) => e.$message)"
      :error="v.userName.$error"
      @blur="v.userName.$touch"
    />
    <TextField
      v-model="user.password"
      label="Пароль пользователя"
      type="password"
      icon="mdi-lock"
      :error-messages="v.password.$errors.map((e: any) => e.$message)"
      :error="v.password.$error"
      @blur="v.password.$touch"
    />
    <Select
      v-model="user.roleId"
      label="Выберите роль"
      :items="roleOptions"
      item-title="title"
      item-value="value"
      icon="mdi-shield-account"
    />
  </BaseForm>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/authStore';
import type { AuthFormModel } from '@/logic/types/forms/AuthFormModel';
import { FormTypes } from '@/logic/types/FormTypes';
import { ref, computed } from 'vue';
import TextField from '../inputs/TextField.vue';
import useVuelidate from '@vuelidate/core';
import { userRules } from '@/logic/validation/userValidation';
import Select from '../inputs/Select.vue';
import BaseForm from './BaseForm.vue';

interface AuthUserProps {
  data?: AuthFormModel;
  formType: FormTypes;
  id?: number;
}
interface RoleOption {
  title: string;
  value: number;
}

const roleOptions: RoleOption[] = [
  { title: 'Администратор', value: 1 },
  { title: 'Редактор', value: 2 }
];

const props = defineProps<AuthUserProps>();
const store = useAuthStore();

const createAuthUser = (): AuthFormModel => ({
  userName: '',
  password: '',
  roleId: 2,
  avatar: '',
});
const user = ref<AuthFormModel>(props.data ? { ...props.data } : createAuthUser());
const v = useVuelidate(userRules, user);

const formTitle = computed(() => {
   switch (props.formType) {
    case FormTypes.EDIT:
      return `Редактирование пользователя ${user.value.userName}`;
    case FormTypes.ADD:
      return `Добавление нового пользователя`;
    default:
      return `Просмотр пользователя ${user.value.userName}`;
  };
});

const emit = defineEmits(['cancel']);

const onSubmitForm = async () => {
  const isValid = await v.value.$validate();
  if (!isValid) {
    v.value.$touch();
    return;
  }
  try {
    if (props.formType === FormTypes.EDIT) {
      await store.updateAuthUser(props.id!, user.value);
    } else if (props.formType === FormTypes.ADD) {
      await store.register(user.value);
      await store.getAuthUsers();
    }
    emit('cancel');
  } catch (error) {
    console.error('Ошибка при сохранении:', error);
  }
};
</script>
