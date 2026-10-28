import { initDatabase, sutando } from '../config/database.js';

async function migrate() {
  initDatabase();
  const db = sutando.connection();
  
  await db.raw(`
    CREATE TABLE IF NOT EXISTS assignments (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      organization_id INT UNSIGNED NOT NULL DEFAULT 1,
      branch_id INT UNSIGNED NOT NULL,
      academic_year_id INT UNSIGNED NOT NULL,
      class_id INT UNSIGNED NOT NULL,
      section_id INT UNSIGNED NULL,
      subject_id INT UNSIGNED NULL,
      subject_name VARCHAR(191) NOT NULL,
      teacher_name VARCHAR(191) NOT NULL DEFAULT 'Staff In-Charge',
      title VARCHAR(255) NOT NULL,
      description TEXT NULL,
      instructions TEXT NULL,
      submission_type VARCHAR(50) NOT NULL DEFAULT 'Online Submission',
      max_marks INT NOT NULL DEFAULT 50,
      assigned_date DATE NOT NULL,
      start_date DATE NOT NULL,
      due_date DATE NOT NULL,
      allow_resubmission TINYINT(1) NOT NULL DEFAULT 1,
      allow_late_submission TINYINT(1) NOT NULL DEFAULT 1,
      attachment_required TINYINT(1) NOT NULL DEFAULT 0,
      is_scheduled TINYINT(1) NOT NULL DEFAULT 0,
      start_at DATETIME NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'Published',
      attachments LONGTEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await db.raw(`
    CREATE TABLE IF NOT EXISTS assignment_submissions (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      assignment_id INT UNSIGNED NOT NULL,
      student_id INT UNSIGNED NOT NULL,
      submission_status VARCHAR(50) NOT NULL DEFAULT 'Pending',
      submission_file_url VARCHAR(255) NULL,
      submission_file_name VARCHAR(255) NULL,
      submission_notes TEXT NULL,
      submission_date DATETIME NULL,
      marks_obtained INT NULL,
      grade VARCHAR(20) NULL,
      remarks TEXT NULL,
      feedback TEXT NULL,
      reviewed_by VARCHAR(191) NULL,
      reviewed_at DATETIME NULL,
      offline_verified_by VARCHAR(191) NULL,
      offline_completion_date DATE NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY unique_assignment_student (assignment_id, student_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  console.log('Assignments tables created successfully!');
  process.exit(0);
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});
