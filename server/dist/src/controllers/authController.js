"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.register = exports.login = exports.editUser = exports.getUsers = void 0;
const Users_1 = require("../models/Users");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const authCongig_1 = require("../config/authCongig");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const errorHelper_1 = require("../utils/errorHelper");
const validatePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt_1.default.compare(plainPassword, hashedPassword);
};
exports.getUsers = (0, express_async_handler_1.default)(async (_req, res) => {
    const result = await (0, Users_1.getAll)();
    const requestWithoutPasswords = result.map(user => {
        const { password, ...usersWithoutPassword } = user;
        return usersWithoutPassword;
    });
    res.status(200).json(requestWithoutPasswords);
});
exports.editUser = (0, express_async_handler_1.default)(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const result = await (0, Users_1.edit)({
        id: id,
        userName: req.body.userName,
        password: req.body.password,
        roleId: req.body.roleId,
    });
    if (!result) {
        throw new errorHelper_1.AppError('Не найдены зарегистрированные пользователи', 404);
    }
    res.status(200).json(result);
});
exports.login = (0, express_async_handler_1.default)(async (req, res) => {
    const user = await (0, Users_1.findOne)(req.body.userName);
    if (!user) {
        throw new errorHelper_1.AppError('Неверное имя пользователя или пароль', 400);
    }
    const isValidPassword = await validatePassword(req.body.password, user.password);
    if (!isValidPassword) {
        throw new errorHelper_1.AppError('Неверное имя пользователя или пароль', 400);
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id, userName: user.userName, roleId: user.roleId }, authCongig_1.JWT_SECRET, {
        expiresIn: '24h',
    });
    res.json({
        message: 'Вход выполнен успешно',
        user: {
            id: user.id,
            userName: user.userName,
            roleId: user.roleId,
        },
        token,
    });
});
exports.register = (0, express_async_handler_1.default)(async (req, res) => {
    const duplicate = await (0, Users_1.findOne)(req.body.userName);
    if (duplicate) {
        throw new errorHelper_1.AppError('Пользователь с таким именем уже существует', 409);
    }
    const result = await (0, Users_1.create)({
        userName: req.body.userName,
        password: req.body.password,
        roleId: req.body.roleId ? req.body.roleId : 2,
    });
    res.status(201).json({
        user: {
            id: result.id,
            userName: result.userName,
            roleId: result.roleId,
        },
        message: 'Пользователь успешно создан',
    });
});
exports.deleteUser = (0, express_async_handler_1.default)(async (req, res) => {
    const result = await (0, Users_1.deleteItem)(parseInt(req.params.id));
    if (!result) {
        throw new errorHelper_1.AppError('Пользователь не найден', 404);
    }
    res.status(200).json(result);
});
