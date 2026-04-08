<template>
  <BaseForm
    :title="formTitle"
    :form-type="formType"
    @cancel="emit('cancel')"
    @submit="onSubmitForm"
  >
    <TextField
      v-model="department.name"
      label="Наименование отдела"
      placeholder="Например: Бухгалтерия"
      icon="mdi-office-building"
      :readonly="disabled"
      :error-messages="v.name.$errors.map((e: any) => e.$message)"
      :error="v.name.$error"
      @blur="v.name.$touch"
    />
    <TextField
      v-model="department.sortOrder"
      label="Приоритет сортировки"
      placeholder="999"
      icon="mdi-sort-numeric-ascending"
      :readonly="disabled"
      :error-messages="v.sortOrder.$errors.map((e: any) => e.$message)"
      :error="v.sortOrder.$error"
      @blur="v.sortOrder.$touch"
    />
  </BaseForm>
</template>

<script setup lang="ts">
import { useDepartmentStore } from '@/store/departmentsStore';
import type { DepartmentFormModel } from '@/logic/types/forms/DepartmentFormModel';
import { FormTypes } from '@/logic/types/FormTypes';
import { computed, ref } from 'vue';
import TextField from '../inputs/TextField.vue';
import { useVuelidate } from '@vuelidate/core';
import { departmentRules } from '@/logic/validation/departmentValidation';
import { useAlertStore } from '@/store/alertStore';
import BaseForm from './BaseForm.vue';

const store = useDepartmentStore();
interface DepartmentProps {
  data?: DepartmentFormModel;
  formType: FormTypes;
}

const props = defineProps<DepartmentProps>();
const alertStore = useAlertStore();

const createDepartment = (): DepartmentFormModel => ({
  name: '',
  sortOrder: 999,
});
const department = ref<DepartmentFormModel>(props.data ? { ...props.data } : createDepartment());
const v = useVuelidate(departmentRules, department);
const emit = defineEmits(['cancel']);
const disabled = computed(() => props.formType === FormTypes.SHOW);

const formTitle = computed(() => {
   switch (props.formType) {
    case FormTypes.EDIT:
      return `Редактирование отдела`;
    case FormTypes.ADD:
      return `Добавление нового отдела`;
    default:
      return `Просмотр отдела "${department.value.name}"`;
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
    if (props.formType === FormTypes.EDIT) {
      await store.updateDepartment(department.value.id, department.value);
    } else if (props.formType === FormTypes.ADD) {
      await store.createDepartment(department.value);
    }
    emit('cancel');
  } catch (error) {
    console.error('Ошибка при добавлении:', error);
  }
};
</script>
