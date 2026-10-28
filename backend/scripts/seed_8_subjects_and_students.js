import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const DB_CONFIG = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'campuseyeplus',
};

export async function seedSubjectsAndStudentMapping() {
  console.log('[Seed] Connecting to MySQL database...');
  const conn = await mysql.createConnection(DB_CONFIG);

  try {
    const now = new Date();

    // 1. Get active Academic Year (2025-2026, ID=2 or active one)
    const [ayRows] = await conn.query('SELECT id, year_name FROM academic_years WHERE is_current = 1 LIMIT 1');
    const academicYearId = ayRows[0]?.id || 2;
    const academicYearStr = ayRows[0]?.year_name || '2025-2026';

    // 2. Get branches
    const [branchRows] = await conn.query('SELECT id, branch_name FROM branches');
    const branchIds = branchRows.map(b => b.id);
    const mainBranchId = branchIds[0] || 1;

    console.log(`Using Academic Year: ${academicYearStr} (ID: ${academicYearId}), Branch: ${mainBranchId}`);

    // 3. Define the 8 Standard Subjects (with Languages and Practical configurations)
    const subjectsToSeed = [
      {
        name: 'English Literature',
        code: 'ENG101',
        short_name: 'ENG',
        category: 'Languages',
        type: 'Academic',
        is_language: 1,
        language_name: 'English',
        language_level: 'First Language',
        requirement: 'Compulsory',
        pass_marks: 35,
        max_marks: 100,
        credits: 4,
        display_order: 1
      },
      {
        name: 'Tamil',
        code: 'TAM101',
        short_name: 'TAM',
        category: 'Languages',
        type: 'Academic',
        is_language: 1,
        language_name: 'Tamil',
        language_level: 'Second Language',
        requirement: 'Compulsory',
        pass_marks: 35,
        max_marks: 100,
        credits: 4,
        display_order: 2
      },
      {
        name: 'Hindi',
        code: 'HIN101',
        short_name: 'HIN',
        category: 'Languages',
        type: 'Academic',
        is_language: 1,
        language_name: 'Hindi',
        language_level: 'Third Language',
        requirement: 'Optional',
        pass_marks: 35,
        max_marks: 100,
        credits: 3,
        display_order: 3
      },
      {
        name: 'Mathematics',
        code: 'MAT101',
        short_name: 'MATH',
        category: 'Mathematics',
        type: 'Academic',
        is_language: 0,
        language_name: null,
        language_level: null,
        requirement: 'Compulsory',
        pass_marks: 35,
        max_marks: 100,
        credits: 5,
        display_order: 4
      },
      {
        name: 'General Science',
        code: 'SCI101',
        short_name: 'SCI',
        category: 'Sciences',
        type: 'Academic',
        is_language: 0,
        language_name: null,
        language_level: null,
        requirement: 'Compulsory',
        practical_applicable: 1,
        theory_periods: 4,
        practical_periods: 2,
        pass_marks: 35,
        max_marks: 100,
        credits: 4,
        display_order: 5
      },
      {
        name: 'Social Science',
        code: 'SOC101',
        short_name: 'SOC',
        category: 'Social Studies',
        type: 'Academic',
        is_language: 0,
        language_name: null,
        language_level: null,
        requirement: 'Compulsory',
        pass_marks: 35,
        max_marks: 100,
        credits: 4,
        display_order: 6
      },
      {
        name: 'Computer Science',
        code: 'CS101',
        short_name: 'CS',
        category: 'Computer Science & IT',
        type: 'Academic',
        is_language: 0,
        language_name: null,
        language_level: null,
        requirement: 'Elective',
        practical_applicable: 1,
        theory_periods: 3,
        practical_periods: 2,
        pass_marks: 35,
        max_marks: 100,
        credits: 3,
        display_order: 7
      },
      {
        name: 'Physical & Health Education',
        code: 'PHE101',
        short_name: 'PET',
        category: 'Arts & Physical Education',
        type: 'Non-Academic',
        is_language: 0,
        language_name: null,
        language_level: null,
        requirement: 'Compulsory',
        pass_marks: 35,
        max_marks: 50,
        credits: 2,
        display_order: 8
      }
    ];

    console.log(`\n[1/3] Upserting 8 master subjects in 'subjects' table...`);
    const masterSubjectMap = {};
    for (const sub of subjectsToSeed) {
      const [existing] = await conn.query('SELECT id FROM subjects WHERE subject_code = ?', [sub.code]);
      if (existing.length > 0) {
        masterSubjectMap[sub.code] = existing[0].id;
        await conn.query(
          `UPDATE subjects SET subject_name = ?, name = ?, type = ?, updated_at = ? WHERE id = ?`,
          [sub.name, sub.name, sub.requirement === 'Elective' ? 'Elective' : (sub.is_language ? 'Language' : 'Core'), now, existing[0].id]
        );
      } else {
        const [insertRes] = await conn.query(
          `INSERT INTO subjects (subject_name, name, subject_code, code, type, status, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, 'Active', ?, ?)`,
          [sub.name, sub.name, sub.code, sub.code, sub.requirement === 'Elective' ? 'Elective' : (sub.is_language ? 'Language' : 'Core'), now, now]
        );
        masterSubjectMap[sub.code] = insertRes.insertId;
      }
    }
    console.log('✓ Master subjects verified:', Object.keys(masterSubjectMap).length);

    // 4. Seed into `class_subjects` for all Classes (Class 1 to 10) in active branch & AY
    console.log(`\n[2/3] Seeding 8 subjects per class into 'class_subjects'...`);
    const [classes] = await conn.query('SELECT id, class_name, branch_id FROM classes WHERE branch_id = ?', [mainBranchId]);
    console.log(`Found ${classes.length} classes for branch ${mainBranchId}`);

    let classSubjectCount = 0;
    const classSubjectMap = {}; // key: `${class_id}_${subject_code}` -> class_subject id

    for (const c of classes) {
      for (const sub of subjectsToSeed) {
        const masterSubId = masterSubjectMap[sub.code] || null;
        const [existing] = await conn.query(
          `SELECT id FROM class_subjects 
           WHERE branch_id = ? AND academic_year_id = ? AND class_id = ? AND subject_code = ?`,
          [mainBranchId, academicYearId, c.id, sub.code]
        );

        if (existing.length > 0) {
          classSubjectMap[`${c.id}_${sub.code}`] = existing[0].id;
        } else {
          const [ins] = await conn.query(
            `INSERT INTO class_subjects (
              branch_id, academic_year_id, academic_year, board, class_id, subject_id,
              subject_name, subject_code, short_name, category_name, subject_type,
              is_language, language_name, language_level, requirement,
              practical_applicable, theory_periods, practical_periods, weekly_periods,
              exam_applicable, gradebook_applicable, reportcard_applicable, attendance_applicable,
              pass_marks, max_marks, credits, display_order, status, created_at, updated_at
            ) VALUES (
              ?, ?, ?, 'CBSE', ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?,
              ?, ?, ?, ?,
              1, 1, 1, 1,
              ?, ?, ?, ?, 'Active', ?, ?
            )`,
            [
              mainBranchId, academicYearId, academicYearStr, c.id, masterSubId,
              sub.name, sub.code, sub.short_name, sub.category, sub.type,
              sub.is_language, sub.language_name, sub.language_level, sub.requirement,
              sub.practical_applicable ? 1 : 0, sub.theory_periods || 5, sub.practical_periods || 0, (sub.theory_periods || 5) + (sub.practical_periods || 0),
              sub.pass_marks, sub.max_marks, sub.credits, sub.display_order, now, now
            ]
          );
          classSubjectMap[`${c.id}_${sub.code}`] = ins.insertId;
          classSubjectCount++;
        }
      }
    }
    console.log(`✓ 'class_subjects' seeded/synced (${classSubjectCount} newly created across all classes)`);

    // 5. Assign subjects to all Students in `student_subjects` table
    console.log(`\n[3/3] Assigning 8 subjects to all students in 'student_subjects'...`);
    const [students] = await conn.query(
      `SELECT s.id, s.admission_no, s.class_id, s.branch_id, s.academic_year_id, sp.first_name, sp.last_name 
       FROM students s
       LEFT JOIN student_profiles sp ON s.user_id = sp.user_id`
    );

    console.log(`Found ${students.length} students to enroll into subjects.`);

    let studentSubjectEnrollments = 0;
    for (const stu of students) {
      const stuBranchId = stu.branch_id || mainBranchId;
      const stuAyId = stu.academic_year_id || academicYearId;
      const stuClassId = stu.class_id;

      for (const sub of subjectsToSeed) {
        const masterSubId = masterSubjectMap[sub.code] || null;
        const csId = classSubjectMap[`${stuClassId}_${sub.code}`] || null;

        // Check if student already enrolled in this subject for this academic year
        const [existing] = await conn.query(
          `SELECT id FROM student_subjects 
           WHERE academic_year_id = ? AND student_id = ? AND subject_code = ?`,
          [stuAyId, stu.id, sub.code]
        );

        if (existing.length === 0) {
          await conn.query(
            `INSERT INTO student_subjects (
              branch_id, academic_year_id, student_id, class_id, subject_id, class_subject_id,
              subject_name, subject_code, subject_type, is_language, language_level,
              enrollment_type, status, created_at, updated_at
            ) VALUES (
              ?, ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, 'Active', ?, ?
            )`,
            [
              stuBranchId, stuAyId, stu.id, stuClassId, masterSubId, csId,
              sub.name, sub.code, sub.type, sub.is_language, sub.language_level,
              sub.requirement, now, now
            ]
          );
          studentSubjectEnrollments++;
        }
      }
    }

    console.log(`✓ Assigned subjects to students: ${studentSubjectEnrollments} enrollments created!`);

    console.log('\n======================================================');
    console.log('🎉 8 Subjects & Student Mapping successfully seeded!');
    console.log('======================================================');
  } finally {
    await conn.end();
  }
}

// Execute directly if run via CLI
seedSubjectsAndStudentMapping()
  .then(() => {
    console.log('Script execution completed.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Fatal error during seed:', err);
    process.exit(1);
  });
