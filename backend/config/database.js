import { sutando } from 'sutando';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

let isInitialized = false;

export function initDatabase() {
  if (isInitialized) {
    return sutando;
  }

  const connection = process.env.DATABASE_URL
    ? process.env.DATABASE_URL
    : {
        host: process.env.DB_HOST || '127.0.0.1',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'school_erp',
        charset: 'utf8mb4',
        connectTimeout: 3000,
      };

  sutando.addConnection({
    client: 'mysql2',
    connection,
    pool: {
      min: 0,
      max: 10,
      acquireTimeoutMillis: 3000,
    },
  });

  isInitialized = true;
  return sutando;
}

export async function testConnection() {
  try {
    initDatabase();
    await sutando.connection().raw('SELECT 1+1 AS result');
    console.log('[Sutando] MySQL Database connected successfully.');
    return true;
  } catch (error) {
    console.warn('[Sutando] MySQL connection notice (awaiting credentials):', error.message);
    return false;
  }
}

export { sutando };
export default sutando;
