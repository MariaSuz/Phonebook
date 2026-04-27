"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeValidator = void 0;
const express_validator_1 = require("express-validator");
exports.employeeValidator = [
    (0, express_validator_1.body)('departmentId')
        .notEmpty()
        .withMessage('ID отдела обязателен')
        .isInt()
        .withMessage('ID отдела должен быть числом'),
    (0, express_validator_1.body)('fullName')
        .notEmpty()
        .withMessage('Полное имя обязательно')
        .isLength({ min: 2, max: 100 })
        .withMessage('Имя должно быть от 2 до 100 символов')
        .trim(),
    (0, express_validator_1.body)('sortOrder')
        .optional({ values: 'falsy' })
        .isInt({ min: 0, max: 999 })
        .withMessage('Порядок сортировки должен быть неотрицательным числом и не выше 999')
        .toInt(),
];
