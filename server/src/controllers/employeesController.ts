import { Request, Response } from 'express';
import {
  getAll,
  create,
  getById,
  edit,
  deleteItem,
  departmentUsers,
} from '../models/Employees';

interface CreateUserRequest {
  departmentId: string;
  cabinet?: string;
  position?: string;
  fullName: string;
  internalPhone?: string;
  cityPhone?: string;
  mobilePhone?: string;
  email?: string;
  sortOrder?: number;
}
interface EditUserRequest {
  id: number;
  departmentId: string;
  cabinet?: string;
  position?: string;
  fullName: string;
  internalPhone?: string;
  cityPhone?: string;
  mobilePhone?: string;
  email?: string;
  sortOrder?: number;
}

export const allEmployees = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await getAll();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Пользователи не найдены' });
  }
};

export const createEmployee = async (
  req: Request<{}, {}, CreateUserRequest>,
  res: Response,
): Promise<void> => {
  try {
    const result = await create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Пользователь не создан' });
  }
};

export const employeeById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const result = await getById(parseInt(req.params.id, 10));
    if (!result) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Пользователь не найден' });
  }
};

export const editEmployee = async (
  req: Request<{ id: string }, {}, EditUserRequest>,
  res: Response,
) => {
  try {
    const result = await edit({
      id: parseInt(req.params.id, 10),
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
    if (!result) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Пользователь не найден' });
  }
};

export const deleteEmployee = async (req: Request<{ id: number }>, res: Response) => {
  try {
    const result = await deleteItem(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    res.status(205).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Пользователь не найден' });
  }
};

export const getEmployeesByDepartment = async (
  req: Request<{ departmentId: string }>,
  res: Response,
) => {
  try {
    const result = await departmentUsers(parseInt(req.params.departmentId, 10));
    if (!result) {
      return res
        .status(404)
        .json({ error: 'Пользователи не найдены в отделе' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Пользователи не найдены в отделе' });
  }
};