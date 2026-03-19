import { helpers, required } from '@vuelidate/validators';

const allowedTypes = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'text/plain',
  'application/msword',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.oasis.opendocument.spreadsheet',
];

const validFileType = (value: File | null) => {
  if (!value) return true;
  return allowedTypes.includes(value.type);
};

export const fileRules = {
  groupId: {
    required: helpers.withMessage('Обязателено для заполнения', required),
  },
  fileContent: {
    required: helpers.withMessage('Обязателено для заполнения', required),
    fileType: helpers.withMessage(
      'Неверный тип файла. Разрешены: PDF, JPG, PNG, TXT, Excel файлы, Word файлы',
      validFileType,
    ),
  },
};
