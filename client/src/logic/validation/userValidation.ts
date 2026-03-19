import { helpers, required, minLength } from '@vuelidate/validators';

export const userRules = {
  userName: {
    required: helpers.withMessage(
      'Имя пользователя обязательно для заполнения',
      required,
    ),
    minLength: helpers.withMessage(
      'Логин должен содержать минимум 2 символа',
      minLength(2),
    ),
    // запрет на пробелы
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
      'Пароль должен содержать минимум 2 символа',
      minLength(2),
    ),
    // нет пробелов
    noSpaces: helpers.withMessage(
      'Пароль не может содержать пробелы',
      (value: string) => !value || !/\s/.test(value),
    ),
  },
};
