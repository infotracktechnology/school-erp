import { initDatabase, sutando } from '../config/database.js';

async function runCleanup() {
  initDatabase();
  const db = sutando.connection();

  console.log('--- Starting DB Cleanup & Real Name Alignment ---');

  // 1. Check current stats
  const [dummy] = await db.raw('SELECT id, user_id FROM students WHERE class_id IS NULL OR class_id = 999999');
  console.log(`Identified ${dummy.length} dummy students to clean up.`);
  const dummyIds = dummy.map(d => d.id);
  const dummyUserIds = dummy.map(d => d.user_id).filter(Boolean);

  // 2. Perform deletion of dummy records
  if (dummyIds.length > 0) {
    console.log('Deleting dummy student_profiles...');
    const [delSp] = await db.raw(`DELETE FROM student_profiles WHERE id IN (${dummyIds.join(',')})`);
    console.log(`Deleted ${delSp.affectedRows || delSp} from student_profiles.`);

    console.log('Deleting dummy students...');
    const [delS] = await db.raw(`DELETE FROM students WHERE id IN (${dummyIds.join(',')})`);
    console.log(`Deleted ${delS.affectedRows || delS} from students.`);
  }

  if (dummyUserIds.length > 0) {
    console.log('Deleting dummy users...');
    const [delU] = await db.raw(`DELETE FROM users WHERE id IN (${dummyUserIds.join(',')})`);
    console.log(`Deleted ${delU.affectedRows || delU} from users.`);
  }

  // 3. Sync student_profiles.user_id = s.user_id by matching sp.id = s.id
  console.log('Syncing student_profiles.user_id = students.user_id...');
  const [syncRes] = await db.raw(`
    UPDATE student_profiles sp
    JOIN students s ON sp.id = s.id
    SET sp.user_id = s.user_id
  `);
  console.log('Synced student_profiles.user_id:', syncRes.affectedRows, 'rows updated / matched.');

  // Also sync students first_name, last_name, parent details from student_profiles
  console.log('Syncing students details from student_profiles...');
  const [syncStudents] = await db.raw(`
    UPDATE students s
    JOIN student_profiles sp ON sp.id = s.id
    SET 
      s.first_name = COALESCE(sp.first_name, s.first_name),
      s.last_name = COALESCE(sp.last_name, s.last_name),
      s.parent_name = COALESCE(sp.parent_name, s.parent_name),
      s.parent_phone = COALESCE(sp.parent_phone, s.parent_phone),
      s.dob = COALESCE(sp.dob, s.dob),
      s.gender = COALESCE(sp.gender, s.gender),
      s.address = COALESCE(sp.address, s.address)
  `);
  console.log('Synced students table:', syncStudents.affectedRows, 'rows.');

  // Sync users.name to real student names
  console.log('Syncing users.name from student_profiles...');
  const [syncUsers] = await db.raw(`
    UPDATE users u
    JOIN students s ON s.user_id = u.id
    JOIN student_profiles sp ON sp.id = s.id
    SET u.name = TRIM(CONCAT(COALESCE(sp.first_name, ''), ' ', COALESCE(sp.last_name, '')))
    WHERE TRIM(CONCAT(COALESCE(sp.first_name, ''), ' ', COALESCE(sp.last_name, ''))) != ''
  `);
  console.log('Synced users table:', syncUsers.affectedRows, 'rows.');

  // 4. In sections table, fix Branch 2's class_id references from 1..10 to 11..20
  console.log('Fixing Branch 2 sections class_id references...');
  const [secRes] = await db.raw(`
    UPDATE sections
    SET class_id = class_id + 10
    WHERE branch_id = 2 AND class_id BETWEEN 1 AND 10
  `);
  console.log('Updated sections for Branch 2:', secRes.affectedRows, 'rows.');

  // Verification checks
  console.log('--- Verification Checks ---');
  const [remainingDummy] = await db.raw('SELECT COUNT(*) as c FROM students WHERE class_id IS NULL OR class_id = 999999');
  console.log('Remaining dummy students (expect 0):', remainingDummy[0].c);

  const [totalStudents] = await db.raw('SELECT COUNT(*) as c FROM students');
  console.log('Total valid students remaining (expect 751):', totalStudents[0].c);

  const [mismatchedSp] = await db.raw(`
    SELECT COUNT(*) as c FROM student_profiles sp
    JOIN students s ON sp.id = s.id
    WHERE sp.user_id != s.user_id
  `);
  console.log('Mismatched student_profiles user_id (expect 0):', mismatchedSp[0].c);

  const [b2SecCount] = await db.raw('SELECT id, branch_id, class_id, section_name FROM sections WHERE branch_id = 2');
  console.log('Branch 2 sections count (expect 20):', b2SecCount.length);
  console.log('Branch 2 class_ids in sections:', [...new Set(b2SecCount.map(s => s.class_id))].sort((a,b) => a-b));

  const [sampleStudents] = await db.raw(`
    SELECT s.id, s.admission_no, s.first_name, s.last_name, u.name as user_name, sp.first_name as sp_first_name, sp.last_name as sp_last_name
    FROM students s
    JOIN student_profiles sp ON s.user_id = sp.user_id
    JOIN users u ON s.user_id = u.id
    LIMIT 5
  `);
  console.log('Sample verified students joined on s.user_id = sp.user_id = u.id:', sampleStudents);

  console.log('--- Cleanup & Alignment Completed Successfully ---');
  process.exit(0);
}

runCleanup().catch(e => {
  console.error('Fatal error during cleanup:', e);
  process.exit(1);
});
