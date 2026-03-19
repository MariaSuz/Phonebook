import pool from '../config/db';
import camelcaseKeys from 'camelcase-keys';
import { File } from '../types/fileType';

export const getAll = async () => {
  const { rows: files } = await pool.query(
    'SELECT * FROM files',
  );
  return camelcaseKeys(files);
};

export const getById = async (id: string) => {
  const { rows: files } = await pool.query(
    `SELECT * FROM files WHERE id = $1`,
    [id],
  );
  return files[0] ? camelcaseKeys(files[0]) : null;
};

export const downloadById = async (id: string) => {
  const { rows: files } = await pool.query(
    `SELECT id, file_name, file_content, content_type, size_bytes, description, group_id, original_file_name
    FROM files
    WHERE id = $1`,
    [id],
  );
  return camelcaseKeys(files[0]) || null;
};

export const create = async ({
  fileName,
  fileContent,
  contentType,
  sizeBytes,
  description,
  groupId,
  originalFileName,
}: File) => {
  const { rows: files } = await pool.query(
    `INSERT INTO files(file_name, file_content, content_type, size_bytes, description, group_id, original_file_name)
    VALUES($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [
      fileName,
      fileContent,
      contentType,
      sizeBytes,
      description || null,
      groupId,
      originalFileName,
    ],
  );
  return camelcaseKeys(files[0]);
};

export const deleteItem = async (id: string) => {
  const { rows: files } = await pool.query(
    `DELETE FROM files
    WHERE id = $1
    RETURNING *`,
    [id],
  );
  return files[0] ? camelcaseKeys(files[0]) : null;
};
