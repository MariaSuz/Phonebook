<template>
  <BaseForm
    :title="formTitle"
    :form-type="formType"
    :is-loading="isLoading"
    layout="grid"
    @cancel="emit('cancel')"
    @submit="onSubmitForm"
  >
    <TextField
      v-model="employee.cabinet"
      label="№ кабинета"
      placeholder="Например: 101"
      icon="mdi-door"
      :disabled="isLoading"
      :readonly="disabled"
      :error-messages="v.cabinet.$errors.map((e: any) => e.$message)"
      :error="v.cabinet.$error"
      @blur="v.cabinet.$touch"
    />
    <TextField
      v-model="employee.position"
      label="Должность"
      placeholder="Например: Главный бухгалтер"
      icon="mdi-badge-account"
      :readonly="disabled"
      :disabled="isLoading"
      :error-messages="v.position.$errors.map((e: any) => e.$message)"
      :error="v.position.$error"
      @blur="v.position.$touch"
    />
    <TextField
      v-model="employee.fullName"
      label="ФИО"
      placeholder="Например: Иванов Иван Иванович"
      icon="mdi-account"
      :readonly="disabled"
      :disabled="isLoading"
      :error-messages="v.fullName.$errors.map((e: any) => e.$message)"
      :error="v.fullName.$error"
      @blur="v.fullName.$touch"
    />
    <TextField
      v-model="employee.internalPhone"
      label="Внутренний номер"
      placeholder="Например: 101"
      icon="mdi-phone"
      :readonly="disabled"
      :disabled="isLoading"
      :error-messages="v.internalPhone.$errors.map((e: any) => e.$message)"
      :error="v.internalPhone.$error"
      @blur="v.internalPhone.$touch"
    />
    <TextField
      v-model="employee.cityPhone"
      label="Городской номер"
      placeholder="Например: 340-00-00"
      icon="mdi-phone-classic"
      :readonly="disabled"
      :disabled="isLoading"
      :error-messages="v.cityPhone.$errors.map((e: any) => e.$message)"
      :error="v.cityPhone.$error"
      @blur="v.cityPhone.$touch"
    />
    <TextField
      v-model="employee.mobilePhone"
      label="Мобильный номер"
      v-maska="'8 (###) ###-##-##'"
      placeholder="Например: 8 927 000 00 00"
      icon="mdi-cellphone"
      :readonly="disabled"
      :disabled="isLoading"
      :error-messages="v.mobilePhone.$errors.map((e: any) => e.$message)"
      :error="v.mobilePhone.$error"
      @blur="v.mobilePhone.$touch"
    />
    <TextField
      v-model="employee.email"
      label="Электронная почта"
      type="email"
      placeholder="Например: ivanov.ii@opera-samara.net"
      icon="mdi-email"
      :readonly="disabled"
      :disabled="isLoading"
      :error-messages="v.email.$errors.map((e: any) => e.$message)"
      :error="v.email.$error"
      @blur="v.email.$touch"
    />
    <Select
      v-model="employee.departmentId"
      label="Выберите подразделение"
      :items="departmentsList"
      item-title="name"
      item-value="id"
      placeholder="Выберите подразделение"
      :readonly="disabled"
      :disabled="isLoading"
      icon="mdi-office-building"
      :error-messages="v.departmentId.$errors.map((e: any) => e.$message)"
      :error="v.departmentId.$error"
      @blur="v.departmentId.$touch"
    />
    <TextField
      v-if="formType !== FormTypes.SHOW"
      v-model.number="employee.sortOrder"
      type="number"
      label="Приоритет сортировки"
      placeholder="999"
      icon="mdi-sort-numeric-ascending"
      :readonly="disabled"
      :disabled="isLoading"
      :error-messages="v.sortOrder.$errors.map((e: any) => e.$message)"
      :error="v.sortOrder.$error"
      @blur="v.sortOrder.$touch"
    />
  </BaseForm>
</template>

<script setup lang="ts">
import { useDepartmentStore } from '@/store/departmentsStore';
import { FormTypes } from '@/logic/types/FormTypes';
import type { EmployeeFormModel } from '@/logic/types/forms/EmployeeFormModel';
import { useEmployeesStore } from '@/store/employeesStore';
import { ref, computed } from 'vue';
import TextField from '../inputs/TextField.vue';
import Select from '../inputs/Select.vue';
import { useAlertStore } from '@/store/alertStore';
import { useVuelidate } from '@vuelidate/core';
import { employeeRules } from '@/logic/validation/employeeValidation';
import BaseForm from './BaseForm.vue';
import { vMaska } from "maska/vue"

const store = useEmployeesStore();
const departmentStore = useDepartmentStore();
const departmentsList = computed(() => departmentStore.list);
const alertStore = useAlertStore();
interface employeeProps {
  data?: EmployeeFormModel;
  formType: FormTypes;
  id?: number;
  departmentId?: number;
}

const props = defineProps<employeeProps>();

const createEmployee = (): EmployeeFormModel => ({
  cabinet: '',
  position: '',
  fullName: '',
  internalPhone: '',
  cityPhone: '',
  mobilePhone: '',
  email: '',
  departmentId: props.departmentId,
  sortOrder: 999,
});
const employee = ref<EmployeeFormModel>(props.data ? { ...props.data } : createEmployee());
const v = useVuelidate(employeeRules, employee);
const disabled = computed(() => props.formType === FormTypes.SHOW);
const isLoading = ref(false);

const formTitle = computed(() => {
   switch (props.formType) {
    case FormTypes.EDIT:
      return `Редактирование пользователя ${employee.value.fullName}`;
    case FormTypes.ADD:
      return `Добавление нового пользователя`;
    default:
      return `Просмотр пользователя ${employee.value.fullName}`;
  };
});

const emit = defineEmits(['cancel']);

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
  try {
    if (props.formType === FormTypes.EDIT) {
      await store.updateEmployee(props.id, employee.value);
    } else if (props.formType === FormTypes.ADD) {
      await store.addEmployees(employee.value);
    }
    emit('cancel');
  } catch (error) {
    console.error('Ошибка при сохранении:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>