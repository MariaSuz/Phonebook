import { body } from 'express-validator';

export const fileValidator = [
  body('name')
    .notEmpty()
    .withMessage('Поле обязательно')
    .isLength({ min: 2, max: 100 })
    .withMessage('Наименование должно быть от 2 до 100 символов')
    .trim(),

  body('sortOrder')
    .optional()
    .isInt({ min: 0, max: 999 })
    .withMessage('Порядок сортировки должен быть неотрицательным числом и не выше 999')
    .toInt(),
];
