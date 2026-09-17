<template>
  <div class="documents">
    <Breadcrumbs current="Документы" />
    <div class="documents__header">
      <h1 class="documents__title font-heading">Документы</h1>
      <ButtonComponent
        v-if="authenticationUser"
        prepend-icon="mdi-upload"
        title="Загрузить документ"
        buttonType="save"
        @click="openAddModal"
      />
    </div>
    <div class="documents__body">
      <aside class="documents__sidebar">
        <div class="documents__sidebar-label">Группы</div>
        <button
          v-for="group in groupsWithCounts"
          :key="group.value"
          type="button"
          class="documents__sidebar-item"
          :class="{ 'documents__sidebar-item--active': activeGroup === group.value }"
          @click="activeGroup = group.value"
        >
          <span>{{ group.title }}</span>
          <span class="documents__sidebar-count">{{ group.count }}</span>
        </button>
      </aside>
      <div class="documents__main">
        <div class="documents__toolbar">
          <SearchInput
            v-model="searchValue"
            label="Поиск по названию документа"
            clearable
          />
        </div>
        <div class="documents__group-header">
          <span class="documents__group-title">{{ currentGroupTitle }}</span>
          <span class="documents__group-count">{{ filteredFiles.length }} файлов</span>
        </div>
        <table
          v-if="filteredFiles.length"
          class="documents__table"
        >
          <thead>
            <tr>
              <th>Название</th>
              <th>Формат</th>
              <th>Размер</th>
              <th class="documents__table-actions">Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="file in filteredFiles"
              :key="file.id"
            >
              <td>
                <div class="documents__table-name">
                  <VIcon
                    icon="mdi-file-document-outline"
                    size="20"
                    color="primary"
                  />
                  <span :title="file.fileName">{{ file.fileName }}</span>
                </div>
              </td>
              <td>
                <span class="documents__table-format">{{ getExtension(file) }}</span>
              </td>
              <td>{{ formatSize(file.sizeBytes) }}</td>
              <td class="documents__table-actions">
                <VIcon
                  icon="mdi-download"
                  size="18"
                  class="documents__table-icon"
                  title="Скачать"
                  @click="downloadFile(file)"
                />
                <VIcon
                  v-if="authenticationUser"
                  icon="mdi-delete"
                  size="18"
                  class="documents__table-icon"
                  title="Удалить"
                  @click="deleteFile(file)"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div
          v-else
          class="documents__empty"
        >
          <VIcon icon="mdi-file-document-outline" size="40" />
          <p>Нет документов</p>
        </div>
        <div
          v-if="authenticationUser && activeGroup !== ALL_GROUP"
          class="documents__dropzone"
          :class="{ 'documents__dropzone--over': isDragOver }"
          @dragover.prevent="isDragOver = true"
          @dragleave.prevent="isDragOver = false"
          @drop.prevent="onDrop"
        >
          <VIcon icon="mdi-tray-arrow-up" size="18" />
          <span>Перетащите файл сюда, чтобы загрузить его в эту группу</span>
        </div>
      </div>
    </div>
    <FormModal
      v-model="modals.add"
      :form-component="FileForm"
      :form-type="FormTypes.ADD"
      width="560"
      @cancel="closeModal"
    />
    <ComfirmDelete
      v-model="modals.delete"
      :title="selectedFile?.fileName"
      :subtitle="deleteSubtitle"
      @confirm="confirmDelete"
      @cancel="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { useFileStore } from '@/store/filesStore';
import type { FileFormModel } from '@/logic/types/forms/FileFormModel';
import { computed, onMounted, reactive, ref } from 'vue';
import Breadcrumbs from '@/components/buttons/Breadcrumbs.vue';
import FileForm from '@/components/forms/FileForm.vue';
import { FormTypes } from '@/logic/types/FormTypes';
import FormModal from '@/components/modals/FormModal.vue';
import ComfirmDelete from '@/components/modals/ComfirmDelete.vue';
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import SearchInput from '@/components/inputs/SearchInput.vue';
import { useAuthStore } from '@/store/authStore';
import { useRoute } from 'vue-router';

const route = useRoute();
const filesStore = useFileStore();
const authStore = useAuthStore();
const selectedFile = ref<FileFormModel | null>(null);
const modals = reactive({
  add: false,
  delete: false,
});

const ALL_GROUP = 0;
const groupOptions = [
  { title: 'Техническое обслуживание', value: 1 },
  { title: 'Нормативно-правовые документы', value: 2 },
  { title: 'Методические рекомендации по противодействию коррупции', value: 3 },
];

const activeGroup = ref<number>(ALL_GROUP);
const searchValue = ref(typeof route.query.q === 'string' ? route.query.q : '');

const authenticationUser = computed(() => authStore.isAuthenticated);

const MIME_EXTENSIONS: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/vnd.ms-excel': 'XLS',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
};

const getExtension = (file: FileFormModel) => {
  const source = file.originalFileName || file.fileName;
  const parts = source.split('.');
  if (parts.length > 1) {
    const ext = parts.pop()!.toUpperCase();
    if (ext.length <= 5) return ext;
  }
  if (file.contentType && MIME_EXTENSIONS[file.contentType]) {
    return MIME_EXTENSIONS[file.contentType];
  }
  return '—';
};

