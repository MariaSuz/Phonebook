<template>
  <BaseForm
    :title="formTitle"
    :form-type="formType"
    :is-loading="isLoading"
    @cancel="emit('cancel')"
    @submit="onSubmitForm"
  >
    <template v-slot:header>
      <div class="file-form__eyebrow">{{ eyebrowText }}</div>
      <h2 class="file-form__title font-heading">{{ titleText }}</h2>
    </template>
    <input
      ref="fileInputRef"
      type="file"
      class="file-form__native-input"
      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
      @change="onFileInputChange"
    />
    <div v-if="!file.fileContent">
      <div
        class="file-form__dropzone"
        :class="{
          'file-form__dropzone--over': isDragOver,
          'file-form__dropzone--error': v.fileContent.$error,
        }"
        @click="openFilePicker"
        @dragover.prevent="isDragOver = true"
        @dragleave.prevent="isDragOver = false"
        @drop.prevent="onDrop"
      >
        <VIcon icon="mdi-tray-arrow-up" size="28" />
        <p class="file-form__dropzone-title">Перетащите файл или выберите на диске</p>
        <p class="file-form__dropzone-hint">PDF, DOC, DOCX, XLS, XLSX, TXT или изображение · до 20 МБ</p>
      </div>
      <p
        v-if="v.fileContent.$error"
        class="file-form__field-error"
      >
        <VIcon icon="mdi-alert-circle-outline" size="14" />
        {{ v.fileContent.$errors[0].$message }}
      </p>
    </div>
    <div
      v-else
      class="file-form__file"
    >
      <VIcon icon="mdi-file-document-outline" size="24" color="primary" />
      <div class="file-form__file-info">
        <div class="file-form__file-name">{{ file.fileContent.name }}</div>
        <div
          v-if="!isLoading"
          class="file-form__file-meta"
        >
          {{ fileExtension }} · {{ formattedSize }}
        </div>
      </div>
      <div
        v-if="!isLoading"
        class="file-form__file-actions"
      >
        <ButtonComponent
          title="Заменить"
          buttonType="cancel"
          @click="openFilePicker"
        />
        <VBtn
          class="file-form__file-remove"
          icon="mdi-close"
          variant="text"
          size="small"
          @click="removeFile"
        />
      </div>
      <div
        v-else
        class="file-form__file-progress-text"
      >
        {{ formatSize(uploadedBytes) }} / {{ formattedSize }}
      </div>
    </div>
    <div class="file-form__field">
      <TextField
        v-model="file.fileName"
        label="Имя файла"
        placeholder="Например: Правила безопасности"
        icon="mdi-file-outline"
        :disabled="isLoading"
        :readonly="disabled"
      />
      <p class="file-form__hint">Так документ будет называться в списке</p>
    </div>
    <Select
      v-model="file.groupId"
      label="Группа документов"
      :items="groupOptions"
      item-title="title"
      item-value="value"
      placeholder="Выберите группу"
      icon="mdi-folder-outline"
      :disabled="isLoading"
      :readonly="disabled"
      :error-messages="v.groupId.$errors.map((e: any) => e.$message)"
      :error="v.groupId.$error"
      @blur="v.groupId.$touch"
    />
    <TextField
      v-model="file.description"
      label="Описание"
      placeholder="Необязательно"
      icon="mdi-format-align-left"
      :disabled="isLoading"
      :readonly="disabled"
    />
  </BaseForm>
</template>

<script setup lang="ts">
import type { FileUploadModel } from '@/logic/types/forms/FileFormModel';
import { FormTypes } from '@/logic/types/FormTypes';
import { computed, ref } from 'vue';
import TextField from '../inputs/TextField.vue';
import Select from '../inputs/Select.vue';
import { useVuelidate } from '@vuelidate/core';
import { fileRules } from '@/logic/validation/fileValidation';
import { useAlertStore } from '@/store/alertStore';
import { useFileStore } from '@/store/filesStore';
import BaseForm from './BaseForm.vue';
import ButtonComponent from '../buttons/ButtonComponent.vue';

const store = useFileStore();
interface fileProps {
  formType: FormTypes;
}

const props = defineProps<fileProps>();
const alertStore = useAlertStore();

const createfile = (): FileUploadModel => ({
  fileName: '',
  fileContent: null,
  description: '',
  groupId: null,
});
const file = ref<FileUploadModel>(createfile());
const v = useVuelidate(fileRules, file);
const emit = defineEmits(['cancel']);
const isLoading = ref(false);
const disabled = computed(() => props.formType === FormTypes.SHOW);

const fileInputRef = ref<HTMLInputElement | null>(null);
const isDragOver = ref(false);
const uploadedBytes = ref(0);

