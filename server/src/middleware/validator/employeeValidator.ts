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

  body('cabinet')
    .optional({ values: 'falsy' })
    .isLength({ max: 20 })
    .withMessage('Номер кабинета не может быть длиннее 20 символов')
    .trim(),

  body('position')
    .optional({ values: 'falsy' })
    .isLength({ max: 100 })
    .withMessage('Должность не может быть длиннее 100 символов')
    .trim(),

  body('internalPhone')
    .optional({ values: 'falsy' })
    .matches(/^[0-9+\-\s()]*$/)
    .withMessage('Внутренний телефон содержит недопустимые символы')
    .isLength({ max: 20 })
    .withMessage('Телефон не может быть длиннее 20 символов')
    .trim(),

  body('cityPhone')
    .optional({ values: 'falsy' })
    .matches(/^[0-9+\-\s()]*$/)
    .withMessage('Городской телефон содержит недопустимые символы')
    .isLength({ max: 20 })
    .withMessage('Телефон не может быть длиннее 20 символов')
    .trim(),

  body('mobilePhone')
    .optional({ values: 'falsy' })
    .matches(/^[0-9+\-\s()]*$/)
    .withMessage('Мобильный телефон содержит недопустимые символы')
    .isLength({ max: 20 })
    .withMessage('Телефон не может быть длиннее 20 символов')
    .trim(),

  body('email')
    .optional({ values: 'falsy' })
    .isEmail()
    .withMessage('Некорректный email')
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('Email не может быть длиннее 100 символов'),

  body('sortOrder')
    .optional({ values: 'falsy' })
    .isInt({ min: 0, max: 999 })
    .withMessage(
      'Порядок сортировки должен быть неотрицательным числом и не выше 999',
    )
    .toInt(),
];
