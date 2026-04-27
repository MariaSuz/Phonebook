"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.create = exports.downloadById = exports.getById = exports.getAll = void 0;
const db_1 = __importDefault(require("../config/db"));
const camelcase_keys_1 = __importDefault(require("camelcase-keys"));
const getAll = async () => {
    const { rows: files } = await db_1.default.query('SELECT * FROM files');
    return (0, camelcase_keys_1.default)(files);
};
exports.getAll = getAll;
const getById = async (id) => {
    const { rows: files } = await db_1.default.query(`SELECT * FROM files WHERE id = $1`, [id]);
    return files[0] ? (0, camelcase_keys_1.default)(files[0]) : null;
};
exports.getById = getById;
const downloadById = async (id) => {
    const { rows: files } = await db_1.default.query(`SELECT id, file_name, file_content, content_type, size_bytes, description, group_id, original_file_name
    FROM files
    WHERE id = $1`, [id]);
    return (0, camelcase_keys_1.default)(files[0]) || null;
};
exports.downloadById = downloadById;
const create = async ({ fileName, fileContent, contentType, sizeBytes, description, groupId, originalFileName, }) => {
    const { rows: files } = await db_1.default.query(`INSERT INTO files(file_name, file_content, content_type, size_bytes, description, group_id, original_file_name)
    VALUES($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`, [
        fileName,
        fileContent,
        contentType,
        sizeBytes,
        description || null,
        groupId,
        originalFileName,
    ]);
    return (0, camelcase_keys_1.default)(files[0]);
};
exports.create = create;
const deleteItem = async (id) => {
    const { rows: files } = await db_1.default.query(`DELETE FROM files
    WHERE id = $1
    RETURNING *`, [id]);
    return files[0] ? (0, camelcase_keys_1.default)(files[0]) : null;
};
exports.deleteItem = deleteItem;
