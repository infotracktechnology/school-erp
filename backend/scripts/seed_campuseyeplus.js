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

export async function seedAllData() {
  console.log(`[Seed] Connecting to MySQL '${DB_CONFIG.database}' at ${DB_CONFIG.host}:${DB_CONFIG.port}...`);
  const conn = await mysql.createConnection(DB_CONFIG);

  try {
    const now = new Date();

    // 1. ROLES
    console.log('[1/14] Seeding Roles...');
    const roles = ['Super Admin', 'Branch Admin', 'Teacher', 'Student', 'Parent', 'Accountant'];
    const roleMap = {};
    for (const r of roles) {
      const [existing] = await conn.query('SELECT id FROM roles WHERE name = ?', [r]);
      if (existing.length > 0) {
        roleMap[r] = existing[0].id;
      } else {
        const [res] = await conn.query(
          'INSERT INTO roles (name, created_at, updated_at) VALUES (?, ?, ?)',
          [r, now, now]
        );
        roleMap[r] = res.insertId;
      }
    }
    console.log('✓ Roles seeded/verified:', Object.keys(roleMap).length);

    // 2. ORGANIZATIONS
    console.log('[2/14] Seeding Organization...');
    let orgId = 1;
    const [existingOrg] = await conn.query('SELECT id FROM organizations LIMIT 1');
    if (existingOrg.length > 0) {
      orgId = existingOrg[0].id;
    } else {
      const [res] = await conn.query(
        `INSERT INTO organizations (name, logo, email, phone, address, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          'Vidya Mandir Educational Trust',
          null,
          'admin@vidyamandir.edu.in',
          '+91 422 2456789',
          '120 Educational Enclave, Coimbatore, Tamil Nadu 641018',
          now,
          now,
        ]
      );
      orgId = res.insertId;
    }
    console.log('✓ Organization ID:', orgId);

    // 3. SCHOOLS
    console.log('[3/14] Seeding School...');
    let schoolId = 1;
    const [existingSchool] = await conn.query('SELECT id FROM schools LIMIT 1');
    if (existingSchool.length > 0) {
      schoolId = existingSchool[0].id;
      await conn.query(
        `UPDATE schools SET school_name = ?, school_code = ?, board_type = ?, status = ?, updated_at = ? WHERE id = ?`,
        ['Vidya Mandir International School', 'VMIS-01', 'CBSE', 'Active', now, schoolId]
      );
    } else {
      const [res] = await conn.query(
        `INSERT INTO schools (school_name, school_code, email, phone, address, board_type, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'Vidya Mandir International School',
          'VMIS-01',
          'info@vidyamandir.edu.in',
          '+91 422 2567890',
          '100 Avinashi Road, Coimbatore, Tamil Nadu',
          'CBSE',
          'Active',
          now,
          now,
        ]
      );
      schoolId = res.insertId;
    }
    console.log('✓ School ID:', schoolId);

    // 4. BRANCHES
    console.log('[4/14] Seeding Branches...');
    const branchesData = [
      {
        name: 'Main Campus (Coimbatore)',
        address: '100 Avinashi Road, Peelamedu, Coimbatore 641004',
        phone: '+91 422 2567890',
      },
      {
        name: 'City Campus (Pollachi)',
        address: '45 Pollachi Main Road, Mahalingapuram, Pollachi 642002',
        phone: '+91 4259 223344',
      },
    ];
    const branchIds = [];
    for (const b of branchesData) {
      const [ex] = await conn.query('SELECT id FROM branches WHERE branch_name = ?', [b.name]);
      if (ex.length > 0) {
        branchIds.push(ex[0].id);
      } else {
        const [res] = await conn.query(
          `INSERT INTO branches (organization_id, branch_name, address, phone, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [orgId, b.name, b.address, b.phone, now, now]
        );
        branchIds.push(res.insertId);
      }
    }
    const mainBranchId = branchIds[0];
    console.log('✓ Branches seeded/verified:', branchIds);

    // 5. DEPARTMENTS
    console.log('[5/14] Seeding Departments...');
    const departments = [
      'Primary School (Grades 1-5)',
      'Middle School (Grades 6-8)',
      'Secondary School (Grades 9-10)',
      'Senior Secondary (Grades 11-12)',
    ];
    const deptMap = {};
    for (const d of departments) {
      const [ex] = await conn.query('SELECT id FROM departments WHERE name = ?', [d]);
      if (ex.length > 0) {
        deptMap[d] = ex[0].id;
      } else {
        const [res] = await conn.query(
          'INSERT INTO departments (name, created_at, updated_at) VALUES (?, ?, ?)',
          [d, now, now]
        );
        deptMap[d] = res.insertId;
      }
    }
    console.log('✓ Departments seeded/verified:', Object.keys(deptMap).length);

    // 6. ACADEMIC YEARS (Unique rows across ERP with branch-wise start/end dates in JSON array)
    console.log('[6/14] Seeding Academic Years...');
    const ayData = [
      {
        year: '2024-2025',
        name: 'Academic Year 2024-2025',
        short_name: '24-25',
        start: '2024-06-01',
        end: '2025-04-30',
        active: 0,
        is_current: 0,
        is_enabled: 1,
        status: 'Closed',
        branch_dates: [
          { branch_id: branchIds[0] || 1, branch_name: 'Main Campus (Coimbatore)', start_date: '2024-06-01', end_date: '2025-04-30', status: 'Closed' },
          { branch_id: branchIds[1] || 2, branch_name: 'City Campus (Pollachi)', start_date: '2024-06-10', end_date: '2025-05-05', status: 'Closed' }
        ]
      },
      {
        year: '2025-2026',
        name: 'Academic Year 2025-2026',
        short_name: '25-26',
        start: '2025-06-01',
        end: '2026-04-30',
        active: 1,
        is_current: 1,
        is_enabled: 1,
        status: 'Active',
        branch_dates: [
          { branch_id: branchIds[0] || 1, branch_name: 'Main Campus (Coimbatore)', start_date: '2025-06-01', end_date: '2026-04-30', status: 'Active' },
          { branch_id: branchIds[1] || 2, branch_name: 'City Campus (Pollachi)', start_date: '2025-06-15', end_date: '2026-05-10', status: 'Active' }
        ]
      },
      {
        year: '2026-2027',
        name: 'Academic Year 2026-2027',
        short_name: '26-27',
        start: '2026-06-01',
        end: '2027-04-30',
        active: 0,
        is_current: 0,
        is_enabled: 1,
        status: 'Upcoming',
        branch_dates: [
          { branch_id: branchIds[0] || 1, branch_name: 'Main Campus (Coimbatore)', start_date: '2026-06-01', end_date: '2027-04-30', status: 'Upcoming' },
          { branch_id: branchIds[1] || 2, branch_name: 'City Campus (Pollachi)', start_date: '2026-06-15', end_date: '2027-05-15', status: 'Upcoming' }
        ]
      },
    ];
    const ayMap = {};
    for (const ay of ayData) {
      const [ex] = await conn.query('SELECT id FROM academic_years WHERE year_name = ?', [ay.year]);
      if (ex.length > 0) {
        ayMap[ay.year] = ex[0].id;
        await conn.query(
          `UPDATE academic_years SET name = ?, short_name = ?, branch_dates = ?, is_current = ?, is_active = ?, status = ?, is_enabled = ?, updated_at = ? WHERE id = ?`,
          [ay.name, ay.short_name, JSON.stringify(ay.branch_dates), ay.is_current, ay.active, ay.status, ay.is_enabled, now, ex[0].id]
        );
      } else {
        const [res] = await conn.query(
          `INSERT INTO academic_years (branch_id, name, year_name, short_name, start_date, end_date, is_active, is_current, is_enabled, status, branch_dates, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [mainBranchId, ay.name, ay.year, ay.short_name, ay.start, ay.end, ay.active, ay.is_current, ay.is_enabled, ay.status, JSON.stringify(ay.branch_dates), now, now]
        );
        ayMap[ay.year] = res.insertId;
      }
    }
    const currentAcademicYearId = ayMap['2025-2026'];
    const currentAcademicYearStr = '2025-2026';
    console.log('✓ Academic Years seeded (3 unique years with branch_dates JSON). Current AY ID:', currentAcademicYearId);

    // 7. CLASSES
    console.log('[7/14] Seeding Classes...');
    const classesList = [
      { name: 'Class 1', num: 1, dept: 'Primary School (Grades 1-5)' },
      { name: 'Class 2', num: 2, dept: 'Primary School (Grades 1-5)' },
      { name: 'Class 3', num: 3, dept: 'Primary School (Grades 1-5)' },
      { name: 'Class 4', num: 4, dept: 'Primary School (Grades 1-5)' },
      { name: 'Class 5', num: 5, dept: 'Primary School (Grades 1-5)' },
      { name: 'Class 6', num: 6, dept: 'Middle School (Grades 6-8)' },
      { name: 'Class 7', num: 7, dept: 'Middle School (Grades 6-8)' },
      { name: 'Class 8', num: 8, dept: 'Middle School (Grades 6-8)' },
      { name: 'Class 9', num: 9, dept: 'Secondary School (Grades 9-10)' },
      { name: 'Class 10', num: 10, dept: 'Secondary School (Grades 9-10)' },
    ];
    const classMap = {};
    for (const c of classesList) {
      const deptId = deptMap[c.dept];
      const [ex] = await conn.query('SELECT id FROM classes WHERE class_name = ?', [c.name]);
      if (ex.length > 0) {
        classMap[c.name] = ex[0].id;
        await conn.query(
          `UPDATE classes SET academic_year = ?, academic_year_id = ? WHERE id = ?`,
          [currentAcademicYearStr, currentAcademicYearId, ex[0].id]
        );
      } else {
        const [res] = await conn.query(
          `INSERT INTO classes (department_id, class_name, numeric_value, academic_year, academic_year_id, branch_id, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [deptId, c.name, c.num, currentAcademicYearStr, currentAcademicYearId, mainBranchId, now, now]
        );
        classMap[c.name] = res.insertId;
      }
    }
    console.log('✓ Classes seeded/verified:', Object.keys(classMap).length);

    // 8. SECTIONS & ACADEMIC YEAR CLASS ENABLEMENT
    console.log('[8/14] Seeding Sections & Academic Year Classes...');
    const sectionNames = ['A', 'B'];
    const sectionMap = {};
    for (const c of classesList) {
      const cId = classMap[c.name];
      for (const bId of branchIds) {
        // Ensure academic_year_classes enablement entry exists
        const [exAyc] = await conn.query(
          `SELECT id FROM academic_year_classes WHERE branch_id = ? AND academic_year = ? AND class_id = ?`,
          [bId, currentAcademicYearStr, cId]
        );
        if (exAyc.length === 0) {
          await conn.query(
            `INSERT INTO academic_year_classes (branch_id, academic_year_id, academic_year, class_id, is_enabled, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [bId, currentAcademicYearId, currentAcademicYearStr, cId, 1, now, now]
          );
        }

        for (const sec of sectionNames) {
          const [ex] = await conn.query(
            `SELECT id FROM sections WHERE class_id = ? AND section_name = ? AND branch_id = ? AND (academic_year = ? OR academic_year_id = ?)`,
            [cId, sec, bId, currentAcademicYearStr, currentAcademicYearId]
          );
          const mapKey = `${c.name}_${sec}_${bId}`;
          if (ex.length > 0) {
            sectionMap[mapKey] = ex[0].id;
            await conn.query(
              `UPDATE sections SET academic_year = ?, academic_year_id = ? WHERE id = ?`,
              [currentAcademicYearStr, currentAcademicYearId, ex[0].id]
            );
          } else {
            const [res] = await conn.query(
              `INSERT INTO sections (branch_id, academic_year_id, academic_year, class_id, section_name, capacity, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [bId, currentAcademicYearId, currentAcademicYearStr, cId, sec, 40, now, now]
            );
            sectionMap[mapKey] = res.insertId;
          }
        }
      }
    }
    console.log('✓ Sections and AY-Classes seeded/verified:', Object.keys(sectionMap).length);

    // 9. SUBJECTS
    console.log('[9/14] Seeding Subjects...');
    const subjects = [
      { name: 'English Literature', code: 'ENG101', type: 'Core' },
      { name: 'Mathematics', code: 'MAT101', type: 'Core' },
      { name: 'General Science', code: 'SCI101', type: 'Core' },
      { name: 'Social Science', code: 'SOC101', type: 'Core' },
      { name: 'Tamil', code: 'TAM101', type: 'Language' },
      { name: 'Hindi', code: 'HIN101', type: 'Language' },
      { name: 'Computer Science', code: 'CS101', type: 'Elective' },
      { name: 'Physics', code: 'PHY101', type: 'Core' },
      { name: 'Chemistry', code: 'CHE101', type: 'Core' },
      { name: 'Biology', code: 'BIO101', type: 'Core' },
    ];
    const subjectMap = {};
    for (const sub of subjects) {
      const [ex] = await conn.query('SELECT id FROM subjects WHERE subject_code = ?', [sub.code]);
      if (ex.length > 0) {
        subjectMap[sub.code] = ex[0].id;
      } else {
        const [res] = await conn.query(
          `INSERT INTO subjects (subject_name, subject_code, type, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?)`,
          [sub.name, sub.code, sub.type, now, now]
        );
        subjectMap[sub.code] = res.insertId;
      }
    }
    console.log('✓ Subjects seeded/verified:', Object.keys(subjectMap).length);

    // 10. USERS (Admin, Teachers)
    console.log('[10/14] Seeding Admin & Staff Users...');
    const adminRole = roleMap['Super Admin'] || 1;
    const teacherRole = roleMap['Teacher'] || 3;
    const studentRole = roleMap['Student'] || 4;

    const [exAdmin] = await conn.query('SELECT id FROM users WHERE email = ?', ['admin@campuseye.com']);
    let adminUserId;
    if (exAdmin.length > 0) {
      adminUserId = exAdmin[0].id;
    } else {
      const [res] = await conn.query(
        `INSERT INTO users (name, email, password, role_id, branch_id, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        ['System Administrator', 'admin@campuseye.com', 'admin123', adminRole, mainBranchId, 'Active', now, now]
      );
      adminUserId = res.insertId;
    }

    // 11. PARENTS
    console.log('[11/14] Seeding Parents...');
    const parentsList = [
      { f: 'Rajesh Kumar', m: 'Priya Rajesh', p: '9842101234', e: 'rajesh.k@gmail.com', a: '12 Gandhi Nagar, Coimbatore' },
      { f: 'Suresh Menon', m: 'Anitha Suresh', p: '9842105678', e: 'suresh.m@gmail.com', a: '45 Anna Nagar, Coimbatore' },
      { f: 'Venkatesh Iyer', m: 'Lakshmi Iyer', p: '9842109012', e: 'venkat.i@gmail.com', a: '78 Tatabad, Coimbatore' },
      { f: 'Mohammed Farooq', m: 'Fatima Farooq', p: '9842103456', e: 'farooq.m@gmail.com', a: '23 RS Puram, Coimbatore' },
      { f: 'David Thomas', m: 'Mary Thomas', p: '9842107890', e: 'david.t@gmail.com', a: '56 Race Course, Coimbatore' },
      { f: 'Karthik Subramanian', m: 'Deepa Karthik', p: '9842112233', e: 'karthik.s@gmail.com', a: '89 Saibaba Colony, Coimbatore' },
      { f: 'Arun Prakash', m: 'Swetha Arun', p: '9842114455', e: 'arun.p@gmail.com', a: '15 Saravanampatti, Coimbatore' },
      { f: 'Vijay Anand', m: 'Meena Vijay', p: '9842116677', e: 'vijay.a@gmail.com', a: '67 Vadavalli, Coimbatore' },
      { f: 'Murugan Palanisamy', m: 'Kavitha Murugan', p: '9842118899', e: 'murugan.p@gmail.com', a: '34 Ramanathapuram, Coimbatore' },
      { f: 'Balamurugan Natarajan', m: 'Revathi Bala', p: '9842120011', e: 'bala.n@gmail.com', a: '90 Singanallur, Coimbatore' },
    ];
    const parentIds = [];
    for (const p of parentsList) {
      const [ex] = await conn.query('SELECT id FROM parents WHERE phone = ?', [p.p]);
      if (ex.length > 0) {
        parentIds.push(ex[0].id);
      } else {
        const [res] = await conn.query(
          `INSERT INTO parents (school_id, branch_id, father_name, mother_name, phone, email, address, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [schoolId, mainBranchId, p.f, p.m, p.p, p.e, p.a, now, now]
        );
        parentIds.push(res.insertId);
      }
    }
    console.log('✓ Parents seeded/verified:', parentIds.length);

    // 12. STUDENTS & STUDENT PROFILES
    console.log('[12/14] Seeding Students & Profiles...');
    const studentsSeedData = [
      { adm: 'ADM-2025-001', fn: 'Aarav', ln: 'Kumar', dob: '2015-05-12', g: 'Male', bg: 'B+', c: 'Class 5', sec: 'A', pIdx: 0 },
      { adm: 'ADM-2025-002', fn: 'Aditi', ln: 'Menon', dob: '2015-08-23', g: 'Female', bg: 'O+', c: 'Class 5', sec: 'A', pIdx: 1 },
      { adm: 'ADM-2025-003', fn: 'Ananya', ln: 'Iyer', dob: '2014-03-15', g: 'Female', bg: 'A+', c: 'Class 6', sec: 'A', pIdx: 2 },
      { adm: 'ADM-2025-004', fn: 'Bilal', ln: 'Farooq', dob: '2014-11-04', g: 'Male', bg: 'AB+', c: 'Class 6', sec: 'B', pIdx: 3 },
      { adm: 'ADM-2025-005', fn: 'Chris', ln: 'Thomas', dob: '2013-07-19', g: 'Male', bg: 'O-', c: 'Class 7', sec: 'A', pIdx: 4 },
      { adm: 'ADM-2025-006', fn: 'Diya', ln: 'Karthik', dob: '2013-09-30', g: 'Female', bg: 'B-', c: 'Class 7', sec: 'B', pIdx: 5 },
      { adm: 'ADM-2025-007', fn: 'Harish', ln: 'Prakash', dob: '2012-02-14', g: 'Male', bg: 'A-', c: 'Class 8', sec: 'A', pIdx: 6 },
      { adm: 'ADM-2025-008', fn: 'Ishita', ln: 'Vijay', dob: '2012-06-25', g: 'Female', bg: 'O+', c: 'Class 8', sec: 'A', pIdx: 7 },
      { adm: 'ADM-2025-009', fn: 'Kavin', ln: 'Murugan', dob: '2011-04-18', g: 'Male', bg: 'B+', c: 'Class 9', sec: 'A', pIdx: 8 },
      { adm: 'ADM-2025-010', fn: 'Lavanya', ln: 'Balamurugan', dob: '2011-12-05', g: 'Female', bg: 'A+', c: 'Class 9', sec: 'B', pIdx: 9 },
      { adm: 'ADM-2025-011', fn: 'Manoj', ln: 'Kumar', dob: '2010-01-22', g: 'Male', bg: 'B+', c: 'Class 10', sec: 'A', pIdx: 0 },
      { adm: 'ADM-2025-012', fn: 'Nandhini', ln: 'Menon', dob: '2010-09-17', g: 'Female', bg: 'O+', c: 'Class 10', sec: 'A', pIdx: 1 },
      { adm: 'ADM-2025-013', fn: 'Pranav', ln: 'Iyer', dob: '2018-04-11', g: 'Male', bg: 'AB+', c: 'Class 1', sec: 'A', pIdx: 2 },
      { adm: 'ADM-2025-014', fn: 'Rohan', ln: 'Farooq', dob: '2017-06-28', g: 'Male', bg: 'A+', c: 'Class 2', sec: 'A', pIdx: 3 },
      { adm: 'ADM-2025-015', fn: 'Sneha', ln: 'Thomas', dob: '2016-10-09', g: 'Female', bg: 'O-', c: 'Class 3', sec: 'A', pIdx: 4 },
      { adm: 'ADM-2025-016', fn: 'Tarun', ln: 'Karthik', dob: '2016-01-14', g: 'Male', bg: 'B+', c: 'Class 4', sec: 'B', pIdx: 5 },
    ];

    let createdStudentsCount = 0;
    for (const s of studentsSeedData) {
      const [ex] = await conn.query('SELECT id FROM students WHERE admission_no = ?', [s.adm]);
      if (ex.length === 0) {
        const parentId = parentIds[s.pIdx % parentIds.length];
        const classId = classMap[s.c] || 1;
        const sectionKey = `${s.c}_${s.sec}_${mainBranchId}`;
        const sectionId = sectionMap[sectionKey] || 1;

        // Create student user
        const studentEmail = `${s.fn.toLowerCase()}.${s.adm.toLowerCase()}@student.vidyamandir.edu`;
        let userId = null;
        const [exUser] = await conn.query('SELECT id FROM users WHERE email = ?', [studentEmail]);
        if (exUser.length > 0) {
          userId = exUser[0].id;
        } else {
          const [uRes] = await conn.query(
            `INSERT INTO users (name, email, password, role_id, branch_id, status, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [`${s.fn} ${s.ln}`, studentEmail, 'student123', studentRole, mainBranchId, 'Active', now, now]
          );
          userId = uRes.insertId;
        }

        // Create student in students table
        const [stuRes] = await conn.query(
          `INSERT INTO students (school_id, branch_id, user_id, admission_no, dob, gender, class_id, section_id, parent_id, academic_year, academic_year_id, admission_date, status, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [schoolId, mainBranchId, userId, s.adm, s.dob, s.g, classId, sectionId, parentId, currentAcademicYearStr, currentAcademicYearId, '2025-06-01', 'Active', now, now]
        );

        // Create student profile in student_profiles table
        const parentRecord = parentsList[s.pIdx % parentsList.length];
        await conn.query(
          `INSERT INTO student_profiles (user_id, admission_number, first_name, last_name, dob, gender, blood_group, address, parent_name, parent_phone, status, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            s.adm,
            s.fn,
            s.ln,
            s.dob,
            s.g,
            s.bg,
            parentRecord.a,
            parentRecord.f,
            parentRecord.p,
            'Active',
            now,
            now,
          ]
        );

        createdStudentsCount++;
      } else {
        await conn.query(
          `UPDATE students SET academic_year = ?, academic_year_id = ? WHERE id = ?`,
          [currentAcademicYearStr, currentAcademicYearId, ex[0].id]
        );
      }
    }
    console.log(`✓ Students seeded (${createdStudentsCount} created, ${studentsSeedData.length} verified)`);

    // 13. FEE STRUCTURES & ANNOUNCEMENTS
    console.log('[13/14] Seeding Fee Structures & Announcements...');
    for (const c of classesList) {
      const cId = classMap[c.name];
      const [ex] = await conn.query('SELECT id FROM fee_structures WHERE class_id = ? AND fee_type = ?', [cId, 'Tuition Fee']);
      if (ex.length === 0) {
        await conn.query(
          `INSERT INTO fee_structures (class_id, fee_type, amount, due_date, academic_year, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [cId, 'Tuition Fee', 25000.00, '2025-07-31', currentAcademicYearStr, now, now]
        );
        await conn.query(
          `INSERT INTO fee_structures (class_id, fee_type, amount, due_date, academic_year, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [cId, 'Lab & Activity Fee', 5000.00, '2025-07-31', currentAcademicYearStr, now, now]
        );
      }
    }

    const announcements = [
      { t: 'Annual Sports Day 2025-26', m: 'The Annual Sports Meet will be held on December 15th at the Nehru Stadium.', a: 'All', d: '2025-11-20' },
      { t: 'Science & Robotics Exhibition', m: 'Students from Grades 6 to 10 are invited to submit their STEM models by next Monday.', a: 'Students', d: '2025-10-15' },
      { t: 'Parent-Teacher Meeting (PTM)', m: 'Quarterly evaluation PTM is scheduled for Saturday, 9:00 AM to 1:00 PM.', a: 'Parents', d: '2025-09-30' },
    ];
    for (const an of announcements) {
      const [ex] = await conn.query('SELECT id FROM announcements WHERE title = ?', [an.t]);
      if (ex.length === 0) {
        await conn.query(
          `INSERT INTO announcements (title, message, target_audience, date_posted, is_active, academic_year, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [an.t, an.m, an.a, an.d, 1, currentAcademicYearStr, now, now]
        );
      }
    }
    console.log('✓ Fee structures and Announcements seeded');

    // 14. HOMEWORK & ATTENDANCE SAMPLES
    console.log('[14/14] Seeding Homework & Sample Attendance...');
    const mathSubId = subjectMap['MAT101'] || 1;
    const sciSubId = subjectMap['SCI101'] || 2;
    const class10Id = classMap['Class 10'] || 1;
    const sec10AId = sectionMap[`Class 10_A_${mainBranchId}`] || 1;

    const [exHw] = await conn.query('SELECT id FROM homework WHERE class_id = ? AND subject_id = ?', [class10Id, mathSubId]);
    if (exHw.length === 0) {
      await conn.query(
        `INSERT INTO homework (school_id, branch_id, class_id, section_id, subject_id, description, due_date, created_by, academic_year, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          schoolId,
          mainBranchId,
          class10Id,
          sec10AId,
          mathSubId,
          'Solve NCERT Chapter 4 Quadratic Equations Exercises 4.1 & 4.2',
          '2025-10-05',
          adminUserId,
          currentAcademicYearStr,
          now,
          now,
        ]
      );
      await conn.query(
        `INSERT INTO homework (school_id, branch_id, class_id, section_id, subject_id, description, due_date, created_by, academic_year, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          schoolId,
          mainBranchId,
          class10Id,
          sec10AId,
          sciSubId,
          'Prepare lab observation report on Chemical Reactions and Equations',
          '2025-10-07',
          adminUserId,
          currentAcademicYearStr,
          now,
          now,
        ]
      );
    }

    // Seed recent attendance
    const [allStudents] = await conn.query('SELECT id, branch_id, school_id FROM students LIMIT 16');
    for (const stu of allStudents) {
      const [exAtt] = await conn.query(
        'SELECT id FROM attendance WHERE student_id = ? AND date = ?',
        [stu.id, '2025-09-10']
      );
      if (exAtt.length === 0) {
        await conn.query(
          `INSERT INTO attendance (school_id, branch_id, student_id, date, status, academic_year, academic_year_id, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [stu.school_id, stu.branch_id, stu.id, '2025-09-10', 'Present', currentAcademicYearStr, currentAcademicYearId, now, now]
        );
      }
    }
    console.log('✓ Homework and Attendance seeded');

    console.log('\n========================================');
    console.log('🎉 All School ERP data seeded successfully into campuseyeplus!');
    console.log('========================================');
  } finally {
    await conn.end();
  }
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : '';

if (invokedFile && (currentFile === invokedFile || path.basename(currentFile) === path.basename(invokedFile))) {
  seedAllData()
    .then(() => {
      console.log('[Seed Completed] Exiting.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeding error:', err);
      process.exit(1);
    });
}

