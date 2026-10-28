import { initDatabase, sutando } from '../config/database.js';

async function setup() {
  initDatabase();
  const conn = sutando.connection();

  await conn.raw(`
    CREATE TABLE IF NOT EXISTS academic_groups (
      id INT AUTO_INCREMENT PRIMARY KEY,
      branch_id INT DEFAULT 1,
      academic_year_id INT DEFAULT 3,
      name VARCHAR(150) NOT NULL,
      code VARCHAR(50) DEFAULT NULL,
      description TEXT DEFAULT NULL,
      status ENUM('Active', 'Inactive') DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('academic_groups table ready');

  await conn.raw(`
    CREATE TABLE IF NOT EXISTS academic_group_students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      academic_group_id INT NOT NULL,
      student_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_group_student (academic_group_id, student_id)
    )
  `);
  console.log('academic_group_students table ready');

  await conn.raw(`
    CREATE TABLE IF NOT EXISTS attendance_timings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      branch_id INT DEFAULT 1,
      academic_year_id INT DEFAULT 3,
      name VARCHAR(100) NOT NULL,
      start_time VARCHAR(10) DEFAULT '08:30',
      end_time VARCHAR(10) DEFAULT '09:00',
      grace_period INT DEFAULT 10,
      status ENUM('Active', 'Inactive') DEFAULT 'Active',
      description TEXT DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('attendance_timings table ready');

  await conn.raw(`
    CREATE TABLE IF NOT EXISTS attendance_assignments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      branch_id INT DEFAULT 1,
      academic_year_id INT DEFAULT 3,
      timing_id INT DEFAULT NULL,
      class_id INT DEFAULT NULL,
      section_id INT DEFAULT NULL,
      status ENUM('Active', 'Inactive') DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('attendance_assignments table ready');

  // Seed sample timing if empty
  const timingsCount = await conn.table('attendance_timings').count('id', { as: 'cnt' });
  const tCount = typeof timingsCount === 'number' ? timingsCount : (timingsCount[0]?.cnt || 0);
  if (tCount === 0) {
    await conn.table('attendance_timings').insert([
      { branch_id: 1, academic_year_id: 3, name: 'Regular Morning Session', start_time: '08:30', end_time: '15:30', grace_period: 15, status: 'Active', description: 'Standard school day timings' },
      { branch_id: 1, academic_year_id: 3, name: 'Senior Secondary Early Batch', start_time: '07:45', end_time: '14:30', grace_period: 10, status: 'Active', description: 'Classes 11 and 12 early lab schedule' },
      { branch_id: 2, academic_year_id: 4, name: 'Regular Morning Session', start_time: '08:30', end_time: '15:30', grace_period: 15, status: 'Active', description: 'Standard school day timings' }
    ]);
    console.log('Seeded sample attendance timings');
  }

  // Seed sample academic groups if empty
  const groupsCount = await conn.table('academic_groups').count('id', { as: 'cnt' });
  const gCount = typeof groupsCount === 'number' ? groupsCount : (groupsCount[0]?.cnt || 0);
  if (gCount === 0) {
    await conn.table('academic_groups').insert([
      { branch_id: 1, academic_year_id: 3, name: 'Science Club & Olympiad', code: 'SCI-OLYMP', description: 'Enrichment group for national and regional science competitions', status: 'Active' },
      { branch_id: 1, academic_year_id: 3, name: 'Robotics & AI Cohort', code: 'ROBO-AI', description: 'STEM innovators and robotics championship team', status: 'Active' },
      { branch_id: 2, academic_year_id: 4, name: 'Model United Nations', code: 'MUN-CHENNAI', description: 'Debate, diplomacy, and global policy group', status: 'Active' }
    ]);
    console.log('Seeded sample academic groups');
  }

  // Ensure attendance table extra columns
  const [cols] = await conn.raw('DESCRIBE attendance');
  const colNames = cols.map((c) => c.Field);
  const addCols = [
    { name: 'remarks', sql: 'ADD COLUMN remarks VARCHAR(255) NULL' },
    { name: 'custom_remark', sql: 'ADD COLUMN custom_remark VARCHAR(255) NULL' },
    { name: 'academic_year_id', sql: 'ADD COLUMN academic_year_id INT NULL' },
    { name: 'class_id', sql: 'ADD COLUMN class_id INT NULL' },
    { name: 'section_id', sql: 'ADD COLUMN section_id INT NULL' },
    { name: 'timing_id', sql: 'ADD COLUMN timing_id INT NULL' },
    { name: 'submitted_by', sql: 'ADD COLUMN submitted_by VARCHAR(100) NULL' },
    { name: 'updated_by', sql: 'ADD COLUMN updated_by VARCHAR(100) NULL' },
  ];
  for (const c of addCols) {
    if (!colNames.includes(c.name)) {
      await conn.raw('ALTER TABLE attendance ' + c.sql);
      console.log('Added column ' + c.name + ' to attendance table');
    }
  }

  // Reactivate students 13 and 14
  await conn.raw("UPDATE students SET status = 'Active' WHERE id IN (13, 14)");

  // Sample active students for all classes
  const sampleStudents = [
    // Class 1
    { fn: 'Aarav', ln: 'Patel', adm: 'ADM-2026-101', g: 'Male', c: 1, sName: 'A' },
    { fn: 'Bhavna', ln: 'Reddy', adm: 'ADM-2026-102', g: 'Female', c: 1, sName: 'A' },
    { fn: 'Chirag', ln: 'Gupta', adm: 'ADM-2026-103', g: 'Male', c: 1, sName: 'A' },
    { fn: 'Divya', ln: 'Nair', adm: 'ADM-2026-104', g: 'Female', c: 1, sName: 'B' },
    { fn: 'Eshan', ln: 'Venkatesh', adm: 'ADM-2026-105', g: 'Male', c: 1, sName: 'B' },
    // Class 2
    { fn: 'Pranav', ln: 'Iyer', adm: 'ADM-2026-201', g: 'Male', c: 2, sName: 'A' },
    { fn: 'Rohan', ln: 'Farooq', adm: 'ADM-2026-202', g: 'Male', c: 2, sName: 'A' },
    { fn: 'Gautam', ln: 'Menon', adm: 'ADM-2026-203', g: 'Male', c: 2, sName: 'A' },
    { fn: 'Hamsini', ln: 'Raman', adm: 'ADM-2026-204', g: 'Female', c: 2, sName: 'A' },
    { fn: 'Ishaan', ln: 'Suri', adm: 'ADM-2026-205', g: 'Male', c: 2, sName: 'B' },
    { fn: 'Janani', ln: 'Sridhar', adm: 'ADM-2026-206', g: 'Female', c: 2, sName: 'B' },
    // Class 3
    { fn: 'Karthik', ln: 'Subramaniam', adm: 'ADM-2026-301', g: 'Male', c: 3, sName: 'A' },
    { fn: 'Lavanya', ln: 'Sundaram', adm: 'ADM-2026-302', g: 'Female', c: 3, sName: 'A' },
    { fn: 'Manish', ln: 'Verma', adm: 'ADM-2026-303', g: 'Male', c: 3, sName: 'A' },
    { fn: 'Nithya', ln: 'Chandran', adm: 'ADM-2026-304', g: 'Female', c: 3, sName: 'B' },
    // Class 4
    { fn: 'Omkar', ln: 'Pande', adm: 'ADM-2026-401', g: 'Male', c: 4, sName: 'A' },
    { fn: 'Pooja', ln: 'Shankar', adm: 'ADM-2026-402', g: 'Female', c: 4, sName: 'A' },
    { fn: 'Qasim', ln: 'Ahmed', adm: 'ADM-2026-403', g: 'Male', c: 4, sName: 'A' },
    { fn: 'Ragini', ln: 'Mishra', adm: 'ADM-2026-404', g: 'Female', c: 4, sName: 'B' },
    // Class 5
    { fn: 'Sanjay', ln: 'Raghavan', adm: 'ADM-2026-501', g: 'Male', c: 5, sName: 'A' },
    { fn: 'Tanvi', ln: 'Deshmukh', adm: 'ADM-2026-502', g: 'Female', c: 5, sName: 'A' },
    { fn: 'Uday', ln: 'Shetty', adm: 'ADM-2026-503', g: 'Male', c: 5, sName: 'A' },
    { fn: 'Varun', ln: 'Kapoor', adm: 'ADM-2026-504', g: 'Male', c: 5, sName: 'B' },
    // Class 6
    { fn: 'Bilal', ln: 'Farooq', adm: 'ADM-2026-601', g: 'Male', c: 6, sName: 'A' },
    { fn: 'Waseem', ln: 'Akram', adm: 'ADM-2026-602', g: 'Male', c: 6, sName: 'A' },
    { fn: 'Yamini', ln: 'Krishnan', adm: 'ADM-2026-603', g: 'Female', c: 6, sName: 'B' },
    // Class 7
    { fn: 'Chris', ln: 'Thomas', adm: 'ADM-2026-701', g: 'Male', c: 7, sName: 'A' },
    { fn: 'Diya', ln: 'Karthik', adm: 'ADM-2026-702', g: 'Female', c: 7, sName: 'A' },
    { fn: 'Zoya', ln: 'Khan', adm: 'ADM-2026-703', g: 'Female', c: 7, sName: 'B' },
    // Class 8
    { fn: 'Ishita', ln: 'Vijay', adm: 'ADM-2026-801', g: 'Female', c: 8, sName: 'A' },
    { fn: 'Abhinav', ln: 'Bindra', adm: 'ADM-2026-802', g: 'Male', c: 8, sName: 'A' },
    { fn: 'Brijesh', ln: 'Shukla', adm: 'ADM-2026-803', g: 'Male', c: 8, sName: 'B' },
    // Class 9
    { fn: 'Kavin', ln: 'Murugan', adm: 'ADM-2026-901', g: 'Male', c: 9, sName: 'A' },
    { fn: 'Lavanya', ln: 'Bala', adm: 'ADM-2026-902', g: 'Female', c: 9, sName: 'A' },
    { fn: 'Chetan', ln: 'Bhagat', adm: 'ADM-2026-903', g: 'Male', c: 9, sName: 'B' },
    // Class 10
    { fn: 'Manoj', ln: 'Kumar', adm: 'ADM-2026-011', g: 'Male', c: 10, sName: 'A' },
    { fn: 'Nandhini', ln: 'Menon', adm: 'ADM-2026-012', g: 'Female', c: 10, sName: 'A' },
    { fn: 'Deepak', ln: 'Chahar', adm: 'ADM-2026-013', g: 'Male', c: 10, sName: 'B' },
  ];

  const now = new Date();
  for (const s of sampleStudents) {
    const [ex] = await conn.raw('SELECT id FROM students WHERE admission_no = ?', [s.adm]);
    if (ex && ex.length > 0) {
      await conn.raw("UPDATE students SET status = 'Active', class_id = ? WHERE id = ?", [s.c, ex[0].id]);
      continue;
    }

    const [secRows] = await conn.raw(
      'SELECT id FROM sections WHERE branch_id = 1 AND class_id = ? AND section_name = ? ORDER BY academic_year_id DESC LIMIT 1',
      [s.c, s.sName]
    );
    const secId = secRows && secRows.length > 0 ? secRows[0].id : null;

    const email = `${s.fn.toLowerCase()}.${s.ln.toLowerCase()}.${s.adm.toLowerCase().replace(/[^a-z0-9]/g, '')}@school.edu`;
    const [uRes] = await conn.raw(
      'INSERT INTO users (name, email, password, role_id, branch_id, status, created_at, updated_at) VALUES (?, ?, ?, 4, 1, ?, ?, ?)',
      [`${s.fn} ${s.ln}`, email, 'student123', 'Active', now, now]
    );
    const userId = uRes.insertId;

    await conn.raw(
      'INSERT INTO students (school_id, branch_id, user_id, admission_no, dob, gender, class_id, section_id, parent_id, admission_date, status, created_at, updated_at) VALUES (1, 1, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?)',
      [userId, s.adm, '2015-06-15', s.g, s.c, secId, '2026-06-01', 'Active', now, now]
    );

    await conn.raw(
      'INSERT INTO student_profiles (user_id, admission_number, first_name, last_name, dob, gender, blood_group, parent_name, parent_phone, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, s.adm, s.fn, s.ln, '2015-06-15', s.g, 'O+', `${s.fn}'s Parent`, '9842199999', 'Active', now, now]
    );
  }
  console.log('Seeded active students across classes 1-10');

  process.exit(0);
}

setup().catch(err => {
  console.error(err);
  process.exit(1);
});
