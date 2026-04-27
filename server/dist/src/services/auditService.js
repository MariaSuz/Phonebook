"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditService = void 0;
const Audit_1 = require("../models/Audit");
const isEqual_1 = __importDefault(require("lodash/isEqual"));
exports.auditService = {
    async log(data) {
        try {
            let diff = null;
            if (data.action === 'UPDATE' && data.oldData && data.newData) {
                diff = {};
                const allKeys = [
                    ...new Set([
                        ...Object.keys(data.oldData),
                        ...Object.keys(data.newData),
                    ]),
                ];
                for (const key of allKeys) {
                    if (!(0, isEqual_1.default)(data.oldData[key], data.newData[key])) {
                        diff[key] = data.newData[key];
                    }
                }
                if (Object.keys(diff).length === 0) {
                    diff = null;
                }
            }
            const result = await (0, Audit_1.create)({
                ...data,
                diff,
            });
            return result;
        }
        catch (error) {
        }
    },
};
