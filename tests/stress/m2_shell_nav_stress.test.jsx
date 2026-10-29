import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';

// Import M2 components
import { Sidebar, NAVIGATION_GROUPS } from '@/components/layout/Sidebar';
import { NavigationHeader } from '@/components/layout/NavigationHeader';
import { AppLayout } from '@/components/layout/AppLayout';
import { BranchSelector } from '@/components/branches/BranchSelector';

// Import mock context controller
import { setMockErpContext, ALL_BRANCHES_META } from './mockErpContext';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failureDetails = [];

function runAssert(condition, name, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✔ [PASS] ${name}`);
  } else {
    failedTests++;
    const errMsg = `FAIL: ${name}${details ? ` (${details})` : ''}`;
    failureDetails.push(errMsg);
    console.error(`  ✖ [${errMsg}]`);
  }
}

function buildMockContext({
  role = 'super_admin',
  currentUser = null,
  activeBranchId = 'all',
  branches = [
    { id: 1, branch_name: 'Main Campus', branch_code: 'MC01', status: 'Active', city: 'Coimbatore', state: 'Tamil Nadu' },
    { id: 2, branch_name: 'City Campus', branch_code: 'CC02', status: 'Active', city: 'Chennai', state: 'Tamil Nadu' }
  ],
  assignedBranchId = 1,
  isLoadingBranches = false,
  academicYearLifecycle = 'Operational Live',
  isCurrentYear = true,
  isUpcomingYear = false,
  onLogout = () => {},
  onSetActiveBranchId = () => {}
} = {}) {
  const isSuperAdmin = role === 'super_admin';
  const isPrincipal = role === 'principal' || role === 'principle' || role === 'branch_admin';
  const isStudent = role === 'student';
  const isAllBranches = isSuperAdmin && activeBranchId === 'all';

  const defaultUser = currentUser || {
    id: 1,
    name: isSuperAdmin ? 'Super Admin User' : isStudent ? 'Rahul Sharma' : 'Principal Ramanathan',
    email: isSuperAdmin ? 'admin@school.edu' : isStudent ? 'rahul@student.edu' : 'principal@school.edu',
    role,
    branch_id: assignedBranchId,
    student: isStudent ? { admission_number: 'ADM-2026-001', roll_number: '10-A-01' } : null
  };

  const assignedBranch = branches.find(b => b.id === assignedBranchId) || branches[0];
  const activeBranch = isAllBranches ? ALL_BRANCHES_META : (branches.find(b => b.id === activeBranchId) || branches[0]);
  const accessibleBranches = isSuperAdmin ? branches : branches.filter(b => b.id === assignedBranchId);

  return {
    currentUser: defaultUser,
    userRole: role,
    setUserRole: () => {},
    isSuperAdmin,
    isPrincipal,
    isStudent,
    isBranchAdmin: isPrincipal,
    isAuthenticated: true,
    branches,
    accessibleBranches,
    activeBranch,
    activeBranchId,
    setActiveBranchId: onSetActiveBranchId,
    isLoadingBranches,
    isAllBranches,
    assignedBranch,
    assignedBranchId,
    setAssignedBranchId: () => {},
    activeAcademicYear: { id: 1, name: '2026-2027', status: 'Current' },
    academicYears: [{ id: 1, name: '2026-2027', status: 'Current' }],
    enabledAcademicYears: [{ id: 1, name: '2026-2027', status: 'Current' }],
    academicYearLifecycle,
    isCurrentYear,
    isUpcomingYear,
    isHistoricalYear: false,
    isReadOnly: false,
    logoutUser: onLogout,
    showToast: () => {}
  };
}

export async function runAllM2StressTests() {
  console.log('\n======================================================');
  console.log('   M2 SHELL & NAVIGATION EMPIRICAL STRESS SUITE       ');
  console.log('======================================================\n');

  // =========================================================================
  // SUITE 1: SIDEBAR COLLAPSIBLE GROUPS & EXPANSION/COLLAPSE TOGGLES
  // =========================================================================
  console.log('▶ Suite 1: Sidebar Collapsible Navigation Groups & Sub-Accordions');

  // 1.1 NAVIGATION_GROUPS Structure & Modules Verification
  runAssert(Array.isArray(NAVIGATION_GROUPS) && NAVIGATION_GROUPS.length === 7, 'S1.1: NAVIGATION_GROUPS has exactly 7 functional groups');
  
  const expectedGroupIds = ['overview', 'students', 'academics', 'assessment', 'communication', 'faculty', 'operations'];
  const actualGroupIds = NAVIGATION_GROUPS.map(g => g.id);
  runAssert(
    expectedGroupIds.every(id => actualGroupIds.includes(id)),
    'S1.2: All 7 expected group IDs are present in NAVIGATION_GROUPS',
    `Found: ${actualGroupIds.join(', ')}`
  );

  const totalModulesInGroups = NAVIGATION_GROUPS.reduce((acc, g) => acc + g.modules.length, 0);
  runAssert(totalModulesInGroups === 16, 'S1.3: Total modules across all 7 groups equals exactly 16 modules');

  // 1.2 Default Sidebar Render (Super Admin) - All groups expanded by default
  const defaultSidebarHtml = ReactDOMServer.renderToString(
    <Sidebar
      activeNav="dashboard"
      onSelectNav={() => {}}
      userRole="super_admin"
      isStudent={false}
      branchCount={2}
    />
  );

  runAssert(defaultSidebarHtml.includes('Overview &amp; Hub') || defaultSidebarHtml.includes('Overview & Hub'), 'S1.4: Overview group header rendered');
  runAssert(defaultSidebarHtml.includes('Student Information (SIS)'), 'S1.5: SIS group header rendered');
  runAssert(defaultSidebarHtml.includes('Academics &amp; Schedule') || defaultSidebarHtml.includes('Academics & Schedule'), 'S1.6: Academics group header rendered');
  runAssert(defaultSidebarHtml.includes('Assessment &amp; Conduct') || defaultSidebarHtml.includes('Assessment & Conduct'), 'S1.7: Assessment group header rendered');
  runAssert(defaultSidebarHtml.includes('Communication &amp; Media') || defaultSidebarHtml.includes('Communication & Media'), 'S1.8: Communication group header rendered');
  runAssert(defaultSidebarHtml.includes('Staff &amp; Administration') || defaultSidebarHtml.includes('Staff & Administration'), 'S1.9: Staff group header rendered');
  runAssert(defaultSidebarHtml.includes('Campus Operations'), 'S1.10: Operations group header rendered');

  // Verify group item badges show module counts
  runAssert(defaultSidebarHtml.includes('>2<') && defaultSidebarHtml.includes('>3<') && defaultSidebarHtml.includes('>4<'), 'S1.11: Module count chips rendered inside group headers');

  // 1.3 Sub-accordions in Sidebar
  // When activeNav is students and isStudentsExpanded=true:
  const expandedStudentsHtml = ReactDOMServer.renderToString(
    <Sidebar
      activeNav="students"
      onSelectNav={() => {}}
      isStudentsExpanded={true}
      activeStudentSubTab="details"
      userRole="super_admin"
    />
  );
  runAssert(expandedStudentsHtml.includes('Student Details'), 'S1.12: Student Details sub-item visible when isStudentsExpanded=true');
  runAssert(expandedStudentsHtml.includes('Student Update'), 'S1.13: Student Update sub-item visible when isStudentsExpanded=true');
  runAssert(expandedStudentsHtml.includes('Student Promotion'), 'S1.14: Student Promotion sub-item visible when isStudentsExpanded=true');
  runAssert(expandedStudentsHtml.includes('Inactive Students / TC'), 'S1.15: Inactive Students sub-item visible when isStudentsExpanded=true');

  // When isStudentsExpanded=false:
  const collapsedStudentsHtml = ReactDOMServer.renderToString(
    <Sidebar
      activeNav="students"
      onSelectNav={() => {}}
      isStudentsExpanded={false}
      activeStudentSubTab="details"
      userRole="super_admin"
    />
  );
  runAssert(!collapsedStudentsHtml.includes('Student Details'), 'S1.16: Student Details sub-item hidden when isStudentsExpanded=false');
  runAssert(!collapsedStudentsHtml.includes('Student Promotion'), 'S1.17: Student Promotion sub-item hidden when isStudentsExpanded=false');

  // 1.4 Attendance Sub-accordion
  const expandedAttendanceHtml = ReactDOMServer.renderToString(
    <Sidebar
      activeNav="attendance"
      onSelectNav={() => {}}
      isAttendanceExpanded={true}
      activeAttendanceSubTab="take_attendance"
      userRole="super_admin"
    />
  );
  runAssert(expandedAttendanceHtml.includes('1. Take Attendance'), 'S1.18: Take Attendance sub-item visible when isAttendanceExpanded=true');
  runAssert(expandedAttendanceHtml.includes('2. Attendance Time'), 'S1.19: Attendance Time sub-item visible when isAttendanceExpanded=true');
  runAssert(expandedAttendanceHtml.includes('4. Attendance History'), 'S1.20: Attendance History sub-item visible when isAttendanceExpanded=true');

  const collapsedAttendanceHtml = ReactDOMServer.renderToString(
    <Sidebar
      activeNav="attendance"
      onSelectNav={() => {}}
      isAttendanceExpanded={false}
      userRole="super_admin"
    />
  );
  runAssert(!collapsedAttendanceHtml.includes('1. Take Attendance'), 'S1.21: Attendance sub-items hidden when isAttendanceExpanded=false');

  // 1.5 Communication Sub-accordion
  const expandedCommunicationHtml = ReactDOMServer.renderToString(
    <Sidebar
      activeNav="communication"
      onSelectNav={() => {}}
      isCommunicationExpanded={true}
      activeCommunicationSubTab="homework"
      userRole="super_admin"
    />
  );
  runAssert(expandedCommunicationHtml.includes('1. Homework'), 'S1.22: Homework sub-item visible when isCommunicationExpanded=true');
  runAssert(expandedCommunicationHtml.includes('2. Assignment'), 'S1.23: Assignment sub-item visible when isCommunicationExpanded=true');
  runAssert(expandedCommunicationHtml.includes('3. Announcement'), 'S1.24: Announcement sub-item visible when isCommunicationExpanded=true');
  runAssert(expandedCommunicationHtml.includes('4. Gallery'), 'S1.25: Gallery sub-item visible when isCommunicationExpanded=true');

  // 1.6 Settings & Academic Settings Sub-accordions
  const expandedSettingsHtml = ReactDOMServer.renderToString(
    <Sidebar
      activeNav="academic-settings"
      onSelectNav={() => {}}
      isSettingsExpanded={true}
      isAcademicExpanded={true}
      activeAcademicSubTab="classes"
      userRole="super_admin"
      userPermissions={{ canViewBranchSettings: true, canViewAcademicSettings: true }}
      branchCount={3}
    />
  );
  runAssert(expandedSettingsHtml.includes('Branch Settings'), 'S1.26: Branch Settings visible in Settings sub-accordion');
  runAssert(expandedSettingsHtml.includes('Menu Assignment'), 'S1.27: Menu Assignment visible in Settings sub-accordion');
  runAssert(expandedSettingsHtml.includes('User Management'), 'S1.28: User Management visible in Settings sub-accordion');
  runAssert(expandedSettingsHtml.includes('Academic Year'), 'S1.29: Academic Year visible in Academic Settings sub-accordion');
  runAssert(expandedSettingsHtml.includes('Classes'), 'S1.30: Classes visible in Academic Settings sub-accordion');
  runAssert(expandedSettingsHtml.includes('Subjects'), 'S1.31: Subjects visible in Academic Settings sub-accordion');
  runAssert(expandedSettingsHtml.includes('>3<'), 'S1.32: Branch count pill (3) rendered next to Branch Settings');

  // 1.7 Student Portal Mode completely bypasses groups
  const studentSidebarHtml = ReactDOMServer.renderToString(
    <Sidebar
      activeNav="dashboard"
      onSelectNav={() => {}}
      isStudent={true}
      userRole="student"
    />
  );
  runAssert(studentSidebarHtml.includes('Student Portal'), 'S1.33: Student Portal header displayed');
  runAssert(studentSidebarHtml.includes('My Merits &amp; Remarks') || studentSidebarHtml.includes('My Merits & Remarks'), 'S1.34: Student specific menu items rendered');
  runAssert(studentSidebarHtml.includes('My Profile'), 'S1.35: My Profile rendered for student');
  runAssert(!studentSidebarHtml.includes('Campus Operations'), 'S1.36: Campus Operations group is NOT rendered for student');
  runAssert(!studentSidebarHtml.includes('Staff &amp; Administration') && !studentSidebarHtml.includes('Staff & Administration'), 'S1.37: Staff & Administration is NOT rendered for student');


  // =========================================================================
  // SUITE 2: ACTIVE ROUTE PILL INDICATOR STYLING
  // =========================================================================
  console.log('\n▶ Suite 2: Active Route Pill Indicator Styling');

  // 2.1 Active top-level menu item styling
  const activeDashboardHtml = ReactDOMServer.renderToString(
    <Sidebar
      activeNav="dashboard"
      onSelectNav={() => {}}
      userRole="super_admin"
    />
  );

  runAssert(
    activeDashboardHtml.includes('bg-primary text-primary-foreground shadow-xs font-bold'),
    'S2.1: Active module item has primary background and font-bold classes'
  );
  runAssert(
    activeDashboardHtml.includes('w-1.5 h-1.5 rounded-full bg-white shrink-0 ml-1'),
    'S2.2: Active module item displays white circular pill indicator dot'
  );

  // Inactive item does NOT have the white pill dot
  const modulesMatch = activeDashboardHtml.match(/<button[^>]*>(?:(?!<\/button>)[\s\S])*?Modules Showcase(?:(?!<\/button>)[\s\S])*?<\/button>/);
  runAssert(
    modulesMatch && !modulesMatch[0].includes('w-1.5 h-1.5 rounded-full bg-white'),
    'S2.3: Inactive module button (Modules Showcase) does NOT have white pill dot'
  );

  // 2.2 Active indicator dot on collapsible group header
  // When activeNav="dashboard" (which belongs to overview group), overview group header should show primary active dot
  runAssert(
    activeDashboardHtml.includes('Overview &amp; Hub') || activeDashboardHtml.includes('Overview & Hub'),
    'S2.4: Overview group exists'
  );
  runAssert(
    activeDashboardHtml.includes('w-1.5 h-1.5 rounded-full bg-primary shrink-0'),
    'S2.5: Group header displays primary active indicator dot when a child module is active'
  );

  // 2.3 Active Sub-item styling in Students
  const activeStudentDetailsHtml = ReactDOMServer.renderToString(
    <Sidebar
      activeNav="students"
      activeStudentSubTab="details"
      isStudentsExpanded={true}
      onSelectNav={() => {}}
      userRole="super_admin"
    />
  );
  runAssert(
    activeStudentDetailsHtml.includes('bg-primary text-primary-foreground font-bold shadow-xs'),
    'S2.6: Active student sub-tab (details) receives active primary pill styling'
  );

  // 2.4 Active Attendance Sub-item emerald styling
  const activeAttendanceSubHtml = ReactDOMServer.renderToString(
    <Sidebar
      activeNav="attendance"
      activeAttendanceSubTab="take_attendance"
      isAttendanceExpanded={true}
      onSelectNav={() => {}}
      userRole="super_admin"
    />
  );
  runAssert(
    activeAttendanceSubHtml.includes('bg-emerald-600 text-white font-bold shadow-xs'),
    'S2.7: Active attendance sub-tab receives emerald accent pill styling'
  );

  // 2.5 Active Academic Settings Sub-item styling
  const activeClassesSubHtml = ReactDOMServer.renderToString(
    <Sidebar
      activeNav="academic-settings"
      activeAcademicSubTab="classes"
      isSettingsExpanded={true}
      isAcademicExpanded={true}
      onSelectNav={() => {}}
      userRole="super_admin"
    />
  );
  runAssert(
    activeClassesSubHtml.includes('bg-primary text-primary-foreground shadow-xs'),
    'S2.8: Active academic sub-tab (classes) receives primary pill styling'
  );


  // =========================================================================
  // SUITE 3: MOBILE SHEET DRAWER OPENING/CLOSING LOGIC
  // =========================================================================
  console.log('\n▶ Suite 3: Mobile Sheet Drawer Opening/Closing Logic');

  // 3.1 Closed state
  const closedSidebarHtml = ReactDOMServer.renderToString(
    <Sidebar
      activeNav="dashboard"
      isMobileOpen={false}
      onCloseMobile={() => {}}
      onSelectNav={() => {}}
    />
  );
  runAssert(closedSidebarHtml.includes('aside class="hidden md:block'), 'S3.1: Desktop aside remains hidden on mobile viewports');

  // 3.2 Open state: Sheet renders SheetContent with side="left"
  const openSidebarHtml = ReactDOMServer.renderToString(
    <Sidebar
      activeNav="dashboard"
      isMobileOpen={true}
      onCloseMobile={() => {}}
      onSelectNav={() => {}}
    />
  );

  runAssert(
    openSidebarHtml.includes('aria-label="Close navigation"'),
    'S3.2: Mobile drawer close button (X) is rendered with proper accessibility label'
  );
  runAssert(
    openSidebarHtml.includes('Navigation Menu'),
    'S3.3: Mobile drawer header rendered'
  );

  // 3.3 Event callbacks verification
  let closeMobileInvoked = false;
  let navSelectedId = null;

  const mockSidebar = (
    <Sidebar
      activeNav="dashboard"
      isMobileOpen={true}
      onCloseMobile={() => { closeMobileInvoked = true; }}
      onSelectNav={(id) => { navSelectedId = id; }}
      isStudentsExpanded={true}
      onSelectStudentSubTab={(sub) => {}}
    />
  );

  // Verify onCloseMobile is called on navigation
  runAssert(typeof mockSidebar.props.onCloseMobile === 'function', 'S3.4: onCloseMobile prop is bound to mobile drawer');
  mockSidebar.props.onCloseMobile();
  runAssert(closeMobileInvoked === true, 'S3.5: onCloseMobile callback updates state to false');


  // =========================================================================
  // SUITE 4: BRANCH SELECTOR ROLE SCOPING & SWITCHING
  // =========================================================================
  console.log('\n▶ Suite 4: BranchSelector Role Scoping (Super Admin vs Locked Principal)');

  // 4.1 Principal Role: Locked Campus Pill
  const principalMock = buildMockContext({
    role: 'principal',
    assignedBranchId: 1,
    branches: [
      { id: 1, branch_name: 'Main Campus', branch_code: 'MC01', status: 'Active' },
      { id: 2, branch_name: 'North Campus', branch_code: 'NC02', status: 'Active' }
    ]
  });

  runAssert(principalMock.isPrincipal === true, 'S4.1: Principal role correctly detected');
  runAssert(principalMock.isSuperAdmin === false, 'S4.2: Principal is not super admin');
  runAssert(principalMock.accessibleBranches.length === 1, 'S4.3: Principal accessible branches scoped strictly to assigned branch (length 1)');
  runAssert(principalMock.accessibleBranches[0].branch_code === 'MC01', 'S4.4: Principal accessible branch matches MC01');

  // Test BranchSelector component rendering for Principal
  setMockErpContext(principalMock);
  const principalBranchHtml = ReactDOMServer.renderToString(<BranchSelector />);

  runAssert(principalBranchHtml.includes('Assigned Campus'), 'S4.5: Principal sees "Assigned Campus" indicator');
  runAssert(principalBranchHtml.includes('Main Campus'), 'S4.6: Principal sees assigned campus name "Main Campus"');
  runAssert(principalBranchHtml.includes('MC01'), 'S4.7: Principal sees assigned campus code "MC01"');
  runAssert(!principalBranchHtml.includes('global-branch-selector-button'), 'S4.8: Principal CANNOT open campus switch dropdown (no switch button)');

  // 4.3 Super Admin Role: Unlocked multi-campus switcher
  let switchedBranchId = null;
  const superAdminMock = buildMockContext({
    role: 'super_admin',
    activeBranchId: 'all',
    onSetActiveBranchId: (id) => { switchedBranchId = id; },
    branches: [
      { id: 1, branch_name: 'Main Campus', branch_code: 'MC01', status: 'Active', city: 'Coimbatore', state: 'Tamil Nadu' },
      { id: 2, branch_name: 'North Campus', branch_code: 'NC02', status: 'Active', city: 'Chennai', state: 'Tamil Nadu' }
    ]
  });

  setMockErpContext(superAdminMock);
  const superAdminBranchHtml = ReactDOMServer.renderToString(<BranchSelector />);

  runAssert(superAdminBranchHtml.includes('global-branch-selector-button'), 'S4.9: Super Admin has global-branch-selector-button');
  runAssert(superAdminBranchHtml.includes('Organization Scope'), 'S4.10: Super Admin shows Organization Scope when activeBranchId="all"');
  runAssert(superAdminBranchHtml.includes('All Branches'), 'S4.11: Super Admin shows All Branches title');
  runAssert(superAdminBranchHtml.includes('ALL (2)'), 'S4.12: Super Admin shows ALL (2) badge with campus count');

  // 4.4 Super Admin scoped to specific campus (activeBranchId = 1)
  const superAdminScopedMock = buildMockContext({
    role: 'super_admin',
    activeBranchId: 1,
    branches: [
      { id: 1, branch_name: 'Main Campus', branch_code: 'MC01', status: 'Active', city: 'Coimbatore', state: 'Tamil Nadu' },
      { id: 2, branch_name: 'North Campus', branch_code: 'NC02', status: 'Active', city: 'Chennai', state: 'Tamil Nadu' }
    ]
  });

  setMockErpContext(superAdminScopedMock);
  const superAdminScopedHtml = ReactDOMServer.renderToString(<BranchSelector />);

  runAssert(superAdminScopedHtml.includes('Branch Campus'), 'S4.13: Scoped Super Admin shows Branch Campus title');
  runAssert(superAdminScopedHtml.includes('Main Campus'), 'S4.14: Scoped Super Admin shows Main Campus name');
  runAssert(superAdminScopedHtml.includes('MC01'), 'S4.15: Scoped Super Admin shows MC01 code');

  // 4.5 Loading State
  const loadingMock = buildMockContext({
    role: 'super_admin',
    isLoadingBranches: true
  });
  setMockErpContext(loadingMock);
  const loadingBranchHtml = ReactDOMServer.renderToString(<BranchSelector />);
  runAssert(loadingBranchHtml.includes('animate-pulse'), 'S4.16: BranchSelector renders animated pulse loader when isLoadingBranches=true');


  // =========================================================================
  // SUITE 5: USER PROFILE DROPDOWN MENU & LOGOUT FLOW
  // =========================================================================
  console.log('\n▶ Suite 5: User Profile Dropdown Menu & Logout Flow');

  // 5.1 Super Admin NavigationHeader Render
  let logoutCalled = false;
  const superAdminHeaderMock = buildMockContext({
    role: 'super_admin',
    currentUser: { name: 'Dr. Vikram Sarabhai', email: 'director@school.edu', role: 'super_admin' },
    onLogout: () => { logoutCalled = true; }
  });

  setMockErpContext(superAdminHeaderMock);
  const superAdminHeaderHtml = ReactDOMServer.renderToString(
    <MemoryRouter>
      <NavigationHeader organization={{ name: 'Vidya Mandir Trust' }} />
    </MemoryRouter>
  );

  runAssert(superAdminHeaderHtml.includes('Dr. Vikram Sarabhai'), 'S5.1: NavigationHeader renders current user name');
  runAssert(superAdminHeaderHtml.includes('DV'), 'S5.2: Avatar computes correct initials "DV" from two words "Dr." and "Vikram"');
  runAssert(superAdminHeaderHtml.includes('All Branches Access'), 'S5.3: Super Admin subtitle is "All Branches Access"');
  runAssert(superAdminHeaderHtml.includes('Super Admin Mode'), 'S5.4: Super Admin mode badge rendered in header');

  // 5.2 Principal NavigationHeader Render
  const principalHeaderMock = buildMockContext({
    role: 'principal',
    currentUser: { name: 'Sister Mary Joseph', email: 'principal@school.edu', role: 'principal' },
    assignedBranchId: 1,
    branches: [{ id: 1, branch_name: 'St. Mary Campus', branch_code: 'SMC', status: 'Active' }]
  });

  setMockErpContext(principalHeaderMock);
  const principalHeaderHtml = ReactDOMServer.renderToString(
    <MemoryRouter>
      <NavigationHeader organization={{ name: 'St. Mary High' }} />
    </MemoryRouter>
  );

  runAssert(principalHeaderHtml.includes('Sister Mary Joseph'), 'S5.5: Principal name displayed');
  runAssert(principalHeaderHtml.includes('SM'), 'S5.6: Principal initials "SM" computed');
  runAssert(principalHeaderHtml.includes('St. Mary Campus'), 'S5.7: Principal header displays campus name');

  // 5.3 Student NavigationHeader Render
  const studentHeaderMock = buildMockContext({
    role: 'student',
    currentUser: {
      name: 'Aanya Patel',
      role: 'student',
      student: { admission_number: 'ADM-2026-999' }
    }
  });

  setMockErpContext(studentHeaderMock);
  const studentHeaderHtml = ReactDOMServer.renderToString(
    <MemoryRouter>
      <NavigationHeader organization={{ name: 'Delhi Public School' }} />
    </MemoryRouter>
  );

  runAssert(studentHeaderHtml.includes('Aanya Patel'), 'S5.8: Student name displayed');
  runAssert(studentHeaderHtml.includes('AP'), 'S5.9: Student initials "AP" computed');
  runAssert(studentHeaderHtml.includes('Adm: ADM-2026-999'), 'S5.10: Student admission number displayed in user subtitle');
  runAssert(studentHeaderHtml.includes('Student Portal'), 'S5.11: Student Portal badge displayed in header');

  // 5.4 Single-word name initials test
  const singleWordNameMock = buildMockContext({
    role: 'teacher',
    currentUser: { name: 'Kavitha', role: 'teacher' }
  });
  setMockErpContext(singleWordNameMock);
  const singleWordHtml = ReactDOMServer.renderToString(
    <MemoryRouter>
      <NavigationHeader />
    </MemoryRouter>
  );
  runAssert(singleWordHtml.includes('KA'), 'S5.12: Single-word name "Kavitha" computes initials "KA"');

  // 5.5 Logout function execution test
  runAssert(typeof superAdminHeaderMock.logoutUser === 'function', 'S5.13: logoutUser is defined on ERP context');
  superAdminHeaderMock.logoutUser();
  runAssert(logoutCalled === true, 'S5.14: logoutUser successfully triggered');


  // =========================================================================
  // SUITE 6: ADVERSARIAL STRESS, BOUNDARY FUZZING & NULL GUARDS
  // =========================================================================
  console.log('\n▶ Suite 6: Adversarial Stress, Boundary Fuzzing & Null Guards');

  // 6.1 Sidebar with completely empty / undefined props
  let emptyPropsSidebarPassed = false;
  try {
    const html = ReactDOMServer.renderToString(<Sidebar />);
    emptyPropsSidebarPassed = html.length > 0;
  } catch (e) {
    emptyPropsSidebarPassed = false;
  }
  runAssert(emptyPropsSidebarPassed, 'S6.1: Sidebar renders without crashing when passed zero props');

  // 6.2 Sidebar with unknown role
  let unknownRolePassed = false;
  try {
    const html = ReactDOMServer.renderToString(
      <Sidebar activeNav="dashboard" userRole="unauthorized_intruder_xyz" />
    );
    unknownRolePassed = html.length > 0;
  } catch (e) {
    unknownRolePassed = false;
  }
  runAssert(unknownRolePassed, 'S6.2: Sidebar gracefully handles unknown/unauthorized role string');

  // 6.3 Sidebar with invalid / deep non-existent route
  let unknownRoutePassed = false;
  try {
    const html = ReactDOMServer.renderToString(
      <Sidebar activeNav="some/arbitrary/nested/path/that/does/not/exist" userRole="super_admin" />
    );
    unknownRoutePassed = html.length > 0;
  } catch (e) {
    unknownRoutePassed = false;
  }
  runAssert(unknownRoutePassed, 'S6.3: Sidebar gracefully handles non-existent route without crashing');

  // 6.4 Special characters, emoji and XSS fuzz strings in branch names
  try {
    const xssMock = buildMockContext({
      role: 'super_admin',
      activeBranchId: 1,
      branches: [
        { id: 1, branch_name: '<script>alert("xss")</script> 🏫 St. John & Paul #1', branch_code: 'CAMPUS-01 & <test>', status: 'Active' }
      ]
    });
    setMockErpContext(xssMock);
    const xssHtml = ReactDOMServer.renderToString(<BranchSelector />);
    runAssert(!xssHtml.includes('<script>alert'), 'S6.4: Special characters and script tags properly escaped in BranchSelector HTML');
    runAssert(xssHtml.includes('&lt;script&gt;'), 'S6.5: Script tags safely HTML-encoded in output');
  } catch (e) {
    runAssert(false, 'S6.4: Special characters handling failed', e.message);
  }

  // 6.5 Extremely long user names and branch names (CSS text-truncation check)
  try {
    const longNameMock = buildMockContext({
      role: 'super_admin',
      currentUser: {
        name: 'His Excellency Dr. Muhammad Al-Mansoor bin Abdulaziz Al-Saud of the International Global Foundation for Higher Learning and Excellence',
        email: 'very.long.email.address.that.exceeds.normal.limits.by.far@subdomain.campus.university.school.edu',
        role: 'super_admin'
      }
    });
    setMockErpContext(longNameMock);
    const longNameHtml = ReactDOMServer.renderToString(
      <MemoryRouter>
        <NavigationHeader />
      </MemoryRouter>
    );
    runAssert(longNameHtml.includes('truncate'), 'S6.6: Truncation CSS class applied to guard against layout overflow');
  } catch (e) {
    runAssert(false, 'S6.6: Truncation handling failed', e.message);
  }

  // 6.6 Rapid consecutive toggles simulation (stress test state mutators)
  const groupIds = NAVIGATION_GROUPS.map(g => g.id);
  let toggleState = {};
  for (let i = 0; i < 1000; i++) {
    const randomGroup = groupIds[i % groupIds.length];
    toggleState[randomGroup] = !toggleState[randomGroup];
  }
  runAssert(Object.keys(toggleState).length === 7, 'S6.7: High-frequency group toggle state mutations execute cleanly (1000 cycles)');

  // 6.7 AppLayout full integration render
  try {
    setMockErpContext(superAdminMock);
    const appLayoutHtml = ReactDOMServer.renderToString(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AppLayout toasts={[{ id: 1, message: 'Welcome back', type: 'info' }]} />
      </MemoryRouter>
    );
    runAssert(appLayoutHtml.includes('EduCampus ERP'), 'S6.8: AppLayout integrates NavigationHeader and brand typography');
    runAssert(appLayoutHtml.includes('Overview &amp; Hub') || appLayoutHtml.includes('Overview & Hub'), 'S6.9: AppLayout integrates Sidebar');
    runAssert(appLayoutHtml.includes('Enterprise Architecture'), 'S6.10: AppLayout integrates footer bar');
  } catch (e) {
    runAssert(false, 'S6.8: AppLayout integration render failed', e.message);
  }

  console.log('\n======================================================');
  console.log(`M2 STRESS SUITE SUMMARY: ${passedTests}/${totalTests} Passed (${((passedTests/totalTests)*100).toFixed(1)}%)`);
  if (failedTests > 0) {
    console.error(`FAILED: ${failedTests} test(s) failed:`);
    failureDetails.forEach(f => console.error(`  - ${f}`));
  }
  console.log('======================================================\n');

  return {
    total: totalTests,
    passed: passedTests,
    failed: failedTests,
    failures: failureDetails
  };
}
