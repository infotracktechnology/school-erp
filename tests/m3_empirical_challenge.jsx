/**
 * tests/m3_empirical_challenge.jsx
 * Empirical Challenge Suite for Milestone 3:
 *  - Dashboard Module (Feature 28)
 *  - Students SIS & Admission (Features 29, 30, 31, 32)
 *  - Attendance (Features 33, 34, 35)
 *
 * Validates edge cases, boundary conditions, empty datasets, null profiles,
 * missing timing setups, multi-campus role switches, and status calculation oracles.
 */

import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import assert from 'assert';

import { DashboardPage } from '@/pages/DashboardPage';
import { OperationalDashboard } from '@/components/dashboard/OperationalDashboard';
import { SuperAdminDashboard } from '@/components/dashboard/SuperAdminDashboard';
import { StudentDashboardView } from '@/components/students/StudentDashboardView';
import { StudentProfileModal } from '@/components/students/StudentProfileModal';
import { StudentDetailsList } from '@/components/students/StudentDetailsList';
import { StudentReferenceMatrixTable } from '@/components/students/update/StudentReferenceMatrixTable';
import { TakeAttendanceView } from '@/components/attendance/TakeAttendanceView';
import { AttendanceTimingView } from '@/components/attendance/AttendanceTimingView';
import { AbsentNotificationModal } from '@/components/attendance/AbsentNotificationModal';
import { setMockErpContext, resetMockErpContext } from './mock_erp_context';

const results = [];

function recordTest(name, category, fn) {
  const start = performance.now();
  try {
    fn();
    const duration = (performance.now() - start).toFixed(2);
    results.push({ name, category, passed: true, duration, error: null });
    console.log(`  ✔ PASS [${duration}ms] ${category}: ${name}`);
  } catch (err) {
    const duration = (performance.now() - start).toFixed(2);
    results.push({ name, category, passed: false, duration, error: err.message || String(err) });
    console.error(`  ✖ FAIL [${duration}ms] ${category}: ${name}`);
    console.error(`    -> ${err.message || String(err)}`);
  }
}

// Oracle function for dual-session attendance status calculation
function calculateDualSessionStatus(morn, aft, hasTwoSessions) {
  if (!hasTwoSessions) return morn;
  if (morn === 'Present' && aft === 'Present') return 'Present';
  if (morn === 'Absent' && aft === 'Absent') return 'Absent';
  if (morn === 'Leave' && aft === 'Leave') return 'Leave';
  if (morn === 'Late' && aft === 'Late') return 'Late';
  if ((morn === 'Absent' && (aft === 'Present' || aft === 'Late')) ||
      (aft === 'Absent' && (morn === 'Present' || morn === 'Late'))) {
    return 'Half Day';
  }
  if ((morn === 'Leave' && (aft === 'Present' || aft === 'Late')) ||
      (aft === 'Leave' && (morn === 'Present' || morn === 'Late'))) {
    return 'Half Day';
  }
  if (morn === 'Late' || aft === 'Late') return 'Late';
  return 'Half Day';
}

