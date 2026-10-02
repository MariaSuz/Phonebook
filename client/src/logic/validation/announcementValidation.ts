import { helpers, maxLength, required } from '@vuelidate/validators';

const endsAfterStart = (value: string, siblings: any) => {
  if (!value || !siblings?.startsAt) return true;
  return new Date(value) > new Date(siblings.startsAt);
};

export const announcementRules = {
  message: {
    required: helpers.withMessage('Введите текст объявления', required),
    maxLength: helpers.withMessage('Не больше 200 символов', maxLength(200)),
  },
  startsAt: { required: helpers.withMessage('Укажите начало', required) },
  endsAt: {
    required: helpers.withMessage('Укажите окончание', required),
    after: helpers.withMessage(
      'Окончание должно быть позже начала',
      endsAfterStart,
    ),
  },
};
