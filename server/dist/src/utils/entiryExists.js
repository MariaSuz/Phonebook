"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFieldExistences = exports.checkEntityExistence = void 0;
const errorHelper_1 = require("./errorHelper");
const db_1 = __importDefault(require("../config/db"));
const checkEntityExistence = async (id, getById, entityName) => {
    const entryId = await getById(id);
    if (!entryId) {
        throw new errorHelper_1.AppError(`${entityName} не найден`, 404);
    }
    return entryId;
};
exports.checkEntityExistence = checkEntityExistence;
const checkFieldExistences = async (tableName, filedName, value, excludeId) => {
    let query = `SELECT 1 FROM ${tableName} WHERE ${filedName} = $1`;
    const params = [value];
    if (excludeId !== undefined) {
        query += ` AND id != $2`;
        params.push(excludeId);
    }
    const { rows } = await db_1.default.query(query, params);
    return rows.length > 0;
};
exports.checkFieldExistences = checkFieldExistences;
