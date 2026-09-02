<template>
  <VAppBar
    :elevation="2"
    class="header"
  >
    <template v-slot:prepend>
      <div
        class="header__menu"
        @click="sidebarStore.toggleSidebar"
      >
        <VAppBarNavIcon ></VAppBarNavIcon>
        <span class="header__menu-label">Отделы</span>
      </div>
    </template>
    <RouterLink
      to="/"
      class="header-link"
    >
      <div class="logo-container">
        <img
          src="../assets/logomain.png"
          alt="logo-company"
          class="logo-image"
        />
        <VAppBarTitle class="logo-title">Компания</VAppBarTitle>
      </div>
    </RouterLink>
    <VBtn
      v-if="authenticationUser"
      class="header__docs-btn"
      variant="text"
      @click="toggleTechMenu"
    >
      <VIcon
        icon="mdi-server"
        size="24"
        class="header__docs-icon"
      />
      <span class="header__docs-title">Тех. сайты</span>
    </VBtn>
    <VBtn
      class="header__docs-btn"
      variant="text"
      @click="toggleDocsPanel"
    >
      <VIcon
        icon="mdi-file-document-multiple"
        size="24"
        class="header__docs-icon"
      />
      <span class="header__docs-title">Документы</span>
    </VBtn>
    <template v-slot:append>
      <div class="header__contacts">
        <VBtn
          class="header__contact-btn"
          variant="text"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          title="Электронная почта"
        >
          <VIcon icon="mdi-email-outline" size="18" />
          <span class="header__contact-text">Почта</span>
        </VBtn>
        <VBtn
          class="header__contact-btn"
          variant="text"
          title="Обмен с ЭДО"
          @click="toggleMailRUModal"
        >
          <VIcon icon="mdi-email-outline" size="18" />
          <span class="header__contact-text">ЭДО</span>
        </VBtn>
        <VBtn
          class="header__contact-btn"
          variant="text"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          title="Официальный сайт"
        >
          <VIcon icon="mdi-web" size="18" />
          <span class="header__contact-text">Сайт</span>
        </VBtn>
      </div>
      <LoginWidgets />
    </template>
    <FileWidget v-model="isDocsPanelOpen" />
    <TechWidget v-model="isTechMenuOpen" />
    <MailWarningModal
      v-model="isMailRUOpen"
    />
  </VAppBar>
</template>

<script setup>
import LoginWidgets from '../components/widgets/LoginWidgets.vue'
import FileWidget from '../components/widgets/FileWidget.vue'
import TechWidget from '../components/widgets/TechWidget.vue'
import MailWarningModal from '../components/modals/MailWarningModal.vue';
import { useSidebarStore } from '@/store/sidebarStore';
import { useAuthStore } from '@/store/authStore';
import { computed, ref } from 'vue';

const sidebarStore = useSidebarStore();
const isDocsPanelOpen = ref(false);
const isTechMenuOpen = ref(false);
const isMailRUOpen = ref(false);
const authStore = useAuthStore();

const toggleDocsPanel = () => {
  isDocsPanelOpen.value = !isDocsPanelOpen.value;
};
const toggleTechMenu = () => {
  isTechMenuOpen.value = !isTechMenuOpen.value;
};
const toggleMailRUModal = () => {
  isMailRUOpen.value = !isMailRUOpen.value;
};
const authenticationUser = computed(() => authStore.isAuthenticated);
</script>

<style scoped lang="scss">
.header {
  &__menu {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
      &-label {
        font-size: 1.125rem;
        font-weight: 600;
        color: #722F37;
        letter-spacing: 0.02em;
        padding-left: 4px;
      }
    }
    :deep(.v-app-bar-nav-icon) {
      color: #722F37;
      &:hover {
        background-color: rgba(114, 47, 55, 0.08);
    }
  }

  &-link {
    text-decoration: none;
    cursor: pointer;
    color: inherit;
    transition: all 0.3s ease;
    &:hover {
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
    }
  }
  .logo-container {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-left: 80px;
  }
  .logo-image {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }

  .logo-title {
    font-size: 1.25rem;
    font-weight: 500;
    white-space: nowrap;
  }

  &__docs-btn {
    margin-left: 5px;
  }

  &__contacts {
    display: flex;
    gap: 4px;
    align-items: center;
    color: #722F37;
    padding-right: 5px;
  }

  &__contact-btn {
    display: flex;
    gap: 6px;
    align-items: center;
    padding: 6px 12px;
    border-radius: 8px;
    background: linear-gradient(135deg, #722F37, #B22222);
    color: white;
    border: none;
    box-shadow: 0 4px 12px rgba(178, 34, 34, 0.3);
    &:hover {
      background: linear-gradient(135deg, #B22222, #722F37);
      box-shadow: 0 6px 16px rgba(178, 34, 34, 0.4);
    }
  }
  &__contact-text {
    font-size: 0.85rem;
    font-weight: 500;
  }
}
</style>
