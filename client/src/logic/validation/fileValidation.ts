import { helpers, required } from '@vuelidate/validators';

export const fileRules = {
  group: {
    required: helpers.withMessage('Обязателено для заполнения', required),
  },
};
