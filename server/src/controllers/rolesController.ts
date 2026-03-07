import { Request, Response } from "express";
import pool from '../config/db';

export const getRoles = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await getAll();
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Не найдены роли' });
  }
};

const getAll = async () => {
  const { rows: roles } = await pool.query(`SELECT * FROM roles`);
  return roles;
};
