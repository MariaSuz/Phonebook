import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errorHelper';

export const errorMiddleware = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Логируем ошибку для отладки
  console.error({
    name: error.name,
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  // Если это наша кастомная ошибка
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  // Ошибка валидации от express-validator
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Ошибка валидации',
      details: error.message,
    });
  }

  // Все остальные ошибки
  res.status(500).json({
    success: false,
    message: 'Внутренняя ошибка сервера',
  });
};
