import pool from '../config/db';
import camelcaseKeys from 'camelcase-keys';
import { Department } from '../types/departmentType';

export const getAll = async () => {
  const { rows: departments } = await pool.query(
    `SELECT * FROM departments
     ORDER BY sort_order ASC, name ASC`,
  );
  return camelcaseKeys(departments);
};

export const create = async ({ name, sortOrder = 999 }: Department) => {
  const { rows: departments } = await pool.query(
    `INSERT INTO departments(name, sort_order)
    VALUES($1, $2)
    RETURNING *`,
    [name, sortOrder],
  );
  return camelcaseKeys(departments[0]);
};

export const getById = async (id: number) => {
  const { rows: departments } = await pool.query(
    `SELECT * FROM departments WHERE id = $1`,
    [id]
  );
  return departments[0] ? camelcaseKeys(departments[0]) : null;
};

export const edit = async ({ name, sortOrder, id }: Department) => {
  const { rows: departments } = await pool.query(
    `UPDATE departments
    SET name = $1, sort_order =$2
    WHERE id = $3
    RETURNING id, name, sort_order`,
    [name, sortOrder, id],
  );
  return departments[0] ? camelcaseKeys(departments[0]) : null;
};

export const deleteItem = async (id: number) => {
  const { rows: departments } = await pool.query(
    `DELETE FROM departments
    WHERE id = $1
    RETURNING *`,
    [id],
  );
  return departments[0] ? camelcaseKeys(departments[0]) : null;
};