const groupOptions = [
  { title: 'Техническое обслуживание', value: 1 },
  { title: 'Нормативно-правовые документы', value: 2 },
  { title: 'Методические рекомендации по Противодествию коррупции', value: 3 },
];

const formTitle = computed(() => {
   switch (props.formType) {
    case FormTypes.ADD:
      return `Добавление нового документа`;
    default:
      return `Просмотр документа`;
  };
});

const eyebrowText = computed(() =>
  props.formType === FormTypes.ADD ? 'Новый документ' : 'Документ',
);

const titleText = computed(() =>
  props.formType === FormTypes.ADD ? 'Добавление документа' : (file.value.fileName || 'Просмотр документа'),
);

const formatSize = (bytes: number) => {
  if (!bytes) return '0 Б';
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

const fileExtension = computed(() => {
  const name = file.value.fileContent?.name ?? '';
  const ext = name.split('.').pop();
  return ext ? ext.toUpperCase() : '—';
});

const formattedSize = computed(() => formatSize(file.value.fileContent?.size ?? 0));

const progressPercent = computed(() => {
  const total = file.value.fileContent?.size ?? 0;
  if (!total) return 0;
  return Math.min(100, Math.round((uploadedBytes.value / total) * 100));
});

const applyFile = (selected: File | null) => {
  file.value.fileContent = selected;
  v.value.fileContent.$touch();
};

const openFilePicker = () => {
  if (isLoading.value || disabled.value) return;
  fileInputRef.value?.click();
};

const onFileInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  applyFile(target.files?.[0] ?? null);
  target.value = '';
};

const onDrop = (event: DragEvent) => {
  isDragOver.value = false;
  const dropped = event.dataTransfer?.files?.[0] ?? null;
  if (dropped) applyFile(dropped);
};

const removeFile = () => {
  file.value.fileContent = null;
  v.value.fileContent.$reset();
};

const onSubmitForm = async () => {
  if (isLoading.value) return;
  alertStore.clear();
  v.value.$reset();
  const isValid = await v.value.$validate();
  if (!isValid) {
    // Показываем все ошибки
    v.value.$touch();
    return;
  }
  isLoading.value = true;
  uploadedBytes.value = 0;
  try {
    if (props.formType === FormTypes.ADD) {
      await store.uploadFile(
        {
          fileName: file.value.fileName,
          fileContent: file.value.fileContent,
          description: file.value.description,
          groupId: file.value.groupId,
        },
        (loaded) => { uploadedBytes.value = loaded; },
      );
    emit('cancel');
    }
  } catch (error) {
    console.error('Ошибка при добавлении:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors';

.file-form {
  &__eyebrow {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: rgb(var(--v-theme-primary));
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    color: $color-primary-text;
    margin: 4px 0 0;
  }

  &__native-input {
    display: none;
  }

  &__dropzone {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 6px;
    padding: 32px 20px;
    border: 1px dashed $color-line;
    border-radius: 4px;
    color: $color-secondary-text;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: rgb(var(--v-theme-primary));
      background: $color-bg-muted;
    }

    &--over {
      border-color: rgb(var(--v-theme-primary));
      background: $color-bg-muted;
      color: rgb(var(--v-theme-primary));
    }

    &--error {
      border-color: rgb(var(--v-theme-error));
    }
  }

  &__dropzone-title {
    margin: 4px 0 0;
    font-weight: 600;
    color: $color-primary-text;
  }

  &__dropzone-hint {
    margin: 0;
    font-size: 0.8rem;
    color: $color-secondary-text;
  }

  &__field-error {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 8px 0 0;
    font-size: 0.8rem;
    color: rgb(var(--v-theme-error));
  }

  &__file {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border: 1px solid $color-line;
    border-radius: 4px;
    background: $color-bg-muted;
  }

  &__file-info {
    flex: 1;
    min-width: 0;
  }

  &__file-name {
    font-weight: 600;
    color: $color-primary-text;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__file-meta {
    font-size: 0.8rem;
    color: $color-secondary-text;
  }

  &__file-actions {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }

  &__file-remove {
    color: $color-secondary-text !important;
  }

  &__file-progress {
    margin-top: 6px;
    height: 4px;
    border-radius: 4px;
    background: $color-line;
    overflow: hidden;
  }

  &__file-progress-fill {
    height: 100%;
    background: rgb(var(--v-theme-primary));
    transition: width 0.2s ease;
  }

  &__file-progress-text {
    flex-shrink: 0;
    font-size: 0.8rem;
    color: $color-secondary-text;
  }

  &__hint {
    margin: 6px 0 0;
    font-size: 0.8rem;
    color: $color-secondary-text;
  }
}
</style>
