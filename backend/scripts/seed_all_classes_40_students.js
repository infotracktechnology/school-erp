import knex from 'knex';

const db = knex({
  client: 'mysql2',
  connection: {
    host: '187.77.187.217',
    port: 3306,
    user: 'school_erp',
    password: '2hmdxGwTc2jc27kB',
    database: 'school_erp'
  }
});

const boyFirstNames = [
  'Aarav', 'Advait', 'Arjun', 'Aryan', 'Dhruv', 'Ishaan', 'Kabir', 'Reyansh', 'Vihaan', 'Vivaan',
  'Aadi', 'Anay', 'Atharv', 'Darsh', 'Kavin', 'Krishna', 'Madhav', 'Nirmal', 'Pranav', 'Raghav',
  'Rohan', 'Samar', 'Sai', 'Shreyas', 'Siddharth', 'Tejas', 'Utkarsh', 'Varun', 'Ved', 'Yuvan',
  'Aditya', 'Devan', 'Harish', 'Manoj', 'Karthik', 'Sanjay', 'Vignesh', 'Balamurugan', 'Ashwin', 'Gautham'
];

const girlFirstNames = [
  'Aanya', 'Aadhya', 'Aarohi', 'Ananya', 'Diya', 'Ishita', 'Kiara', 'Myra', 'Navya', 'Pari',
  'Riya', 'Saanvi', 'Samaira', 'Sara', 'Siya', 'Tara', 'Vanya', 'Anika', 'Avani', 'Divya',
  'Kavya', 'Krithika', 'Meera', 'Nitya', 'Pooja', 'Priya', 'Rithika', 'Sneha', 'Swathi', 'Tanvi',
  'Trisha', 'Varsha', 'Vedika', 'Yashika', 'Deepa', 'Lavanya', 'Malini', 'Pavithra', 'Soundarya', 'Janani'
];

const lastNames = [
  'Kumar', 'Sharma', 'Iyer', 'Menon', 'Pillai', 'Nair', 'Patel', 'Reddy', 'Rao', 'Sundaram',
  'Venkatesan', 'Krishnan', 'Raman', 'Subramanian', 'Balaji', 'Natarajan', 'Karthik', 'Murugan', 'Balamurugan', 'Ramachandran',
  'Prakash', 'Vijay', 'Varma', 'Joshi', 'Mehta', 'Das', 'Kulkarni', 'Gupta', 'Singh', 'Bhat',
  'Nambiar', 'Shenoy', 'Chidambaram', 'Srinivasan', 'Raghavan', 'Narayanan', 'Swaminathan', 'Muthusamy', 'Thangavel', 'Senthil'
];

const fatherFirstNames = [
  'Rajesh', 'Suresh', 'Venkatesh', 'Ramesh', 'Anand', 'Natarajan', 'Gopinath', 'Senthil', 'Murugan', 'Karthikeyan',
  'Saravanan', 'Ganesh', 'Manikandan', 'Baskaran', 'Ravichandran', 'Chandran', 'Sundaram', 'Krishnakumar', 'Dhanasekaran', 'Shanmugam'
];

const motherFirstNames = [
  'Lakshmi', 'Geetha', 'Deepa', 'Shanthi', 'Revathi', 'Radha', 'Kalyani', 'Parvathi', 'Gayathri', 'Bhuvaneshwari',
  'Sumathi', 'Meenakshi', 'Usha', 'Saraswathi', 'Vijayalakshmi', 'Kavitha', 'Mallika', 'Vasanthi', 'Padma', 'Sudha'
];

const bloodGroups = ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-'];

