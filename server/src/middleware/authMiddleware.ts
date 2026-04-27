import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/authConfig';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    roleId: number;
    userName: string;
  };
}


// Middleware для проверки JWT токена
export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Требуется авторизация' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Недействительный токен' });
    }
    req.user = user;
    next();
  });
};

// Middleware для проверки роли администратора
export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Требуется авторизация' });
  }

  if (req.user.roleId !== 1) {
    return res.status(403).json({ message: 'Требуются права администратора' });
  }

  next();
};


export const canEditUser = (req: AuthRequest, res: Response, next: NextFunction) => {
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
