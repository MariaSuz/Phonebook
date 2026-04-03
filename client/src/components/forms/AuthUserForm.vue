<template>
  <VCard>
    <div div class="auth-form">
      <div class="auth-form__header">
        <h2 class="auth-form__title">{{ formTitle }}</h2>
      </div>
      <div class="auth-form__content">
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
      </div>
      <div class="auth-form__actions">
        <ButtonComponent
          @click="cancelAction"
          title="Отмена"
          buttonType="cancel"
        />
        <ButtonComponent
          v-if="formType !== FormTypes.SHOW"
          title="Сохранить"
          @click="onSubmitForm"
          buttonType="save"
        />
      </div>
    </div>
  </VCard>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/authStore';
import type { AuthFormModel } from '@/logic/types/forms/AuthFormModel';
import { FormTypes } from '@/logic/types/FormTypes';
import { ref, computed } from 'vue';
import TextField from '../inputs/TextField.vue';
import useVuelidate from '@vuelidate/core';
import { userRules } from '@/logic/validation/userValidation';
import ButtonComponent from '../ButtonComponent.vue';
import Select from '../inputs/Select.vue';

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

const cancelAction = () => {
  emit('cancel');
};

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

<style lang="scss">
.auth-form {
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
    display: flex;
    flex-direction: column;
    gap: 10px;
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
