"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.edit = exports.create = exports.findOne = exports.getAll = void 0;
const db_1 = __importDefault(require("../config/db"));
const camelcase_keys_1 = __importDefault(require("camelcase-keys"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const entiryExists_1 = require("../utils/entiryExists");
const errorHelper_1 = require("../utils/errorHelper");
const getAll = async () => {
    const { rows: users } = await db_1.default.query(`SELECT * FROM users`);
    return (0, camelcase_keys_1.default)(users);
};
exports.getAll = getAll;
const findOne = async (userName) => {
    const { rows: users } = await db_1.default.query('SELECT * FROM users WHERE user_name = $1', [userName]);
    return users.length > 0 ? (0, camelcase_keys_1.default)(users[0]) : null;
};
exports.findOne = findOne;
const create = async ({ userName, password, roleId = 2, }) => {
    const salt = await bcrypt_1.default.genSalt();
    const hashedPassword = bcrypt_1.default.hashSync(password, salt);
    const nameExists = await (0, entiryExists_1.checkFieldExistences)('users', ' user_name', userName);
    if (nameExists) {
        throw new errorHelper_1.AppError(`Пользователь с таким именем "${userName}" уже существует`, 409);
    }
    const { rows: users } = await db_1.default.query(`INSERT INTO users(user_name, password, role_id)
    VALUES($1, $2, $3)
    RETURNING id, user_name, role_id`, [userName, hashedPassword, roleId]);
    return (0, camelcase_keys_1.default)(users[0]);
};
exports.create = create;
const edit = async ({ id, userName, password, roleId, }) => {
    const nameExists = await (0, entiryExists_1.checkFieldExistences)('users', ' user_name', userName, id);
    if (nameExists) {
        throw new errorHelper_1.AppError(`Пользователь с таким именем "${userName}" уже существует`, 409);
    }
    if (password) {
        const salt = await bcrypt_1.default.genSalt();
        const hashedPassword = bcrypt_1.default.hashSync(password, salt);
        const { rows: users } = await db_1.default.query(`UPDATE users
        SET user_name = $1, password = $2, role_id = $3
        WHERE id = $4
        RETURNING id, user_name, role_id`, [userName, hashedPassword, roleId, id]);
        return users[0] ? (0, camelcase_keys_1.default)(users[0]) : null;
    }
    else {
        const { rows: users } = await db_1.default.query(`UPDATE users
        SET user_name = $1, role_id = $2,
        WHERE id = $3
        RETURNING id, user_name, role_id`, [userName, roleId, id]);
        return users[0] ? (0, camelcase_keys_1.default)(users[0]) : null;
    }
};
exports.edit = edit;
const deleteItem = async (id) => {
    const { rows: users } = await db_1.default.query(`DELETE FROM users
    WHERE id = $1
    RETURNING *`, [id]);
    return users[0] ? (0, camelcase_keys_1.default)(users[0]) : null;
};
exports.deleteItem = deleteItem;
