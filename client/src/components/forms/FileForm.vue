<template>
  <BaseForm
    :title="formTitle"
    :form-type="formType"
    @cancel="emit('cancel')"
    @submit="onSubmitForm"
  >
    <TextField
      v-model="file.fileName"
      label="Имя файла"
      placeholder="Например: Правила безопасности"
      icon="mdi-office-building"
    />
    <VFileInput
      v-model="file.fileContent"
      :label="file.fileContent ? 'Файл выбран' : 'Выберите файл'"
      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
      :multiple="false"
      :error-messages="v.fileContent.$errors.map((e: any) => e.$message)"
      :error="v.fileContent.$error"
      @blur="v.fileContent.$touch"
      @update:modelValue="() => v.fileContent.$touch()"
    />
    <TextField
      v-model="file.description"
      label="Описание (необязательно)"
      icon="mdi-sort-numeric-ascending"
    />
    <Select
      v-model="file.groupId"
      label="Выберите подразделение"
      :items="groupOptions"
      item-title="title"
      item-value="value"
      placeholder="Выберите подразделение"
      :error-messages="v.groupId.$errors.map((e: any) => e.$message)"
      :error="v.groupId.$error"
      @blur="v.groupId.$touch"
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
        fileName: file.value.fileName,
        fileContent: file.value.fileContent,
        description: file.value.description,
        groupId: file.value.groupId,
      });
    emit('cancel');
    }
  } catch (error) {
    console.error('Ошибка при добавлении:', error);
  }
};
</script>
