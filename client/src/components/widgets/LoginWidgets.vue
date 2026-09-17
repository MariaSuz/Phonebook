<template>
  <div class="login-menu">
    <VMenu>
      <template v-slot:activator="{ props }">
        <VAvatar
          v-bind="props"
          class="login-menu--avatar"
          size="36"
        >
          <VIcon
            icon="mdi-account"
            color="white"
            size="20"
          />
        </VAvatar>
      </template>
      <VList class="login-menu__container">
        <div
          v-if="authStore.isAuthenticated"
          class="login-menu__profile"
        >
          <VAvatar
            class="login-menu__profile-avatar"
            size="36"
          >
            <VIcon
              icon="mdi-account"
              color="white"
              size="20"
            />
          </VAvatar>
          <div class="login-menu__profile-info">
            <div class="login-menu__profile-name">{{ authStore.authUser?.userName }}</div>
            <div class="login-menu__profile-role">{{ roleName }}</div>
          </div>
        </div>
        <VDivider
          v-if="authStore.isAuthenticated"
          class="login-menu__divider"
        />
        <VListItem
          v-if="authStore.isAdmin"
          class="login-menu__item"
          prepend-icon="mdi-account-multiple"
          title="Пользователи"
          subtitle="Учётные записи и роли"
          value="settings"
          @click="goSettings"
        />
        <VListItem
          v-if="authStore.isAdmin"
          class="login-menu__item"
          prepend-icon="mdi-file-document-outline"
          title="Журнал аудита"
          subtitle="Кто и что менял в справочнике"
          value="audit"
          @click="goAudit"
        />
        <VListItem
          v-if="authStore.isAuthenticated"
          class="login-menu__item"
          prepend-icon="mdi-lock-outline"
          title="Изменить пароль"
          value="change-password"
           @click="goChange"
        />
        <VDivider
          v-if="authStore.isAuthenticated"
          class="login-menu__divider"
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
    <ChangePassword v-model="changePass" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'vue-router';
import ChangePassword from '@/components/widgets/ChangePassword.vue';

const router = useRouter();
const authStore = useAuthStore();
const changePass = ref(false);

const roleName = computed(() => {
  switch (authStore.authUser?.roleId) {
    case 1: return 'Администратор';
    case 2: return 'Редактор';
    default: return '';
  }
});

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
const goChange = () => {
  changePass.value = true;
};
</script>
<style scoped lang="scss">
@import '@/styles/colors';

.login-menu{
  display: flex;
  align-items: center;

  &--avatar {
    background: rgb(var(--v-theme-primary)) !important;
    cursor: pointer;
  }

  &__container {
    background: rgb(var(--v-theme-surface)) !important;
    border-radius: 4px !important;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12) !important;
    padding: 4px !important;
    margin-top: 10px;
    min-width: 260px;
  }

  &__profile {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;

    &-avatar {
      background: rgb(var(--v-theme-primary)) !important;
      flex-shrink: 0;
    }

    &-info {
      min-width: 0;
    }

    &-name {
      font-weight: 600;
      color: rgb(var(--v-theme-on-surface));
      font-size: 0.9rem;
    }

    &-role {
      font-size: 0.8rem;
      color: $color-secondary-text;
    }
  }

  &__divider {
    margin: 4px 0 !important;
    border-color: $color-border !important;
  }
  &__item {
    border-radius: 4px !important;
    margin: 2px 0 !important;
    transition: all 0.2s ease !important;
    :deep(.v-list-item__prepend) {
      color: rgb(var(--v-theme-primary)) !important;
      transition: color 0.2s ease;
    }
    :deep(.v-list-item-title) {
      color: rgb(var(--v-theme-on-surface)) !important;
      font-size: 0.9rem !important;
      font-weight: 500 !important;
    }
    :deep(.v-list-item-subtitle) {
      color: $color-secondary-text !important;
      font-size: 0.78rem !important;
      opacity: 1 !important;
    }

    &:hover {
      background: $color-bg-muted !important;
      :deep(.v-list-item__prepend) {
        color: rgb(var(--v-theme-secondary))!important;
      }
      :deep(.v-list-item-title) {
        color: rgb(var(--v-theme-primary)) !important;
      }
    }
    &:active {
      background: $color-bg-muted !important;
    }
  }
}
</style>
