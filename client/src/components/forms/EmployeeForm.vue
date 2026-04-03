<template>
  <VCard>
    <div div class="employee-form">
      <div class="employee-form__header">
        <h2 class="employee-form__title">{{ formTitle }}</h2>
      </div>
      <AlertMessage />
      <VForm @submit.prevent="onSubmitForm">
        <div class="employee-form__content">
          <TextField
            v-model="employee.cabinet"
            label="№ кабинета"
            placeholder="Например: 101"
            icon="mdi-door"
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
            :error-messages="v.cityPhone.$errors.map((e: any) => e.$message)"
            :error="v.cityPhone.$error"
            @blur="v.cityPhone.$touch"
          />
          <TextField
            v-model="employee.mobilePhone"
            label="Мобильный номер"
            v-mask="'+7 (###) ###-##-##'"
            placeholder="Например: 8 927 000 00 00"
            icon="mdi-cellphone"
            :readonly="disabled"
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
            icon="mdi-office-building"
            :error-messages="v.departmentId.$errors.map((e: any) => e.$message)"
            :error="v.departmentId.$error"
            @blur="v.departmentId.$touch"
          />
          <TextField
            v-if="formType !== FormTypes.SHOW"
            v-model="employee.sortOrder"
            label="Приоритет сортировки"
            placeholder="999"
            icon="mdi-sort-numeric-ascending"
            :readonly="disabled"
            :error-messages="v.sortOrder.$errors.map((e: any) => e.$message)"
            :error="v.sortOrder.$error"
            @blur="v.sortOrder.$touch"
          />
        </div>
        <div class="employee-form__actions">
          <ButtonComponent
            @click="cancelAction"
            title="Отмена"
            buttonType="cancel"
          />
          <ButtonComponent
            v-if="formType !== FormTypes.SHOW"
            title="Сохранить"
            type="submit"
            buttonType="save"
          />
        </div>
      </VForm>
    </div>
  </VCard>
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
import AlertMessage from '../widgets/AlertMessage.vue';
import ButtonComponent from '../ButtonComponent.vue';

const store = useEmployeesStore();
const departmentStore = useDepartmentStore();
const departmentsList = computed(() => departmentStore.list);
const alertStore = useAlertStore();
interface employeeProps {
  data?: EmployeeFormModel;
  formType: FormTypes;
  id?: number;
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
  departmentId: undefined,
  sortOrder: 999,
});
const employee = ref<EmployeeFormModel>(props.data ? { ...props.data } : createEmployee());
const v = useVuelidate(employeeRules, employee);
const disabled = computed(() => props.formType === FormTypes.SHOW);

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

const cancelAction = () => {
  emit('cancel');
};

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
      await store.updateEmployee(props.id, employee.value);
    } else if (props.formType === FormTypes.ADD) {
      await store.addEmployees(employee.value);
    }
    emit('cancel');
  } catch (error) {
    console.error('Ошибка при сохранении:', error);
  }
};
</script>

<style lang="scss">
.employee-form {
  display: flex;
  flex-direction: column;
  background: #ffffff;

  &__header {
    padding: 24px 28px 16px;
    background: linear-gradient(135deg, #FDF5F5, #FCE9E9);
    border-bottom: 1px solid #E5C7C7;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #722F37;
    margin: 0 0 4px 0;
  }

  &__content {
    padding: 28px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    padding: 20px 28px 28px;
    background: #FDF5F5;
  }
}
</style>
