"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.canEditUser = exports.requireAdmin = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authCongig_1 = require("../config/authCongig");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Требуется авторизация' });
    }
    jsonwebtoken_1.default.verify(token, authCongig_1.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Недействительный токен' });
        }
        req.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Требуется авторизация' });
    }
    if (req.user.roleId !== 1) {
        return res.status(403).json({ message: 'Требуются права администратора' });
    }
    next();
};
exports.requireAdmin = requireAdmin;
const canEditUser = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Требуется авторизация' });
    }
    if (req.user.roleId === 1) {
        return next();
    }
    const targetUserId = parseInt(req.params.id.toString(), 10);
    if (req.user.roleId === 2 && req.user.userId === targetUserId) {
        return next();
    }
    return res.status(403).json({
        message: 'У вас нет прав для редактирования этого пользователя',
    });
};
exports.canEditUser = canEditUser;
