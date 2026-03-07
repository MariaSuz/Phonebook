import pool from '../config/db';
import camelcaseKeys from 'camelcase-keys';
import bcrypt from 'bcrypt';

interface User {
  id?: number;
  userName: string;
  password: string;
  roleId: number;
  avatar?: string | null;
}

export const getAll = async () => {
  const { rows: users } = await pool.query(`SELECT * FROM users`);
  return camelcaseKeys(users);
};

export const findOne = async (userName: string) => {
  const { rows: users } = await pool.query(
    'SELECT * FROM users WHERE user_name = $1',
    [userName],
  );
  return users.length > 0 ? camelcaseKeys(users[0]) : null;
};

export const create = async ({
  userName,
  password,
  roleId = 2,
  avatar = null,
}: User) => {

  const salt = await bcrypt.genSalt();
  const hashedPassword = bcrypt.hashSync(password, salt);

  const { rows: users } = await pool.query(
    `INSERT INTO users(user_name, password, role_id, avatar)
    VALUES($1, $2, $3, $4)
    RETURNING id, user_name, role_id, avatar`,
    [userName, hashedPassword, roleId, avatar],
  );
  return camelcaseKeys(users[0]);
};

export const edit = async ({
  id,
  userName,
  password,
  roleId,
  avatar,
}: User) => {
  if (password) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = bcrypt.hashSync(password, salt);
    const { rows: users } = await pool.query(
      `UPDATE users
        SET user_name = $1, password = $2, role_id = $3, avatar = $4
        WHERE id = $5
        RETURNING id, user_name, role_id, avatar`,
      [userName, hashedPassword, roleId, avatar, id],
    );
    return users[0] ? camelcaseKeys(users[0]) : null;
  } else {
      const { rows: users } = await pool.query(
        `UPDATE users
        SET user_name = $1, role_id = $2, avatar = $3
        WHERE id = $4
        RETURNING id, user_name, role_id, avatar`,
        [userName, roleId, avatar, id],
      );
    return users[0] ? camelcaseKeys(users[0]) : null;
    }
  };

export const deleteItem = async (id: number) => {
  const { rows: users } = await pool.query(
    `DELETE FROM users
    WHERE id = $1
    RETURNING *`,
    [id],
  );
  return users[0] ? camelcaseKeys(users[0]) : null;
};
