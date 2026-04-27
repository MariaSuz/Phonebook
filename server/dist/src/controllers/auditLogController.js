"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuditLog = exports.getAuditLog = void 0;
const Audit_1 = require("../models/Audit");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
exports.getAuditLog = (0, express_async_handler_1.default)(async (_req, res) => {
    const result = await (0, Audit_1.getAll)();
    res.status(200).json(result);
});
exports.createAuditLog = (0, express_async_handler_1.default)(async (req, res) => {
    const result = await (0, Audit_1.create)(req.body);
    res.status(201).json(result);
});
