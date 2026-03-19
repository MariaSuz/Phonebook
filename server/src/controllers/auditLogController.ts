import { Request, Response } from "express";
import {
  getAll,
  create,
} from '../models/Audit';
import { CreateAudit } from '../types/auditType';

export const getAuditLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await getAll();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения логов' });
  }
};

export const createAuditLog = async (
  req: Request<{}, {}, CreateAudit>,
  res: Response,
): Promise<void> => {
  try {
    const result = await create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка создания лога аудита' });
  }
};
