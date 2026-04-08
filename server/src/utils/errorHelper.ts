export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';

    // Сохраняем стек вызовов для правильной отладки
    Error.captureStackTrace(this, this.constructor);
  }
}
