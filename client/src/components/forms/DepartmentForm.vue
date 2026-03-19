<template>
  <VCard>
    <div class="department-form">
      <div class="department-form__header">
        <div class="department-form__title">{{ formTitle }}</div>
      </div>
      <AlertMessage />
      <VForm @submit.prevent="onSubmitForm">
        <div class="department-form__content">
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
        </div>
        <VDivider class="department-form__divider" />
        <div class="department-form__actions">
          <VBtn
            @click="cancelAction"
            class="department-form__actions__btn department-form__actions__btn--cancel"
          >
            Отмена
          </VBtn>
          <VBtn
            v-if="formType !== formType.SHOW"
            class="department-form__actions__btn department-form__actions__btn--save"
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
import { useDepartmentStore } from '@/store/departmentsStore';
import type { DepartmentFormModel } from '@/logic/types/forms/DepartmentFormModel';
import { FormTypes } from '@/logic/types/FormTypes';
import { computed, ref } from 'vue';
import TextField from '../inputs/TextField.vue';
import AlertMessage from '../widgets/AlertMessage.vue';
import { useVuelidate } from '@vuelidate/core';
import { departmentRules } from '@/logic/validation/departmentValidation';
import { useAlertStore } from '@/store/alertStore';

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

const cancelAction = () => {
  emit('cancel');
};

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

<style lang="scss">
.department-form {
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
