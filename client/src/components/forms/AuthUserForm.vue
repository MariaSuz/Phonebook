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
        <VSelect
          v-model="user.roleId"
          label="Выберите роль"
          :items="roleOptions"
          item-title="title"
          item-value="value"
          variant="outlined"
        >
          <template v-slot:prepend>
            <VIcon icon="mdi-shield-account" color="#7ccf7c" size="small" />
          </template>
        </VSelect>
      </div>
      <VDivider class="auth-form__divider" />
      <div class="auth-form__actions">
        <VBtn
          @click="cancelAction"
          class="auth-form__actions__btn auth-form__actions__btn--cancel"
        > Отмена
        </VBtn>
        <VBtn
          v-if="formType !== FormTypes.SHOW"
          @click="onSubmitForm"
          class="auth-form__actions__btn auth-form__actions__btn--save"
        >  {{ formType === FormTypes.ADD ? 'Создать' : 'Сохранить' }}
        </VBtn>
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
    background: linear-gradient(135deg, #f8fff8, #f0f7f0);
    border-bottom: 1px solid #ddebe0;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e3c2c;
    margin: 0 0 4px 0;
    letter-spacing: -0.01em;
  }

  &__subtitle {
    font-size: 0.95rem;
    color: #5a7a6a;
    margin: 0;
  }

  &__content {
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__divider {
    margin: 0 28px;
    border-color: #ddebe0;
    opacity: 0.6;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    padding: 20px 28px 28px;
    background: #fafffa;
      &__btn {
      border-radius: 30px !important;
      padding: 0 28px !important;
      height: 44px !important;
      font-weight: 600 !important;
      text-transform: none !important;
      letter-spacing: 0.3px !important;
        &--cancel {
          background: transparent !important;
          color: #5a7a6a !important;
          border: 1px solid #c0d6c0 !important;

          &:hover {
            background: #f0f7f0 !important;
            border-color: #7ccf7c !important;
          }
        }
        &--save {
          background: linear-gradient(135deg, #1e3c2c, #2a5a3a) !important;
          color: white !important;
          border: none !important;
          box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3) !important;
          &:hover {
            background: linear-gradient(135deg, #2a5a3a, #1e3c2c) !important;
            box-shadow: 0 6px 16px rgba(46, 125, 50, 0.4) !important;
          }
        }
      }
  }
}
</style>
