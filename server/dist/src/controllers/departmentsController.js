"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDepartment = exports.editDepartment = exports.departmentById = exports.createDepartment = exports.allDepartments = void 0;
const Department_1 = require("../models/Department");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const entiryExists_1 = require("../utils/entiryExists");
const auditHelper_1 = require("../utils/auditHelper");
exports.allDepartments = (0, express_async_handler_1.default)(async (_req, res) => {
    const result = await (0, Department_1.getAll)();
    res.status(200).json(result);
});
exports.createDepartment = (0, express_async_handler_1.default)(async (req, res) => {
    const result = await (0, auditHelper_1.withCreateLog)(req, 'department', () => (0, Department_1.create)(req.body));
    res.status(201).json(result);
});
exports.departmentById = (0, express_async_handler_1.default)(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const result = await (0, entiryExists_1.checkEntityExistence)(id, Department_1.getById, 'Отдел');
    res.status(200).json(result);
});
exports.editDepartment = (0, express_async_handler_1.default)(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const oldData = await (0, entiryExists_1.checkEntityExistence)(id, Department_1.getById, 'Отдел');
    const result = await (0, auditHelper_1.withUpdateLog)(req, 'department', id, () => (0, Department_1.edit)({
        id: id,
        name: req.body.name,
        sortOrder: req.body.sortOrder,
    }), oldData);
    res.status(200).json(result);
});
exports.deleteDepartment = (0, express_async_handler_1.default)(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const oldData = await (0, entiryExists_1.checkEntityExistence)(id, Department_1.getById, 'Отдел');
    const result = await (0, auditHelper_1.withDeleteLog)(req, 'department', id, () => (0, Department_1.deleteItem)(id), oldData);
    res.status(200).json(result);
});
