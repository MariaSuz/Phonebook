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
            @click="openAddModal"
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
        <div class="files__grid">
          <div
            v-for="file in filteredFiles"
            :key="file.id"
            class="file-card"
            @click="downloadFile(file)"
          >
            <div class="file-card__preview">
              <VIcon
                icon="mdi-file-document"
                size="32"
                color="#B22222"
              />
              <VBtn
                v-if="authenticationUser"
                class="file-card__delete"
                @click.stop="deleteFile(file)"
                title="Удалить"
              >
                <VIcon icon="mdi-delete" size="16" />
              </VBtn>
            </div>
            <div class="file-card__name" :title="file.fileName">
              {{ file.fileName }}
            </div>
            <div v-if="file.sizeBytes" class="file-card__size">
              {{ formatSize(file.sizeBytes) }}
            </div>
          </div>
          <div v-if="filteredFiles.length === 0" class="files__empty">
            <VIcon icon="mdi-file-document-outline" size="48" color="#ccc" />
            <p>Нет документов</p>
          </div>
        </div>
      </div>
      <FormModal
        v-model="modals.add"
        :form-component="FileForm"
        :form-type="FormTypes.ADD"
        @cancel="closeModal"
      />
      <ComfirmDelete
        v-model="modals.delete"
        :title="selectedFile?.fileName"
        @confirm="confirmDelete"
        @cancel="closeModal"
    />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useFileStore } from '@/store/filesStore';
import type { FileFormModel } from '@/logic/types/forms/FileFormModel';
import { computed, reactive, ref, watch } from 'vue';
import FileForm from '../forms/FileForm.vue';
import { FormTypes } from '@/logic/types/FormTypes';
import FormModal from '../modals/FormModal.vue';
import FileTab from './FileTab.vue';
import { useAuthStore } from '@/store/authStore';
import ComfirmDelete from '../modals/ComfirmDelete.vue';


interface FilesProps {
  modelValue: boolean;
}

const props = defineProps<FilesProps>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const filesStore = useFileStore();
const authStore = useAuthStore();
const selectedFile = ref<FileFormModel | null>(null)
const activeTab = ref(1);
const modals = reactive({
  add: false,
  delete: false,
});

const closePanel = () => {
  if (!modals.add && !modals.delete) {
    emit('update:modelValue', false);
  }
};

const filteredFiles = computed(() => {
  return filesStore.list.filter(file => file.groupId === activeTab.value);
});

const downloadFile = async (file: FileFormModel) => {
  await filesStore.downloadFile(file.id!);
}
const deleteFile = async (file: FileFormModel) => {
  selectedFile.value = file;
  modals.delete = true;
}
const confirmDelete = async () => {
  if (selectedFile.value?.id) {
    await filesStore.deleteFile(selectedFile.value.id);
  }
}
const openAddModal = () => {
  modals.add = true;
};
const closeModal = () => {
  modals.add = false;
  modals.delete = false;
  selectedFile.value = null;
};

const authenticationUser = computed(() => authStore.isAuthenticated);

const formatSize = (bytes?: number) => {
  if (!bytes) return '';
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

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
  box-shadow: 0 10px 30px rgba(114, 47, 55, 0.25);
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
    background: linear-gradient(135deg, #722F37, #B22222);
    &-title {
      font-size: 1.2rem;
      font-weight: 600;
      color: white;
      margin: 0;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }
    &-actions {
      display: flex;
      gap: 8px;
    }
    &-close, &-upload {
      color: white !important;
      background: rgba(255, 255, 255, 0.15) !important;
      border-radius: 8px !important;
      transition: all 0.2s ease !important;
      &:hover {
        background: rgba(255, 255, 255, 0.25) !important;
        transform: scale(1.05);
      }
    }
  }
  &__content {
    padding: 24px;
    min-height: 200px;
  }
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 140px));
    gap: 20px;
    justify-content: center;
  }

  &__empty {
    grid-column: 1 / -1;
    text-align: center;
    padding: 60px 20px;
    color: #999;
    p {
      margin: 16px 0;
      font-size: 0.9rem;
    }
  }

  // Карточка файла
.file-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-4px);

    .file-card__preview {
      background: #f5f0f0;
      border-color: #C06060;
    }

    .file-card__delete {
      opacity: 1;
    }
  }

  &__preview {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    background: #fafafa;
    border: 2px solid #e5e5e5;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    margin-bottom: 8px;
  }

  &__delete {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 28px;
    height: 28px;
    background: rgba(255, 255, 255, 0.95);
    border: none;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #dc3545;
    opacity: 0;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &:hover {
      background: #dc3545;
      color: white;
      transform: scale(1.05);
    }
  }

  &__name {
    font-size: 0.8rem;
    font-weight: 500;
    color: #333;
    text-align: center;
    word-break: break-word;
    max-width: 100%;
    line-height: 1.3;
  }

  &__size {
    font-size: 0.7rem;
    color: #999;
    text-align: center;
    margin-top: 2px;
  }
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
