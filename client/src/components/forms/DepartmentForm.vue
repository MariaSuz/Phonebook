<template>
  <BaseForm
    :title="formTitle"
    :form-type="formType"
    :is-loading="isLoading"
    :progress="isLoading"
    @cancel="emit('cancel')"
    @submit="onSubmitForm"
  >
    <template v-slot:header>
      <div class="department-form__eyebrow">{{ eyebrowText }}</div>
      <h2 class="department-form__title font-heading">
        {{ formType === FormTypes.ADD ? 'Добавление отдела' : (department.name || 'Новый отдел') }}
      </h2>
      <div
        v-if="employeeCountLabel"
        class="department-form__subtitle"
      >
        {{ employeeCountLabel }}
      </div>
    </template>
    <TextField
      v-model="department.name"
      label="Наименование отдела"
      placeholder="Например: Бухгалтерия"
      icon="mdi-office-building"
      :readonly="disabled"
      :disabled="isLoading"
      :error-messages="v.name.$errors.map((e: any) => e.$message)"
      :error="v.name.$error"
      @blur="v.name.$touch"
    />
    <div class="department-form__row">
      <TextField
        v-model.number="department.sortOrder"
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
      <p class="department-form__hint">
        Чем меньше число, тем выше отдел в списке. По умолчанию 999.
      </p>
    </div>
    <div
      v-if="previewList.length"
      class="department-form__preview"
    >
      <div class="department-form__preview-label">Сейчас в списке</div>
      <div
        v-for="item in previewList"
        :key="item.id ?? 'current'"
        class="department-form__preview-item"
        :class="{ 'department-form__preview-item--current': item.isCurrent }"
      >
        {{ item.sortOrder }} · {{ item.name || '(без названия)' }}
      </div>
    </div>
  </BaseForm>
</template>

<script setup lang="ts">
import { useDepartmentStore } from '@/store/departmentsStore';
import { useEmployeesStore } from '@/store/employeesStore';
import type { DepartmentFormModel } from '@/logic/types/forms/DepartmentFormModel';
import { FormTypes } from '@/logic/types/FormTypes';
import { computed, ref } from 'vue';
import TextField from '../inputs/TextField.vue';
import { useVuelidate } from '@vuelidate/core';
import { departmentRules } from '@/logic/validation/departmentValidation';
import { useAlertStore } from '@/store/alertStore';
import { pluralizeRu } from '@/logic/utils/pluralize';
import BaseForm from './BaseForm.vue';

const store = useDepartmentStore();
const employeesStore = useEmployeesStore();
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
const isLoading = ref(false);

const eyebrowText = computed(() => {
  switch (props.formType) {
    case FormTypes.EDIT:
      return 'Редактирование отдела';
    case FormTypes.ADD:
      return 'Новый отдел';
    default:
      return 'Просмотр отдела';
  }
});

const employeeCountLabel = computed(() => {
  if (!department.value.id) return '';
  const count = employeesStore.list.filter(e => e.departmentId === department.value.id).length;
  return `${count} ${pluralizeRu(count, ['сотрудник', 'сотрудника', 'сотрудников'])}`;
});

const previewList = computed(() => {
  const others = store.list.filter(d => d.id !== department.value.id);
  const current = {
    ...department.value,
    sortOrder: department.value.sortOrder ?? 999,
    isCurrent: true,
  };
  const merged = [
    ...others.map(d => ({ ...d, isCurrent: false })),
    current,
  ];
  merged.sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999) || a.name.localeCompare(b.name));
  const index = merged.findIndex(item => item.isCurrent);
  const start = Math.max(0, index - 1);
  return merged.slice(start, start + 3);
});

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
      await store.updateDepartment(department.value.id, department.value);
    } else if (props.formType === FormTypes.ADD) {
      await store.createDepartment(department.value);
    }
    emit('cancel');
  } catch (error) {
    console.error('Ошибка при добавлении:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors';

.department-form {
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

  &__row {
    display: flex;
    align-items: center;
    gap: 16px;

    :deep(.text-field) {
      flex: 0 0 160px;
    }
  }

  &__hint {
    flex: 1;
    margin: 0;
    font-size: 0.85rem;
    color: $color-secondary-text;
  }

  &__preview {
    padding: 12px 16px;
    background: $color-bg-muted;
    border-radius: 4px;
  }

  &__preview-label {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: $color-secondary-text;
    margin-bottom: 8px;
  }

  &__preview-item {
    font-size: 0.9rem;
    color: $color-secondary-text;
    padding: 2px 0;

    &--current {
      color: $color-primary-text;
      font-weight: 700;
    }
  }
}
</style>
