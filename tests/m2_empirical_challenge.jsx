/**
 * tests/m2_empirical_challenge.jsx
 * Empirical Challenge Suite for Milestone 2: Shell & Navigation
 * Targets:
 *  - src/components/layout/AppLayout.jsx
 *  - src/components/layout/NavigationHeader.jsx
 *  - src/components/layout/Sidebar.jsx
 *  - src/components/branches/BranchSelector.jsx
 */

import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import assert from 'assert';

import { AppLayout } from '@/components/layout/AppLayout';
import { NavigationHeader } from '@/components/layout/NavigationHeader';
import { Sidebar, NAVIGATION_GROUPS } from '@/components/layout/Sidebar';
import { BranchSelector } from '@/components/branches/BranchSelector';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ToastContainer } from '@/components/common/Toast';
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

export function runAllTests() {
  console.log('\n======================================================');
  console.log('   MILESTONE 2 SHELL & NAVIGATION EMPIRICAL CHALLENGE  ');
  console.log('======================================================\n');

  // =========================================================================
  // SUITE 1: Layout Full-Width Suppression on /students/update
  // =========================================================================
  console.log('▶ Suite 1: Layout Full-Width Suppression on /students/update');

  recordTest('Sidebar is suppressed on /students/update', 'Layout-FullWidth', () => {
    resetMockErpContext();
    const html = renderToString(
      <MemoryRouter initialEntries={['/students/update']}>
        <Routes>
          <Route path="/students/*" element={<AppLayout toasts={[]} />} />
        </Routes>
      </MemoryRouter>
    );

    // Sidebar should be completely omitted on /students/update
    assert.strictEqual(
      html.includes('Multi-Branch ERP v2.4'),
      false,
      'Sidebar footer Multi-Branch ERP v2.4 must NOT be rendered on /students/update'
    );
    assert.strictEqual(
      html.includes('Overview &amp; Hub') || html.includes('Overview & Hub'),
      false,
      'Sidebar Navigation Groups must NOT be rendered on /students/update'
    );
  });

  recordTest('Main container uses max-w-none full-width on /students/update', 'Layout-FullWidth', () => {
    resetMockErpContext();
    const html = renderToString(
      <MemoryRouter initialEntries={['/students/update']}>
        <Routes>
          <Route path="/students/*" element={<AppLayout toasts={[]} />} />
        </Routes>
      </MemoryRouter>
    );

    assert.ok(
      html.includes('max-w-none'),
      'Main element must contain max-w-none on /students/update for spreadsheet matrix'
    );
    assert.strictEqual(
      html.includes('max-w-7xl mx-auto'),
      false,
      'Main element must NOT contain max-w-7xl mx-auto on /students/update'
    );
  });

  recordTest('Sidebar is suppressed on trailing slash /students/update/', 'Layout-FullWidth', () => {
    resetMockErpContext();
    const html = renderToString(
      <MemoryRouter initialEntries={['/students/update/']}>
        <Routes>
          <Route path="/students/*" element={<AppLayout toasts={[]} />} />
        </Routes>
      </MemoryRouter>
    );

    assert.strictEqual(
      html.includes('Multi-Branch ERP v2.4'),
      false,
      'Sidebar must NOT be rendered on /students/update/'
    );
    assert.ok(
      html.includes('max-w-none'),
      'Main container must retain max-w-none on /students/update/'
    );
  });

  recordTest('Sidebar is rendered normally on standard /students/details route', 'Layout-FullWidth', () => {
    resetMockErpContext();
    const html = renderToString(
      <MemoryRouter initialEntries={['/students/details']}>
        <Routes>
          <Route path="/students/*" element={<AppLayout toasts={[]} />} />
        </Routes>
      </MemoryRouter>
    );

    assert.ok(
      html.includes('Multi-Branch ERP v2.4'),
      'Sidebar must be rendered on standard /students/details route'
    );
    assert.ok(
      html.includes('max-w-7xl mx-auto'),
      'Main container must have standard max-w-7xl mx-auto on /students/details'
    );
    assert.strictEqual(
      html.includes('max-w-none'),
      false,
      'Main container must NOT be max-w-none on standard /students/details'
    );
  });

  recordTest('Sidebar is rendered normally on root dashboard route', 'Layout-FullWidth', () => {
    resetMockErpContext();
    const html = renderToString(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<AppLayout toasts={[]} />} />
        </Routes>
      </MemoryRouter>
    );

    assert.ok(
      html.includes('Multi-Branch ERP v2.4'),
      'Sidebar must be rendered on /dashboard'
    );
    assert.ok(
      html.includes('max-w-7xl mx-auto'),
      'Main container must have max-w-7xl mx-auto on /dashboard'
    );
  });

  // =========================================================================
  // SUITE 2: Empty Toasts Handling & Boundary Conditions
  // =========================================================================
  console.log('\n▶ Suite 2: Empty Toasts Handling & Boundary Conditions');

  recordTest('AppLayout handles toasts={null} without throwing', 'Toast-Handling', () => {
    resetMockErpContext();
    const html = renderToString(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<AppLayout toasts={null} />} />
        </Routes>
      </MemoryRouter>
    );
    assert.ok(html.length > 0, 'AppLayout renders cleanly with toasts={null}');
  });

  recordTest('AppLayout handles toasts={undefined} without throwing', 'Toast-Handling', () => {
    resetMockErpContext();
    const html = renderToString(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<AppLayout />} />
        </Routes>
      </MemoryRouter>
    );
    assert.ok(html.length > 0, 'AppLayout renders cleanly with undefined toasts');
  });

  recordTest('AppLayout handles toasts={[]} returning null ToastContainer', 'Toast-Handling', () => {
    resetMockErpContext();
    const html = renderToString(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<AppLayout toasts={[]} />} />
        </Routes>
      </MemoryRouter>
    );
    assert.strictEqual(
      html.includes('animate-slide-up'),
      false,
      'No toast message DOM nodes rendered when toasts array is empty'
    );
  });

  recordTest('ToastContainer directly returns null on empty toasts', 'Toast-Handling', () => {
    const html = renderToString(<ToastContainer toasts={[]} onDismiss={() => {}} />);
    assert.strictEqual(html, '', 'ToastContainer should return empty markup for []');
  });

  recordTest('ToastContainer renders multi-type toasts correctly', 'Toast-Handling', () => {
    const testToasts = [
      { id: 1, type: 'success', text: 'Academic year activated successfully.' },
      { id: 2, type: 'error', text: 'Failed to synchronize branch permissions.' },
      { id: 3, type: 'info', text: 'System backup in progress.' }
    ];
    const html = renderToString(<ToastContainer toasts={testToasts} onDismiss={() => {}} />);

    assert.ok(html.includes('Academic year activated successfully.'));
    assert.ok(html.includes('Failed to synchronize branch permissions.'));
    assert.ok(html.includes('System backup in progress.'));
    assert.ok(html.includes('bg-emerald-900'), 'Success toast has emerald background');
    assert.ok(html.includes('bg-rose-900'), 'Error toast has rose background');
    assert.ok(html.includes('bg-slate-900'), 'Info toast has slate background');
  });

  recordTest('ToastContainer handles empty string text and missing onDismiss', 'Toast-Handling', () => {
    const testToasts = [{ id: 4, type: 'info', text: '' }];
    const html = renderToString(<ToastContainer toasts={testToasts} />);
    assert.ok(html.includes('bg-slate-900'));
  });

  // =========================================================================
  // SUITE 3: Null User Fallbacks & Avatar Initials
  // =========================================================================
  console.log('\n▶ Suite 3: Null User Fallbacks & Avatar Initials');

  recordTest('NavigationHeader with null currentUser for super_admin', 'User-Fallback', () => {
    resetMockErpContext();
    setMockErpContext({
      currentUser: null,
      isSuperAdmin: true,
      isPrincipal: false,
      isStudent: false,
      userRole: 'super_admin'
    });

    const html = renderToString(
      <MemoryRouter>
        <NavigationHeader />
      </MemoryRouter>
    );

    assert.ok(html.includes('SA'), 'Fallback initials for Super Admin must be SA');
    assert.ok(html.includes('Super Admin'), 'Display name fallback must be Super Admin');
    assert.ok(html.includes('All Branches Access'), 'Subtitle fallback must be All Branches Access');
  });

  recordTest('NavigationHeader with null currentUser for student', 'User-Fallback', () => {
    resetMockErpContext();
    setMockErpContext({
      currentUser: null,
      isSuperAdmin: false,
      isPrincipal: false,
      isStudent: true,
      userRole: 'student'
    });

    const html = renderToString(
      <MemoryRouter>
        <NavigationHeader />
      </MemoryRouter>
    );

    assert.ok(html.includes('ST'), 'Fallback initials for Student must be ST');
    assert.ok(html.includes('Student'), 'Display name fallback must be Student');
    assert.ok(html.includes('Student Account'), 'Subtitle fallback must be Student Account');
  });

  recordTest('NavigationHeader with null currentUser for principal', 'User-Fallback', () => {
    resetMockErpContext();
    setMockErpContext({
      currentUser: null,
      isSuperAdmin: false,
      isPrincipal: true,
      isStudent: false,
      userRole: 'principal',
      assignedBranch: { branch_name: 'Coimbatore Campus', branch_code: 'CBE' }
    });

    const html = renderToString(
      <MemoryRouter>
        <NavigationHeader />
      </MemoryRouter>
    );

    assert.ok(html.includes('PR'), 'Fallback initials for Principal must be PR');
    assert.ok(html.includes('Principal'), 'Display name fallback must be Principal');
    assert.ok(html.includes('Coimbatore Campus'), 'Subtitle reflects assigned branch');
  });

  recordTest('NavigationHeader initials for single-word name "Aarav"', 'User-Fallback', () => {
    resetMockErpContext();
    setMockErpContext({
      currentUser: { name: 'Aarav', student: { admission_number: 'ADM-404' } },
      isStudent: true
    });

    const html = renderToString(
      <MemoryRouter>
        <NavigationHeader />
      </MemoryRouter>
    );

    assert.ok(html.includes('AA'), 'Single-word Aarav initials must be AA');
    assert.ok(html.includes('Adm: ADM-404'), 'Admission number rendered in subtitle');
  });

  recordTest('NavigationHeader initials for two-word name "Rohan Sharma"', 'User-Fallback', () => {
    resetMockErpContext();
    setMockErpContext({
      currentUser: { name: 'Rohan Sharma' },
      isSuperAdmin: true
    });

    const html = renderToString(
      <MemoryRouter>
        <NavigationHeader />
      </MemoryRouter>
    );

    assert.ok(html.includes('RS'), 'Two-word Rohan Sharma initials must be RS');
  });

  recordTest('NavigationHeader initials for multi-word name "Dr. Jane Mary Smith"', 'User-Fallback', () => {
    resetMockErpContext();
    setMockErpContext({
      currentUser: { name: 'Dr. Jane Mary Smith' },
      isPrincipal: true
    });

    const html = renderToString(
      <MemoryRouter>
        <NavigationHeader />
      </MemoryRouter>
    );

    assert.ok(html.includes('DJ'), 'First two word initials must be DJ');
  });

  recordTest('NavigationHeader empty name string falls back cleanly', 'User-Fallback', () => {
    resetMockErpContext();
    setMockErpContext({
      currentUser: { name: '   ' },
      isSuperAdmin: false,
      isPrincipal: true,
      userRole: 'principal'
    });

    const html = renderToString(
      <MemoryRouter>
        <NavigationHeader />
      </MemoryRouter>
    );

    assert.ok(html.length > 0, 'Renders without throwing for whitespace name');
    assert.ok(html.includes('Principal'), 'Displays fallback name Principal');
  });

  recordTest('NavigationHeader contains User Profile dropdown trigger', 'User-Fallback', () => {
    resetMockErpContext();
    const html = renderToString(
      <MemoryRouter>
        <NavigationHeader />
      </MemoryRouter>
    );

    assert.ok(
      html.includes('title="User Profile &amp; Settings"') || html.includes('title="User Profile & Settings"'),
      'Dropdown trigger contains User Profile & Settings title'
    );
    assert.ok(html.includes('EduCampus ERP Logo'), 'Header contains school logo');
    assert.ok(html.includes('Cycle:'), 'Header contains academic cycle indicator');
  });

  // =========================================================================
  // SUITE 4: Multi-Role Menu Permissions & Group Visibility
  // =========================================================================
  console.log('\n▶ Suite 4: Multi-Role Menu Permissions & Group Visibility');

  recordTest('Sidebar super_admin has all 7 groups and Settings', 'Role-Permissions', () => {
    const html = renderToString(
      <MemoryRouter>
        <Sidebar
          activeNav="dashboard"
          onSelectNav={() => {}}
          userRole="super_admin"
          isStudent={false}
          branchCount={3}
          isSettingsExpanded={true}
          userPermissions={{ canViewBranchSettings: true, canViewAcademicSettings: true }}
        />
      </MemoryRouter>
    );

    // 7 navigation groups
    for (const group of NAVIGATION_GROUPS) {
      assert.ok(
        html.includes(group.label.replace('&', '&amp;')) || html.includes(group.label),
        `Group "${group.label}" must be rendered for super_admin`
      );
    }

    // Settings group
    assert.ok(html.includes('Settings'), 'Settings must be visible for super_admin');
    assert.ok(html.includes('User Management'), 'User Management must be visible for super_admin');
    assert.ok(html.includes('Menu Assignment'), 'Menu Assignment must be visible for super_admin');
    assert.ok(html.includes('Branch Settings'), 'Branch Settings must be visible for super_admin');
    assert.ok(html.includes('Academic Settings'), 'Academic Settings must be visible for super_admin');
  });

  recordTest('Sidebar principal has all 7 groups but Settings is hidden', 'Role-Permissions', () => {
    const html = renderToString(
      <MemoryRouter>
        <Sidebar
          activeNav="dashboard"
          onSelectNav={() => {}}
          userRole="principal"
          isStudent={false}
          branchCount={1}
          userPermissions={{ canViewBranchSettings: false, canViewAcademicSettings: false }}
        />
      </MemoryRouter>
    );

    assert.ok(
      html.includes('Overview &amp; Hub') || html.includes('Overview & Hub'),
      'Overview group visible for principal'
    );
    assert.ok(
      html.includes('Student Information (SIS)'),
      'Students group visible for principal'
    );
    assert.ok(
      html.includes('Campus Operations'),
      'Campus Operations visible for principal'
    );
    // Settings must be hidden for principal
    assert.strictEqual(
      html.includes('User Management'),
      false,
      'User Management must NOT be visible for principal'
    );
    assert.strictEqual(
      html.includes('Menu Assignment'),
      false,
      'Menu Assignment must NOT be visible for principal'
    );
  });

  recordTest('Sidebar teacher filters out unauthorized modules', 'Role-Permissions', () => {
    const html = renderToString(
      <MemoryRouter>
        <Sidebar
          activeNav="dashboard"
          onSelectNav={() => {}}
          userRole="teacher"
          isStudent={false}
          branchCount={1}
        />
      </MemoryRouter>
    );

    // Permitted teacher modules
    assert.ok(html.includes('Attendance'), 'Teacher can see Attendance');
    assert.ok(html.includes('Timetable'), 'Teacher can see Timetable');
    assert.ok(html.includes('Communication'), 'Teacher can see Communication');
    assert.ok(html.includes('Library'), 'Teacher can see Library');

    // Prohibited teacher modules
    assert.strictEqual(html.includes('>Finance<'), false, 'Teacher cannot see Finance');
    assert.strictEqual(html.includes('>Transport<'), false, 'Teacher cannot see Transport');
    assert.strictEqual(html.includes('>HR<'), false, 'Teacher cannot see HR');
    assert.strictEqual(html.includes('>Reports<'), false, 'Teacher cannot see Reports');
    assert.strictEqual(html.includes('Settings'), false, 'Teacher cannot see Settings');
  });

  recordTest('Sidebar student portal mode renders studentMenuItems strictly', 'Role-Permissions', () => {
    const html = renderToString(
      <MemoryRouter>
        <Sidebar
          activeNav="dashboard"
          onSelectNav={() => {}}
          userRole="student"
          isStudent={true}
          branchCount={1}
        />
      </MemoryRouter>
    );

    assert.ok(html.includes('Student Portal'), 'Contains Student Portal title');
    assert.ok(html.includes('My Merits &amp; Remarks') || html.includes('My Merits & Remarks'));
    assert.ok(html.includes('Homework'));
    assert.ok(html.includes('Assignment'));
    assert.ok(html.includes('My Profile'));

    // Admin groups are not present
    assert.strictEqual(html.includes('Overview &amp; Hub'), false);
    assert.strictEqual(html.includes('Campus Operations'), false);
    assert.strictEqual(html.includes('Staff &amp; Administration'), false);
    assert.strictEqual(html.includes('Settings'), false);
  });

  recordTest('Sidebar legacy role "principle" normalizes to "principal"', 'Role-Permissions', () => {
    const html = renderToString(
      <MemoryRouter>
        <Sidebar
          activeNav="dashboard"
          onSelectNav={() => {}}
          userRole="principle"
          isStudent={false}
          branchCount={1}
        />
      </MemoryRouter>
    );

    assert.ok(
      html.includes('Student Information (SIS)'),
      'Normalized principle role can access Students group'
    );
  });

  recordTest('Sidebar unknown role handles gracefully without throwing', 'Role-Permissions', () => {
    const html = renderToString(
      <MemoryRouter>
        <Sidebar
          activeNav="dashboard"
          onSelectNav={() => {}}
          userRole="guest_visitor"
          isStudent={false}
          branchCount={0}
        />
      </MemoryRouter>
    );

    assert.ok(html.includes('Multi-Branch ERP v2.4'));
  });

  recordTest('Sidebar mobile sheet configures side="left" with left drawer positioning', 'Role-Permissions', () => {
    // 1. Verify Sidebar element sets isMobileOpen on Sheet and side="left" on SheetContent
    let sidebarEl;
    function HookRunner() {
      sidebarEl = Sidebar({
        activeNav: 'dashboard',
        onSelectNav: () => {},
        userRole: 'super_admin',
        isStudent: false,
        isMobileOpen: true,
        onCloseMobile: () => {},
      });
      return null;
    }
    renderToString(<HookRunner />);

    // sidebarEl is a Fragment with [<aside>...</aside>, <Sheet ...>...</Sheet>]
    const children = React.Children.toArray(sidebarEl.props.children);
    const sheetEl = children.find((c) => c && c.props && 'open' in c.props);
    assert.ok(sheetEl, 'Sidebar must render Sheet with open prop');
    assert.strictEqual(sheetEl.props.open, true, 'Sheet open prop must reflect isMobileOpen');

    const sheetContentEl = sheetEl.props.children;
    assert.ok(sheetContentEl, 'Sheet must contain SheetContent');
    assert.strictEqual(sheetContentEl.props.side, 'left', 'SheetContent side must be "left"');
    assert.ok(
      sheetContentEl.props.className.includes('w-64'),
      'SheetContent has responsive w-64 drawer width'
    );
  });

  // =========================================================================
  // SUITE 5: BranchSelector Scoping & Boundary Conditions
  // =========================================================================
  console.log('\n▶ Suite 5: BranchSelector Scoping & Boundary Conditions');

  recordTest('BranchSelector renders principal locked mode', 'Branch-Scoping', () => {
    resetMockErpContext();
    setMockErpContext({
      isPrincipal: true,
      isSuperAdmin: false,
      assignedBranch: { branch_name: 'Trichy Campus', branch_code: 'TRY' },
      isLoadingBranches: false
    });

    const html = renderToString(
      <MemoryRouter>
        <BranchSelector />
      </MemoryRouter>
    );

    assert.ok(html.includes('Assigned Campus'), 'Principal displays Assigned Campus badge');
    assert.ok(html.includes('Trichy Campus'), 'Displays assigned branch name');
    assert.ok(html.includes('TRY'), 'Displays assigned branch code');
    assert.strictEqual(
      html.includes('global-branch-selector-button'),
      false,
      'Principal must NOT have interactive selector button'
    );
  });

  recordTest('BranchSelector renders SuperAdmin consolidated "All Branches"', 'Branch-Scoping', () => {
    resetMockErpContext();
    setMockErpContext({
      isSuperAdmin: true,
      isPrincipal: false,
      isAllBranches: true,
      branches: [
        { id: 1, branch_name: 'Campus A', branch_code: 'CA' },
        { id: 2, branch_name: 'Campus B', branch_code: 'CB' },
        { id: 3, branch_name: 'Campus C', branch_code: 'CC' }
      ],
      isLoadingBranches: false
    });

    const html = renderToString(
      <MemoryRouter>
        <BranchSelector />
      </MemoryRouter>
    );

    assert.ok(html.includes('All Branches'), 'SuperAdmin displays All Branches');
    assert.ok(html.includes('ALL (3)'), 'Displays consolidated count ALL (3)');
    assert.ok(html.includes('Organization Scope'), 'Displays Organization Scope header');
  });

  recordTest('BranchSelector renders loading skeleton on isLoadingBranches=true', 'Branch-Scoping', () => {
    resetMockErpContext();
    setMockErpContext({
      isLoadingBranches: true
    });

    const html = renderToString(
      <MemoryRouter>
        <BranchSelector />
      </MemoryRouter>
    );

    assert.ok(html.includes('animate-pulse'), 'Renders animated pulse skeleton');
  });

  recordTest('BranchSelector handles empty branches array', 'Branch-Scoping', () => {
    resetMockErpContext();
    setMockErpContext({
      isSuperAdmin: true,
      isPrincipal: false,
      isAllBranches: true,
      branches: [],
      accessibleBranches: [],
      isLoadingBranches: false
    });

    const html = renderToString(
      <MemoryRouter>
        <BranchSelector />
      </MemoryRouter>
    );

    assert.ok(html.includes('ALL (0)'), 'Displays ALL (0) for empty branches');
  });

  // =========================================================================
  // SUITE 6: Breadcrumb Hierarchy & Module Formats
  // =========================================================================
  console.log('\n▶ Suite 6: Breadcrumb Hierarchy & Module Formats');

  recordTest('Breadcrumb renders root dashboard', 'Breadcrumb-Nav', () => {
    const html = renderToString(
      <Breadcrumb activeNav="dashboard" onNavigate={() => {}} />
    );
    assert.ok(html.includes('Dashboard'));
  });

  recordTest('Breadcrumb renders Settings → Branch Settings with branch name', 'Breadcrumb-Nav', () => {
    const html = renderToString(
      <Breadcrumb
        activeNav="branch-settings"
        onNavigate={() => {}}
        branchName="HQ-MAIN"
      />
    );
    assert.ok(html.includes('Settings'));
    assert.ok(html.includes('Branch Settings'));
    assert.ok(html.includes('HQ-MAIN'));
  });

  recordTest('Breadcrumb renders Settings → Academic Settings → Classes', 'Breadcrumb-Nav', () => {
    const html = renderToString(
      <Breadcrumb
        activeNav="academic-settings"
        onNavigate={() => {}}
        academicSubTab="classes"
      />
    );
    assert.ok(html.includes('Settings'));
    assert.ok(html.includes('Academic Settings'));
    assert.ok(html.includes('Classes'));
  });

  recordTest('Breadcrumb renders Students (SIS) → Student Update', 'Breadcrumb-Nav', () => {
    const html = renderToString(
      <Breadcrumb
        activeNav="students"
        onNavigate={() => {}}
        studentSubTab="update"
      />
    );
    assert.ok(html.includes('Students (SIS)'));
    assert.ok(html.includes('Student Update'));
  });

  recordTest('Breadcrumb renders Attendance → Take Attendance', 'Breadcrumb-Nav', () => {
    const html = renderToString(
      <Breadcrumb
        activeNav="attendance"
        onNavigate={() => {}}
        attendanceSubTab="take_attendance"
      />
    );
    assert.ok(html.includes('Attendance'));
    assert.ok(html.includes('Take Attendance'));
  });

  recordTest('Breadcrumb renders Communication → Homework', 'Breadcrumb-Nav', () => {
    const html = renderToString(
      <Breadcrumb
        activeNav="communication"
        onNavigate={() => {}}
        communicationSubTab="homework"
      />
    );
    assert.ok(html.includes('Communication'));
    assert.ok(html.includes('Homework'));
  });

  recordTest('Breadcrumb capitalizes generic modules', 'Breadcrumb-Nav', () => {
    const html = renderToString(
      <Breadcrumb activeNav="timetable" onNavigate={() => {}} />
    );
    assert.ok(html.includes('Timetable'));
  });

  // Summary Report
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log('\n======================================================');
  console.log(`M2 SHELL CHALLENGE SUMMARY: ${passed}/${results.length} Passed (${((passed / results.length) * 100).toFixed(1)}%)`);
  if (failed > 0) {
    console.error(`FAILED: ${failed} tests failed!`);
    throw new Error(`${failed} tests failed in M2 Shell Challenge Suite`);
  } else {
    console.log('[SUCCESS] All Milestone 2 empirical challenge tests PASSED!');
  }
  console.log('======================================================\n');
}

runAllTests();
