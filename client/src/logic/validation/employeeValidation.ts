import {
  helpers,
  required,
  minLength,
  between,
} from '@vuelidate/validators';

export const employeeRules = {
  fullName: {
    required: helpers.withMessage('Имя обязателено для заполнения', required),
    validFormat: helpers.withMessage(
      'Имя может содержать только буквы и цифры',
      (value: string) => !value || /^[a-zA-Zа-яА-ЯёЁ0-9\s-]+$/.test(value),
    ),
    minLength: helpers.withMessage(
      'Имя должно содержать минимум 2 символа',
      minLength(2),
    ),
  },
  cabinet: {
    validFormat: helpers.withMessage(
      'Номер кабинета может содержать только цифры и буквы',
      (value: string) => !value || /^[a-zA-Zа-яА-ЯёЁ0-9]+$/.test(value),
    ),
  },
  position: {
    validFormat: helpers.withMessage(
      'Должность может содержать только буквы, пробелы и знаки .,:',
      (value: string) => !value || /^[a-zA-Zа-яА-Я\s.,:-]+$/.test(value),
    ),
  },
  internalPhone: {
    validFormat: helpers.withMessage(
      'Внутренний номер может содержать только цифры, "," и пробел',
      (value: string) => {
        if (!value) return true;
        if (/^[\s,]+$/.test(value)) return false;
        return /^[\d, ]+$/.test(value);
      },
    ),
  },
  cityPhone: {
    validFormat: helpers.withMessage(
      'Некорректный формат городского номера',
      (value: string) => !value || /^[\d\s\-()+,]+$/.test(value),
    ),
  },
  mobilePhone: {
    validFormat: helpers.withMessage(
      'Некорректный формат мобильного номера',
      (value: string) => !value || /^[\d\s-()+]+$/.test(value),
    ),
  },
  email: {
    validFormat: helpers.withMessage(
      'Некорректный электронный адрес',
      (value: string) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    ),
  },
  departmentId: {
    required: helpers.withMessage(
      'Подразделение обязателено для заполнения',
      required,
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
