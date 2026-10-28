import { initDatabase, sutando } from '../config/database.js';

export async function setupFreshExamDatabase() {
  console.log('[Exam Migration] Initializing fresh clean exam database tables...');
  initDatabase();
  const knex = sutando.connection();

  try {
    // 1. Master Exams Table (Eg: Term 1 Exam, Periodic Test 1, Annual Exam)
    await knex.raw(`
      CREATE TABLE IF NOT EXISTS exams (
        id INT AUTO_INCREMENT PRIMARY KEY,
        branch_id INT NOT NULL DEFAULT 1,
        academic_year_id INT NOT NULL DEFAULT 2,
        name VARCHAR(150) NOT NULL,
        exam_category ENUM('Periodic Test', 'Term Exam', 'Annual Exam', 'Unit Test') DEFAULT 'Term Exam',
        term_name VARCHAR(50) DEFAULT 'Term 1',
        start_date DATE NULL,
        end_date DATE NULL,
        max_theory_marks DECIMAL(5,2) DEFAULT 80.00,
        max_ia_marks DECIMAL(5,2) DEFAULT 20.00,
        pass_percentage DECIMAL(5,2) DEFAULT 33.00,
        status ENUM('Upcoming', 'Ongoing', 'Completed') DEFAULT 'Ongoing',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 2. Scholastic Marks Entries (Subject-wise: Theory + IA -> Total -> Auto Grade)
    await knex.raw(`
      CREATE TABLE IF NOT EXISTS exam_marks_entries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        branch_id INT NOT NULL DEFAULT 1,
        academic_year_id INT NOT NULL DEFAULT 2,
        exam_id INT NOT NULL,
        class_id INT NOT NULL,
        section_id INT NULL,
        subject_id INT NOT NULL,
        student_id INT NOT NULL,
        theory_marks DECIMAL(6,2) DEFAULT 0.00,
        ia_marks DECIMAL(6,2) DEFAULT 0.00,
        total_marks DECIMAL(6,2) DEFAULT 0.00,
        grade VARCHAR(10) DEFAULT 'E',
        grade_point DECIMAL(4,2) DEFAULT 0.00,
        is_absent TINYINT(1) DEFAULT 0,
        remarks VARCHAR(255) NULL,
        status ENUM('Draft', 'Submitted', 'Published') DEFAULT 'Draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_exam_stu_sub (exam_id, student_id, subject_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 3. Co-Scholastic Skills Master (Art, Sports, Work Ed, Discipline)
    await knex.raw(`
      CREATE TABLE IF NOT EXISTS co_scholastic_skills (
        id INT AUTO_INCREMENT PRIMARY KEY,
        branch_id INT NOT NULL DEFAULT 1,
        name VARCHAR(150) NOT NULL,
        category VARCHAR(100) DEFAULT 'General Activity',
        display_order INT DEFAULT 1,
        status ENUM('Active', 'Inactive') DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 4. Co-Scholastic Grades Entries (Student -> Skill -> Grade: A, B, C, D)
    await knex.raw(`
      CREATE TABLE IF NOT EXISTS exam_co_scholastic_entries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        branch_id INT NOT NULL DEFAULT 1,
        academic_year_id INT NOT NULL DEFAULT 2,
        exam_id INT NULL,
        term_name VARCHAR(50) DEFAULT 'Term 1',
        class_id INT NOT NULL,
        section_id INT NULL,
        student_id INT NOT NULL,
        co_scholastic_id INT NOT NULL,
        grade VARCHAR(5) NOT NULL DEFAULT 'A',
        remarks VARCHAR(255) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_stu_skill_term (student_id, co_scholastic_id, academic_year_id, term_name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 5. Seed default standard skills
    const [skills] = await knex.raw('SELECT count(*) as c FROM co_scholastic_skills');
    if (skills[0].c === 0) {
      await knex.raw(`
        INSERT INTO co_scholastic_skills (branch_id, name, category, display_order) VALUES
        (1, 'Art Education (Visual & Performing)', 'Artistic Expression', 1),
        (1, 'Health & Physical Education (Sports/Yoga)', 'Physical Well-being', 2),
        (1, 'Work Education (ICT / Craft & Skills)', 'Skill Activities', 3),
        (1, 'Discipline, Values & Conduct', 'Moral & Conduct', 4);
      `);
      console.log('[Exam Migration] Seeded default Co-Scholastic Skills.');
    }

    // 6. Seed default exams
    const [examsCount] = await knex.raw('SELECT count(*) as c FROM exams');
    if (examsCount[0].c === 0) {
      await knex.raw(`
        INSERT INTO exams (branch_id, academic_year_id, name, exam_category, term_name, start_date, end_date, max_theory_marks, max_ia_marks, pass_percentage, status) VALUES
        (1, 2, 'Periodic Test 1 (PT-1)', 'Periodic Test', 'Term 1', '2025-07-15', '2025-07-22', 40.00, 10.00, 33.00, 'Completed'),
        (1, 2, 'Term 1 Half-Yearly Exam', 'Term Exam', 'Term 1', '2025-09-15', '2025-09-28', 80.00, 20.00, 33.00, 'Ongoing'),
        (1, 2, 'Periodic Test 2 (PT-2)', 'Periodic Test', 'Term 2', '2025-12-10', '2025-12-18', 40.00, 10.00, 33.00, 'Upcoming'),
        (1, 2, 'Term 2 Annual Final Exam', 'Annual Exam', 'Term 2', '2026-03-10', '2026-03-25', 80.00, 20.00, 33.00, 'Upcoming');
      `);
      console.log('[Exam Migration] Seeded default standard Exams.');
    }

    console.log('[Exam Migration] Clean Exam Schema initialized successfully!');
  } catch (err) {
    console.error('[Exam Migration] Error:', err);
  }
}

if (process.argv[1]?.includes('setup_fresh_exam_db.js')) {
  setupFreshExamDatabase().then(() => process.exit(0));
}
