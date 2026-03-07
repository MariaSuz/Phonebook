import { helpers, required, minLength } from '@vuelidate/validators';

export const loginRules = {
  userName: {
    required: helpers.withMessage(
      'Логин обязателен для заполнения',
      required,
    ),
    minLength: helpers.withMessage(
      'Логин должен содержать минимум 3 символа',
      minLength(3),
    ),
    // Кастомное правило: только буквы, цифры
    validFormat: helpers.withMessage(
      'Логин может содержать только буквы и цифры',
      (value: string) => !value || /^[a-zA-Z0-9]+$/.test(value),
    ),
    // Кастомное правило: запрет на пробелы
    noSpaces: helpers.withMessage(
      'Логин не может содержать пробелы',
      (value: string) => !value || !/\s/.test(value),
    ),
  },
  password: {
    required: helpers.withMessage(
      'Пароль обязателен для заполнения',
      required,
    ),
    minLength: helpers.withMessage(
      'Пароль должен содержать минимум 6 символов',
      minLength(6),
    ),
    // Кастомное правило: нет пробелов
    noSpaces: helpers.withMessage(
      'Пароль не может содержать пробелы',
      (value: string) => !value || !/\s/.test(value),
    ),
  },
};
