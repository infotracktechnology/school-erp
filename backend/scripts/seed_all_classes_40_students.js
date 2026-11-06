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
  'Aditya', 'Devan', 'Harish', 'Manoj', 'Karthik', 'Sanjay', 'Vignesh', 'Balamurugan', 'Ashwin', 'Gautham',
  'Abhay', 'Akash', 'Akhil', 'Alok', 'Aman', 'Aniket', 'Anish', 'Ankit', 'Apoorv', 'Arman',
  'Ayush', 'Bharat', 'Chirag', 'Deepak', 'Dev', 'Harsh', 'Hiten', 'Jai', 'Jayant', 'Jatin',
  'Karan', 'Keshav', 'Kunal', 'Laksh', 'Lokesh', 'Manan', 'Mayank', 'Mohit', 'Nakul', 'Namit',
  'Naveen', 'Neeraj', 'Nikhil', 'Nishant', 'Nitesh', 'Ojas', 'Parth', 'Piyush', 'Pradeep', 'Prakash',
  'Puneet', 'Rahul', 'Raj', 'Rajat', 'Rajesh', 'Rakesh', 'Rishabh', 'Rituraj', 'Rohit', 'Sachin',
  'Sahil', 'Sameer', 'Sanket', 'Satyam', 'Saurabh', 'Shashi', 'Shivam', 'Shlok', 'Soham', 'Srijan',
  'Subhash', 'Sudhir', 'Sumit', 'Sunil', 'Suraj', 'Sushant', 'Tanish', 'Tanmay', 'Tarun', 'Uday',
  'Vaibhav', 'Vikas', 'Vinay', 'Vishal', 'Vivek', 'Yash', 'Yogesh', 'Bhavin', 'Chetan', 'Dinesh'
];

const girlFirstNames = [
  'Aanya', 'Aadhya', 'Aarohi', 'Ananya', 'Diya', 'Ishita', 'Kiara', 'Myra', 'Navya', 'Pari',
  'Riya', 'Saanvi', 'Samaira', 'Sara', 'Siya', 'Tara', 'Vanya', 'Anika', 'Avani', 'Divya',
  'Kavya', 'Krithika', 'Meera', 'Nitya', 'Pooja', 'Priya', 'Rithika', 'Sneha', 'Swathi', 'Tanvi',
  'Trisha', 'Varsha', 'Vedika', 'Yashika', 'Deepa', 'Lavanya', 'Malini', 'Pavithra', 'Soundarya', 'Janani',
  'Aarti', 'Aditi', 'Akanksha', 'Amrita', 'Anjali', 'Anusha', 'Aparna', 'Archana', 'Barkha', 'Bhavna',
  'Charu', 'Damini', 'Deepika', 'Drishti', 'Garima', 'Gayatri', 'Gunjan', 'Harshita', 'Heena', 'Ishani',
  'Janki', 'Juhi', 'Jyoti', 'Kajal', 'Karishma', 'Komal', 'Kriti', 'Mahima', 'Manisha', 'Mansi',
  'Medha', 'Muskan', 'Nalini', 'Namrata', 'Nandini', 'Natasha', 'Neha', 'Nidhi', 'Payal', 'Pallavi',
  'Prerna', 'Priyanka', 'Radhika', 'Rashi', 'Raveena', 'Rekha', 'Ritu', 'Roshni', 'Sakshi', 'Saloni',
  'Sanya', 'Sarita', 'Seema', 'Shalini', 'Shikha', 'Shivani', 'Shreya', 'Simran', 'Sonal', 'Sonali',
  'Sonam', 'Sonia', 'Sunita', 'Sushma', 'Tanya', 'Tarini', 'Urvashi', 'Vaishali', 'Vidya', 'Vrinda'
];

const lastNames = [
  'Kumar', 'Sharma', 'Iyer', 'Menon', 'Pillai', 'Nair', 'Patel', 'Reddy', 'Rao', 'Sundaram',
  'Venkatesan', 'Krishnan', 'Raman', 'Subramanian', 'Balaji', 'Natarajan', 'Murugan', 'Balamurugan', 'Ramachandran', 'Prakash',
  'Vijay', 'Varma', 'Joshi', 'Mehta', 'Das', 'Kulkarni', 'Gupta', 'Singh', 'Bhat', 'Nambiar',
  'Shenoy', 'Chidambaram', 'Srinivasan', 'Raghavan', 'Narayanan', 'Swaminathan', 'Muthusamy', 'Thangavel', 'Senthil', 'Bose',
  'Sen', 'Mukherjee', 'Banerjee', 'Chatterjee', 'Dutta', 'Ghosh', 'Roy', 'Choudhury', 'Mishra', 'Pandey',
  'Tiwari', 'Tripathi', 'Shukla', 'Dwivedi', 'Verma', 'Agarwal', 'Jain', 'Mittal', 'Bansal', 'Goel',
  'Goyal', 'Singhal', 'Mahajan', 'Kapoor', 'Malhotra', 'Khanna', 'Chopra', 'Anand', 'Sethi', 'Grover',
  'Arora', 'Bhatia', 'Saxena', 'Mathur', 'Srivastava', 'Deshmukh', 'Patil', 'Kadam', 'Shinde', 'Jadhav',
  'Pawar', 'Gaikwad', 'More', 'Chauhan', 'Rathore', 'Solanki', 'Parmar', 'Shekhawat', 'Kashyap', 'Chhabra'
];

