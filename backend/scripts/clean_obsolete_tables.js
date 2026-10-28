import { initDatabase, sutando } from '../config/database.js';

async function clean() {
  initDatabase();
  const conn = sutando.connection();
  await conn.raw('DROP TABLE IF EXISTS `attendances`');
  console.log('Successfully dropped obsolete table: attendances');
  await conn.raw('DROP TABLE IF EXISTS `class_sections`');
  console.log('Successfully dropped obsolete table: class_sections');
  process.exit(0);
}

clean().catch(err => {
  console.error('Error during cleanup:', err);
  process.exit(1);
});
