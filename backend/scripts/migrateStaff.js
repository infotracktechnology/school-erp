import { initDatabase } from '../config/database.js';

async function migrateStaff() {
  try {
    const sutando = initDatabase();
    const conn = sutando.connection();
    
    // 1. Create staff table
    await conn.raw(`
      CREATE TABLE IF NOT EXISTS staff (
        id INT AUTO_INCREMENT PRIMARY KEY,
        branch_id INT NOT NULL,
        staff_code VARCHAR(50) NOT NULL UNIQUE,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NULL,
        staff_type ENUM('Teaching', 'Non-Teaching') NOT NULL DEFAULT 'Teaching',
        department VARCHAR(100) NOT NULL,
        designation VARCHAR(100) NOT NULL,
        role_id INT NULL,
        user_id INT NULL,
        gender ENUM('Male', 'Female', 'Other') NOT NULL,
        date_of_birth DATE NULL,
        date_of_joining DATE NOT NULL,
        mobile VARCHAR(20) NOT NULL,
        alternate_phone VARCHAR(20) NULL,
        email VARCHAR(150) NULL,
        blood_group VARCHAR(10) NULL,
        aadhaar_number VARCHAR(20) NULL,
        qualification VARCHAR(255) NULL,
        experience_years DECIMAL(4,1) DEFAULT 0,
        employment_type ENUM('Permanent', 'Probation', 'Contract', 'Part-Time') DEFAULT 'Permanent',
        status ENUM('Active', 'On Leave', 'Resigned', 'Terminated') DEFAULT 'Active',
        address_line TEXT NULL,
        city VARCHAR(100) NULL,
        pincode VARCHAR(20) NULL,
        bank_name VARCHAR(100) NULL,
        bank_account_number VARCHAR(50) NULL,
        ifsc_code VARCHAR(20) NULL,
        pan_number VARCHAR(20) NULL,
        photo_url VARCHAR(255) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_branch_staff (branch_id, staff_type, status),
        INDEX idx_staff_code (staff_code)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('[Migration] staff table created successfully.');

    // 2. Create staff_allocations table
    await conn.raw(`
      CREATE TABLE IF NOT EXISTS staff_allocations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        branch_id INT NOT NULL,
        academic_year_id INT NOT NULL,
        staff_id INT NOT NULL,
        allocation_type ENUM('Class Teacher', 'Assistant Class Teacher', 'Class Coordinator', 'Subject Teacher') NOT NULL,
        class_id INT NOT NULL,
        section_id INT NULL,
        subject_id INT NULL,
        weekly_periods INT DEFAULT 0,
        is_primary BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_staff_alloc (staff_id, allocation_type),
        INDEX idx_class_sec_alloc (class_id, section_id, allocation_type),
        FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('[Migration] staff_allocations table created successfully.');

    // 3. Seed initial staff members if empty
    const [existing] = await conn.raw('SELECT COUNT(*) as count FROM staff');
    if (existing[0].count === 0) {
      console.log('[Migration] Seeding staff...');
      
      // Teaching staff
      await conn.raw(`
        INSERT INTO staff (branch_id, staff_code, first_name, last_name, staff_type, department, designation, gender, date_of_joining, mobile, email, qualification, experience_years, employment_type, status)
        VALUES 
        (1, 'TCH-001', 'Anand', 'Kumar', 'Teaching', 'Mathematics', 'PGT Mathematics', 'Male', '2021-06-01', '9840112233', 'anand.k@school.edu', 'M.Sc., B.Ed.', 8.5, 'Permanent', 'Active'),
        (1, 'TCH-002', 'Priya', 'Dharshini', 'Teaching', 'Science', 'TGT Science', 'Female', '2022-05-15', '9840223344', 'priya.d@school.edu', 'M.Sc., M.Ed.', 5.0, 'Permanent', 'Active'),
        (1, 'TCH-003', 'Murugan', 'K', 'Teaching', 'Languages', 'Tamil Pandit', 'Male', '2019-06-10', '9840334455', 'murugan.k@school.edu', 'M.A., B.Ed., M.Phil', 12.0, 'Permanent', 'Active'),
        (1, 'TCH-004', 'Kavitha', 'S', 'Teaching', 'English', 'TGT English', 'Female', '2023-01-05', '9840445566', 'kavitha.s@school.edu', 'M.A., B.Ed.', 4.0, 'Probation', 'Active'),
        (1, 'TCH-005', 'Suresh', 'Babu', 'Teaching', 'Physical Education', 'PET Coach', 'Male', '2020-08-20', '9840556677', 'suresh.b@school.edu', 'B.P.Ed, M.P.Ed', 7.0, 'Permanent', 'Active'),
        
        -- Non-Teaching staff
        (1, 'NT-001', 'Ramesh', 'Chandran', 'Non-Teaching', 'Administration', 'Senior Accountant', 'Male', '2018-04-01', '9840667788', 'ramesh.c@school.edu', 'M.Com, Tally Pro', 10.0, 'Permanent', 'Active'),
        (1, 'NT-002', 'Lakshmi', 'Narayanan', 'Non-Teaching', 'Administration', 'Front Desk Officer', 'Female', '2022-11-01', '9840778899', 'reception@school.edu', 'B.Com', 3.5, 'Permanent', 'Active'),
        (1, 'NT-003', 'Selvam', 'P', 'Non-Teaching', 'Transport', 'Senior Bus Driver', 'Male', '2017-06-01', '9840889900', 'transport@school.edu', 'Heavy Vehicle License', 15.0, 'Permanent', 'Active'),
        (1, 'NT-004', 'Deepa', 'R', 'Non-Teaching', 'Library', 'Chief Librarian', 'Female', '2021-03-15', '9840990011', 'library@school.edu', 'M.Lib.I.Sc.', 6.0, 'Permanent', 'Active'),
        (1, 'NT-005', 'Velu', 'M', 'Non-Teaching', 'Maintenance', 'Security Head', 'Male', '2019-01-10', '9840001122', 'security@school.edu', 'Ex-Serviceman', 9.0, 'Permanent', 'Active')
      `);

      // Seed staff_allocations
      // Anand Kumar (id=1): Class Teacher of Class 1 Sec A (c=1, s=1), Subject Teacher for Maths (c=1, s=1, sub=2)
      // Priya Dharshini (id=2): Assistant Class Teacher of Class 1 Sec A, Subject Teacher for Science (sub=3)
      // Murugan K (id=3): Class Coordinator for Class 1 (c=1, s=null), Subject Teacher for Tamil (sub=5)
      await conn.raw(`
        INSERT INTO staff_allocations (branch_id, academic_year_id, staff_id, allocation_type, class_id, section_id, subject_id, weekly_periods)
        VALUES
        (1, 2, 1, 'Class Teacher', 1, 1, NULL, 0),
        (1, 2, 1, 'Subject Teacher', 1, 1, 2, 6),
        (1, 2, 2, 'Assistant Class Teacher', 1, 1, NULL, 0),
        (1, 2, 2, 'Subject Teacher', 1, 1, 3, 5),
        (1, 2, 3, 'Class Coordinator', 1, NULL, NULL, 0),
        (1, 2, 3, 'Subject Teacher', 1, 1, 5, 5),
        (1, 2, 4, 'Subject Teacher', 1, 1, 1, 6)
      `);
      console.log('[Migration] Seeded sample staff and allocations.');
    }

    process.exit(0);
  } catch (err) {
    console.error('[Migration Error]:', err);
    process.exit(1);
  }
}

migrateStaff();
