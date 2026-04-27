"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.departmentValidator = void 0;
const express_validator_1 = require("express-validator");
exports.departmentValidator = [
    (0, express_validator_1.body)('name')
        .notEmpty()
        .withMessage('Поле обязательно')
        .isLength({ min: 2, max: 100 })
        .withMessage('Наименование должно быть от 2 до 100 символов')
        .trim(),
    (0, express_validator_1.body)('sortOrder')
        .optional({ values: 'falsy' })
        .isInt({ min: 0, max: 999 })
        .withMessage('Порядок сортировки должен быть неотрицательным числом и не выше 999')
        .toInt(),
];
