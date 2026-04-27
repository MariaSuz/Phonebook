"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployeesByDepartment = exports.deleteEmployee = exports.editEmployee = exports.employeeById = exports.createEmployee = exports.allEmployees = void 0;
const Employees_1 = require("../models/Employees");
const auditHelper_1 = require("../utils/auditHelper");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const errorHelper_1 = require("../utils/errorHelper");
const entiryExists_1 = require("../utils/entiryExists");
exports.allEmployees = (0, express_async_handler_1.default)(async (_req, res) => {
    const result = await (0, Employees_1.getAll)();
    res.status(200).json(result);
});
exports.createEmployee = (0, express_async_handler_1.default)(async (req, res) => {
    const result = await (0, auditHelper_1.withCreateLog)(req, 'employee', () => (0, Employees_1.create)(req.body));
    res.status(201).json(result);
});
exports.employeeById = (0, express_async_handler_1.default)(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const result = await (0, entiryExists_1.checkEntityExistence)(id, Employees_1.getById, 'Пользователь');
    res.status(200).json(result);
});
exports.editEmployee = (0, express_async_handler_1.default)(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const oldData = await (0, entiryExists_1.checkEntityExistence)(id, Employees_1.getById, 'Пользователь');
    const result = await (0, auditHelper_1.withUpdateLog)(req, 'employee', id, () => (0, Employees_1.edit)({ id, ...req.body }), oldData);
    res.status(200).json(result);
});
exports.deleteEmployee = (0, express_async_handler_1.default)(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const oldData = await (0, entiryExists_1.checkEntityExistence)(id, Employees_1.getById, 'Пользователь');
    const result = await (0, auditHelper_1.withDeleteLog)(req, 'employee', id, () => (0, Employees_1.deleteItem)(id), oldData);
    res.status(205).json(result);
});
exports.getEmployeesByDepartment = (0, express_async_handler_1.default)(async (req, res) => {
    const departmentId = parseInt(req.params.departmentId, 10);
    const result = await (0, Employees_1.departmentUsers)(departmentId);
    if (!result) {
        throw new errorHelper_1.AppError('Пользователи не найдены в отделе', 404);
    }
    res.status(200).json(result);
});