const fatherFirstNames = [
  'Rajesh', 'Suresh', 'Venkatesh', 'Ramesh', 'Anand', 'Natarajan', 'Gopinath', 'Senthil', 'Murugan', 'Karthikeyan',
  'Saravanan', 'Ganesh', 'Manikandan', 'Baskaran', 'Ravichandran', 'Chandran', 'Sundaram', 'Krishnakumar', 'Dhanasekaran', 'Shanmugam',
  'Balakrishnan', 'Subramani', 'Mohan', 'Arumugam', 'Palanisamy', 'Velumani', 'Vijayan', 'Rajan', 'Radhakrishnan', 'Sridhar'
];

const motherFirstNames = [
  'Lakshmi', 'Geetha', 'Deepa', 'Shanthi', 'Revathi', 'Radha', 'Kalyani', 'Parvathi', 'Gayathri', 'Bhuvaneshwari',
  'Sumathi', 'Meenakshi', 'Usha', 'Saraswathi', 'Vijayalakshmi', 'Kavitha', 'Mallika', 'Vasanthi', 'Padma', 'Sudha',
  'Kamala', 'Anitha', 'Karpagam', 'Selvi', 'Sangeetha', 'Shubha', 'Malathi', 'Latha', 'Shobana', 'Vimala'
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
  '54 Bharathiar Road, Papanaickenpalayam, Coimbatore 641037',
  '18 Cowley Brown Road, RS Puram, Coimbatore 641002',
  '82 Mettupalayam Road, Kavundampalayam, Coimbatore 641030',
  '27 Pollachi Road, Sundarapuram, Coimbatore 641024',
  '94 Vilankurichi Road, Cheran Ma Nagar, Coimbatore 641035'
];

async function run() {
  console.log('🚀 Regenerating student records with 100% UNIQUE & DIVERSE names across all 800 students...');

  const classes = await db('classes').where('branch_id', 1).orderBy('numeric_value', 'asc');
  let globalAdmIndex = 1;
  const usedFullNames = new Set();

  for (const cls of classes) {
    const classNum = cls.numeric_value || 1;
    const birthYear = 2026 - 6 - (classNum - 1); // Class 1: 2019, Class 10: 2010

    const sections = await db('sections')
      .where('branch_id', 1)
      .where('class_id', cls.id)
      .orderBy('section_name', 'asc');

    for (const sec of sections) {
      console.log(`📚 Standardizing Class ${classNum} Section ${sec.section_name} (ID: ${sec.id})...`);

      const currentStudents = await db('students')
        .where('branch_id', 1)
        .where('class_id', cls.id)
        .where('section_id', sec.id)
        .orderBy('id', 'asc');

      // We need 40 unique students for this section
      for (let roll = 1; roll <= 40; roll++) {
        const isBoy = roll % 2 !== 0; // Odd = boy, Even = girl

        // Pick unique first name + last name combination
        let firstName, lastName, fullName;
        let attempt = 0;

        do {
          const fnIndex = isBoy 
            ? ((globalAdmIndex * 3 + roll * 7 + attempt) % boyFirstNames.length)
            : ((globalAdmIndex * 5 + roll * 11 + attempt) % girlFirstNames.length);

          const lnIndex = (globalAdmIndex * 13 + roll * 17 + attempt * 19) % lastNames.length;

          firstName = isBoy ? boyFirstNames[fnIndex] : girlFirstNames[fnIndex];
          lastName = lastNames[lnIndex];
          fullName = `${firstName} ${lastName}`;
          attempt++;
        } while (usedFullNames.has(fullName) && attempt < 200);

        usedFullNames.add(fullName);

        const gender = isBoy ? 'Male' : 'Female';
        const fatherFn = fatherFirstNames[(globalAdmIndex * 3 + roll) % fatherFirstNames.length];
        const motherFn = motherFirstNames[(globalAdmIndex * 7 + roll) % motherFirstNames.length];
        const fatherName = `${fatherFn} ${lastName}`;
        const motherName = `${motherFn} ${lastName}`;
        const bloodGroup = bloodGroups[(globalAdmIndex + roll) % bloodGroups.length];
        const address = addresses[(globalAdmIndex + roll) % addresses.length];

        // Unique 10-digit phone: 9842 + 6 unique digits derived from globalAdmIndex
        const parentPhone = `9842${String(100000 + globalAdmIndex * 111).slice(-6)}`;
        const admNum = `ADM-2025-${String(globalAdmIndex).padStart(3, '0')}`;

        const birthMonth = String(((roll * 5 + globalAdmIndex) % 12) + 1).padStart(2, '0');
        const birthDay = String(((roll * 7 + globalAdmIndex) % 28) + 1).padStart(2, '0');
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
          studentId = currentStudents[roll - 1].id;
          await db('students').where('id', studentId).update(studentData);
        } else {
          const [newId] = await db('students').insert({
            ...studentData,
            created_at: new Date()
          });
          studentId = newId;
        }

        // Update student_profiles with matching data
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

        const existingProfile = await db('student_profiles').where('id', studentId).first();
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
      console.log(`  ✅ Section ${sec.section_name} complete: 40 distinct students.`);
    }
  }

  console.log(`\n🎉 Total unique full names generated: ${usedFullNames.size} (out of 800 students)`);
  process.exit(0);
}

run().catch(err => {
  console.error('❌ Error during regeneration:', err);
  process.exit(1);
});
