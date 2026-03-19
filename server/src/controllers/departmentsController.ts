import { Request, Response } from "express";
import {
  getAll,
  create,
  getById,
  edit,
  deleteItem,
} from '../models/Department';
import { Department } from "../types/departmentType";
import { auditService } from "../services/auditService";

export const allDepartments = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await getAll();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Отделы не найдены'});
  }
};

export const createDepartment = async (req: Request<{}, {}, Department>, res: Response): Promise<void> => {
  try {
    const result = await create(req.body);
    await auditService.log({
      userId: (req as any).user?.userId,
      userName: (req as any).user?.userName,
      action: 'CREATE',
      entityType: 'department',
      entityId: result.id,
      newData: result,
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Отдел не создан'});
  }
};

export const departmentById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await getById(id);
    if (!result) {
      return res.status(404).json({ error: 'Отдел не найден' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Отдел не найден'});
  }
};

export const editDepartment = async (
  req: Request<{ id: string }, {}, Department>,
  res: Response,
) => {
  try {
    const id = parseInt(req.params.id, 10);
    const oldData = await getById(id);
    const result = await edit({
      id: id,
      name: req.body.name,
      sortOrder: req.body.sortOrder,
    });
    if (!result) {
      return res.status(404).json({ error: 'Отдел не найден' });
    }
    const hasChanges = JSON.stringify(oldData) !== JSON.stringify(result);
    if (hasChanges) {
      await auditService.log({
        userId: (req as any).user?.userId,
        userName: (req as any).user?.userName || 'system',
        action: 'UPDATE',
        entityType: 'department',
        entityId: id,
        oldData: oldData,
        newData: result,
      });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Отдел не найден' });
  }
};

export const deleteDepartment = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const oldData = await getById(id);
    const result = await deleteItem(id);
    if (!result) {
      return res.status(404).json({ error: 'Отдел не найден' });
    }
    await auditService.log({
      userId: (req as any).user?.userId,
      userName: (req as any).user?.userName || 'system',
      action: 'DELETE',
      entityType: 'department',
      entityId: id,
      oldData: oldData,
    });
    res.status(205).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Отдел не найден' });
  }
};
