import { Request, Response } from "express";
import {
  getAll,
  create,
  getById,
  edit,
  deleteItem,
} from '../models/Department';

export const allDepartments = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await getAll();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Отделы не найдены'});
  }
};

export const createDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Отдел не создан'});
  }
};

export const departmentById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const result = await getById(parseInt(req.params.id, 10));
    if (!result) {
      return res.status(404).json({ error: 'Отдел не найден' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Отдел не найден'});
  }
};

export const editDepartment = async (
  req: Request<{ id: string }, {}, { name: string; sortOrder?: number }>,
  res: Response,
) => {
  try {
    const result = await edit({
      id: parseInt(req.params.id, 10),
      name: req.body.name,
      sortOrder: req.body.sortOrder,
    });
    if (!result) {
      return res.status(404).json({ error: 'Отдел не найден' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Отдел не найден' });
  }
};

export const deleteDepartment = async (req: Request<{ id: number }>, res: Response) => {
  try {
    const result = await deleteItem(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Отдел не найден' });
    }
    res.status(205).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Отдел не найден' });
  }
};
