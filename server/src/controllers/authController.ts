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

// Helper функция для проверки пароля
const validatePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await getAll();
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Не найдены зарегистрированные пользователи' });
  }
};

export const editUser = async (
  req: Request<
    { id: string },
    {},
    { userName: string; password: string; roleId: string; avatar: string }
  >,
  res: Response,
) => {
  try {
    // TODO: Добавить проверку прав (только админ или сам пользователь)
    const result = await edit({
      id: parseInt(req.params.id, 10),
      userName: req.body.userName,
      password: req.body.password,
      roleId: parseInt(req.body.roleId, 10),
      avatar: req.body.avatar,
    });

    if (!result) {
      return res
        .status(404)
        .json({ error: 'Не найдены зарегистрированные пользователи' });
    }

    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Не найдены зарегистрированные пользователи' });
  }
};

export const login = async (
  req: Request<
    {},
    {},
    { userName: string; password: string; }
  >,
  res: Response,
) => {
  try {
    // Проверяем существование пользователя
    const user = await findOne(req.body.userName);
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Неверное имя пользователя или пароль' });
    }
    // Проверяем пароль
    const isValidPassword = await validatePassword(
      req.body.password,
      user.password,
    );
    if (!isValidPassword) {
      return res
        .status(400)
        .json({ message: 'Неверное имя пользователя или пароль' });
    }
    //Создаю токен
    const token = jwt.sign(
      { userId: user.id, userName: user.userName, roleId: user.roleId },
      JWT_SECRET,
      {
        expiresIn: '24h',
      },
    );
    return res.json({
      message: 'Вход выполнен успешно',
      user: {
        id: user.id,
        userName: user.userName,
        roleId: user.roleId,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Вход не выполнен' });
  }
};

export const register = async (
  req: Request<
    {},
    {},
    { userName: string; password: string; roleId: string; avatar?: string }
  >,
  res: Response,
) => {
  try {
    // Проверяю если ли уже пользователь
    const duplicate = await findOne(req.body.userName);
    if (duplicate) {
      return res
        .status(400)
        .json({ message: 'Пользователь с таким именем уже существует' });
    }

    const result = await create({
      userName: req.body.userName,
      password: req.body.password,
      roleId: req.body.roleId ? parseInt(req.body.roleId, 10) : 2,
      avatar: req.body.avatar,
    });
    res.status(201).json({
      user: {
        id: result.id,
        userName: result.userName,
        roleId: result.roleId,
        avatar: result.avatar,
      },
      message: 'Пользователь успешно создан',
    });
  } catch (error) {
    res.status(500).json({ message: 'Пользователь не создан' });
  }
};

export const deleteUser = async (req: Request<{ id: string }>, res: Response) => {
  try {
    // TODO: Добавить проверку прав (только админ)
    const result = await deleteItem(parseInt(req.params.id));
    if (!result) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    res.status(205).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Пользователь не найден' });
  }
};
