"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.edit = exports.getById = exports.create = exports.getAll = void 0;
const db_1 = __importDefault(require("../config/db"));
const camelcase_keys_1 = __importDefault(require("camelcase-keys"));
const entiryExists_1 = require("../utils/entiryExists");
const errorHelper_1 = require("../utils/errorHelper");
const getAll = async () => {
    const { rows: departments } = await db_1.default.query(`SELECT * FROM departments
     ORDER BY sort_order ASC, name ASC`);
    return (0, camelcase_keys_1.default)(departments);
};
exports.getAll = getAll;
const create = async ({ name, sortOrder = 999, }) => {
    const nameExists = await (0, entiryExists_1.checkFieldExistences)('departments', 'name', name);
    if (nameExists) {
        throw new errorHelper_1.AppError(`Отдел с таким наименованием "${name}" уже существует`, 409);
    }
    const { rows: departments } = await db_1.default.query(`INSERT INTO departments(name, sort_order)
    VALUES($1, $2)
    RETURNING *`, [name, sortOrder]);
    return (0, camelcase_keys_1.default)(departments[0]);
};
exports.create = create;
const getById = async (id) => {
    const { rows: departments } = await db_1.default.query(`SELECT * FROM departments WHERE id = $1`, [id]);
    return departments[0] ? (0, camelcase_keys_1.default)(departments[0]) : null;
};
exports.getById = getById;
const edit = async ({ name, sortOrder, id, }) => {
    const nameExists = await (0, entiryExists_1.checkFieldExistences)('departments', 'name', name, id);
    if (nameExists) {
        throw new errorHelper_1.AppError(`Отдел с таким наименованием "${name}" уже существует`, 409);
    }
    const { rows: departments } = await db_1.default.query(`UPDATE departments
    SET name = $1, sort_order =$2
    WHERE id = $3
    RETURNING id, name, sort_order`, [name, sortOrder, id]);
    return departments[0] ? (0, camelcase_keys_1.default)(departments[0]) : null;
};
exports.edit = edit;
const deleteItem = async (id) => {
    const { rows: employees } = await db_1.default.query(`SELECT id FROM employees WHERE department_id = $1 LIMIT 1`, [id]);
    if (employees.length > 0) {
        throw new errorHelper_1.AppError(`Невозможно удалить отдел: к нему привязаны сотрудники`, 409);
    }
    ;
    const { rows: departments } = await db_1.default.query(`DELETE FROM departments
    WHERE id = $1
    RETURNING *`, [id]);
    return departments[0] ? (0, camelcase_keys_1.default)(departments[0]) : null;
};
exports.deleteItem = deleteItem;
