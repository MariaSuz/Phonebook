import { Request, Response } from 'express';
import {
  getAll,
  create,
  getById,
  edit,
  deleteItem,
  departmentUsers,
} from '../models/Employees';
import { Employee } from '../types/employeeType'
import { logAction } from '../utils/auditHelper';
import expressAsyncHandler from 'express-async-handler';
import { AppError } from '../utils/errorHelper';


export const allEmployees = expressAsyncHandler(
  async (_req: Request, res: Response) => {
    const result = await getAll();
    res.status(200).json(result);
  },
);

export const createEmployee = expressAsyncHandler(async (
  req: Request<{}, {}, Employee>,
  res: Response,
) => {
    const result = await create(req.body);
    await logAction({
      req,
      action: 'CREATE',
      entityType: 'employee',
      entityId: result.id,
      newData: result,
    });
    res.status(201).json(result);
  }
);

export const employeeById = expressAsyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const result = await getById(id);
    if (!result) {
      throw new AppError('Пользователь не найден', 404);
    }
    res.status(200).json(result);
  },
);

export const editEmployee = expressAsyncHandler(
  async (req: Request<{ id: string }, {}, Employee>, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const oldData = await getById(id);
    if (!oldData) {
      throw new AppError('Пользователь не найден', 404);
    }
    const result = await edit({
      id: id,
      fullName: req.body.fullName,
      position: req.body.position,
      cabinet: req.body.cabinet,
      internalPhone: req.body.internalPhone,
      cityPhone: req.body.cityPhone,
      mobilePhone: req.body.mobilePhone,
      email: req.body.email,
      departmentId: req.body.departmentId,
      sortOrder: req.body.sortOrder,
    });
    await logAction({
      req,
      action: 'UPDATE',
      entityType: 'employee',
      entityId: id,
      oldData: oldData,
      newData: result,
    });
    res.status(200).json(result);
  },
);

export const deleteEmployee = expressAsyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const oldData = await getById(id);
    if (!oldData) {
      throw new AppError('Пользователь не найден', 404);
    }
    const result = await deleteItem(id);
    await logAction({
      req,
      action: 'DELETE',
      entityType: 'employee',
      entityId: id,
      oldData: oldData,
    });
    res.status(205).json(result);
  }
);

export const getEmployeesByDepartment = expressAsyncHandler(async (
  req: Request<{ departmentId: string }>,
  res: Response,
) => {
    const departmentId = parseInt(req.params.departmentId, 10);
    const result = await departmentUsers(departmentId);
    if (!result) {
      throw new AppError('Пользователи не найдены в отделе', 404);
    }
    res.status(200).json(result);
  }
);