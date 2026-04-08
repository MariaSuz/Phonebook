import { Request, Response } from "express";
import {
  getAll,
  create,
  getById,
  edit,
  deleteItem,
} from '../models/Department';
import { Department } from "../types/departmentType";
import { logAction } from "../utils/auditHelper";
import expressAsyncHandler from 'express-async-handler';
import { AppError } from "../utils/errorHelper";

export const allDepartments = expressAsyncHandler(
  async (_req: Request, res: Response) => {
    const result = await getAll();
    res.status(200).json(result);
  },
);

export const createDepartment = expressAsyncHandler(
  async (req: Request<{}, {}, Department>, res: Response) => {
    const result = await create(req.body);
    await logAction({
      req,
      action: 'CREATE',
      entityType: 'department',
      entityId: result.id,
      newData: result,
    });
    res.status(201).json(result);
  },
);

export const departmentById = expressAsyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const result = await getById(id);
    if (!result) {
      throw new AppError('Отдел не найден', 404);
    }
    res.status(200).json(result);
  },
);

export const editDepartment = expressAsyncHandler(
  async (req: Request<{ id: string }, {}, Department>, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const oldData = await getById(id);
    if (!oldData) {
      throw new AppError('Отдел не найден', 404);
    }
    const result = await edit({
      id: id,
      name: req.body.name,
      sortOrder: req.body.sortOrder,
    });
    await logAction({
      req,
      action: 'UPDATE',
      entityType: 'department',
      entityId: id,
      oldData: oldData,
      newData: result,
    });
    res.status(200).json(result);
  },
);

export const deleteDepartment = expressAsyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const oldData = await getById(id);
    if (!oldData) {
      throw new AppError('Отдел не найден', 404);
    }
    const result = await deleteItem(id);
    await logAction({
      req,
      action: 'DELETE',
      entityType: 'department',
      entityId: id,
      oldData: oldData,
    });
    res.status(200).json(result);
  },
);
