<template>
  <VCard>
    <div class="file-form">
      <div class="file-form__header">
        <div class="file-form__title">{{ formTitle }}</div>
      </div>
      <AlertMessage />
      <VForm @submit.prevent="onSubmitForm">
        <div class="file-form__content">
          <TextField
            v-model="file.fileName"
            label="Имя файла"
            placeholder="Например: Правила безопасности"
            icon="mdi-office-building"
          />
          <VFileInput
            v-model="selectedFile"
            :label="selectedFile ? 'Файл выбран' : 'Выберите файл'"
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
            @update:modelValue="fileUpload"
            :multiple="false"
          />
          <TextField
            v-model="file.description"
            label="Описание (необязательно)"
            icon="mdi-sort-numeric-ascending"
          />
          <Select
            v-model="file.group"
            label="Выберите подразделение"
            :items="groupOptions"
            item-title="title"
            item-value="value"
            placeholder="Выберите подразделение"
            :error-messages="v.group.$errors.map((e: any) => e.$message)"
            :error="v.group.$error"
            @blur="v.group.$touch"
          />
        </div>
        <VDivider class="file-form__divider" />
        <div class="file-form__actions">
          <VBtn
            @click="cancelAction"
            class="file-form__actions__btn file-form__actions__btn--cancel"
          >
            Отмена
          </VBtn>
          <VBtn
            v-if="formType !== formType.SHOW"
            class="file-form__actions__btn file-form__actions__btn--save"
            type="submit"
          >
            Сохранить
          </VBtn>
        </div>
      </VForm>
    </div>
  </VCard>
</template>

<script setup lang="ts">
import type { FileFormModel } from '@/logic/types/forms/FileFormModel';
import { FormTypes } from '@/logic/types/FormTypes';
import { computed, ref } from 'vue';
import TextField from '../inputs/TextField.vue';
import Select from '../inputs/Select.vue';
import AlertMessage from '../widgets/AlertMessage.vue';
import { useVuelidate } from '@vuelidate/core';
import { fileRules } from '@/logic/validation/fileValidation';
import { useAlertStore } from '@/store/alertStore';
import { useFileStore } from '@/store/filesStore';

const store = useFileStore();
interface fileProps {
  formType: FormTypes;
}

const props = defineProps<fileProps>();
const alertStore = useAlertStore();
const selectedFile = ref<File | null>(null);

const createfile = (): FileFormModel => ({
  fileName: '',
  description: '',
  group: null,
  fileContent: null,
  contentType: null,
  sizeBytes: null
});
const file = ref<FileFormModel>(createfile());
const v = useVuelidate(fileRules, file);
const emit = defineEmits(['cancel']);

const cancelAction = () => {
  emit('cancel');
};

const groupOptions = [
  { title: 'Документация основная', value: 1 },
  { title: 'Правила', value: 2 },
  { title: 'Инструкции', value: 3 },
  { title: 'Отчеты', value: 4 },
  { title: 'Прочее', value: 5 }
];

const formTitle = computed(() => {
   switch (props.formType) {
    case FormTypes.ADD:
      return `Добавление нового документа`;
    default:
      return `Просмотр документа`;
  };
});

const fileUpload = async (file: FileFormModel) => {
  selectedFile.value = file;
}

const onSubmitForm = async () => {
  alertStore.clear();
  const isValid = await v.value.$validate();
  if (!isValid) {
    // Показываем все ошибки
    v.value.$touch();
    return;
  }
  try {
    if (props.formType === FormTypes.ADD) {
      await store.uploadFile({
        fileContent: selectedFile.value,
        description: file.value.description
      });
    emit('cancel');
    }
  } catch (error) {
    console.error('Ошибка при добавлении:', error);
  }
};
</script>

<style lang="scss">
.file-form {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  &__header {
    padding: 24px 28px 16px;
    background: linear-gradient(135deg, #f8fff8, #f0f7f0);
    border-bottom: 1px solid #ddebe0;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e3c2c;
    margin: 0 0 4px 0;
    letter-spacing: -0.01em;
  }

  &__subtitle {
    font-size: 0.95rem;
    color: #5a7a6a;
    margin: 0;
  }

  &__content {
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  &__divider {
    margin: 0 28px;
    border-color: #ddebe0;
    opacity: 0.6;
  }
  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    padding: 20px 28px 28px;
    background: #fafffa;
      &__btn {
      border-radius: 30px !important;
      padding: 0 28px !important;
      height: 44px !important;
      font-weight: 600 !important;
      text-transform: none !important;
      letter-spacing: 0.3px !important;
        &--cancel {
          background: transparent !important;
          color: #5a7a6a !important;
          border: 1px solid #c0d6c0 !important;

          &:hover {
            background: #f0f7f0 !important;
            border-color: #7ccf7c !important;
          }
        }
        &--save {
          background: linear-gradient(135deg, #1e3c2c, #2a5a3a) !important;
          color: white !important;
          border: none !important;
          box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3) !important;
          &:hover {
            background: linear-gradient(135deg, #2a5a3a, #1e3c2c) !important;
            box-shadow: 0 6px 16px rgba(46, 125, 50, 0.4) !important;
          }
        }
      }
  }
}
</style>
