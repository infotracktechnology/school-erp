import { initDatabase, sutando } from '../config/database.js';

async function migrate() {
  initDatabase();
  const conn = sutando.connection();
  const spCols = await conn.raw("SHOW COLUMNS FROM student_profiles LIKE 'extra_details'");
  if (spCols[0].length === 0) {
    await conn.raw("ALTER TABLE student_profiles ADD COLUMN extra_details JSON DEFAULT NULL");
    console.log("Added extra_details JSON column to student_profiles");
  } else {
    console.log("extra_details column already exists");
  }
  process.exit(0);
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});
