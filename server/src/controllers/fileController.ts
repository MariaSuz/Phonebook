import { Request, Response } from "express";
import {
  getAll,
  create,
  deleteItem,
  getById,
  downloadById,
} from '../models/File';
import multer from 'multer';

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
      // Excel файлы
      'application/vnd.ms-excel', // .xls (старый формат)
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx (новый формат)
      'application/vnd.oasis.opendocument.spreadsheet', // .ods (OpenDocument)
      'text/csv', // .csv (часто используется как Excel)
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          'Неверный тип файла. Разрешены: PDF, JPG, PNG, TXT, Excel файлы',
        ),
      );
    }
  },
}).single('document');

export const allFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await getAll();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении списка файлов' });
  }
};

export const fileById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const result = await getById(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Файл не найден' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении списка файлов' });
  }
};


export const uploadFile = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  upload(req, res, async (err) => {
    if (err) {
      // Ошибка от multer (неверный тип файла, превышен размер и т.д.)
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) return res.status(400).json({ error: 'Файл не выбран' });
    try {
      const result = await create({
        fileName: `${Date.now()}-${req.file.originalname}`,
        fileContent: req.file.buffer,
        contentType: req.file.mimetype,
        sizeBytes: req.file.size,
        description: req.body.description,
      });
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при сохранении файла' });
    }
  });
};
export const downloadFile = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const file = await downloadById(req.params.id);

    if (!file) {
      return res.status(404).json({ error: 'Файл не найден' });
    }

    // Заголовки минимум
    res.set({
      'Content-Type': file.contentType,
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(file.fileName)}; filename="${encodeURIComponent(file.fileName)}"`,
      'Content-Length': file.sizeBytes,
      'Cache-Control': 'no-cache',
      'Access-Control-Expose-Headers': 'Content-Disposition',
    });

    // Отправляем файл как бинарные данные
    return res.send(file.fileContent);
  } catch (error) {
    console.error('Ошибка при скачивании файла:', error);
    return res.status(500).json({ message: 'Ошибка при скачивании файла' });
  }
};

export const deleteFile = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const result = await deleteItem(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Файл не найден' });
    }
    res.status(205).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении файла' });
  }
};
