import { initDatabase, sutando } from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function audit() {
  console.log('=== 1. DATABASE AUDIT ===');
  initDatabase();
  const conn = sutando.connection();
  const [tables] = await conn.raw('SHOW TABLES');
  const tList = tables.map(t => Object.values(t)[0]);
  console.log(`Total Tables (${tList.length}):`);
  
  const tableStats = [];
  for (const t of tList) {
    try {
      const cnt = await conn.table(t).count();
      const num = typeof cnt === 'number' ? cnt : (cnt?.[0]?.['count(*)'] || 0);
      tableStats.push({ table: t, rows: num });
      console.log(`  - ${t}: ${num} rows`);
    } catch (e) {
      console.log(`  - ${t}: Error reading count: ${e.message}`);
    }
  }

  // Check duplicate or suspicious tables
  console.log('\n=== Check Potential Duplicate/Orphan Tables ===');
  if (tList.includes('attendance') && tList.includes('attendances')) {
    console.log('  WARNING: Both "attendance" and "attendances" exist!');
    const [attCols] = await conn.raw('DESCRIBE attendance');
    const [attsCols] = await conn.raw('DESCRIBE attendances');
    console.log('  "attendance" columns:', attCols.map(c => c.Field));
    console.log('  "attendances" columns:', attsCols.map(c => c.Field));
  }

  console.log('\n=== 2. BACKEND ROUTES & CONTROLLERS AUDIT ===');
  const routesDir = path.join(__dirname, '..', 'routes');
  const controllersDir = path.join(__dirname, '..', 'controllers');
  const routeFiles = fs.readdirSync(routesDir);
  const controllerFiles = fs.readdirSync(controllersDir);
  console.log(`Route Files (${routeFiles.length}):`, routeFiles);
  console.log(`Controller Files (${controllerFiles.length}):`, controllerFiles);

  process.exit(0);
}

audit().catch(e => {
  console.error('Audit failed:', e);
  process.exit(1);
});
