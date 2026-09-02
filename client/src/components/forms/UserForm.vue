<template>
  <BaseForm
    :title="formTitle"
    :form-type="formType"
    :is-loading="isLoading"
    @cancel="emit('cancel')"
    @submit="onSubmitForm"
  >
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
      label="Выберите роль"
      :items="roleOptions"
      item-title="title"
      item-value="value"
      :disabled="isLoading"
      :readonly="disabled"
      icon="mdi-shield-account"
    />
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
  value: number;
}

const roleOptions: RoleOption[] = [
  { title: 'Администратор', value: 1 },
  { title: 'Редактор', value: 2 }
];

const props = defineProps<UserProps>();
const store = useUserStore();

const createUser = (): UserFormModel => ({
  userName: '',
  password: '',
  roleId: 2,
  avatar: '',
});
const user = ref<UserFormModel>(props.data ? { ...props.data } : createUser());
const v = useVuelidate(userRules, user);
const disabled = computed(() => props.formType === FormTypes.SHOW);
const isLoading = ref(false);

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
