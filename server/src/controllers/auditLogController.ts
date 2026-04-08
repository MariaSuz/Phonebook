import { Request, Response } from "express";
import {
  getAll,
  create,
} from '../models/Audit';
import { CreateAudit } from '../types/auditType';
import expressAsyncHandler from "express-async-handler";

export const getAuditLog = expressAsyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const result = await getAll();
    res.status(200).json(result);
  }
);

export const createAuditLog = expressAsyncHandler(async (
  req: Request<{}, {}, CreateAudit>,
  res: Response,
): Promise<void> => {
    const result = await create(req.body);
    res.status(201).json(result);
  }
);
