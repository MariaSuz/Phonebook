<template>
  <VAppBar
    elevation="0"
    class="header"
  >
    <RouterLink
      to="/"
      class="header-link"
    >
      <div class="header-logo">
        <img
          src="../assets/logomain.png"
          alt="logo-company"
          class="header-logo-image"
        />
        <div>
          <VAppBarTitle class="header-logo-title font-heading">КОМПАНИЯ</VAppBarTitle>
          <span class="header-logo-subtitle">супер</span>
        </div>
      </div>
    </RouterLink>
    <nav class="header__nav">
      <RouterLink
        to="/"
        class="header__nav-tab"
        active-class="header__nav-tab--active"
        exact
      >
        <VIcon icon="mdi-book-open-page-variant" size="20" />
        <span>Справочник</span>
      </RouterLink>
      <RouterLink
        to="/documents"
        class="header__nav-tab"
        active-class="header__nav-tab--active"
        exact
      >
        <VIcon icon="mdi-file-document-multiple" size="20" />
        <span>Документы</span>
      </RouterLink>
      <RouterLink
        v-if="isAdmin"
        to="/tech-sites"
        class="header__nav-tab"
        active-class="header__nav-tab--active"
        exact
      >
        <VIcon icon="mdi-server" size="20" />
        <span>Тех. сайты</span>
      </RouterLink>
    </nav>
    <template v-slot:append>
      <div class="header__contacts">
        <VBtn
          class="header__contacts-btn"
          variant="text"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          title="Электронная почта"
        >
          <VIcon icon="mdi-email-outline" size="18" />
          <span class="header__contacts-title">Почта</span>
          <VIcon icon="mdi-arrow-top-right" size="14" class="header__contacts-arrow" />
        </VBtn>
        <VBtn
          class="header__contacts-btn"
          variant="text"
          title="Обмен с ЭДО"
          @click="toggleMailRUModal"
        >
          <VIcon icon="mdi-email-outline" size="18" />
          <span class="header__contacts-title">ЭДО</span>
          <VIcon icon="mdi-arrow-top-right" size="14" class="header__contacts-arrow" />
        </VBtn>
        <VBtn
          class="header__contacts-btn"
          variant="text"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          title="Официальный сайт"
        >
          <VIcon icon="mdi-web" size="18" />
          <span class="header__contacts-title">Сайт</span>
          <VIcon icon="mdi-arrow-top-right" size="14" class="header__contacts-arrow" />
        </VBtn>
      </div>
      <div class="header__divider" />
      <LoginWidgets />
    </template>
    <MailWarningModal
      v-model="isMailRUOpen"
    />
  </VAppBar>
</template>

<script setup>
import LoginWidgets from '../components/widgets/LoginWidgets.vue'
import MailWarningModal from '../components/modals/MailWarningModal.vue';
import { useAuthStore } from '@/store/authStore';
import { computed, ref } from 'vue';

const isMailRUOpen = ref(false);
const authStore = useAuthStore();

const toggleMailRUModal = () => {
  isMailRUOpen.value = !isMailRUOpen.value;
};
const isAdmin = computed(() => authStore.isAdmin);
</script>

<style scoped lang="scss">
@import '@/styles/colors';

.header {
  padding: 0 18px;
  border-bottom: 2px solid $color-bg-muted;
  &-link {
    text-decoration: none;
    cursor: pointer;
    color: inherit;
  }
  &-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-left: 24px;
    &-image {
      width: 40px;
      height: 40px;
      object-fit: contain;
      flex-shrink: 0;
    }
    &-title {
      font-size: 1.1rem;
      font-weight: 600;
      line-height: 1.2;
      white-space: nowrap;
    }
    &-subtitle {
      display: block;
      font-size: 0.75rem;
      font-weight: 400;
      color: $color-muted;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      white-space: nowrap;
    }
  }

  &__nav {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-left: 32px;
    height: 100%;
    &-tab {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border: none;
      background: transparent;
      color: $color-secondary-text;
      font-size: 0.9rem;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: color 0.2s ease, border-color 0.2s ease;
      &:hover {
        color: rgb(var(--v-theme-secondary));
      }
      &--active {
        color: rgb(var(--v-theme-primary));
        border-bottom-color: rgb(var(--v-theme-primary));
        font-weight: 600;
      }
    }
  }

  &__contacts {
    display: flex;
    gap: 20px;
    align-items: center;
    color: rgb(var(--v-theme-secondary));
    &-btn {
      display: flex;
      gap: 6px;
      align-items: center;
      padding: 0;
      min-width: 0;
      background: transparent;
      color: $color-secondary-text;
      border: none;
      box-shadow: none;
      text-transform: none;
      letter-spacing: normal;
      &:hover {
        background: transparent;
        color: rgb(var(--v-theme-primary));
        box-shadow: none;
      }
    }
    &-title {
      font-size: 0.85rem;
      font-weight: 500;
    }
    &-arrow {
      opacity: 0.6;
      margin-left: -2px;
    }
  }

  &__divider {
    width: 1px;
    height: 24px;
    background: $color-line;
    margin: 0 16px;
  }
}
</style>
