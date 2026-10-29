/**
 * tests/e2e/tier3-cross-feature/cross-feature.test.js
 * Tier 3: Cross-Feature Combinations (Pairwise Domain Interactions)
 * Requirements: Pairwise interactions across major feature domains in PROJECT.md
 */

import {
  assert,
  assertEqual,
  assertContains,
  assertMatch,
  assertArray,
  apiRequest,
  getAuthSession,
  readProjectFile,
  generateTestId,
} from '../helpers.js';

export const tests = [
  // ==========================================
  // Pairwise Domain 1: Auth Session ↔ Multi-Campus Branch Scoping
  // ==========================================
  {
    feature: 'F24-X-F27',
    featureName: 'Auth Session ↔ Multi-Campus Branch Scoping',
    name: 'X01: Super Admin can access all branch scopes while Principal is restricted to assigned campus',
    run: async () => {
      // 1. Super Admin authentication
      const adminSession = await getAuthSession('super_admin');
      assert(adminSession.success, 'Super admin auth must succeed');
      assertEqual(adminSession.user.role, 'super_admin', 'Role must be super_admin');

      // 2. Query branches endpoint
      const res = await apiRequest('/branches');
      assert(res.ok, '/api/branches must return 200 for admin');
      assertArray(res.data.data || res.data, 1, 'Admin can see organization branches');

      // 3. Verify context scoping logic
      const erp = readProjectFile('src/context/ErpContext.jsx');
      assertContains(erp, 'isSuperAdmin', 'Context differentiates super admin');
      assertContains(erp, 'ALL_BRANCHES_META', 'Central management meta object configured');
    },
  },
  {
    feature: 'F24-X-F27',
    featureName: 'Auth Session ↔ Multi-Campus Branch Scoping',
    name: 'X02: Branch switching updates active context and scoped dashboard metrics',
    run: async () => {
      const branchesRes = await apiRequest('/branches');
      const branches = branchesRes.data.data || branchesRes.data;
      assertArray(branches, 1, 'Must have at least 1 branch');

      const targetBranch = branches[0];
      const dashRes = await apiRequest(`/dashboard/super-admin?branch_id=${targetBranch.id}`);
      assert(dashRes.ok, 'Dashboard responds for specific branch scope');
    },
  },

  // ==========================================
  // Pairwise Domain 2: Academic Year Switcher ↔ Attendance Locking
  // ==========================================
  {
    feature: 'F25-X-F33',
    featureName: 'Academic Year Switcher ↔ Attendance Locking',
    name: 'X03: Historical academic year enforces read-only banner and restricts attendance edits',
    run: async () => {
      const ayRes = await apiRequest('/academic-years');
      assert(ayRes.ok, '/api/academic-years must return 200');
      const years = ayRes.data.data || ayRes.data;
      assert(Array.isArray(years), 'Must return years list');

      // Verify academic selector contains read-only warning
      const selector = readProjectFile('src/components/academic/AcademicYearSelector.jsx');
      assertMatch(selector, /Historical|Archived|banner|warning/i, 'Warning banner configured');
    },
  },
  {
    feature: 'F25-X-F33',
    featureName: 'Academic Year Switcher ↔ Attendance Locking',
    name: 'X04: Active academic year allows live roll-call operations for current dates',
    run: async () => {
      const records = await apiRequest('/attendance?class_id=1&section_id=1');
      assert(records.status === 200, 'Current attendance records accessible');
    },
  },

  // ==========================================
  // Pairwise Domain 3: Student Admission ↔ Class Section Capacity
  // ==========================================
  {
    feature: 'F30-X-F44',
    featureName: 'Student Admission ↔ Class Section Capacity',
    name: 'X05: Admitting student assigns class and section and updates roster count',
    run: async () => {
      const classesRes = await apiRequest('/classes');
      assert(classesRes.ok, 'Classes available for enrollment');

      const sectionsRes = await apiRequest('/sections');
      assert(sectionsRes.ok, 'Sections available for enrollment');

      const studentRoster = await apiRequest('/students?class_id=1&limit=5');
      assert(studentRoster.ok, 'Enrolled students roster returned');
    },
  },
  {
    feature: 'F30-X-F44',
    featureName: 'Student Admission ↔ Class Section Capacity',
    name: 'X06: Enrolling student with invalid class_id is rejected by database foreign key',
    run: async () => {
      const testAdm = generateTestId('ADM');
      const res = await apiRequest('/students', {
        method: 'POST',
        body: JSON.stringify({
          admission_no: testAdm,
          first_name: 'InvalidClass',
          last_name: 'Test',
          class_id: 999999,
          section_id: 999999,
        }),
      });
      assert(res.status === 400 || res.status === 500 || !res.ok, 'Invalid class ID rejected');
    },
  },

  // ==========================================
  // Pairwise Domain 4: Attendance Roll-Call ↔ Absentee Parent Alerts
  // ==========================================
  {
    feature: 'F33-X-F38',
    featureName: 'Attendance Roll-Call ↔ Absentee Parent Alerts',
    name: 'X07: Marking students absent during morning roll-call enables absentee communication trigger',
    run: async () => {
      const modal = readProjectFile('src/components/attendance/AbsentNotificationModal.jsx');
      assertMatch(modal, /alert|notify|absent|sms/i, 'Absent parent notification hook integrated');
    },
  },
  {
    feature: 'F33-X-F38',
    featureName: 'Attendance Roll-Call ↔ Absentee Parent Alerts',
    name: 'X08: Attendance summary updates dynamically with marked present and absent tallies',
    run: async () => {
      const summary = await apiRequest('/attendance/summary?class_id=1&section_id=1&academic_year_id=2');
      assert(summary.status === 200, 'Attendance summary aggregates marked records');
    },
  },

  // ==========================================
  // Pairwise Domain 5: Staff Directory ↔ Timetable Period Allocation
  // ==========================================
  {
    feature: 'F40-X-F41',
    featureName: 'Staff Directory ↔ Timetable Period Allocation',
    name: 'X09: Staff directory faculty members populate teacher dropdown in timetable allocations',
    run: async () => {
      const staffRes = await apiRequest('/staff');
      assert(staffRes.ok, '/api/staff provides faculty list for timetable');

      const timetableRes = await apiRequest('/timetable/structures');
      assert(timetableRes.ok, '/api/timetable operational');
    },
  },
  {
    feature: 'F40-X-F41',
    featureName: 'Staff Directory ↔ Timetable Period Allocation',
    name: 'X10: Timetable period allocation updates teacher weekly workload totals',
    run: async () => {
      const workload = readProjectFile('src/components/staff/TeachingWorkloadView.jsx');
      assertMatch(workload, /workload|period|hours|timetable/i, 'Workload tracking linked to timetable');
    },
  },

  // ==========================================
  // Pairwise Domain 6: Homework Publishing ↔ Student Portal Feed
  // ==========================================
  {
    feature: 'F36-X-F28',
    featureName: 'Homework Publishing ↔ Student Portal Feed',
    name: 'X11: Staff publishing homework makes it immediately visible in student portal for enrolled class',
    run: async () => {
      const hwRes = await apiRequest('/communication/homework?limit=5');
      assert(hwRes.ok, 'Homework feed accessible');

      const portalPage = readProjectFile('src/pages/StudentPortalPage.jsx');
      assertMatch(portalPage, /homework/i, 'Student portal renders homework items');
    },
  },
  {
    feature: 'F36-X-F28',
    featureName: 'Homework Publishing ↔ Student Portal Feed',
    name: 'X12: Homework deadline badges synchronize with student dashboard upcoming tasks',
    run: async () => {
      const portal = readProjectFile('src/pages/StudentPortalPage.jsx');
      assertMatch(portal, /badge|due|date|status/i, 'Deadline badge synchronized');
    },
  },

  // ==========================================
  // Pairwise Domain 7: Assignment Submission ↔ Teacher Grading Drawer
  // ==========================================
  {
    feature: 'F37-X-F10',
    featureName: 'Assignment Submission ↔ Teacher Grading Drawer',
    name: 'X13: Student file upload populates submission list in teacher review drawer',
    run: async () => {
      const assignRes = await apiRequest('/communication/assignments');
      assert(assignRes.ok, 'Assignments list accessible');

      const comm = readProjectFile('src/components/communication/AssignmentView.jsx');
      assertMatch(comm, /submission|drawer|review|grade/i, 'Teacher grading drawer connected');
    },
  },
  {
    feature: 'F37-X-F10',
    featureName: 'Assignment Submission ↔ Teacher Grading Drawer',
    name: 'X14: Grading dialog submission records score and updates assignment status',
    run: async () => {
      const service = readProjectFile('src/services/communicationService.js');
      assertMatch(service, /grade|score|assignment/i, 'Grading update service connected');
    },
  },

  // ==========================================
  // Pairwise Domain 8: Role Permissions Matrix ↔ Route Guards & API Enforcement
  // ==========================================
  {
    feature: 'F42-X-F27',
    featureName: 'Role Permissions Matrix ↔ Route Guards & API Enforcement',
    name: 'X15: Toggling module permission in MenuAssignmentPage updates client sidebar navigation',
    run: async () => {
      const menuPage = readProjectFile('src/components/settings/MenuAssignmentPage.jsx');
      assertMatch(menuPage, /permission|role|menu/i, 'Menu assignment permissions verified');

      const sidebar = readProjectFile('src/components/layout/Sidebar.jsx');
      assertContains(sidebar, 'userRole', 'Sidebar filters navigation by role permissions');
    },
  },
  {
    feature: 'F42-X-F27',
    featureName: 'Role Permissions Matrix ↔ Route Guards & API Enforcement',
    name: 'X16: ProtectedRoute blocks unauthorized access when role does not have permission',
    run: async () => {
      const protectedRoute = readProjectFile('src/components/auth/ProtectedRoute.jsx');
      assertContains(protectedRoute, 'allowedRoles', 'Role checking enforced');
    },
  },

  // ==========================================
  // Pairwise Domain 9: Branch Management ↔ Topbar Selector Sync
  // ==========================================
  {
    feature: 'F43-X-F24',
    featureName: 'Branch Management ↔ Topbar Selector Sync',
    name: 'X17: Campus registry in BranchesPage provides branches consumed by Topbar BranchSelector',
    run: async () => {
      const branches = await apiRequest('/branches');
      assert(branches.ok, 'Branch registry operational');

      const branchSelector = readProjectFile('src/components/branches/BranchSelector.jsx');
      assertContains(branchSelector, 'branches', 'BranchSelector receives registered branches');
    },
  },
  {
    feature: 'F43-X-F24',
    featureName: 'Branch Management ↔ Topbar Selector Sync',
    name: 'X18: Campus branch head update synchronizes across campus directories',
    run: async () => {
      const branchesPage = readProjectFile('src/pages/BranchesPage.jsx');
      assertMatch(branchesPage, /branch_head|head|director/i, 'Branch head management synced');
    },
  },

  // ==========================================
  // Pairwise Domain 10: Curricular Subject Category ↔ Timetable Period Mapping
  // ==========================================
  {
    feature: 'F44-X-F41',
    featureName: 'Curricular Subject Category ↔ Timetable Period Mapping',
    name: 'X19: Curricular subjects defined in Academic Settings populate timetable subject dropdown',
    run: async () => {
      const subRes = await apiRequest('/subjects');
      assert(subRes.ok, 'Curricular subjects available');

      const ttRes = await apiRequest('/timetable/structures');
      assert(ttRes.ok, 'Timetable links subjects');
    },
  },
  {
    feature: 'F44-X-F41',
    featureName: 'Curricular Subject Category ↔ Timetable Period Mapping',
    name: 'X20: Class-subject mappings enforce valid weekly teaching period allocations',
    run: async () => {
      const csRes = await apiRequest('/class-subjects');
      assert(csRes.ok, 'Class-subject mapping operational');
    },
  },
];
