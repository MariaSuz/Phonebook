"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDepartmentId = exports.validateId = void 0;
const express_validator_1 = require("express-validator");
exports.validateId = [
    (0, express_validator_1.param)('id').isInt().withMessage('ID должен быть числом').toInt(),
];
exports.validateDepartmentId = [
    (0, express_validator_1.param)('departmentId').isInt().withMessage('ID должен быть числом').toInt(),
];
