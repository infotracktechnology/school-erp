import mysql from 'mysql2/promise';

async function setup() {
  const c = await mysql.createConnection('mysql://root:@127.0.0.1:3306/campuseyeplus');
  
  await c.query(`
    CREATE TABLE IF NOT EXISTS academic_calendar_events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      branch_id INT NOT NULL DEFAULT 1,
      academic_year_id INT NOT NULL DEFAULT 2,
      title VARCHAR(255) NOT NULL,
      description TEXT NULL,
      event_type ENUM('public_holiday', 'school_holiday', 'school_event', 'exam', 'academic_milestone') NOT NULL DEFAULT 'school_event',
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      is_holiday BOOLEAN DEFAULT FALSE,
      school_closed BOOLEAN DEFAULT FALSE,
      applicable_to ENUM('all', 'specific_classes') NOT NULL DEFAULT 'all',
      applicable_classes JSON NULL,
      color_code VARCHAR(30) NULL,
      created_by INT NULL,
      is_published BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_cal_branch_ay (branch_id, academic_year_id, start_date),
      INDEX idx_cal_dates (start_date, end_date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  console.log('academic_calendar_events table verified/created');

  const [existing] = await c.query('SELECT count(*) as c FROM academic_calendar_events');
  if (existing[0].c === 0) {
    await c.query(`
      INSERT INTO academic_calendar_events 
      (branch_id, academic_year_id, title, description, event_type, start_date, end_date, is_holiday, school_closed, applicable_to, color_code)
      VALUES
      (1, 2, 'Diwali Festival Holiday', 'Festival of Lights - School Closed', 'public_holiday', '2026-11-01', '2026-11-02', TRUE, TRUE, 'all', '#ef4444'),
      (1, 2, 'Term 1 Mid-Term Examinations', 'Mid-Term Summative Assessments for Classes 1 to 10', 'exam', '2026-11-10', '2026-11-18', FALSE, FALSE, 'all', '#8b5cf6'),
      (1, 2, "Children's Day Celebration", 'Special assembly and cultural activities', 'school_event', '2026-11-14', '2026-11-14', FALSE, FALSE, 'all', '#3b82f6'),
      (1, 2, 'Annual Sports Meet 2026', 'Inter-House Athletic & Sports Competition', 'school_event', '2026-12-05', '2026-12-06', FALSE, FALSE, 'all', '#3b82f6'),
      (1, 2, 'Christmas & Winter Vacation', 'Winter break holidays - School will reopen on Jan 2nd', 'school_holiday', '2026-12-24', '2027-01-01', TRUE, TRUE, 'all', '#f97316'),
      (1, 2, 'Pongal & Harvest Festival Holiday', 'Traditional Tamil Harvest Festival holidays', 'public_holiday', '2027-01-14', '2027-01-17', TRUE, TRUE, 'all', '#ef4444'),
      (1, 2, 'Republic Day Celebration', 'Flag hoisting ceremony at 8:00 AM in campus grounds', 'academic_milestone', '2027-01-26', '2027-01-26', FALSE, FALSE, 'all', '#10b981');
    `);
    console.log('Sample academic events seeded successfully');
  } else {
    console.log('academic_calendar_events already contains rows:', existing[0].c);
  }

  process.exit(0);
}

setup().catch(err => {
  console.error(err);
  process.exit(1);
});
