import { initDatabase, sutando } from '../config/database.js';

export async function createTimetableTables() {
  console.log('[Migration] Creating clean Timetable module tables...');
  initDatabase();
  const conn = sutando.connection();

  await conn.raw('SET FOREIGN_KEY_CHECKS = 0');

  // 1. Timetable Structures Master (e.g. Standard 8-Period Shift, Primary Shift)
  await conn.raw(`
    CREATE TABLE IF NOT EXISTS timetable_structures (
      id INT AUTO_INCREMENT PRIMARY KEY,
      branch_id INT NOT NULL DEFAULT 1,
      academic_year_id INT NOT NULL DEFAULT 2,
      name VARCHAR(150) NOT NULL,
      working_days JSON NULL, -- e.g. ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
      is_active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 2. Timetable Periods / Slots definition for each structure
  await conn.raw(`
    CREATE TABLE IF NOT EXISTS timetable_periods (
      id INT AUTO_INCREMENT PRIMARY KEY,
      structure_id INT NOT NULL,
      period_name VARCHAR(100) NOT NULL, -- e.g. Period 1, Assembly, Morning Break, Lunch Break
      period_type ENUM('teaching', 'break', 'assembly') DEFAULT 'teaching',
      start_time VARCHAR(10) NOT NULL, -- e.g. "09:00"
      end_time VARCHAR(10) NOT NULL, -- e.g. "09:45"
      display_order INT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (structure_id) REFERENCES timetable_structures(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 3. Mapping Structure to Classes & Sections
  await conn.raw(`
    CREATE TABLE IF NOT EXISTS timetable_class_mappings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      structure_id INT NOT NULL,
      class_id INT NOT NULL,
      section_id INT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_struct_cls_sec (structure_id, class_id, section_id),
      FOREIGN KEY (structure_id) REFERENCES timetable_structures(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 4. Weekly Timetable Slots (Class + Section + Day + Period -> Subject + Teacher + Room)
  await conn.raw(`
    CREATE TABLE IF NOT EXISTS timetable_slots (
      id INT AUTO_INCREMENT PRIMARY KEY,
      branch_id INT NOT NULL DEFAULT 1,
      academic_year_id INT NOT NULL DEFAULT 2,
      class_id INT NOT NULL,
      section_id INT NULL,
      period_id INT NOT NULL,
      day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
      subject_id INT NULL,
      teacher_id INT NULL,
      room_name VARCHAR(100) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_cls_day_period (class_id, section_id, day_of_week, period_id),
      FOREIGN KEY (period_id) REFERENCES timetable_periods(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await conn.raw('SET FOREIGN_KEY_CHECKS = 1');
  console.log('[Migration] Timetable module tables created successfully!');
}

createTimetableTables().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
