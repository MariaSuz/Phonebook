<template>
  <div class="login-page">
    <VCard class="login-page__card">
      <VProgressLinear
        v-if="isSubmitting"
        indeterminate
        color="primary"
        height="3"
        absolute
        location="top"
      />
      <div class="login-page__brand">
        <img
          src="../assets/logomain.png"
          alt="logo-company"
          class="login-page__logo"
        />
        <div class="login-page__brand-name">Лого</div>
        <div class="login-page__brand-sub">Саб лого</div>
      </div>
      <div class="login-page__intro">
        <h1 class="login-page__title font-heading">Телефонный справочник</h1>
        <p class="login-page__subtitle">Войдите, чтобы продолжить</p>
      </div>
      <AlertMessage />
      <VForm @submit.prevent="sendLoginForm">
        <div class="login-page__content">
          <TextField
            v-model="authForm.userName"
            placeholder="Введите логин"
            icon="mdi-account"
            :disabled="isSubmitting"
            :error-messages="v.userName.$errors.map((e: any) => e.$message)"
            :error="v.userName.$error"
            @blur="v.userName.$touch"
          />
          <TextField
            v-model="authForm.password"
            placeholder="Введите пароль"
            icon="mdi-lock"
            type="password"
            :disabled="isSubmitting"
            :error-messages="v.password.$errors.map((e: any) => e.$message)"
            :error="v.password.$error"
            @blur="v.password.$touch"
          />
        </div>
        <div class="login-page__actions">
          <ButtonComponent
            title="Отмена"
            buttonType="cancel"
            @click="cancelAction"
          />
          <ButtonComponent
            type="submit"
            :title="isSubmitting ? 'Вход...' : 'Войти'"
            :loading="isSubmitting"
            buttonType="save"
            :disabled="isEmpty"
          />
        </div>
      </VForm>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/authStore";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useVuelidate } from '@vuelidate/core';
import { loginRules } from "@/logic/validation/loginValidation";
import { useAlertStore } from "@/store/alertStore";
import AlertMessage from "@/components/widgets/AlertMessage.vue"
import TextField from "@/components/inputs/TextField.vue";
import ButtonComponent from "@/components/buttons/ButtonComponent.vue";

const authStore = useAuthStore();
const router = useRouter();
const alertStore = useAlertStore();
const authForm = ref({
  userName: "",
  password: "",
});
const isSubmitting = ref(false);

const v = useVuelidate(loginRules, authForm);
const isEmpty = computed(() => !authForm.value.userName || !authForm.value.password);

const cancelAction = () => {
  router.push('/');
};

const sendLoginForm = async() => {
  if (isSubmitting.value) return;
  alertStore.clear();
  const isValid = await v.value.$validate();
  if (!isValid) {
    // Показываем все ошибки
    v.value.$touch();
    return;
  }
  isSubmitting.value = true;
  try {
    const result = await authStore.login({
      userName: authForm.value.userName,
      password: authForm.value.password,
    });
    if (result.success) {
      router.push('/');
    }
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style lang="scss">
@import '@/styles/colors';

.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px);
  background: inherit;
  padding: 20px;
  box-sizing: border-box;

  &__card {
    width: 500px;
    position: relative;
    overflow: hidden;
  }

  &__brand {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 32px 28px 0;
  }

  &__logo {
    width: 56px;
    height: 56px;
    object-fit: contain;
    margin-bottom: 8px;
  }

  &__brand-name {
    font-family: 'Spectral', serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: $color-primary-text;
    letter-spacing: 0.02em;
  }

  &__brand-sub {
    font-size: 0.75rem;
    font-weight: 400;
    color: $color-muted;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-top: 2px;
  }

  &__intro {
    text-align: center;
    padding: 20px 28px 24px;
    border-bottom: 1px solid $color-line;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 700;
    color: $color-primary-text;
    margin: 0;
  }

  &__subtitle {
    font-size: 0.9rem;
    color: $color-secondary-text;
    margin: 6px 0 0;
  }

  &__content {
    padding: 24px 28px 0;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__actions {
    display: flex;
    gap: 16px;
    padding: 20px 28px 28px;

    .btn {
      flex: 1;
    }
  }

  .v-alert {
    margin: 20px 28px 0;
  }
}
</style>
