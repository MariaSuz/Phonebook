<template>
  <div class="login-form">
    <VCard class="login-form__wrapper">
      <div class="login-form__header">
        <div class="department-form__title">Войдите в систему телефонного справочника</div>
      </div>
      <AlertMessage />
      <VForm @submit.prevent="sendLoginForm">
        <div class="login-form__content">
          <TextField
            v-model="authForm.userName"
            label="Login"
            icon="mdi-account"
            :error-messages="v.userName.$errors.map((e: any) => e.$message)"
            :error="v.userName.$error"
            @blur="v.userName.$touch"
          />
          <TextField
            v-model="authForm.password"
            label="Password"
            icon="mdi-lock"
            type="password"
            :error-messages="v.password.$errors.map((e: any) => e.$message)"
            :error="v.password.$error"
            @blur="v.password.$touch"
          />
        </div>
        <div class="login-form__actions">
          <VBtn
            @click="cancelAction"
            class="login-form__actions__btn login-form__actions__btn--cancel"
          >
            Отмена
          </VBtn>
          <VBtn
            type="Submit"
            class="login-form__actions__btn login-form__actions__btn--save"
            :disabled="v.$invalid"
          >
            Войти
          </VBtn>
        </div>
      </VForm>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/authStore";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useVuelidate } from '@vuelidate/core';
import { loginRules } from "@/logic/validation/loginValidation";
import { useAlertStore } from "@/store/alertStore";
import AlertMessage from "@/components/widgets/AlertMessage.vue"
import TextField from "@/components/inputs/TextField.vue";

const authStore = useAuthStore();
const router = useRouter();
const alertStore = useAlertStore();
const authForm = ref({
  userName: "",
  password: "",
});

const v = useVuelidate(loginRules, authForm);

const cancelAction = () => {
  router.push('/');
};

const sendLoginForm = async() => {
  alertStore.clear();
  const isValid = await v.value.$validate();
  if (!isValid) {
    // Показываем все ошибки
    v.value.$touch();
    return;
  }
  try {
    await authStore.login({
      userName: authForm.value.userName,
      password: authForm.value.password,
    });
    router.push('/');
    } catch (error) {
      alertStore.error(error.message || 'Ошибка авторизации');
    }
}
</script>

<style lang="scss">
.login-form {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px);
  background: inherit;
  padding: 20px;
  box-sizing: border-box;
  &__wrapper {
    width: 500px;
  }
  &__header {
    padding: 24px 28px 16px;
    background: linear-gradient(135deg, #f8fff8, #f0f7f0);
    border-bottom: 1px solid #ddebe0;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    &__title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e3c2c;
      margin: 0;
      line-height: 1.4;
      max-width: 80%;
    }
  }
  &__content {
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 20px;
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
