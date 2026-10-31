import { initDatabase, sutando } from '../config/database.js';
import { fileURLToPath } from 'url';
import path from 'path';
// import { seedAllData } from './seed_campuseyeplus.js';

export async function runMigrations(options = {}) {
  const isFresh = options.fresh || process.argv.includes('--fresh') || process.argv.includes('-f');
  const shouldSeed = options.seed !== false && (isFresh || process.argv.includes('--seed'));

  initDatabase();
  const conn = sutando.connection();
  

  console.log(`[Sutando Migrations] Starting database migration (fresh: ${isFresh})...`);

  if (isFresh) {
    console.log('[Sutando Migrations] ⚠️ Fresh migration requested: Dropping all existing tables...');
    await conn.raw('SET FOREIGN_KEY_CHECKS = 0');
    const [tables] = await conn.raw('SHOW TABLES');
    for (const row of tables) {
      const tableName = Object.values(row)[0];
      if (tableName) {
        await conn.raw(`DROP TABLE IF EXISTS \`${tableName}\``);
        console.log(`  - Dropped table: ${tableName}`);
      }
    }
    await conn.raw('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✓ All existing tables dropped cleanly.');
  }

  // 1. Organizations
  if (!(await conn.schema.hasTable('organizations'))) {
    await conn.schema.createTable('organizations', (table) => {
      table.increments('id').primary();
      table.string('organization_name', 191).nullable();
      table.string('name', 191).nullable();
      table.string('code', 50).nullable();
      table.text('logo').nullable();
      table.string('contact_email', 191).nullable();
      table.string('email', 191).nullable();
      table.string('contact_phone', 50).nullable();
      table.string('phone', 50).nullable();
      table.text('address').nullable();
      table.timestamps(true, true);
    });
    console.log('✓ Created organizations table');
  }

  // 2. Schools
  if (!(await conn.schema.hasTable('schools'))) {
    await conn.schema.createTable('schools', (table) => {
      table.increments('id').primary();
      table.integer('organization_id').unsigned().defaultTo(1);
      table.string('school_name', 191).notNullable();
      table.string('school_code', 50).notNullable();
      table.string('email', 191).nullable();
      table.string('phone', 50).nullable();
      table.text('address').nullable();
      table.string('board_type', 50).defaultTo('CBSE');
      table.string('status', 20).defaultTo('Active');
      table.timestamps(true, true);
    });
    console.log('✓ Created schools table');
  }

  // 3. Roles
  if (!(await conn.schema.hasTable('roles'))) {
    await conn.schema.createTable('roles', (table) => {
      table.increments('id').primary();
      table.string('name', 50).notNullable().unique();
      table.timestamps(true, true);
    });
    console.log('✓ Created roles table');
  }

  // 4. Users (Staff, Admins, Students, Parents)
  if (!(await conn.schema.hasTable('users'))) {
    await conn.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('name', 191).notNullable();
      table.string('email', 191).notNullable().unique();
      table.string('password', 255).notNullable();
      table.integer('role_id').unsigned().notNullable();
      table.integer('branch_id').unsigned().nullable().defaultTo(1);
      table.string('status', 20).defaultTo('Active');
      table.timestamps(true, true);
    });
    console.log('✓ Created users table');
  }

  // 5. Branches
  if (!(await conn.schema.hasTable('branches'))) {
    await conn.schema.createTable('branches', (table) => {
      table.increments('id').primary();
      table.integer('organization_id').unsigned().defaultTo(1);
      table.integer('school_id').unsigned().nullable().defaultTo(1);
      table.string('branch_name', 191).notNullable();
      table.string('branch_code', 50).nullable().defaultTo('BR01');
      table.string('short_name', 50).nullable();
      table.string('branch_type', 50).defaultTo('Main Branch');
      table.string('status', 20).defaultTo('Active');
      table.text('logo').nullable();
      table.string('address', 255).nullable();
      table.string('address_line_1', 255).nullable();
      table.string('address_line_2', 255).nullable();
      table.string('country', 100).defaultTo('India');
      table.string('state', 100).nullable().defaultTo('Tamil Nadu');
      table.string('district', 100).nullable().defaultTo('Coimbatore');
      table.string('city', 100).nullable().defaultTo('Coimbatore');
      table.string('pincode', 20).nullable().defaultTo('641001');
      table.string('phone', 50).nullable();
      table.string('alternative_phone', 50).nullable();
      table.string('email', 191).nullable();
      table.string('website', 191).nullable();
      table.string('branch_head_name', 191).nullable();
      table.string('branch_head_designation', 100).nullable();
      table.string('branch_head_mobile', 50).nullable();
      table.string('branch_head_email', 191).nullable();
      table.string('board', 50).nullable().defaultTo('CBSE');
      table.string('medium', 50).nullable().defaultTo('English');
      table.string('school_type', 50).nullable().defaultTo('Co-Educational');
      table.string('udise_code', 50).nullable();
      table.string('affiliation_number', 50).nullable();
      table.integer('established_year').nullable();
      table.timestamps(true, true);
    });
    console.log('✓ Created branches table');
  }

  // 6. Departments
  if (!(await conn.schema.hasTable('departments'))) {
    await conn.schema.createTable('departments', (table) => {
      table.increments('id').primary();
      table.string('name', 100).notNullable();
      table.timestamps(true, true);
    });
    console.log('✓ Created departments table');
  }

  // 7. Academic Years (Unique across ERP, branch-wise dates stored in JSON array)
  if (!(await conn.schema.hasTable('academic_years'))) {
    await conn.schema.createTable('academic_years', (table) => {
      table.increments('id').primary();
      table.integer('organization_id').unsigned().defaultTo(1);
      table.integer('branch_id').unsigned().nullable().defaultTo(1);
      table.string('name', 100).notNullable();
      table.string('year_name', 50).notNullable().unique();
      table.string('short_name', 50).nullable();
      table.date('start_date').notNullable();
      table.date('end_date').notNullable();
      table.string('status', 20).defaultTo('Active');
      table.boolean('is_current').defaultTo(false);
      table.boolean('is_active').defaultTo(false);
      table.boolean('is_enabled').defaultTo(true);
      table.boolean('is_next').defaultTo(false);
      table.json('branch_dates').nullable(); // JSON array: [{ branch_id, branch_name, start_date, end_date, status, is_current }]
      table.timestamps(true, true);
    });
    console.log('✓ Created academic_years table (unique sessions + branch_dates JSON)');
  }

  // 8. Classes
  if (!(await conn.schema.hasTable('classes'))) {
    await conn.schema.createTable('classes', (table) => {
      table.increments('id').primary();
      table.integer('department_id').unsigned().nullable();
      table.integer('branch_id').unsigned().nullable().defaultTo(1);
      table.integer('academic_year_id').unsigned().nullable();
      table.string('academic_year', 50).nullable().index();
      table.string('name', 100).nullable();
      table.string('class_name', 100).notNullable();
      table.integer('numeric_value').nullable();
      table.string('code', 50).nullable();
      table.string('stage', 50).nullable();
      table.integer('order_index').defaultTo(0);
      table.string('status', 20).defaultTo('Active');
      table.timestamps(true, true);
    });
    console.log('✓ Created classes table');
  }

  // 9. Academic Year Classes (Enablement per year & branch)
  if (!(await conn.schema.hasTable('academic_year_classes'))) {
    await conn.schema.createTable('academic_year_classes', (table) => {
      table.increments('id').primary();
      table.integer('branch_id').unsigned().notNullable();
      table.integer('academic_year_id').unsigned().nullable();
      table.string('academic_year', 50).nullable().index();
      table.integer('class_id').unsigned().notNullable();
      table.boolean('is_enabled').defaultTo(true);
      table.timestamps(true, true);
    });
    console.log('✓ Created academic_year_classes table');
  }

  // 10. Sections
  if (!(await conn.schema.hasTable('sections'))) {
    await conn.schema.createTable('sections', (table) => {
      table.increments('id').primary();
      table.integer('branch_id').unsigned().notNullable();
      table.integer('academic_year_id').unsigned().nullable();
      table.string('academic_year', 50).nullable().index();
      table.integer('class_id').unsigned().nullable();
      table.string('name', 50).nullable();
      table.string('section_name', 50).notNullable();
      table.integer('capacity').defaultTo(40);
      table.boolean('is_enabled').defaultTo(true);
      table.string('status', 20).defaultTo('Active');
      table.timestamps(true, true);
    });
    console.log('✓ Created sections table');
  }

  // 11. Class Sections Mapping
  if (!(await conn.schema.hasTable('class_sections'))) {
    await conn.schema.createTable('class_sections', (table) => {
      table.increments('id').primary();
      table.integer('class_id').unsigned().notNullable();
      table.integer('section_id').unsigned().notNullable();
      table.integer('capacity').defaultTo(40);
      table.string('room_no', 50).nullable();
      table.timestamps(true, true);
    });
    console.log('✓ Created class_sections table');
  }

  // 12. Parents
  if (!(await conn.schema.hasTable('parents'))) {
    await conn.schema.createTable('parents', (table) => {
      table.increments('id').primary();
      table.integer('school_id').unsigned().defaultTo(1);
      table.integer('branch_id').unsigned().defaultTo(1);
      table.string('father_name', 191).nullable();
      table.string('mother_name', 191).nullable();
      table.string('phone', 50).nullable();
      table.string('email', 191).nullable();
      table.text('address').nullable();
      table.string('occupation', 100).nullable();
      table.timestamps(true, true);
    });
    console.log('✓ Created parents table');
  }

  // 13. Students
  if (!(await conn.schema.hasTable('students'))) {
    await conn.schema.createTable('students', (table) => {
      table.increments('id').primary();
      table.integer('organization_id').unsigned().defaultTo(1);
      table.integer('school_id').unsigned().defaultTo(1);
      table.integer('branch_id').unsigned().notNullable();
      table.integer('user_id').unsigned().nullable();
      table.integer('parent_id').unsigned().nullable();
      table.integer('academic_year_id').unsigned().nullable();
      table.string('academic_year', 50).nullable().index();
      table.integer('class_id').unsigned().nullable();
      table.integer('section_id').unsigned().nullable();
      table.string('admission_number', 50).nullable();
      table.string('admission_no', 50).nullable();
      table.string('roll_number', 50).nullable();
      table.string('first_name', 100).nullable();
      table.string('last_name', 100).nullable();
      table.string('gender', 20).nullable();
      table.date('date_of_birth').nullable();
      table.date('dob').nullable();
      table.string('parent_name', 191).nullable();
      table.string('parent_phone', 50).nullable();
      table.string('parent_email', 191).nullable();
      table.string('address', 255).nullable();
      table.date('admission_date').nullable();
      table.text('fcm_tokens').nullable();
      table.string('status', 20).defaultTo('Active');
      table.timestamps(true, true);
    });
    console.log('✓ Created students table');
  } else {
    const hasFcmTokens = await conn.schema.hasColumn('students', 'fcm_tokens');
    if (!hasFcmTokens) {
      await conn.schema.alterTable('students', (table) => {
        table.text('fcm_tokens').nullable();
      });
      console.log('✓ Added fcm_tokens column to students table');
    }
  }

  // 14. Student Profiles
  if (!(await conn.schema.hasTable('student_profiles'))) {
    await conn.schema.createTable('student_profiles', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.string('admission_number', 50).nullable();
      table.string('first_name', 100).notNullable();
      table.string('last_name', 100).nullable();
      table.date('dob').nullable();
      table.string('gender', 20).nullable();
      table.string('blood_group', 20).nullable();
      table.text('address').nullable();
      table.string('parent_name', 191).nullable();
      table.string('parent_phone', 50).nullable();
      table.string('status', 20).defaultTo('Active');
      table.json('extra_details').nullable();
      table.timestamps(true, true);
    });
    console.log('✓ Created student_profiles table');
  }

  // 15. Student Promotions
  if (!(await conn.schema.hasTable('student_promotions'))) {
    await conn.schema.createTable('student_promotions', (table) => {
      table.increments('id').primary();
      table.integer('organization_id').unsigned().defaultTo(1);
      table.integer('branch_id').unsigned().notNullable();
      table.integer('student_id').unsigned().notNullable();
      table.integer('from_academic_year_id').unsigned().nullable();
      table.integer('to_academic_year_id').unsigned().nullable();
      table.string('from_academic_year', 50).nullable().index();
      table.string('to_academic_year', 50).nullable().index();
      table.integer('from_class_id').unsigned().notNullable();
      table.integer('from_section_id').unsigned().nullable();
      table.integer('to_class_id').unsigned().notNullable();
      table.integer('to_section_id').unsigned().nullable();
      table.string('result', 50).defaultTo('Passed');
      table.string('promotion_status', 50).defaultTo('Promoted');
      table.integer('academic_group_id').unsigned().nullable();
      table.text('remarks').nullable();
      table.string('promoted_by', 100).nullable();
      table.date('promoted_date').nullable();
      table.timestamps(true, true);
    });
    console.log('✓ Created student_promotions table');
  }

  // 16. Student Class Section History
  if (!(await conn.schema.hasTable('student_class_section_history'))) {
    await conn.schema.createTable('student_class_section_history', (table) => {
      table.increments('id').primary();
      table.integer('organization_id').unsigned().defaultTo(1);
      table.integer('branch_id').unsigned().notNullable();
      table.integer('academic_year_id').unsigned().nullable();
      table.string('academic_year', 50).nullable().index();
      table.integer('student_id').unsigned().notNullable();
      table.integer('from_class_id').unsigned().nullable();
      table.integer('from_section_id').unsigned().nullable();
      table.integer('to_class_id').unsigned().notNullable();
      table.integer('to_section_id').unsigned().notNullable();
      table.date('effective_date').notNullable();
      table.string('reason', 255).notNullable();
      table.text('remarks').nullable();
      table.string('changed_by', 100).nullable();
      table.timestamps(true, true);
    });
    console.log('✓ Created student_class_section_history table');
  }

  // 17. Academic Groups
  if (!(await conn.schema.hasTable('academic_groups'))) {
    await conn.schema.createTable('academic_groups', (table) => {
      table.increments('id').primary();
      table.integer('branch_id').unsigned().defaultTo(1);
      table.integer('academic_year_id').unsigned().nullable();
      table.string('academic_year', 50).nullable().index();
      table.string('name', 150).notNullable();
      table.string('code', 50).nullable();
      table.text('description').nullable();
      table.string('status', 20).defaultTo('Active');
      table.timestamps(true, true);
    });
    console.log('✓ Created academic_groups table');
  }

  // 18. Academic Group Students Mapping
  if (!(await conn.schema.hasTable('academic_group_students'))) {
    await conn.schema.createTable('academic_group_students', (table) => {
      table.increments('id').primary();
      table.integer('academic_group_id').unsigned().notNullable();
      table.integer('student_id').unsigned().notNullable();
      table.timestamps(true, true);
      table.unique(['academic_group_id', 'student_id']);
    });
    console.log('✓ Created academic_group_students table');
  }

  // 19. Attendance Timings
  if (!(await conn.schema.hasTable('attendance_timings'))) {
    await conn.schema.createTable('attendance_timings', (table) => {
      table.increments('id').primary();
      table.integer('branch_id').unsigned().defaultTo(1);
      table.integer('academic_year_id').unsigned().nullable();
      table.string('academic_year', 50).nullable().index();
      table.string('name', 100).notNullable();
      table.string('session_1_name', 100).nullable().defaultTo('Morning Session');
      table.string('session_2_name', 100).nullable().defaultTo('Afternoon Session');
      table.boolean('is_second_session').defaultTo(false);
      table.string('morning_start_time', 10).nullable().defaultTo('08:30');
      table.string('morning_end_time', 10).nullable().defaultTo('12:30');
      table.string('afternoon_start_time', 10).nullable().defaultTo('13:30');
      table.string('afternoon_end_time', 10).nullable().defaultTo('16:00');
      table.string('start_time', 10).defaultTo('08:30');
      table.string('end_time', 10).defaultTo('15:30');
      table.integer('grace_period').defaultTo(15);
      table.string('status', 20).defaultTo('Active');
      table.text('description').nullable();
      table.timestamps(true, true);
    });
    console.log('✓ Created attendance_timings table');
  }

  // 20. Attendance Assignments
  if (!(await conn.schema.hasTable('attendance_assignments'))) {
    await conn.schema.createTable('attendance_assignments', (table) => {
      table.increments('id').primary();
      table.integer('branch_id').unsigned().defaultTo(1);
      table.integer('academic_year_id').unsigned().nullable();
      table.string('academic_year', 50).nullable().index();
      table.integer('timing_id').unsigned().nullable();
      table.integer('class_id').unsigned().nullable();
      table.integer('section_id').unsigned().nullable();
      table.date('effective_from').nullable();
      table.date('effective_to').nullable();
      table.string('status', 20).defaultTo('Active');
      table.timestamps(true, true);
    });
    console.log('✓ Created attendance_assignments table');
  }

  // 21. Attendance (Singular)
  if (!(await conn.schema.hasTable('attendance'))) {
    await conn.schema.createTable('attendance', (table) => {
      table.increments('id').primary();
      table.integer('school_id').unsigned().nullable().defaultTo(1);
      table.integer('branch_id').unsigned().notNullable();
      table.integer('student_id').unsigned().notNullable();
      table.integer('class_id').unsigned().nullable();
      table.integer('section_id').unsigned().nullable();
      table.integer('academic_year_id').unsigned().nullable();
      table.string('academic_year', 50).nullable().index();
      table.integer('timing_id').unsigned().nullable();
      table.date('date').notNullable();
      table.string('status', 20).notNullable(); // Present, Absent, Late, Half Day
      table.string('remarks', 255).nullable();
      table.string('custom_remark', 255).nullable();
      table.string('submitted_by', 100).nullable();
      table.string('updated_by', 100).nullable();
      table.timestamps(true, true);
    });
    console.log('✓ Created attendance table');
  }

  // 22. Attendances (Plural synonym/compatibility)
  if (!(await conn.schema.hasTable('attendances'))) {
    await conn.schema.createTable('attendances', (table) => {
      table.increments('id').primary();
      table.integer('branch_id').unsigned().notNullable();
      table.integer('student_id').unsigned().notNullable();
      table.integer('class_id').unsigned().nullable();
      table.integer('section_id').unsigned().nullable();
      table.string('academic_year', 50).nullable().index();
      table.date('date').notNullable();
      table.string('status', 20).notNullable();
      table.string('remarks', 255).nullable();
      table.timestamps(true, true);
    });
    console.log('✓ Created attendances table');
  }

  // 23. Subjects
  if (!(await conn.schema.hasTable('subjects'))) {
    await conn.schema.createTable('subjects', (table) => {
      table.increments('id').primary();
      table.integer('branch_id').unsigned().nullable().defaultTo(1);
      table.string('name', 100).nullable();
      table.string('subject_name', 100).notNullable();
      table.string('code', 50).nullable();
      table.string('subject_code', 50).nullable();
      table.string('type', 50).nullable().defaultTo('Core');
      table.string('subject_type', 50).defaultTo('Academic');
      table.string('status', 20).defaultTo('Active');
      table.timestamps(true, true);
    });
    console.log('✓ Created subjects table');
  }

  // 24. Fee Structures
  if (!(await conn.schema.hasTable('fee_structures'))) {
    await conn.schema.createTable('fee_structures', (table) => {
      table.increments('id').primary();
      table.integer('class_id').unsigned().notNullable();
      table.string('academic_year', 50).nullable().index();
      table.string('fee_type', 100).notNullable();
      table.decimal('amount', 10, 2).notNullable();
      table.date('due_date').nullable();
      table.timestamps(true, true);
    });
    console.log('✓ Created fee_structures table');
  }

  // 25. Announcements
  if (!(await conn.schema.hasTable('announcements'))) {
    await conn.schema.createTable('announcements', (table) => {
      table.increments('id').primary();
      table.string('title', 191).notNullable();
      table.text('message').nullable();
      table.string('academic_year', 50).nullable().index();
      table.string('target_audience', 50).defaultTo('All');
      table.date('date_posted').nullable();
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
    });
    console.log('✓ Created announcements table');
  }

  // 26. Homework
  if (!(await conn.schema.hasTable('homework'))) {
    await conn.schema.createTable('homework', (table) => {
      table.increments('id').primary();
      table.integer('school_id').unsigned().defaultTo(1);
      table.integer('branch_id').unsigned().notNullable();
      table.integer('class_id').unsigned().notNullable();
      table.integer('section_id').unsigned().nullable();
      table.integer('subject_id').unsigned().notNullable();
      table.string('academic_year', 50).nullable().index();
      table.text('description').nullable();
      table.date('due_date').nullable();
      table.integer('created_by').unsigned().nullable();
      table.timestamps(true, true);
    });
    console.log('✓ Created homework table');
  }

  // 27. Communications
  if (!(await conn.schema.hasTable('communications'))) {
    await conn.schema.createTable('communications', (table) => {
      table.increments('id').primary();
      table.integer('branch_id').unsigned().notNullable();
      table.string('type', 50).notNullable();
      table.string('title', 191).notNullable();
      table.text('content').nullable();
      table.date('due_date').nullable();
      table.string('priority', 20).defaultTo('Normal');
      table.timestamps(true, true);
    });
    console.log('✓ Created communications table');
  }

  // 28. Subject Categories
  if (!(await conn.schema.hasTable('subject_categories'))) {
    await conn.schema.createTable('subject_categories', (table) => {
      table.increments('id').primary();
      table.string('name', 100).notNullable();
      table.string('code', 50).nullable();
      table.string('board', 50).defaultTo('CBSE');
      table.integer('display_order').defaultTo(1);
      table.string('status', 20).defaultTo('Active');
      table.timestamps(true, true);
    });
    console.log('✓ Created subject_categories table');
  }

  // 29. Class Subjects (Curriculum mapping)
  if (!(await conn.schema.hasTable('class_subjects'))) {
    await conn.schema.createTable('class_subjects', (table) => {
      table.increments('id').primary();
      table.integer('branch_id').unsigned().notNullable();
      table.integer('academic_year_id').unsigned().nullable();
      table.string('academic_year', 50).nullable();
      table.string('board', 50).defaultTo('CBSE');
      table.integer('class_id').unsigned().notNullable();
      table.integer('group_id').unsigned().nullable();
      table.integer('subject_id').unsigned().nullable();
      table.string('subject_name', 150).notNullable();
      table.string('subject_code', 50).notNullable();
      table.string('short_name', 50).nullable();
      table.string('category_name', 100).defaultTo('General');
      table.string('subject_type', 50).defaultTo('Academic');
      table.boolean('is_language').defaultTo(false);
      table.string('language_name', 50).nullable();
      table.string('language_level', 50).defaultTo('First Language');
      table.string('requirement', 50).defaultTo('Compulsory');
      table.string('elective_group_name', 100).nullable();
      table.integer('elective_min_count').defaultTo(1);
      table.integer('elective_max_count').defaultTo(1);
      table.boolean('practical_applicable').defaultTo(false);
      table.integer('theory_periods').defaultTo(5);
      table.integer('practical_periods').defaultTo(0);
      table.integer('weekly_periods').defaultTo(5);
      table.boolean('exam_applicable').defaultTo(true);
      table.boolean('gradebook_applicable').defaultTo(true);
      table.boolean('reportcard_applicable').defaultTo(true);
      table.boolean('attendance_applicable').defaultTo(true);
      table.boolean('homework_applicable').defaultTo(true);
      table.boolean('assignment_applicable').defaultTo(true);
      table.boolean('timetable_applicable').defaultTo(true);
      table.boolean('promotion_applicable').defaultTo(true);
      table.integer('pass_marks').defaultTo(35);
      table.integer('max_marks').defaultTo(100);
      table.integer('credits').defaultTo(4);
      table.integer('display_order').defaultTo(1);
      table.string('status', 20).defaultTo('Active');
      table.text('description').nullable();
      table.timestamps(true, true);
    });
    console.log('✓ Created class_subjects table');
  }

  // 30. Student Subjects (Direct student-to-subject enrollment / mapping)
  if (!(await conn.schema.hasTable('student_subjects'))) {
    await conn.schema.createTable('student_subjects', (table) => {
      table.increments('id').primary();
      table.integer('branch_id').unsigned().notNullable();
      table.integer('academic_year_id').unsigned().nullable();
      table.integer('student_id').unsigned().notNullable();
      table.integer('class_id').unsigned().notNullable();
      table.integer('subject_id').unsigned().nullable();
      table.integer('class_subject_id').unsigned().nullable();
      table.string('subject_name', 150).notNullable();
      table.string('subject_code', 50).notNullable();
      table.string('subject_type', 50).defaultTo('Core'); // Core, Language, Elective, Vocational
      table.boolean('is_language').defaultTo(false);
      table.string('language_level', 50).nullable(); // First Language, Second Language, Third Language
      table.string('enrollment_type', 50).defaultTo('Compulsory'); // Compulsory, Optional, Elective
      table.string('status', 20).defaultTo('Active');
      table.timestamps(true, true);
      table.unique(['academic_year_id', 'student_id', 'subject_code']);
    });
    console.log('✓ Created student_subjects table');
  }

  // Drop legacy user_fcm_tokens table if it exists
  if (await conn.schema.hasTable('user_fcm_tokens')) {
    await conn.schema.dropTable('user_fcm_tokens');
    console.log('✓ Dropped legacy user_fcm_tokens table (fcm_tokens stored directly in students)');
  }

  console.log('[Sutando Migrations] All schema migrations completed successfully!');

  // Seed sample data if requested or if fresh migration
  if (shouldSeed) {
    console.log('\n[Sutando Migrations] Seeding initial dataset...');
    await seedAllData();
  }
}

// Cross-platform CLI runner check
const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : '';

if (invokedFile && (currentFile === invokedFile || path.basename(currentFile) === path.basename(invokedFile))) {
  runMigrations()
    .then(() => {
      console.log('✓ Migration script finished successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Sutando Migrations] Fatal error running migrations:', err);
      process.exit(1);
    });
}