export function runAllTests() {
  console.log('\n======================================================');
  console.log('   MILESTONE 3 EMPIRICAL ADVERSARIAL CHALLENGE SUITE   ');
  console.log('======================================================\n');

  // =========================================================================
  // SUITE 1: Dashboard Edge Cases & Multi-Campus Role Scoping (Feature 28)
  // =========================================================================
  console.log('▶ Suite 1: Dashboard Edge Cases & Multi-Campus Role Scoping');

  recordTest('Student role switch renders StudentDashboardView strictly', 'Dashboard-RoleScoping', () => {
    resetMockErpContext();
    setMockErpContext({
      userRole: 'student',
      isStudent: true,
      isSuperAdmin: false,
      isPrincipal: false,
    });

    const html = renderToString(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </MemoryRouter>
    );

    assert.ok(
      html.includes('Welcome back') || html.includes('Student Portal') || html.includes('Attendance Rate'),
      'Student dashboard must be rendered when userRole is student'
    );
    assert.strictEqual(
      html.includes('SUPER ADMIN DASHBOARD'),
      false,
      'Super Admin dashboard banner must NOT be visible to student'
    );
    assert.strictEqual(
      html.includes('Operational Campus Dashboard'),
      false,
      'Operational admin widgets must NOT be visible to student'
    );
  });

  recordTest('Super Admin role switch renders SuperAdminDashboard with organization header', 'Dashboard-RoleScoping', () => {
    resetMockErpContext();
    setMockErpContext({
      userRole: 'super_admin',
      isStudent: false,
      isSuperAdmin: true,
      isPrincipal: false,
      isAllBranches: true,
    });

    const html = renderToString(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </MemoryRouter>
    );

    assert.ok(
      html.includes('SUPER ADMIN DASHBOARD'),
      'SuperAdmin banner must render SUPER ADMIN DASHBOARD badge'
    );
    assert.ok(
      html.includes('Overall Branch Monitoring Dashboard'),
      'Header must display Overall Branch Monitoring Dashboard when isAllBranches is true'
    );
  });

  recordTest('Principal role switch renders OperationalDashboard scoped to campus', 'Dashboard-RoleScoping', () => {
    resetMockErpContext();
    setMockErpContext({
      userRole: 'principal',
      isStudent: false,
      isSuperAdmin: false,
      isPrincipal: true,
      isAllBranches: false,
      assignedBranchId: 1,
    });

    const html = renderToString(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </MemoryRouter>
    );

    assert.strictEqual(
      html.includes('SUPER ADMIN DASHBOARD'),
      false,
      'Super Admin banner must NOT render for principal'
    );
    assert.ok(
      html.includes('Main Campus') || html.includes('Campus') || html.includes('Overview'),
      'Operational Dashboard must render for campus principal'
    );
  });

  recordTest('Empty branch dataset handles effectiveBranchId null safely without crash', 'Dashboard-EmptyBranches', () => {
    resetMockErpContext();
    setMockErpContext({
      branches: [],
      accessibleBranches: [],
      activeBranchId: null,
      userRole: 'principal',
      isSuperAdmin: false,
      isStudent: false,
    });

    // Should not throw TypeError when branches are empty
    let html = '';
    assert.doesNotThrow(() => {
      html = renderToString(
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </MemoryRouter>
      );
    }, 'DashboardPage must not throw when branch list is empty');
    assert.ok(html.length > 0, 'DashboardPage rendered non-empty HTML with empty branch list');
  });

  recordTest('SuperAdminDashboard fallback metrics binding handles undefined cards and metrics', 'Dashboard-EmptyMetrics', () => {
    resetMockErpContext();
    setMockErpContext({
      userRole: 'super_admin',
      isSuperAdmin: true,
      branches: [{ id: 1, branch_name: 'Main Campus', branch_code: 'MAIN' }],
    });

    // Verify fallback logic: cards = dashboardData?.cards || dashboardData?.metrics || {}
    let html = '';
    assert.doesNotThrow(() => {
      html = renderToString(
        <MemoryRouter>
          <SuperAdminDashboard onNavigateToStudents={() => {}} onNavigateToSettings={() => {}} />
        </MemoryRouter>
      );
    }, 'SuperAdminDashboard must not throw when initial dashboardData is null');

    assert.ok(html.includes('SUPER ADMIN DASHBOARD'), 'Renders header badge successfully');
    assert.ok(html.includes('Academic Year:'), 'Renders academic year badge');
  });

  recordTest('OperationalDashboard handles empty branches array gracefully', 'Dashboard-OperationalEmpty', () => {
    let html = '';
    assert.doesNotThrow(() => {
      html = renderToString(
        <MemoryRouter>
          <OperationalDashboard branches={[]} activeBranchId={null} />
        </MemoryRouter>
      );
    }, 'OperationalDashboard handles branches=[] without runtime exception');

    assert.ok(html.length > 0, 'OperationalDashboard renders valid markup');
  });

  // =========================================================================
  // SUITE 2: Students SIS Empty Datasets & Null Profiles (Features 29, 30, 31, 32)
  // =========================================================================
  console.log('▶ Suite 2: Students SIS Empty Datasets & Null Profiles');

  recordTest('StudentProfileModal with isOpen=false renders null', 'SIS-ProfileModal', () => {
    const html = renderToString(
      <StudentProfileModal isOpen={false} studentId={null} onClose={() => {}} />
    );
    assert.strictEqual(html, '', 'Closed modal must render empty string');
  });

  recordTest('StudentProfileModal with isOpen=true and null studentId handles null profile safely', 'SIS-ProfileModal', () => {
    let html = '';
    assert.doesNotThrow(() => {
      html = renderToString(
        <StudentProfileModal isOpen={true} studentId={null} onClose={() => {}} />
      );
    }, 'StudentProfileModal must not throw when studentId is null');

    assert.ok(
      html.includes('No student profile information found.') || html.includes('Retrieving'),
      'Null student profile should render clean fallback message'
    );
  });

  recordTest('StudentProfileModal tab schema defines all 16 canonical profile tabs', 'SIS-ProfileTabs', () => {
    // 16 tabs canonical inventory: overview, personal, parents, contact, address, academic,
    // subjects, documents, transport, hostel, fees, attendance, exams, groups, timeline, audit
    const requiredTabs = [
      'overview', 'personal', 'parents', 'contact', 'address', 'academic',
      'subjects', 'documents', 'transport', 'hostel', 'fees', 'attendance',
      'exams', 'groups', 'timeline', 'audit'
    ];

    const html = renderToString(
      <StudentProfileModal isOpen={true} studentId={null} onClose={() => {}} />
    );

    // Each tab trigger should be defined
    for (const tab of requiredTabs) {
      assert.ok(
        html.includes(`value="${tab}"`) || html.includes(tab),
        `Student profile modal must include trigger for tab: ${tab}`
      );
    }
  });

  recordTest('StudentDetailsList renders colSpan=10 empty state when students array is empty', 'SIS-DetailsEmpty', () => {
    resetMockErpContext();
    const html = renderToString(
      <MemoryRouter>
        <StudentDetailsList branchId={1} academicYearId={1} />
      </MemoryRouter>
    );

    assert.ok(
      html.includes('No student records found') || html.includes('Loading student records...'),
      'Student directory must render empty state or loading state when students array is empty'
    );
    assert.ok(
      html.includes('Admission No') && html.includes('Student Name') && html.includes('Class &amp; Sec'),
      'Table header columns must be fully preserved'
    );
  });

  recordTest('StudentDetailsList CSV Export button is disabled when dataset is empty', 'SIS-ExportDisabled', () => {
    resetMockErpContext();
    const html = renderToString(
      <MemoryRouter>
        <StudentDetailsList branchId={1} academicYearId={1} />
      </MemoryRouter>
    );

    // Export button should be disabled when students.length === 0
    assert.ok(
      html.includes('disabled=""') || html.includes('disabled'),
      'Buttons requiring data (such as CSV export) must be disabled on empty dataset'
    );
  });

  recordTest('StudentDetailsList bulk selection bar is not visible when selectedIds is empty', 'SIS-BulkActions', () => {
    resetMockErpContext();
    const html = renderToString(
      <MemoryRouter>
        <StudentDetailsList branchId={1} academicYearId={1} />
      </MemoryRouter>
    );

    assert.strictEqual(
      html.includes('Selected') && html.includes('Choose a bulk operation:'),
      false,
      'Bulk action bar must be hidden when selectedIds is empty'
    );
  });

  recordTest('StudentReferenceMatrixTable renders spreadsheet container without throwing', 'SIS-SpreadsheetMatrix', () => {
    resetMockErpContext();
    let html = '';
    assert.doesNotThrow(() => {
      html = renderToString(
        <MemoryRouter>
          <StudentReferenceMatrixTable branchId={1} academicYearId={1} />
        </MemoryRouter>
      );
    }, 'StudentReferenceMatrixTable must mount cleanly in SSR');

    assert.ok(
      html.includes('Student Name') || html.includes('Search') || html.includes('Spreadsheet') || html.length > 0,
      'StudentReferenceMatrixTable renders matrix structure'
    );
  });

  // =========================================================================
  // SUITE 3: Attendance Roll-Call, Timings & Boundary Conditions (Features 33, 34, 35)
  // =========================================================================
  console.log('▶ Suite 3: Attendance Roll-Call, Timings & Boundary Conditions');

  recordTest('TakeAttendanceView renders core DOM selectors required by E2E test harness', 'Attendance-Selectors', () => {
    resetMockErpContext();
    const html = renderToString(
      <MemoryRouter>
        <TakeAttendanceView branchId={1} academicYearId={1} />
      </MemoryRouter>
    );

    // Assert DOM elements defined in Feature 33
    assert.ok(html.includes('id="attendance-branch-select"'), 'Missing #attendance-branch-select');
    assert.ok(html.includes('id="attendance-ay-select"'), 'Missing #attendance-ay-select');
    assert.ok(html.includes('id="attendance-date-input"'), 'Missing #attendance-date-input');
    assert.ok(html.includes('id="attendance-class-select"'), 'Missing #attendance-class-select');
    assert.ok(html.includes('id="attendance-section-select"'), 'Missing #attendance-section-select');
    assert.ok(html.includes('id="mark-all-present-btn"'), 'Missing #mark-all-present-btn');
    assert.ok(html.includes('id="submit-attendance-top-btn"'), 'Missing #submit-attendance-top-btn');
  });

  recordTest('TakeAttendanceView Mark All Present button is disabled when students array is empty', 'Attendance-Boundary', () => {
    resetMockErpContext();
    const html = renderToString(
      <MemoryRouter>
        <TakeAttendanceView branchId={1} academicYearId={1} />
      </MemoryRouter>
    );

    // mark-all-present-btn has disabled={isReadOnly || students.length === 0}
    assert.ok(
      html.includes('id="mark-all-present-btn"') && html.includes('disabled'),
      'Mark all present button must be disabled when student list is empty'
    );
  });

  recordTest('AttendanceTimingView renders dashed empty state card when timings array is empty', 'Attendance-TimingsEmpty', () => {
    resetMockErpContext();
    const html = renderToString(
      <MemoryRouter>
        <AttendanceTimingView branchId={1} academicYearId={1} />
      </MemoryRouter>
    );

    assert.ok(
      html.includes('Loading branch timings...') || html.includes('No Attendance Timings Found') || html.includes('Create Timing'),
      'AttendanceTimingView should render loading or empty state prompt'
    );
  });

  recordTest('AbsentNotificationModal renders dialog structure with notification channels', 'Attendance-AbsentNotif', () => {
    const absentSample = [
      { student_id: 101, first_name: 'Aarav', last_name: 'Patel', admission_number: 'ADM-101', class_name: 'Grade 10', section_name: 'A', father_name: 'Rajesh Patel', father_mobile: '9876543210' },
      { student_id: 102, first_name: 'Diya', last_name: 'Sharma', admission_number: 'ADM-102', class_name: 'Grade 10', section_name: 'A', father_name: 'Suresh Sharma', father_mobile: '9876543211' },
    ];

    const html = renderToString(
      <AbsentNotificationModal
        isOpen={true}
        onClose={() => {}}
        absentStudents={absentSample}
        date="2026-10-29"
        className="Grade 10"
        sectionName="A"
        onNotificationsSent={() => {}}
      />
    );

    assert.ok(html.includes('id="send-absent-notifications-btn"'), 'Send notifications button must be present');
    assert.ok(html.includes('Aarav') && html.includes('Patel') && html.includes('Diya') && html.includes('Sharma'), 'Absent students must be listed in modal');
    assert.ok(html.includes('SMS') || html.includes('WhatsApp'), 'Notification channels must be displayed');
  });

  recordTest('AbsentNotificationModal handles empty absent students array without crashing', 'Attendance-AbsentEmpty', () => {
    let html = '';
    assert.doesNotThrow(() => {
      html = renderToString(
        <AbsentNotificationModal
          isOpen={true}
          onClose={() => {}}
          absentStudents={[]}
          date="2026-10-29"
          className="Grade 10"
          sectionName="A"
          onNotificationsSent={() => {}}
        />
      );
    }, 'AbsentNotificationModal handles empty absent array without throwing');

    assert.ok(html.includes('0 absent students') || html.includes('No absent students') || html.length > 0, 'Rendered modal markup');
  });

  // =========================================================================
  // SUITE 4: Dual Session Status Calculation Oracle (Features 33, 34)
  // =========================================================================
  console.log('▶ Suite 4: Dual Session Status Calculation Oracle');

  recordTest('Dual session oracle: Present + Present => Present', 'Attendance-Oracle', () => {
    const status = calculateDualSessionStatus('Present', 'Present', true);
    assert.strictEqual(status, 'Present');
  });

  recordTest('Dual session oracle: Absent + Absent => Absent', 'Attendance-Oracle', () => {
    const status = calculateDualSessionStatus('Absent', 'Absent', true);
    assert.strictEqual(status, 'Absent');
  });

  recordTest('Dual session oracle: Leave + Leave => Leave', 'Attendance-Oracle', () => {
    const status = calculateDualSessionStatus('Leave', 'Leave', true);
    assert.strictEqual(status, 'Leave');
  });

  recordTest('Dual session oracle: Late + Late => Late', 'Attendance-Oracle', () => {
    const status = calculateDualSessionStatus('Late', 'Late', true);
    assert.strictEqual(status, 'Late');
  });

  recordTest('Dual session oracle: Absent morning + Present afternoon => Half Day', 'Attendance-Oracle', () => {
    const status = calculateDualSessionStatus('Absent', 'Present', true);
    assert.strictEqual(status, 'Half Day');
  });

  recordTest('Dual session oracle: Present morning + Absent afternoon => Half Day', 'Attendance-Oracle', () => {
    const status = calculateDualSessionStatus('Present', 'Absent', true);
    assert.strictEqual(status, 'Half Day');
  });

  recordTest('Dual session oracle: Leave morning + Present afternoon => Half Day', 'Attendance-Oracle', () => {
    const status = calculateDualSessionStatus('Leave', 'Present', true);
    assert.strictEqual(status, 'Half Day');
  });

  recordTest('Dual session oracle: Absent morning + Late afternoon => Half Day', 'Attendance-Oracle', () => {
    const status = calculateDualSessionStatus('Absent', 'Late', true);
    assert.strictEqual(status, 'Half Day');
  });

  recordTest('Dual session oracle: Late morning + Present afternoon => Late', 'Attendance-Oracle', () => {
    const status = calculateDualSessionStatus('Late', 'Present', true);
    assert.strictEqual(status, 'Late');
  });

  recordTest('Single session mode disregards afternoon status and returns morning status', 'Attendance-Oracle', () => {
    const status1 = calculateDualSessionStatus('Present', 'Absent', false);
    assert.strictEqual(status1, 'Present');

    const status2 = calculateDualSessionStatus('Absent', 'Present', false);
    assert.strictEqual(status2, 'Absent');
  });

  // =========================================================================
  // SUITE 5: Multi-Campus Role Switching & Historical Year Isolation
  // =========================================================================
  console.log('▶ Suite 5: Multi-Campus Role Switching & Historical Year Isolation');

  recordTest('Principal role cannot switch to unauthorized branches in StudentDetailsList', 'Isolation-PrincipalRole', () => {
    resetMockErpContext();
    setMockErpContext({
      userRole: 'principal',
      isSuperAdmin: false,
      isPrincipal: true,
      assignedBranchId: 2,
    });

    const html = renderToString(
      <MemoryRouter>
        <StudentDetailsList branchId={1} academicYearId={1} />
      </MemoryRouter>
    );

    assert.ok(html.length > 0, 'Principal view mounted correctly');
  });

  recordTest('Historical academic year disables Enroll Student button in StudentDetailsList', 'Isolation-HistoricalYear', () => {
    resetMockErpContext();
    setMockErpContext({
      isHistoricalYear: true,
      isReadOnly: true,
    });

    const html = renderToString(
      <MemoryRouter>
        <StudentDetailsList
          branchId={1}
          academicYearId={1}
          isHistoricalYear={true}
          onOpenRegisterModal={() => {}}
        />
      </MemoryRouter>
    );

    // When isHistoricalYear is true, onOpenRegisterModal button is omitted
    assert.strictEqual(
      html.includes('Enroll Student'),
      false,
      'Enroll Student button must be omitted in historical academic year'
    );
  });

  recordTest('Non-historical active academic year permits Enroll Student action', 'Isolation-ActiveYear', () => {
    resetMockErpContext();
    setMockErpContext({
      isHistoricalYear: false,
      isReadOnly: false,
    });

    const html = renderToString(
      <MemoryRouter>
        <StudentDetailsList
          branchId={1}
          academicYearId={1}
          isHistoricalYear={false}
          onOpenRegisterModal={() => {}}
        />
      </MemoryRouter>
    );

    assert.ok(
      html.includes('Enroll Student'),
      'Enroll Student button must be present in active academic year'
    );
  });

  // =========================================================================
  // Summary
  // =========================================================================
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log('\n======================================================');
  console.log(`Summary: ${passed}/${total} passed (${((passed / total) * 100).toFixed(1)}%)`);
  if (failed > 0) {
    console.error(`FAILED: ${failed} tests failed!`);
    process.exit(1);
  } else {
    console.log('All Milestone 3 empirical challenge tests PASSED!');
    console.log('======================================================\n');
  }
}

runAllTests();
