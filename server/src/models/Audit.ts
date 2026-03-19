import pool from '../config/db';
import camelcaseKeys from 'camelcase-keys';
import { CreateAudit } from '../types/auditType';

export const getAll = async () => {
  const { rows: audit_log } = await pool.query(
    `SELECT * FROM audit_log
     ORDER BY timestamp DESC`,
  );
  return camelcaseKeys(audit_log);
};

export const create = async ({
  userId,
  userName,
  action,
  entityType,
  entityId,
  oldData,
  newData,
  diff,
}: CreateAudit) => {
  const { rows: audit_log } = await pool.query(
    `INSERT INTO audit_log(user_id, user_name, action, entity_type, entity_id, old_data, new_data, diff)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *`,
    [userId, userName, action, entityType, entityId, oldData, newData, diff],
  );
  return camelcaseKeys(audit_log[0]);
};
