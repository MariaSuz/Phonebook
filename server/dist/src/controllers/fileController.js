"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.downloadFile = exports.uploadFile = exports.fileById = exports.allFiles = void 0;
const File_1 = require("../models/File");
const multer_1 = __importDefault(require("multer"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const errorHelper_1 = require("../utils/errorHelper");
const auditHelper_1 = require("../utils/auditHelper");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 30 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'text/plain',
            'application/msword',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.oasis.opendocument.spreadsheet',
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Неверный тип файла. Разрешены: PDF, JPG, PNG, TXT, Excel файлы, Word файлы'));
        }
    },
}).single('document');
exports.allFiles = (0, express_async_handler_1.default)(async (_req, res) => {
    const result = await (0, File_1.getAll)();
    res.status(200).json(result);
});
exports.fileById = (0, express_async_handler_1.default)(async (req, res) => {
    const result = await (0, File_1.getById)(req.params.id);
    if (!result) {
        throw new errorHelper_1.AppError('Файл не найден', 404);
    }
    res.status(200).json(result);
});
exports.uploadFile = (0, express_async_handler_1.default)(async (req, res) => {
    await new Promise((resolve, reject) => {
        upload(req, res, (err) => {
            if (err) {
                reject(new errorHelper_1.AppError(err.message, 400));
            }
            else {
                resolve(null);
            }
        });
    });
    if (!req.file) {
        throw new errorHelper_1.AppError('Файл не выбран', 400);
    }
    const file = req.file;
    const result = await (0, auditHelper_1.withCreateLog)(req, 'file', () => (0, File_1.create)({
        fileName: req.body.fileName?.trim() || file.originalname,
        fileContent: file.buffer,
        contentType: file.mimetype,
        sizeBytes: file.size,
        description: req.body.description,
        groupId: req.body.groupId,
        originalFileName: file.originalname,
    }));
    res.status(201).json(result);
});
exports.downloadFile = (0, express_async_handler_1.default)(async (req, res) => {
    const file = await (0, File_1.downloadById)(req.params.id);
    if (!file) {
        throw new errorHelper_1.AppError('Файл не найден', 404);
    }
    const downloadName = file.originalFileName || file.fileName;
    res.set({
        'Content-Type': file.contentType,
        'Content-Disposition': `attachment; filename="${downloadName}"`,
        'Content-Length': file.sizeBytes,
    });
    res.send(file.fileContent);
});
exports.deleteFile = (0, express_async_handler_1.default)(async (req, res) => {
    const oldData = await (0, File_1.getById)(req.params.id);
    if (!oldData) {
        throw new errorHelper_1.AppError('Файл не найден', 404);
    }
    const result = await (0, auditHelper_1.withDeleteLog)(req, 'file', req.params.id, () => (0, File_1.deleteItem)(req.params.id), oldData);
    res.status(200).json(result);
});
