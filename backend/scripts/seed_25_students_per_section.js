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

const firstNamesBoy = [
  'Aarav', 'Aditya', 'Akash', 'Anand', 'Arjun', 'Ashwin', 'Bala', 'Barath', 'Chandran', 'Deepak',
  'Dhanush', 'Ganesh', 'Gautam', 'Hari', 'Harish', 'Kalyan', 'Karthik', 'Kavin', 'Madhav', 'Manoj',
  'Mithran', 'Mukesh', 'Naveen', 'Nirmal', 'Pranav', 'Praveen', 'Rahul', 'Rajesh', 'Rithvik', 'Rohan',
  'Rohit', 'Sanjay', 'Santosh', 'Saravanan', 'Siddharth', 'Siva', 'Sriram', 'Sudhakar', 'Surya', 'Tarun',
  'Varun', 'Vasanth', 'Vignesh', 'Vijay', 'Vikram', 'Vinoth', 'Vishal', 'Yogesh', 'Yuvan', 'Zaid'
];

const firstNamesGirl = [
  'Aadhya', 'Abinaya', 'Aditi', 'Akshara', 'Ananya', 'Anitha', 'Anu', 'Archana', 'Bhavani', 'Brindha',
  'Charulatha', 'Deepa', 'Devi', 'Dharani', 'Divya', 'Gayathri', 'Harini', 'Ishita', 'Janani', 'Kavitha',
  'Keerthana', 'Krithika', 'Lakshmi', 'Lavanya', 'Madhumitha', 'Meena', 'Megala', 'Mythili', 'Nandhini', 'Nithya',
  'Pavithra', 'Pooja', 'Priya', 'Priyanka', 'Radhika', 'Ramya', 'Rashmi', 'Rithika', 'Sandhya', 'Saranya',
  'Shalini', 'Shivani', 'Shruthi', 'Sneha', 'Soundarya', 'Subhashini', 'Swetha', 'Vaishnavi', 'Varsha', 'Vidya'
];

const lastNames = [
  'Kumar', 'Menon', 'Iyer', 'Farooq', 'Thomas', 'Karthik', 'Prakash', 'Vijay', 'Murugan', 'Balamurugan',
  'Natarajan', 'Subramanian', 'Palanisamy', 'Ramachandran', 'Sundaram', 'Krishnan', 'Venkatesan', 'Narayanan',
  'Selvam', 'Rajendran', 'Chandrasekar', 'Srinivasan', 'Balaji', 'Swaminathan', 'Mani'
];

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const addresses = [
  '12 Gandhi Nagar, Coimbatore', '45 Anna Nagar, Coimbatore', '78 Tatabad, Coimbatore',
  '23 RS Puram, Coimbatore', '56 Race Course, Coimbatore', '89 Saibaba Colony, Coimbatore',
  '15 Saravanampatti, Coimbatore', '67 Vadavalli, Coimbatore', '34 Ramanathapuram, Coimbatore',
  '90 Singanallur, Coimbatore', '18 Peelamedu, Coimbatore', '27 Kuniyamuthur, Coimbatore',
  '8 Ganapathy, Coimbatore', '51 Kovaipudur, Coimbatore', '42 Ondipudur, Coimbatore'
];

