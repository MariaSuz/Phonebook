import { Request, Response } from "express";
import {
  getAll,
  create,
  edit,
  deleteItem,
  findOne,
} from '../models/Users';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { JWT_SECRET } from "../config/authCongig";
import { User } from "../types/userType";
import expressAsyncHandler from "express-async-handler";
import { AppError } from "../utils/errorHelper";

// Helper функция для проверки пароля
const validatePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const getUsers = expressAsyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
  const result = await getAll();
  res.status(200).json(result);
  }
);

export const editUser = expressAsyncHandler(async (
  req: Request<{ id: string }, {}, User>,
  res: Response,
) => {
    const result = await edit({
      id: parseInt(req.params.id, 10),
      userName: req.body.userName,
      password: req.body.password,
      roleId: req.body.roleId,
    });
    if (!result) {
      throw new AppError('Не найдены зарегистрированные пользователи', 404);
    }
    res.status(200).json(result);
  }
);

export const login = expressAsyncHandler(
  async (
    req: Request<{}, {}, { userName: string; password: string }>,
    res: Response,
  ) => {
    // Проверяем существование пользователя
    const user = await findOne(req.body.userName);
    if (!user) {
      throw new AppError('Неверное имя пользователя или пароль', 400);
    }
    // Проверяем пароль
    const isValidPassword = await validatePassword(
      req.body.password,
      user.password,
    );
    if (!isValidPassword) {
      throw new AppError('Неверное имя пользователя или пароль', 400);
    }
    //Создаю токен
    const token = jwt.sign(
      { userId: user.id, userName: user.userName, roleId: user.roleId },
      JWT_SECRET,
      {
        expiresIn: '24h',
      },
    );
    res.json({
      message: 'Вход выполнен успешно',
      user: {
        id: user.id,
        userName: user.userName,
        roleId: user.roleId,
      },
      token,
    });
  },
);

export const register = expressAsyncHandler(
  async (req: Request<{}, {}, User>, res: Response) => {
    // Проверяю если ли уже пользователь
    const duplicate = await findOne(req.body.userName);
    if (duplicate) {
      throw new AppError('Пользователь с таким именем уже существует', 409);
    }

    const result = await create({
      userName: req.body.userName,
      password: req.body.password,
      roleId: req.body.roleId ? req.body.roleId: 2,
    });
    res.status(201).json({
      user: {
        id: result.id,
        userName: result.userName,
        roleId: result.roleId,
      },
      message: 'Пользователь успешно создан',
    });
  }
);

export const deleteUser = expressAsyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const result = await deleteItem(parseInt(req.params.id));
    if (!result) {
      throw new AppError('Пользователь не найден', 404);
    }
    res.status(200).json(result);
  }
);
