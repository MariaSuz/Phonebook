import { AppError } from "./errorHelper";
import pool from '../config/db';

export const checkEntityExistence = async <T>(
  id: number,
  getById: (id: number) => Promise<T | null>,
  entityName: string,
): Promise<T> => {
  const entryId = await getById(id);
  if (!entryId) {
    throw new AppError(`${entityName} не найден`, 404);
  }
  return entryId;
};

//валидация дубликатор по имени
export const checkFieldExistences = async (
  tableName: string,
  filedName: string,
  value: any,
  excludeId?: number,
): Promise<boolean> => {
  let query = `SELECT 1 FROM ${tableName} WHERE ${filedName} = $1`;
  const params: any[] = [value];

  if (excludeId !== undefined) {
    query += ` AND id != $2`;
    params.push(excludeId);
  }

  const { rows } = await pool.query(query, params);
  return rows.length > 0;
};