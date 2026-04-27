"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoles = void 0;
const db_1 = __importDefault(require("../config/db"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const getAll = async () => {
    const { rows: roles } = await db_1.default.query(`SELECT * FROM roles`);
    return roles;
};
exports.getRoles = (0, express_async_handler_1.default)(async (_req, res) => {
    const result = await getAll();
    res.status(200).json(result);
});
