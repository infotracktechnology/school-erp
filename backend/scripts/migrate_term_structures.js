import { initDatabase, sutando } from '../config/database.js';

export async function createTermTables() {
  console.log('[Migration] Creating clean Term Structure tables...');
  initDatabase();
  const conn = sutando.connection();

  await conn.raw('SET FOREIGN_KEY_CHECKS = 0');

  // 1. Term Structures Master
  await conn.raw(`
    CREATE TABLE IF NOT EXISTS exam_term_structures (
      id INT AUTO_INCREMENT PRIMARY KEY,
      branch_id INT NOT NULL DEFAULT 1,
      academic_year_id INT NOT NULL DEFAULT 2,
      structure_name VARCHAR(150) NOT NULL,
      board_type ENUM('CBSE', 'State Board', 'ICSE', 'Cambridge', 'Other') DEFAULT 'CBSE',
      is_active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 2. Applicable Classes per Term Structure
  await conn.raw(`
    CREATE TABLE IF NOT EXISTS exam_term_structure_classes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      structure_id INT NOT NULL,
      class_id INT NOT NULL,
      class_name VARCHAR(100) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_struct_class (structure_id, class_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 3. Terms inside the Structure
  await conn.raw(`
    CREATE TABLE IF NOT EXISTS exam_terms (
      id INT AUTO_INCREMENT PRIMARY KEY,
      structure_id INT NOT NULL,
      term_name VARCHAR(100) NOT NULL,
      display_name VARCHAR(100) NOT NULL,
      from_date DATE NULL,
      to_date DATE NULL,
      weightage_percent DECIMAL(5,2) DEFAULT 100.00,
      is_selected TINYINT(1) DEFAULT 1,
      display_order INT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await conn.raw('SET FOREIGN_KEY_CHECKS = 1');
  console.log('[Migration] Term Structure tables created successfully!');
}

createTermTables().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
