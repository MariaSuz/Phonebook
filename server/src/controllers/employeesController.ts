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
import { auditService } from '../services/auditService';

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
  req: Request<{}, {}, Employee>,
  res: Response,
): Promise<void> => {
  try {
    const result = await create(req.body);
    await auditService.log({
      userId: (req as any).user?.userId,
      userName: (req as any).user?.userName,
      action: 'CREATE',
      entityType: 'employee',
      entityId: result.id,
      newData: result,
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Пользователь не создан' });
  }
};

export const employeeById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await getById(id);
    if (!result) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Пользователь не найден' });
  }
};

export const editEmployee = async (
  req: Request<{ id: string }, {}, Employee>,
  res: Response,
) => {
  try {
    const id = parseInt(req.params.id, 10);
    const oldData = await getById(id);
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
    if (!result) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    const hasChanges = JSON.stringify(oldData) !== JSON.stringify(result);
    if (hasChanges) {
      await auditService.log({
        userId: (req as any).user?.userId,
        userName: (req as any).user?.userName || 'system',
        action: 'UPDATE',
        entityType: 'employee',
        entityId: id,
        oldData: oldData,
        newData: result,
      });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Пользователь не найден' });
  }
};

export const deleteEmployee = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const oldData = await getById(id);
    const result = await deleteItem(id);
    if (!result) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    await auditService.log({
      userId: (req as any).user?.userId,
      userName: (req as any).user?.userName || 'system',
      action: 'DELETE',
      entityType: 'employee',
      entityId: id,
      oldData: oldData,
    });
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
    const departmentId = parseInt(req.params.departmentId, 10);
    const result = await departmentUsers(departmentId);
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