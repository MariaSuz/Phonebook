"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const errorHelper_1 = require("../utils/errorHelper");
const errorMiddleware = (error, req, res, next) => {
    console.error({
        name: error.name,
        message: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
    });
    if (error instanceof errorHelper_1.AppError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
    }
    if (error.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Ошибка валидации',
            details: error.message,
        });
    }
    res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера',
    });
};
exports.errorMiddleware = errorMiddleware;
