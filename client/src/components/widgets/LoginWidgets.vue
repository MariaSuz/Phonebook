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
      <VList class="login-menu">
        <VListItem
          v-if="authStore.isAuthenticated"
          class="login-menu__item"
          prepend-icon="mdi-account"
          title="Настройки"
          value="settings"
          @click="goSettings"
        />
        <VListItem
          v-if="authStore.isAuthenticated"
          class="login-menu__item"
          prepend-icon="mdi-history"
          title="Логи"
          value="audit"
          @click="goAudit"
        />
        <VListItem
          v-if="authStore.isAuthenticated"
          class="login-menu__item login-menu__item--logout"
          prepend-icon="mdi-logout"
          title="Выйти"
          value="logout"
          @click="logout"
        />
        <VListItem
          v-if="!authStore.isAuthenticated"
          class="login-menu__item login-menu__item--login"
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
const goAudit = () => {
  router.push('/audit');
};
const goLogin = () => {
  router.push('/login');
};
</script>
<style scoped lang="scss">
.header__login {
  display: flex;
  align-items: center;
}

.login-menu {
  background: white !important;
  border-radius: 8px !important;
  box-shadow: 0 2px 12px rgba(114, 47, 55, 0.15) !important;
  padding: 4px !important;
  min-width: 200px;
  &__divider {
    margin: 4px 0 !important;
    border-color: #f0e0e0 !important;
  }
  &__item {
    border-radius: 6px !important;
    margin: 2px 0 !important;
    transition: all 0.2s ease !important;
    :deep(.v-list-item__prepend) {
      color: #722F37 !important;
      transition: color 0.2s ease;
    }
    :deep(.v-list-item-title) {
      color: #4a4a4a !important;
      font-size: 0.9rem !important;
      font-weight: 500 !important;
    }

    &:hover {
      background: rgba(114, 47, 55, 0.08) !important;
      :deep(.v-list-item__prepend) {
        color: #B22222 !important;
      }
      :deep(.v-list-item-title) {
        color: #722F37 !important;
      }
    }
    &:active {
      background: rgba(114, 47, 55, 0.12) !important;
    }
  }
}
</style>