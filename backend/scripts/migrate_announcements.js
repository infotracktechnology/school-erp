import { initDatabase, sutando } from '../config/database.js';

async function updateAnnouncementsSchema() {
  initDatabase();
  const db = sutando.connection();
  const [cols] = await db.raw('SHOW COLUMNS FROM announcements;');
  const colNames = cols.map(c => c.Field);
  console.log('Existing columns:', colNames);

  const toAdd = [
    { name: 'branch_id', def: 'INT UNSIGNED NULL' },
    { name: 'academic_year_id', def: 'INT UNSIGNED NULL' },
    { name: 'user_type', def: "VARCHAR(50) NOT NULL DEFAULT 'Both'" },
    { name: 'target_class_id', def: 'INT UNSIGNED NULL' },
    { name: 'target_section_id', def: 'INT UNSIGNED NULL' },
    { name: 'target_student_id', def: 'INT UNSIGNED NULL' },
    { name: 'target_student_name', def: 'VARCHAR(191) NULL' },
    { name: 'target_gender', def: 'VARCHAR(20) NULL' },
    { name: 'target_residential_type', def: 'VARCHAR(50) NULL' },
    { name: 'publish_date', def: 'DATE NULL' },
    { name: 'publish_time', def: 'VARCHAR(20) NULL' },
    { name: 'expiry_date', def: 'DATE NULL' },
    { name: 'priority', def: "VARCHAR(20) NOT NULL DEFAULT 'Normal'" },
    { name: 'is_scheduled', def: 'TINYINT(1) NOT NULL DEFAULT 0' },
    { name: 'start_at', def: 'DATETIME NULL' },
    { name: 'status', def: "VARCHAR(50) NOT NULL DEFAULT 'Published'" },
    { name: 'attachments', def: 'LONGTEXT NULL' }
  ];

  for (const col of toAdd) {
    if (!colNames.includes(col.name)) {
      await db.raw(`ALTER TABLE announcements ADD COLUMN ${col.name} ${col.def};`);
      console.log('Added column:', col.name);
    }
  }

  console.log('Announcements table updated successfully!');
  process.exit(0);
}

updateAnnouncementsSchema().catch(err => {
  console.error(err);
  process.exit(1);
});
