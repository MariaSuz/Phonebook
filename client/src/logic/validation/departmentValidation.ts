import {
  helpers,
  required,
  minLength,
  between,
} from '@vuelidate/validators';

export const departmentRules = {
  name: {
    required: helpers.withMessage(
      'Наименование отдела обязателено для заполнения',
      required,
    ),
    validFormat: helpers.withMessage(
      'Наименование отдела может содержать только буквы',
      (value: string) => !value || /^[a-zA-Zа-яА-Я\s-]+$/.test(value),
    ),
    minLength: helpers.withMessage(
      'Наименование отдела должно содержать минимум 2 символа',
      minLength(2),
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
