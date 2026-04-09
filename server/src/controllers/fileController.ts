import { Request, Response } from "express";
import {
  getAll,
  create,
  deleteItem,
  getById,
  downloadById,
} from '../models/File';
import multer from 'multer';
import expressAsyncHandler from "express-async-handler";
import { AppError } from "../utils/errorHelper";
import { withCreateLog, withDeleteLog } from "../utils/auditHelper";

// Храним файл в памяти для последующей записи в БД
const storage = multer.memoryStorage();
// Инициализация multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 30 * 1024 * 1024, // лимит 30MB
  },
  fileFilter: (req, file, cb) => {
    // Разрешённые типы файлов
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
    } else {
      cb(
        new Error(
          'Неверный тип файла. Разрешены: PDF, JPG, PNG, TXT, Excel файлы, Word файлы',
        ),
      );
    }
  },
}).single('document');

export const allFiles = expressAsyncHandler(
  async (_req: Request, res: Response) => {
    const result = await getAll();
    res.status(200).json(result);
  }
);

export const fileById = expressAsyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const result = await getById(req.params.id);
    if (!result) {
      throw new AppError('Файл не найден', 404);
    }
    res.status(200).json(result);
  }
);


export const uploadFile = expressAsyncHandler(async (
  req: Request<{ id: string }>,
  res: Response,
) => {
   await new Promise((resolve, reject) => {
    upload(req, res, (err) => {
      if (err) {
        reject(new AppError(err.message, 400));
      } else {
        resolve(null);
      }
    });
  });

  if (!req.file) {
    throw new AppError('Файл не выбран', 400);
  }
  const file = req.file;
  const result = await withCreateLog(
    req,
    'file',
    () => create({
      fileName: req.body.fileName?.trim() || file.originalname,
      fileContent: file.buffer,
      contentType: file.mimetype,
      sizeBytes: file.size,
      description: req.body.description,
      groupId: req.body.groupId,
      originalFileName: file.originalname,
    })
  );
  res.status(201).json(result);
});

export const downloadFile = expressAsyncHandler(async (
  req: Request<{ id: string }>,
  res: Response,
) => {
    const file = await downloadById(req.params.id);
    if (!file) {
      throw new AppError('Файл не найден', 404);
    }

    const downloadName = file.originalFileName || file.fileName;
    // Заголовки минимум
    res.set({
      'Content-Type': file.contentType,
      'Content-Disposition': `attachment; filename="${downloadName}"`,
      'Content-Length': file.sizeBytes,
    });

    // Отправляем файл как бинарные данные
    res.send(file.fileContent);
  }
);

export const deleteFile = expressAsyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const oldData = await getById(req.params.id);
    if (!oldData) {
      throw new AppError('Файл не найден', 404);
    }
    const result = await withDeleteLog(
      req,
      'file',
      req.params.id,
      () => deleteItem(req.params.id),
      oldData,
    );
    res.status(200).json(result);
  }
);