async function seedClassSectionStudents() {
  console.log(`[Seed 25 Students per Section] Connecting to database '${DB_CONFIG.database}'...`);
  const conn = await mysql.createConnection(DB_CONFIG);

  try {
    const now = new Date();
    const branchId = 1;
    const academicYearId = 2; // Academic Year 2025-2026
    const academicYearStr = '2025-2026';
    const schoolId = 1;

    // Get Student Role ID
    const [roles] = await conn.execute('SELECT id FROM roles WHERE name = ?', ['Student']);
    const studentRoleId = roles.length > 0 ? roles[0].id : 4;

    // Get Parents
    const [parents] = await conn.execute('SELECT id, father_name, phone, address FROM parents WHERE branch_id = ?', [branchId]);
    if (parents.length === 0) {
      throw new Error('No parents found in database. Please run initial seed first.');
    }

    // Get All Classes
    const [classes] = await conn.execute('SELECT id, class_name FROM classes WHERE branch_id = ? AND status = ? ORDER BY id ASC', [branchId, 'Active']);

    // Get All Sections for these Classes
    const [sections] = await conn.execute('SELECT id, class_id, section_name FROM sections WHERE branch_id = ? AND status = ? ORDER BY class_id, section_name ASC', [branchId, 'Active']);

    // Get Class Subjects lookup by class_id
    const [allClassSubjects] = await conn.execute('SELECT * FROM class_subjects WHERE branch_id = ? AND academic_year_id = ? AND status = ?', [branchId, academicYearId, 'Active']);
    const subjectsByClass = {};
    for (const cs of allClassSubjects) {
      if (!subjectsByClass[cs.class_id]) subjectsByClass[cs.class_id] = [];
      subjectsByClass[cs.class_id].push(cs);
    }

    // Get Max Admission Number sequence
    const [stuRows] = await conn.execute('SELECT admission_no FROM students');
    let maxSequence = 16;
    for (const row of stuRows) {
      const match = (row.admission_no || '').match(/ADM-2025-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxSequence) maxSequence = num;
      }
    }

    console.log(`Initial max admission number sequence found: ${maxSequence}`);

    let totalCreated = 0;
    const TARGET_PER_SECTION = 25;

    // For every class and section, ensure at least 25 students
    for (const cls of classes) {
      const classSections = sections.filter(s => s.class_id === cls.id);
      
      for (const sec of classSections) {
        // Check current count
        const [existing] = await conn.execute(
          'SELECT COUNT(*) as cnt FROM students WHERE class_id = ? AND section_id = ? AND status = ?',
          [cls.id, sec.id, 'Active']
        );
        const currentCount = existing[0].cnt;
        const needed = TARGET_PER_SECTION - currentCount;

        if (needed <= 0) {
          console.log(`[${cls.class_name} - Sec ${sec.section_name}] Already has ${currentCount} students. Skipping.`);
          continue;
        }

        console.log(`[${cls.class_name} - Sec ${sec.section_name}] Current: ${currentCount}. Adding ${needed} students...`);

        // Class subjects for automatic subject assignment
        const classSubs = subjectsByClass[cls.id] || [];
        const compulsorySubs = classSubs.filter(s => s.requirement === 'Compulsory' || s.requirement === 'Common');
        const optionalSubs = classSubs.filter(s => s.requirement === 'Optional' || s.requirement === 'Elective');

        for (let i = 0; i < needed; i++) {
          maxSequence++;
          const admNo = `ADM-2025-${String(maxSequence).padStart(3, '0')}`;
          
          const isBoy = (i + currentCount) % 2 === 0;
          const firstName = isBoy 
            ? firstNamesBoy[(maxSequence + i) % firstNamesBoy.length]
            : firstNamesGirl[(maxSequence + i) % firstNamesGirl.length];
          const lastName = lastNames[(maxSequence * 3 + i) % lastNames.length];
          const fullName = `${firstName} ${lastName}`;
          const gender = isBoy ? 'Male' : 'Female';
          const bloodGroup = bloodGroups[(maxSequence + i) % bloodGroups.length];
          
          // Generate DOB based on class (Class 1 = 6yo, Class 10 = 15yo)
          const baseAge = 5 + cls.id;
          const birthYear = 2025 - baseAge;
          const month = String(1 + ((maxSequence + i) % 12)).padStart(2, '0');
          const day = String(1 + ((maxSequence * 2 + i) % 28)).padStart(2, '0');
          const dob = `${birthYear}-${month}-${day}`;

          const parent = parents[(maxSequence + i) % parents.length];
          const studentEmail = `${firstName.toLowerCase()}.${admNo.toLowerCase()}@student.vidyamandir.edu`;

          // 1. Create User
          const [uRes] = await conn.execute(
            `INSERT INTO users (name, email, password, role_id, branch_id, status, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [fullName, studentEmail, 'student123', studentRoleId, branchId, 'Active', now, now]
          );
          const userId = uRes.insertId;

          // 2. Create Student record
          const rollNo = currentCount + i + 1;
          const [sRes] = await conn.execute(
            `INSERT INTO students (
              organization_id, school_id, branch_id, user_id, parent_id,
              academic_year_id, academic_year, class_id, section_id,
              admission_number, admission_no, roll_number, first_name, last_name,
              gender, date_of_birth, dob, parent_name, parent_phone, address,
              admission_date, status, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              1, schoolId, branchId, userId, parent.id,
              academicYearId, academicYearStr, cls.id, sec.id,
              admNo, admNo, String(rollNo), firstName, lastName,
              gender, dob, dob, parent.father_name, parent.phone, parent.address || addresses[0],
              '2025-06-01', 'Active', now, now
            ]
          );
          const studentId = sRes.insertId;

          // 3. Create Student Profile record
          await conn.execute(
            `INSERT INTO student_profiles (
              user_id, admission_number, first_name, last_name, dob,
              gender, blood_group, address, parent_name, parent_phone,
              status, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              userId, admNo, firstName, lastName, dob,
              gender, bloodGroup, parent.address || addresses[0], parent.father_name, parent.phone,
              'Active', now, now
            ]
          );

          // 4. Enroll in Compulsory Subjects + 1 Optional Subject
          const subjectsToEnroll = [...compulsorySubs];
          if (optionalSubs.length > 0) {
            // Pick an optional subject in round-robin fashion
            const chosenElective = optionalSubs[(maxSequence + i) % optionalSubs.length];
            subjectsToEnroll.push(chosenElective);
          }

          for (const sub of subjectsToEnroll) {
            await conn.execute(
              `INSERT INTO student_subjects (
                branch_id, academic_year_id, student_id, class_id, subject_id,
                class_subject_id, subject_name, subject_code, subject_type,
                is_language, language_level, enrollment_type, status,
                created_at, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                branchId, academicYearId, studentId, cls.id, sub.subject_id,
                sub.id, sub.subject_name, sub.subject_code, sub.subject_type,
                sub.is_language, sub.language_level, sub.requirement, 'Active',
                now, now
              ]
            );
          }

          totalCreated++;
        }
      }
    }

    console.log(`\n========================================`);
    console.log(`🎉 Successfully added ${totalCreated} students!`);
    console.log(`Every class section now has exactly 25 students.`);
    console.log(`========================================\n`);

  } catch (err) {
    console.error('Error seeding students:', err);
    throw err;
  } finally {
    await conn.end();
  }
}

seedClassSectionStudents()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
