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

async function setupLanguageLevels() {
  console.log('[Setup 2nd & 3rd Language Subjects] Connecting to database...');
  const conn = await mysql.createConnection(DB_CONFIG);

  try {
    const now = new Date();
    const branchId = 1;
    const academicYearId = 2; // 2025-2026
    const academicYearStr = '2025-2026';

    // 1. Ensure Subjects exist in master `subjects` table
    const languageMaster = [
      { name: 'Tamil (2nd Language)', code: 'TAM201', type: 'Language' },
      { name: 'Hindi (2nd Language)', code: 'HIN201', type: 'Language' },
      { name: 'Tamil (3rd Language)', code: 'TAM301', type: 'Language' },
      { name: 'Hindi (3rd Language)', code: 'HIN301', type: 'Language' },
    ];

    const subjectMasterMap = {};
    for (const lm of languageMaster) {
      const [ex] = await conn.execute('SELECT id FROM subjects WHERE subject_code = ?', [lm.code]);
      if (ex.length > 0) {
        subjectMasterMap[lm.code] = ex[0].id;
        await conn.execute('UPDATE subjects SET name = ?, subject_name = ? WHERE id = ?', [lm.name, lm.name, ex[0].id]);
      } else {
        const [res] = await conn.execute(
          `INSERT INTO subjects (branch_id, name, subject_name, subject_code, type, subject_type, status, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [branchId, lm.name, lm.name, lm.code, lm.type, 'Academic', 'Active', now, now]
        );
        subjectMasterMap[lm.code] = res.insertId;
      }
    }
    console.log('✓ Master subjects verified:', subjectMasterMap);

    // 2. Fetch classes 1 to 10
    const [classes] = await conn.execute('SELECT id, class_name FROM classes WHERE branch_id = ? ORDER BY id ASC', [branchId]);

    // 3. For each class, configure:
    // Remove the old TAM101 & HIN101 from class_subjects, replace with:
    // TAM201 (Tamil 2nd Lang - Optional)
    // HIN201 (Hindi 2nd Lang - Optional)
    // TAM301 (Tamil 3rd Lang - Optional)
    // HIN301 (Hindi 3rd Lang - Optional)
    for (const cls of classes) {
      // Remove old generic TAM101 and HIN101 for this class
      await conn.execute(
        `DELETE FROM class_subjects WHERE class_id = ? AND branch_id = ? AND academic_year_id = ? AND subject_code IN ('TAM101', 'HIN101')`,
        [cls.id, branchId, academicYearId]
      );

      const languagesToAdd = [
        {
          subject_name: 'Tamil (2nd Language)',
          subject_code: 'TAM201',
          language_name: 'Tamil',
          language_level: 'Second Language',
          requirement: 'Optional',
          display_order: 2,
          sub_id: subjectMasterMap['TAM201']
        },
        {
          subject_name: 'Hindi (2nd Language)',
          subject_code: 'HIN201',
          language_name: 'Hindi',
          language_level: 'Second Language',
          requirement: 'Optional',
          display_order: 3,
          sub_id: subjectMasterMap['HIN201']
        },
        {
          subject_name: 'Tamil (3rd Language)',
          subject_code: 'TAM301',
          language_name: 'Tamil',
          language_level: 'Third Language',
          requirement: 'Optional',
          display_order: 4,
          sub_id: subjectMasterMap['TAM301']
        },
        {
          subject_name: 'Hindi (3rd Language)',
          subject_code: 'HIN301',
          language_name: 'Hindi',
          language_level: 'Third Language',
          requirement: 'Optional',
          display_order: 5,
          sub_id: subjectMasterMap['HIN301']
        },
      ];

      for (const lang of languagesToAdd) {
        const [exCs] = await conn.execute(
          `SELECT id FROM class_subjects WHERE class_id = ? AND branch_id = ? AND academic_year_id = ? AND subject_code = ?`,
          [cls.id, branchId, academicYearId, lang.subject_code]
        );

        if (exCs.length === 0) {
          await conn.execute(
            `INSERT INTO class_subjects (
              branch_id, academic_year_id, academic_year, board, class_id,
              subject_id, subject_name, subject_code, short_name, category_name,
              subject_type, is_language, language_name, language_level, requirement,
              practical_applicable, exam_applicable, gradebook_applicable,
              reportcard_applicable, attendance_applicable, homework_applicable,
              assignment_applicable, timetable_applicable, promotion_applicable,
              pass_marks, max_marks, credits, display_order, status, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              branchId, academicYearId, academicYearStr, 'CBSE', cls.id,
              lang.sub_id, lang.subject_name, lang.subject_code, lang.subject_code, 'Language Subject',
              'Academic', 1, lang.language_name, lang.language_level, lang.requirement,
              0, 1, 1,
              1, 1, 1,
              1, 1, 1,
              35, 100, 4, lang.display_order, 'Active', now, now
            ]
          );
        }
      }
    }
    console.log('✓ Class subjects configured with Tamil (2nd & 3rd Lang) & Hindi (2nd & 3rd Lang)');

    // 4. Update student enrollments for these classes:
    // Split students:
    // Group A (Even roll/id): Tamil (2nd Lang) + Hindi (3rd Lang)
    // Group B (Odd roll/id): Hindi (2nd Lang) + Tamil (3rd Lang)
    // Clear old TAM101 & HIN101 from student_subjects
    await conn.execute(`DELETE FROM student_subjects WHERE subject_code IN ('TAM101', 'HIN101') AND academic_year_id = ?`, [academicYearId]);

    // Fetch class_subjects for lookup
    const [allCs] = await conn.execute(`SELECT * FROM class_subjects WHERE branch_id = ? AND academic_year_id = ?`, [branchId, academicYearId]);
    const csMap = {};
    for (const item of allCs) {
      csMap[`${item.class_id}_${item.subject_code}`] = item;
    }

    const [students] = await conn.execute(`SELECT id, class_id, section_id FROM students WHERE status = 'Active'`);
    let assignedCount = 0;

    for (let i = 0; i < students.length; i++) {
      const stu = students[i];
      // Alternate language choices
      const takesTamil2nd = (i % 2 === 0);
      const chosenLangCodes = takesTamil2nd 
        ? ['TAM201', 'HIN301'] // Tamil 2nd Lang + Hindi 3rd Lang
        : ['HIN201', 'TAM301']; // Hindi 2nd Lang + Tamil 3rd Lang

      for (const code of chosenLangCodes) {
        const cs = csMap[`${stu.class_id}_${code}`];
        if (cs) {
          // Check if already mapped
          const [ex] = await conn.execute(
            `SELECT id FROM student_subjects WHERE student_id = ? AND subject_code = ? AND academic_year_id = ?`,
            [stu.id, code, academicYearId]
          );
          if (ex.length === 0) {
            await conn.execute(
              `INSERT INTO student_subjects (
                branch_id, academic_year_id, student_id, class_id, subject_id,
                class_subject_id, subject_name, subject_code, subject_type,
                is_language, language_level, enrollment_type, status,
                created_at, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                branchId, academicYearId, stu.id, stu.class_id, cs.subject_id,
                cs.id, cs.subject_name, cs.subject_code, cs.subject_type,
                cs.is_language, cs.language_level, cs.requirement, 'Active',
                now, now
              ]
            );
            assignedCount++;
          }
        }
      }
    }

    console.log(`✓ Automatically assigned 2nd & 3rd languages cleanly to ${students.length} students without conflict (${assignedCount} records added)!`);
    console.log('  -> Even students: Tamil (2nd Lang) + Hindi (3rd Lang)');
    console.log('  -> Odd students: Hindi (2nd Lang) + Tamil (3rd Lang)');

  } catch (err) {
    console.error('Error in setupLanguageLevels:', err);
    throw err;
  } finally {
    await conn.end();
  }
}

setupLanguageLevels()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
