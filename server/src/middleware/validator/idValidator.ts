import { param } from 'express-validator';

export const validateId = [
  param('id').isInt().withMessage('ID должен быть числом').toInt(),
];

export const validateDepartmentId = [
  param('departmentId').isInt().withMessage('ID должен быть числом').toInt(),
];
