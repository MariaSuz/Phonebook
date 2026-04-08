<template>
  <VAppBar
    :elevation="2"
    class="header"
  >
    <template v-slot:prepend>
      <VAppBarNavIcon @click="sidebarStore.toggleSidebar"></VAppBarNavIcon>
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
        <VAppBarTitle class="logo-title">ШОСТАКОВИЧ опера балет</VAppBarTitle>
      </div>
    </RouterLink>
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
          href="http://mail.opera-samara.net/"
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
          href="http://mail.opera-samara.ru/"
          target="_blank"
          rel="noopener noreferrer"
          title="Обмен с ЭДО"
        >
          <VIcon icon="mdi-email-outline" size="18" />
          <span class="header__contact-text">ЭДО</span>
        </VBtn>
        <VBtn
          class="header__contact-btn"
          variant="text"
          href="https://opera-samara.ru/afisha/"
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
  </VAppBar>
</template>

<script setup>
import LoginWidgets from '../components/widgets/LoginWidgets.vue'
import FileWidget from '../components/widgets/FileWidget.vue'
import { useSidebarStore } from '@/store/sidebarStore';
import { ref } from 'vue';

const sidebarStore = useSidebarStore();
const isDocsPanelOpen = ref(false);

const toggleDocsPanel = () => {
  isDocsPanelOpen.value = !isDocsPanelOpen.value;
};

</script>

<style scoped lang="scss">
.header {
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
    background: transparent !important;
    padding: 6px 12px;
    border-radius: 8px;
  }
  &__contact-text {
    font-size: 0.85rem;
    font-weight: 500;
  }
}
</style>
