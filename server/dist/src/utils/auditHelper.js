"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withDeleteLog = exports.withUpdateLog = exports.withCreateLog = void 0;
const auditService_1 = require("../services/auditService");
const getUserFromReq = (req) => {
    const user = req.user;
    return {
        userId: user?.userId ?? null,
        userName: user?.userName ?? 'system',
    };
};
const logAction = async (params) => {
    const { req, action, entityType, entityId, oldData, newData, } = params;
    const { userId, userName } = getUserFromReq(req);
    const auditData = {
        userId,
        userName,
        action,
        entityType,
        entityId,
        oldData: oldData ?? null,
        newData: newData ?? null,
    };
    await auditService_1.auditService.log(auditData);
};
const withLogging = async (req, action, entityType, entityId, operation, oldData) => {
    const result = await operation();
    await logAction({
        req,
        action,
        entityType,
        entityId,
        oldData,
        newData: result,
    });
    return result;
};
const withCreateLog = (req, entityType, operation) => {
    return withLogging(req, 'CREATE', entityType, 0, operation);
};
exports.withCreateLog = withCreateLog;
const withUpdateLog = (req, entityType, entityId, operation, oldData) => {
    return withLogging(req, 'UPDATE', entityType, entityId, operation, oldData);
};
exports.withUpdateLog = withUpdateLog;
const withDeleteLog = (req, entityType, entityId, operation, oldData) => {
    return withLogging(req, 'DELETE', entityType, entityId, operation, oldData);
};
exports.withDeleteLog = withDeleteLog;
