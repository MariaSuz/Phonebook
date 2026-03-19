<template>
  <Transition name="slide-down">
    <div
      v-if="modelValue"
      class="files"
      v-click-outside="closePanel"
    >
      <div class="files__header">
        <span class="files__header-title">
          Документы
        </span>
        <div class="files__header-actions">
          <VBtn
            v-if="authenticationUser"
            icon="mdi-upload"
            variant="text"
            size="small"
            class="files__header-upload"
            @click="openModal"
          />
          <VBtn
            icon="mdi-close"
            variant="text"
            size="small"
            class="files__header-close"
            @click="closePanel"
          />
        </div>
      </div>
      <FileTab v-model:active-tab="activeTab"/>
      <div class="files__content">
        <div class="files__list">
          <VList>
            <VListItem
              v-for="file in filteredFiles"
              :key="file.id"
              class="docs-panel__item"
            >
              <VListItemTitle class="files__item-title">
                {{ file.fileName || 'Без названия' }}
              </VListItemTitle>
              <VListItemSubtitle class="files__item-subtitle">
                <div v-if="file.description" class="files__item-description">
                  {{ file.description }}
                </div>
              </VListItemSubtitle>
              <template v-slot:append>
                <div class="files__item-actions">
                  <VBtn
                    icon="mdi-download"
                    variant="text"
                    size="small"
                    color="primary"
                    @click="downloadFile(file)"
                  />
                  <VBtn
                    v-if="authenticationUser"
                    icon="mdi-delete"
                    variant="text"
                    size="small"
                    color="error"
                    @click="confirmDelete(file)"
                  />
                </div>
              </template>
            </VListItem>
          </VList>
        </div>
      </div>
      <FormModal
        v-model="isModalOpenFile"
        :form-component="FileForm"
        :form-type="FormTypes.ADD"
        @cancel="closeModal"
      />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useFileStore } from '@/store/filesStore';
import type { FileFormModel } from '@/logic/types/forms/FileFormModel';
import { computed, ref, watch } from 'vue';
import FileForm from '../forms/FileForm.vue';
import { FormTypes } from '@/logic/types/FormTypes';
import FormModal from '../modals/FormModal.vue';
import FileTab from './FileTab.vue';
import { useAuthStore } from '@/store/authStore';


interface FilesProps {
  modelValue: boolean;
}

const props = defineProps<FilesProps>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const filesStore = useFileStore();
const authStore = useAuthStore();
const files = computed(() => filesStore.list);
const selectedFile = ref<File | null>(null);
const isModalOpenFile = ref(false);
const activeTab = ref(2);

const closePanel = () => {
  if (!isModalOpenFile.value) {
    emit('update:modelValue', false);
  }
};

const filteredFiles = computed(() => {
  return files.value.filter(file => file.groupId === activeTab.value);
});

const downloadFile = async (file: FileFormModel) => {
  await filesStore.downloadFile(file.id);
}
const confirmDelete = async (file: FileFormModel) => {
  if (confirm(`Удалить файл?`)) {
    await filesStore.deleteFile(file.id);
  }
}
const openModal = () => {
  isModalOpenFile.value = true;
};
const closeModal = () => {
  isModalOpenFile.value = false;
  selectedFile.value = null;
};

const authenticationUser = computed(() => authStore.isAuthenticated);

watch(() => props.modelValue, async (newValue) => {
  if (newValue) {
    await filesStore.getFiles();
  }
}, { immediate: true });
</script>
<style scoped lang="scss">
.files {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  max-height: calc(100vh - 64px);
  overflow-y: auto;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background: linear-gradient(135deg, #1e3c2c, #2a5a3a);
    &-title {
      font-size: 1.2rem;
      font-weight: 600;
      color: white;
      margin: 0;
    }
    &-actions {
      display: flex;
      gap: 8px;
    }
    &-close, &-upload {
      color: white !important;
      background: rgba(255, 255, 255, 0.1) !important;
      &:hover {
        background: rgba(255, 255, 255, 0.2) !important;
      }
    }
  }
  &__content {
    padding: 24px;
    min-height: 200px;
    color: #1e3c2c;
  }
}
/* Анимация */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>
