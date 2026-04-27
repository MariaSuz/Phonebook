import { body } from 'express-validator';

export const employeeValidator = [
  body('departmentId')
    .notEmpty()
    .withMessage('ID отдела обязателен')
    .isInt()
    .withMessage('ID отдела должен быть числом'),

  body('fullName')
    .notEmpty()
    .withMessage('Полное имя обязательно')
    .isLength({ min: 2, max: 100 })
    .withMessage('Имя должно быть от 2 до 100 символов')
    .trim(),

  body('sortOrder')
    .optional({ values: 'falsy' })
    .isInt({ min: 0, max: 999 })
    .withMessage(
      'Порядок сортировки должен быть неотрицательным числом и не выше 999',
    )
    .toInt(),
];
