<template>
  <BaseForm
    :title="formTitle"
    :form-type="formType"
    :is-loading="isLoading"
    layout="flex"
    @cancel="emit('cancel')"
    @submit="onSubmitForm"
  >
    <template v-slot:header>
      <div class="employee-form__eyebrow">{{ formTitle }}</div>
      <h2 class="employee-form__title font-heading">
        {{ employee.fullName || 'Новый пользователь' }}
      </h2>
      <div
        v-if="departmentName"
        class="employee-form__subtitle"
      >
        {{ departmentName }}
      </div>
    </template>
    <div class="employee-form__section">
      <div class="employee-form__section-header">
        <span class="employee-form__section-title">Кто и где</span>
        <span class="employee-form__section-rule" />
      </div>
      <TextField
        v-model="employee.fullName"
        label="ФИО"
        placeholder="ФИО"
        icon="mdi-account"
        :readonly="disabled"
        :disabled="isLoading"
        :error-messages="v.fullName.$errors.map((e: any) => e.$message)"
        :error="v.fullName.$error"
        @blur="v.fullName.$touch"
      />
      <div class="employee-form__row employee-form__row--2">
        <TextField
          v-model="employee.position"
          label="Должность"
          placeholder="Например: Главный бухгалтер"
          icon="mdi-badge-account"
          :readonly="disabled"
          :disabled="isLoading"
        />
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
      </div>
      <Autocomplete
        v-model="employee.departmentId"
        label="Подразделение"
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
    </div>
    <div class="employee-form__section">
      <div class="employee-form__section-header">
        <span class="employee-form__section-title">Связь</span>
        <span class="employee-form__section-rule" />
      </div>
      <div class="employee-form__row employee-form__row--3">
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
      </div>
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
    </div>
    <div
      v-if="formType !== FormTypes.SHOW"
      class="employee-form__section"
    >
      <div class="employee-form__section-header">
        <span class="employee-form__section-title">Отображение</span>
        <span class="employee-form__section-rule" />
      </div>
      <div class="employee-form__row employee-form__row--sort">
        <TextField
          v-model.number="employee.sortOrder"
          type="number"
          :min="1"
          :max="999"
          label="Приоритет сортировки"
          placeholder="999"
          icon="mdi-sort-numeric-ascending"
          :readonly="disabled"
          :disabled="isLoading"
          :error-messages="v.sortOrder.$errors.map((e: any) => e.$message)"
          :error="v.sortOrder.$error"
          @blur="v.sortOrder.$touch"
        />
        <p class="employee-form__hint">
          Чем меньше число, тем выше сотрудник в списке отдела. По умолчанию 999.
        </p>
      </div>
    </div>
  </BaseForm>
</template>

<script setup lang="ts">
import { useDepartmentStore } from '@/store/departmentsStore';
import { FormTypes } from '@/logic/types/FormTypes';
import type { EmployeeFormModel } from '@/logic/types/forms/EmployeeFormModel';
import { useEmployeesStore } from '@/store/employeesStore';
import { ref, computed } from 'vue';
import TextField from '../inputs/TextField.vue';
import Autocomplete from '../inputs/Autocomplete.vue';
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

const departmentName = computed(() => {
  return departmentsList.value.find(d => d.id === employee.value.departmentId)?.name ?? '';
});

const formTitle = computed(() => {
  switch (props.formType) {
    case FormTypes.EDIT:
      return 'Редактирование пользователя';
    case FormTypes.ADD:
      return 'Добавление пользователя';
    default:
      return 'Просмотр пользователя';
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

<style scoped lang="scss">
@import '@/styles/colors';

.employee-form {
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

  &__subtitle {
    font-size: 0.85rem;
    color: $color-secondary-text;
    margin-top: 4px;
  }

  &__section {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__section-header {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__section-title {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: $color-secondary-text;
    white-space: nowrap;
  }

  &__section-rule {
    flex: 1;
    height: 1px;
    background: $color-line;
  }

  &__row {
    display: flex;
    gap: 16px;

    > * {
      flex: 1;
      min-width: 0;
    }

    &--sort {
      align-items: center;
    }
  }

  &__hint {
    margin: 0;
    font-size: 0.85rem;
    color: $color-secondary-text;
  }
}
</style>
