import { Request, Response } from "express";
import pool from '../config/db';
import expressAsyncHandler from "express-async-handler";

const getAll = async () => {
  const { rows: roles } = await pool.query(`SELECT * FROM roles`);
  return roles;
};

export const getRoles = expressAsyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const result = await getAll();
    res.status(200).json(result);
  }
);
