import pg from "pg";
import * as dotenv from 'dotenv';

//Строка ниже загружает конфиг, без неё нет видимости файла .env
dotenv.config();
const { Pool } = pg;

const pool = new Pool({
  user: String(process.env.DB_USER),
  host: String(process.env.DB_HOST),
  database: String(process.env.DB_NAME),
  password: String(process.env.DB_PASSWORD),
  port: parseInt(process.env.DB_PORT || '5432'),
});

export default pool;
