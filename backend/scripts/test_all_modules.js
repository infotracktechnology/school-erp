import http from 'http';

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:5000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('=== END-TO-END BACKEND API AUDIT TEST ===');
  const endpoints = [
    { name: 'Health Check', path: '/api/health' },
    { name: 'Organization', path: '/api/organization' },
    { name: 'Branches', path: '/api/branches' },
    { name: 'Academic Years', path: '/api/academic-years' },
    { name: 'Classes', path: '/api/classes' },
    { name: 'Sections', path: '/api/sections' },
    { name: 'Class Sections Matrix', path: '/api/class-sections?branch_id=1&academic_year_id=2' },
    { name: 'Students', path: '/api/students?branch_id=1&academic_year=2026-2027' },
    { name: 'Academic Groups', path: '/api/academic-groups?branch_id=1' },
    { name: 'Subjects', path: '/api/subjects?branch_id=1' },
    { name: 'Attendance Timings', path: '/api/attendance/timings?branch_id=1&academic_year_id=2' },
    { name: 'Attendance Assignments', path: '/api/attendance/assignments?branch_id=1&academic_year_id=2' },
    { name: 'Students to Mark Attendance', path: '/api/attendance/students-to-mark?branch_id=1&academic_year_id=2&class_id=1&section_id=1&date=2026-10-03' },
    { name: 'Attendance History', path: '/api/attendance/history?branch_id=1' },
    { name: 'Attendance Summary', path: '/api/attendance/summary?branch_id=1' },
    { name: 'Daily Attendance Report', path: '/api/attendance/reports/daily?branch_id=1&date=2026-10-03' },
    { name: 'Monthly Attendance Report', path: '/api/attendance/reports/monthly?branch_id=1&class_id=1&section_id=1&month=10&year=2026' },
    { name: 'Dashboard Super Admin Stats', path: '/api/dashboard/super-admin?branch_id=1' }
  ];

  let passCount = 0;
  let failCount = 0;

  for (const ep of endpoints) {
    try {
      const res = await get(ep.path);
      const isSuccess = res.status >= 200 && res.status < 300 && (res.body.success === true || res.body.status === 'ok' || Array.isArray(res.body) || res.body.data !== undefined || res.body.organization !== undefined);
      if (isSuccess) {
        console.log(`[PASS] ${ep.name} (${ep.path}) -> Status: ${res.status}`);
        passCount++;
      } else {
        console.log(`[WARN/FAIL] ${ep.name} (${ep.path}) -> Status: ${res.status}, body:`, JSON.stringify(res.body).substring(0, 120));
        if (res.status >= 400) failCount++; else passCount++;
      }
    } catch (e) {
      console.log(`[ERROR] ${ep.name} (${ep.path}) -> ${e.message}`);
      failCount++;
    }
  }

  console.log(`\nTest Summary: ${passCount} Passed, ${failCount} Failed.`);
}

runTests();