const addresses = [
  '12 Gandhi Nagar, Peelamedu, Coimbatore 641004',
  '45 Cross Cut Road, Gandhipuram, Coimbatore 641012',
  '78 DB Road, RS Puram, Coimbatore 641002',
  '23 NSR Road, Saibaba Colony, Coimbatore 641011',
  '56 Trichy Road, Singanallur, Coimbatore 641005',
  '89 Sathy Road, Saravanampatti, Coimbatore 641035',
  '34 Palakkad Road, Kuniyamuthur, Coimbatore 641008',
  '15 Race Course Road, Coimbatore 641018',
  '67 Marudhamalai Road, Vadavalli, Coimbatore 641046',
  '91 Thadagam Road, Ramanathapuram, Coimbatore 641045',
  '102 Avinashi Road, Hopes College, Coimbatore 641004',
  '54 Bharathiar Road, Papanaickenpalayam, Coimbatore 641037'
];

async function run() {
  console.log('🚀 Starting student dataset standardization to 40 students per class section...');

  // 1. Fetch all Branch 1 classes and sections
  const classes = await db('classes').where('branch_id', 1).orderBy('numeric_value', 'asc');
  console.log(`Found ${classes.length} classes for Branch 1`);

  let globalAdmIndex = 1;

  for (const cls of classes) {
    const classNum = cls.numeric_value || 1;
    const birthYear = 2026 - 6 - (classNum - 1); // Class 1: 2019, Class 10: 2010

    const sections = await db('sections')
      .where('branch_id', 1)
      .where('class_id', cls.id)
      .orderBy('section_name', 'asc');

    console.log(`\n📚 Processing Class ${classNum} (${cls.class_name}) - ${sections.length} sections:`);

    for (const sec of sections) {
      console.log(`  👉 Section ${sec.section_name} (ID: ${sec.id}):`);

      // Get existing students in this section
      const existingStudents = await db('students')
        .where('branch_id', 1)
        .where('class_id', cls.id)
        .where('section_id', sec.id)
        .orderBy('id', 'asc');

      console.log(`     Current student count: ${existingStudents.length}`);

      // If more than 40 students (like in Class 1 Sec A), trim non-referenced test students down to 40
      if (existingStudents.length > 40) {
        const toKeep = existingStudents.slice(0, 40);
        const toRemove = existingStudents.slice(40);
        const removeIds = toRemove.map(s => s.id);

        // Delete dependencies first
        await db('student_subjects').whereIn('student_id', removeIds).del();
        await db('academic_group_students').whereIn('student_id', removeIds).del();
        await db('student_profiles').whereIn('id', removeIds).del();
        await db('students').whereIn('id', removeIds).del();
        console.log(`     ✂️ Trimmed ${toRemove.length} excess test records down to 40 students.`);
      }

      // Re-fetch existing students after potential trim
      const currentStudents = await db('students')
        .where('branch_id', 1)
        .where('class_id', cls.id)
        .where('section_id', sec.id)
        .orderBy('id', 'asc');

      // Now ensure we have exactly 40 students
      for (let roll = 1; roll <= 40; roll++) {
        const isBoy = roll % 2 !== 0;
        const firstName = isBoy 
          ? boyFirstNames[(roll - 1) % boyFirstNames.length]
          : girlFirstNames[(roll - 1) % girlFirstNames.length];
        const lastName = lastNames[(globalAdmIndex * 7 + roll) % lastNames.length];
        const gender = isBoy ? 'Male' : 'Female';
        const fatherName = `${fatherFirstNames[(roll * 3) % fatherFirstNames.length]} ${lastName}`;
        const motherName = `${motherFirstNames[(roll * 5) % motherFirstNames.length]} ${lastName}`;
        const bloodGroup = bloodGroups[(roll * 2) % bloodGroups.length];
        const address = addresses[(roll + classNum) % addresses.length];
        const parentPhone = `9842${String(100000 + (classNum * 1000) + (sec.id * 100) + roll).padStart(6, '0')}`.substring(0, 10);
        const admNum = `ADM-2025-${String(globalAdmIndex).padStart(3, '0')}`;
        const birthMonth = String(((roll * 3) % 12) + 1).padStart(2, '0');
        const birthDay = String(((roll * 7) % 28) + 1).padStart(2, '0');
        const dob = `${birthYear}-${birthMonth}-${birthDay}`;

        const studentData = {
          organization_id: 1,
          school_id: 1,
          branch_id: 1,
          academic_year_id: 2,
          academic_year: '2025-2026',
          class_id: cls.id,
          section_id: sec.id,
          roll_number: roll,
          admission_no: admNum,
          admission_number: admNum,
          username: admNum,
          password: 'students123',
          first_name: firstName,
          last_name: lastName,
          gender: gender,
          dob: dob,
          parent_name: fatherName,
          parent_phone: parentPhone,
          parent_email: `parent.${admNum.toLowerCase()}@gmail.com`,
          address: address,
          status: 'Active',
          updated_at: new Date()
        };

        let studentId;
        if (roll <= currentStudents.length) {
          // Update existing student
          const existing = currentStudents[roll - 1];
          studentId = existing.id;
          await db('students').where('id', studentId).update(studentData);
        } else {
          // Insert new student to reach 40
          const [newId] = await db('students').insert({
            ...studentData,
            created_at: new Date()
          });
          studentId = newId;
        }

        // Also ensure student_profiles has matching clean record
        const existingProfile = await db('student_profiles').where('id', studentId).first();
        const profileData = {
          admission_number: admNum,
          first_name: firstName,
          last_name: lastName,
          dob: dob,
          gender: gender,
          blood_group: bloodGroup,
          address: address,
          parent_name: fatherName,
          parent_phone: parentPhone,
          status: 'Active',
          updated_at: new Date()
        };

        if (existingProfile) {
          await db('student_profiles').where('id', studentId).update(profileData);
        } else {
          await db('student_profiles').insert({
            id: studentId,
            user_id: null,
            ...profileData,
            created_at: new Date()
          });
        }

        globalAdmIndex++;
      }

      // Check section capacity is set to 40
      await db('sections').where('id', sec.id).update({ capacity: 40 });

      // Automatically map compulsory subjects for all students in this class
      const classSubjects = await db('class_subjects')
        .where('branch_id', 1)
        .where('class_id', cls.id)
        .where('status', 'Active');

      if (classSubjects.length > 0) {
        const secStudents = await db('students')
          .where('class_id', cls.id)
          .where('section_id', sec.id)
          .select('id');

        for (const st of secStudents) {
          for (const cs of classSubjects) {
            const hasSub = await db('student_subjects')
              .where({ student_id: st.id, class_subject_id: cs.id })
              .first();

            if (!hasSub) {
              await db('student_subjects').insert({
                branch_id: 1,
                academic_year_id: 2,
                student_id: st.id,
                class_id: cls.id,
                subject_id: cs.subject_id,
                class_subject_id: cs.id,
                subject_name: cs.subject_name,
                subject_code: cs.subject_code,
                subject_type: cs.subject_type || 'Academic',
                is_language: cs.is_language || 0,
                language_level: cs.language_level,
                enrollment_type: cs.requirement || 'Compulsory',
                status: 'Active',
                created_at: new Date(),
                updated_at: new Date()
              });
            }
          }
        }
      }

      console.log(`     ✅ Completed Section ${sec.section_name}: 40 students with Roll No 1..40.`);
    }
  }

  // Summary check
  const total = await db('students').where('branch_id', 1).count('id as cnt').first();
  console.log(`\n🎉 All classes standardized! Total Branch 1 students in DB: ${total.cnt}`);

  const distribution = await db('students')
    .join('classes', 'students.class_id', 'classes.id')
    .join('sections', 'students.section_id', 'sections.id')
    .where('students.branch_id', 1)
    .groupBy('classes.numeric_value', 'classes.class_name', 'sections.section_name')
    .orderBy('classes.numeric_value', 'asc')
    .select('classes.class_name', 'sections.section_name')
    .count('students.id as student_count');

  console.log('\n📊 Final Student Distribution Per Class/Section:');
  console.table(distribution);

  process.exit(0);
}

run().catch(err => {
  console.error('❌ Error during seeding:', err);
  process.exit(1);
});
