"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.getAll = void 0;
const db_1 = __importDefault(require("../config/db"));
const camelcase_keys_1 = __importDefault(require("camelcase-keys"));
const getAll = async () => {
    const { rows: audit_log } = await db_1.default.query(`SELECT * FROM audit_log
     ORDER BY timestamp DESC`);
    return (0, camelcase_keys_1.default)(audit_log);
};
exports.getAll = getAll;
const create = async ({ userId, userName, action, entityType, entityId, oldData, newData, diff, }) => {
    const { rows: audit_log } = await db_1.default.query(`INSERT INTO audit_log(user_id, user_name, action, entity_type, entity_id, old_data, new_data, diff)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *`, [userId, userName, action, entityType, entityId, oldData, newData, diff]);
    return (0, camelcase_keys_1.default)(audit_log[0]);
};
exports.create = create;
