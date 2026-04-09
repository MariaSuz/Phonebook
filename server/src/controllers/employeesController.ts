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
import { withCreateLog, withDeleteLog, withUpdateLog } from '../utils/auditHelper';
import expressAsyncHandler from 'express-async-handler';
import { AppError } from '../utils/errorHelper';
import { checkEntityExistence } from '../utils/entiryExists';


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
    const result = await withCreateLog(req, 'employee', () => create(req.body));
    res.status(201).json(result);
  }
);

export const employeeById = expressAsyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const result = await checkEntityExistence(id, getById, 'Пользователь');
    res.status(200).json(result);
  },
);

export const editEmployee = expressAsyncHandler(
  async (req: Request<{ id: string }, {}, Employee>, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const oldData = await checkEntityExistence(id, getById, 'Пользователь');
    const result = await withUpdateLog(
      req,
      'employee',
      id,
      () => edit({ id, ...req.body }),
      oldData,
    );
    res.status(200).json(result);
  },
);

export const deleteEmployee = expressAsyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const oldData = await checkEntityExistence(id, getById, 'Пользователь');
    const result = await withDeleteLog(
      req,
      'employee',
      id,
      () => deleteItem(id),
      oldData
    );
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