import { Request, Response } from "express";
import {
  getAll,
  create,
  getById,
  edit,
  deleteItem,
} from '../models/Department';
import { Department } from "../types/departmentType";
import expressAsyncHandler from 'express-async-handler';
import { checkEntityExistence } from '../utils/entiryExists';
import { withCreateLog, withDeleteLog, withUpdateLog } from "../utils/auditHelper";

export const allDepartments = expressAsyncHandler(
  async (_req: Request, res: Response) => {
    const result = await getAll();
    res.status(200).json(result);
  },
);

export const createDepartment = expressAsyncHandler(
  async (req: Request<{}, {}, Department>, res: Response) => {
    const result = await withCreateLog(
      req,
      'department',
      () => create(req.body),
    );
    res.status(201).json(result);
  },
);

export const departmentById = expressAsyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const result = await checkEntityExistence(id, getById, 'Отдел');
    res.status(200).json(result);
  },
);

export const editDepartment = expressAsyncHandler(
  async (req: Request<{ id: string }, {}, Department>, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const oldData = await checkEntityExistence(id, getById, 'Отдел');
    const result = await withUpdateLog (
      req,
      'department',
      id,
      () => edit({
      id: id,
      name: req.body.name,
      sortOrder: req.body.sortOrder,
      }),
      oldData,
    );
    res.status(200).json(result);
  },
);

export const deleteDepartment = expressAsyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const oldData = await checkEntityExistence(id, getById, 'Отдел');
    const result = await withDeleteLog(
      req,
      'department',
      id,
      () => deleteItem(id),
      oldData,
    );
    res.status(200).json(result);
  },
);
