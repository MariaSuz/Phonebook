import pool from '../config/db';
import camelcaseKeys from 'camelcase-keys';
import { Employee } from '../types/employeeType';

export const getAll = async () => {
  const { rows: employees } = await pool.query(
    `SELECT * FROM employees
     ORDER BY sort_order ASC`,
  );
  console.log('Raw rows:', employees);
  return camelcaseKeys(employees);
};

export const create = async ({
  fullName,
  position,
  cabinet,
  internalPhone,
  cityPhone,
  mobilePhone,
  email,
  departmentId,
  sortOrder = 999,
}: Employee) => {
  // Проверка существования отдела.
  const departmentCheck = await pool.query(
    'SELECT id FROM departments WHERE id = $1',
    [departmentId],
  );
  if (departmentCheck.rows.length === 0) {
    throw new Error('Department not found');
  }

  const { rows: employees } = await pool.query(
    `INSERT INTO employees(full_name, position, cabinet, internal_phone, city_phone, mobile_phone, email, department_id, sort_order)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`,
    [
      fullName,
      position,
      cabinet,
      internalPhone,
      cityPhone,
      mobilePhone,
      email,
      departmentId,
      sortOrder,
    ],
  );
  return camelcaseKeys(employees[0]);
};

export const getById = async (id: number) => {
  const { rows: employees } = await pool.query(
    `SELECT * FROM employees WHERE id = $1`,
    [id],
  );
  return employees[0] ? camelcaseKeys(employees[0]) : null;
};

export const edit = async ({
  fullName,
  position,
  cabinet,
  internalPhone,
  cityPhone,
  mobilePhone,
  email,
  departmentId,
  sortOrder,
  id,
}: Employee) => {
  const { rows: employees } = await pool.query(
    `UPDATE employees
    SET full_name = $1, position = $2, cabinet =$3,
    internal_phone = $4, city_phone = $5, mobile_phone = $6,
    email = $7, department_id = $8, sort_order = $9
    WHERE id = $10
    RETURNING id, full_name, position, cabinet, internal_phone, city_phone, mobile_phone,
    email, department_id, sort_order`,
    [
      fullName,
      position,
      cabinet,
      internalPhone,
      cityPhone,
      mobilePhone,
      email,
      departmentId,
      sortOrder,
      id,
    ],
  );
  return employees[0] ? camelcaseKeys(employees[0]) : null;
};

export const deleteItem = async (id: number) => {
  const { rows: employees } = await pool.query(
    `DELETE FROM employees
    WHERE id = $1
    RETURNING *`,
    [id],
  );
  return employees[0] ? camelcaseKeys(employees[0]) : null;
};

export const departmentUsers = async (departmentId: number) => {
  const { rows: employees } = await pool.query(
    `SELECT * FROM employees
    WHERE department_id = $1
    ORDER BY sort_order, full_name`,
    [departmentId],
  );
  return camelcaseKeys(employees);
};