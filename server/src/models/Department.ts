import pool from '../config/db';
import camelcaseKeys from 'camelcase-keys';
import { Department, DepartmentCreateInput, DepartmentUpdateInput } from '../types/departmentType';
import { checkFieldExistences } from '../utils/entiryExists';
import { AppError } from '../utils/errorHelper';

export const getAll = async (): Promise<Department[]> => {
  const { rows: departments } = await pool.query(
    `SELECT
      id,
      name,
      sort_order
      FROM departments
     ORDER BY sort_order ASC, name ASC`,
  );
  return camelcaseKeys(departments);
};

export const create = async ({
  name,
  sortOrder = 999,
}: DepartmentCreateInput): Promise<Department> => {
  const nameExists = await checkFieldExistences('departments', 'name', name);
  if (nameExists) {
    throw new AppError(`Отдел с таким наименованием "${name}" уже существует`, 409);
  }
  const { rows: departments } = await pool.query(
    `INSERT INTO departments(name, sort_order)
    VALUES($1, $2)
    RETURNING *`,
    [name, sortOrder],
  );
  return camelcaseKeys(departments[0]);
};

export const getById = async (id: number): Promise<Department | null> => {
  const { rows: departments } = await pool.query(
    `SELECT * FROM departments WHERE id = $1`,
    [id],
  );
  return departments[0] ? camelcaseKeys(departments[0]) : null;
};

export const edit = async ({
  name,
  sortOrder,
  id,
}: DepartmentUpdateInput & { id: number }): Promise<Department | null> => {
  const nameExists = await checkFieldExistences('departments', 'name', name, id);
  if (nameExists) {
    throw new AppError(`Отдел с таким наименованием "${name}" уже существует`, 409);
  }
  const { rows: departments } = await pool.query(
    `UPDATE departments
    SET name = $1, sort_order =$2
    WHERE id = $3
    RETURNING id, name, sort_order`,
    [name, sortOrder, id],
  );
  return departments[0] ? camelcaseKeys(departments[0]) : null;
};

export const deleteItem = async (id: number): Promise<Department | null> => {
  const { rows: employees } = await pool.query(
    `SELECT id FROM employees WHERE department_id = $1 LIMIT 1`,
    [id],
  );
  if (employees.length > 0) {
    throw new AppError(`Невозможно удалить отдел: к нему привязаны сотрудники`, 409);
  };
  const { rows: departments } = await pool.query(
    `DELETE FROM departments
    WHERE id = $1
    RETURNING *`,
    [id],
  );
  return departments[0] ? camelcaseKeys(departments[0]) : null;
};
