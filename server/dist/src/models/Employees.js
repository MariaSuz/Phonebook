"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.departmentUsers = exports.deleteItem = exports.edit = exports.getById = exports.create = exports.getAll = void 0;
const db_1 = __importDefault(require("../config/db"));
const camelcase_keys_1 = __importDefault(require("camelcase-keys"));
const getAll = async () => {
    const { rows: employees } = await db_1.default.query(`SELECT * FROM employees
     ORDER BY sort_order ASC`);
    console.log('Raw rows:', employees);
    return (0, camelcase_keys_1.default)(employees);
};
exports.getAll = getAll;
const create = async ({ fullName, position, cabinet, internalPhone, cityPhone, mobilePhone, email, departmentId, sortOrder = 999, }) => {
    const departmentCheck = await db_1.default.query('SELECT id FROM departments WHERE id = $1', [departmentId]);
    if (departmentCheck.rows.length === 0) {
        throw new Error('Department not found');
    }
    const { rows: employees } = await db_1.default.query(`INSERT INTO employees(full_name, position, cabinet, internal_phone, city_phone, mobile_phone, email, department_id, sort_order)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`, [
        fullName,
        position,
        cabinet,
        internalPhone,
        cityPhone,
        mobilePhone,
        email,
        departmentId,
        sortOrder,
    ]);
    return (0, camelcase_keys_1.default)(employees[0]);
};
exports.create = create;
const getById = async (id) => {
    const { rows: employees } = await db_1.default.query(`SELECT * FROM employees WHERE id = $1`, [id]);
    return employees[0] ? (0, camelcase_keys_1.default)(employees[0]) : null;
};
exports.getById = getById;
const edit = async ({ fullName, position, cabinet, internalPhone, cityPhone, mobilePhone, email, departmentId, sortOrder, id, }) => {
    const { rows: employees } = await db_1.default.query(`UPDATE employees
    SET full_name = $1, position = $2, cabinet =$3,
    internal_phone = $4, city_phone = $5, mobile_phone = $6,
    email = $7, department_id = $8, sort_order = $9
    WHERE id = $10
    RETURNING id, full_name, position, cabinet, internal_phone, city_phone, mobile_phone,
    email, department_id, sort_order`, [
        fullName,
        position,
        cabinet,
        internalPhone,
        cityPhone,
        mobilePhone,
        email,
        departmentId,
        sortOrder,
        id,
    ]);
    return employees[0] ? (0, camelcase_keys_1.default)(employees[0]) : null;
};
exports.edit = edit;
const deleteItem = async (id) => {
    const { rows: employees } = await db_1.default.query(`DELETE FROM employees
    WHERE id = $1
    RETURNING *`, [id]);
    return employees[0] ? (0, camelcase_keys_1.default)(employees[0]) : null;
};
exports.deleteItem = deleteItem;
const departmentUsers = async (departmentId) => {
    const { rows: employees } = await db_1.default.query(`SELECT * FROM employees
    WHERE department_id = $1
    ORDER BY sort_order, full_name`, [departmentId]);
    return (0, camelcase_keys_1.default)(employees);
};
exports.departmentUsers = departmentUsers;
