<template>
  <div class="header__login">
    <VMenu>
      <template v-slot:activator="{ props }">
        <VIcon
          v-bind="props"
          icon="mdi-account-circle"
          class="header__login-icon"
          size="32"
        />
      </template>
      <VList>
        <VListItem
          v-if="authStore.isAuthenticated"
          prepend-icon="mdi-account"
          title="Настройки"
          value="settings"
          @click="goSettings"
        />
        <VListItem
          v-if="authStore.isAuthenticated"
          prepend-icon="mdi-logout"
          title="Выйти"
          value="logout"
          @click="logout"
        />
        <VListItem
          v-if="!authStore.isAuthenticated"
          prepend-icon="mdi-logout"
          title="Войти"
          value="login"
          @click="goLogin"
        />
      </VList>
    </VMenu>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

const logout = () => authStore.logout();

const goSettings = () => {
  router.push('/settings');
};
const goLogin = () => {
  router.push('/login');
};
</script>
