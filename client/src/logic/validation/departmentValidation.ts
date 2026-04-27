import { useDepartmentStore } from '@/store/departmentsStore';
import {
  helpers,
  required,
  minLength,
  between,
} from '@vuelidate/validators';
import { computed } from 'vue';

const uniqueName = (value: string, siblings: any) => {
  if (!value) return true;
  const store = useDepartmentStore();
  const currentId = siblings?.id;
  const departmentList = computed(() => store.list);
  if (currentId) {
    return !departmentList.value.some(
      (dep) => dep.id !== currentId && dep.name === value,
    );
  } else {
    return !departmentList.value.some((dep) => dep.name === value);
  }
};

export const departmentRules = {
  name: {
    required: helpers.withMessage(
      'Наименование отдела обязателено для заполнения',
      required,
    ),
    minLength: helpers.withMessage(
      'Наименование отдела должно содержать минимум 2 символа',
      minLength(2),
    ),
    unique: helpers.withMessage(
      'Отдел с таким наименованием уже существует',
      uniqueName,
    ),
  },
  sortOrder: {
    validFormat: helpers.withMessage(
      'Приоритет сортировки может содержать только цифры',
      (value: string) => !value || /^\d+$/.test(value),
    ),
    between: helpers.withMessage(
      'Приоритет сортировки должен быть от 1 до 999',
      between(1, 999),
    ),
    numeric: helpers.withMessage(
      'Приоритет сортировки должен быть числом',
      (value: string) => !value || /^\d+$/.test(value),
    ),
  },
};