const groupsWithCounts = computed(() => [
  { title: 'Все документы', value: ALL_GROUP, count: filesStore.list.length },
  ...groupOptions.map(group => ({
    ...group,
    count: filesStore.list.filter(file => file.groupId === group.value).length,
  })),
]);

const currentGroupTitle = computed(() => {
  return groupsWithCounts.value.find(group => group.value === activeGroup.value)?.title ?? '';
});

const groupFilteredFiles = computed(() => {
  if (activeGroup.value === ALL_GROUP) return filesStore.list;
  return filesStore.list.filter(file => file.groupId === activeGroup.value);
});

const deleteSubtitle = computed(() => {
  if (!selectedFile.value) return '';
  return [getExtension(selectedFile.value), formatSize(selectedFile.value.sizeBytes)].filter(Boolean).join(' · ');
});

const filteredFiles = computed(() => {
  const term = searchValue.value.trim().toLowerCase();
  return groupFilteredFiles.value.filter(file => {
    return !term || file.fileName.toLowerCase().includes(term);
  });
});

const downloadFile = async (file: FileFormModel) => {
  await filesStore.downloadFile(file.id!);
};
const deleteFile = async (file: FileFormModel) => {
  selectedFile.value = file;
  modals.delete = true;
};
const confirmDelete = async () => {
  if (selectedFile.value?.id) {
    await filesStore.deleteFile(selectedFile.value.id);
  }
};
const openAddModal = () => {
  modals.add = true;
};
const closeModal = () => {
  modals.add = false;
  modals.delete = false;
  selectedFile.value = null;
};

const isDragOver = ref(false);
const onDrop = async (event: DragEvent) => {
  isDragOver.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (!file || activeGroup.value === ALL_GROUP) return;
  await filesStore.uploadFile({
    fileName: file.name,
    fileContent: file,
    groupId: activeGroup.value,
  });
};

const formatSize = (bytes?: number | null) => {
  if (!bytes) return '—';
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

onMounted(async () => {
  await filesStore.getFiles();
});
</script>

<style scoped lang="scss">
@import '@/styles/colors';

.documents {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    color: $color-primary-text;
    margin: 0;
  }

  &__body {
    display: flex;
    align-items: flex-start;
    gap: 20px;
  }

  &__sidebar {
    width: 260px;
    flex-shrink: 0;
    background: rgb(var(--v-theme-surface));
    border: 1px solid $color-line;
    border-radius: 4px;
    padding: 16px;

    &-label {
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: $color-secondary-text;
      margin-bottom: 8px;
    }

    &-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 10px 12px;
      border: none;
      border-radius: 4px;
      background: transparent;
      color: $color-primary-text;
      font-size: 0.9rem;
      text-align: left;
      cursor: pointer;

      &:hover {
        background: $color-bg-muted;
      }

      &--active {
        background: $color-bg-muted;
        color: rgb(var(--v-theme-primary));
        font-weight: 600;
      }
    }

    &-count {
      color: $color-secondary-text;
      font-size: 0.8rem;
    }
  }

  &__main {
    flex: 1;
    min-width: 0;
  }

  &__toolbar {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;

    &-filter {
      max-width: 180px;
      flex-shrink: 0;
    }
  }

  &__group-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }

  &__group-title {
    font-weight: 600;
    color: $color-primary-text;
  }

  &__group-count {
    font-size: 0.8rem;
    color: $color-secondary-text;
    background: $color-bg-muted;
    padding: 2px 10px;
    border-radius: 20px;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    background: rgb(var(--v-theme-surface));
    border: 1px solid $color-line;
    border-radius: 4px;
    overflow: hidden;

    th {
      text-align: left;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      color: $color-secondary-text;
      padding: 12px 16px;
      border-bottom: 1px solid $color-line;
    }

    td {
      padding: 12px 16px;
      border-bottom: 1px solid $color-line;
      color: $color-primary-text;
      font-size: 0.9rem;
    }

    tr:last-child td {
      border-bottom: none;
    }
  }

  &__table-name {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__table-format {
    color: rgb(var(--v-theme-primary));
    font-weight: 600;
    font-size: 0.8rem;
  }

  &__table-actions {
    text-align: right;
    white-space: nowrap;
  }

  &__table-icon {
    color: $color-secondary-text;
    cursor: pointer;
    margin-left: 12px;
    transition: color 0.2s ease;

    &:hover {
      color: rgb(var(--v-theme-primary));
    }
  }

  &__empty {
    text-align: center;
    padding: 60px 20px;
    color: $color-secondary-text;
    background: rgb(var(--v-theme-surface));
    border: 1px solid $color-line;
    border-radius: 4px;

    p {
      margin: 12px 0 0;
      font-size: 0.9rem;
    }
  }

  &__dropzone {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 12px;
    padding: 16px;
    border: 1px dashed $color-line;
    border-radius: 4px;
    color: $color-secondary-text;
    font-size: 0.85rem;

    &--over {
      border-color: rgb(var(--v-theme-primary));
      color: rgb(var(--v-theme-primary));
      background: $color-bg-muted;
    }
  }
}
</style>
