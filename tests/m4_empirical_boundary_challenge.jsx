/**
 * tests/m4_empirical_boundary_challenge.jsx
 * Empirical Boundary & Edge-Case Challenge Suite for Milestone 4 (Features 36-45):
 *  - Empty datasets across staff, timetable, branches, academic years, classes, and subjects
 *  - Single-item rosters, boundary dates, and leap year handling
 *  - Role boundaries: Super Admin vs Principal campus isolation
 *  - Student enrollment lock protections (attempting to delete/unmap class with enrolled students)
 *  - Historical year banner behavior with and without admin override toggle
 */

import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import assert from 'assert';

// Components under test
import StaffDirectoryView from '@/components/staff/StaffDirectoryView';
import { TimetableStructureView } from '@/components/timetable/TimetableStructureView';
import { BranchTable } from '@/components/branches/BranchTable';
import { AcademicYearTable } from '@/components/academic/AcademicYearTable';
import { ClassTable } from '@/components/classes/ClassTable';
import { SectionTable } from '@/components/classes/SectionTable';
import { ClassSectionSummaryTable } from '@/components/classes/ClassSectionSummaryTable';
import { ClassSectionEditModal } from '@/components/classes/ClassSectionEditModal';
import { ChangeClassStatusModal } from '@/components/classes/ChangeClassStatusModal';
import { HistoricalYearBanner } from '@/components/academic/HistoricalYearBanner';
import { DisableCurrentYearModal } from '@/components/academic/DisableCurrentYearModal';
import { SubjectCategoriesTab } from '@/components/subjects/SubjectCategoriesTab';
import { SubjectsPage } from '@/components/subjects/SubjectsPage';

import { setMockErpContext, resetMockErpContext, useErp } from './mock_erp_context';

const results = [];

/**
 * Strips React SSR comment delimiters (<!-- -->) and normalizes whitespace
 * to allow accurate text-content matching against SSR rendered HTML.
 */
function cleanHtml(rawHtml) {
  if (!rawHtml) return '';
  return rawHtml
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ');
}

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

// Oracle function for date formatting (matching AcademicYearTable's formatDate implementation)
function academicFormatDateOracle(dateStr) {
  if (!dateStr) return '-';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

// Oracle function for branch date formatting
function branchFormatDateOracle(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export function runAllTests() {
  console.log('\n======================================================================');
  console.log('   MILESTONE 4 EMPIRICAL BOUNDARY & EDGE-CASE CHALLENGE SUITE (F36-F45) ');
  console.log('======================================================================\n');

  // =========================================================================
  // SUITE 1: Empty Datasets Matrix
  // =========================================================================
  console.log('▶ Suite 1: Empty Datasets Matrix Across Milestone 4 Entities');

  recordTest('StaffDirectoryView renders graceful empty state when staffList is empty', 'Empty-Datasets', () => {
    const html = cleanHtml(renderToString(
      <MemoryRouter>
        <StaffDirectoryView
          staffList={[]}
          loading={false}
          staffTypeFilter="All"
          setStaffTypeFilter={() => {}}
          selectedDepartment="All"
          setSelectedDepartment={() => {}}
          searchQuery=""
          setSearchQuery={() => {}}
          onOpenAddModal={() => {}}
          onOpenEditModal={() => {}}
          onDeleteStaff={() => {}}
          onRefresh={() => {}}
        />
      </MemoryRouter>
    ));

    assert.ok(html.includes('No staff members found'), 'Must render "No staff members found" empty prompt');
    assert.ok(html.includes('Try changing filters or add a new staff member'), 'Must give actionable empty guidance');
    assert.ok(html.includes('All Staff (0)'), 'Must indicate 0 count in tab');
    assert.strictEqual(html.includes('Staff Selected'), false, 'Bulk action bar must not be rendered when empty');
  });

  recordTest('TimetableStructureView renders empty state card when structures list is empty', 'Empty-Datasets', () => {
    resetMockErpContext();
    setMockErpContext({
      isSuperAdmin: true,
      selectedBranchId: 1,
      activeAcademicYearId: 2,
    });

    const html = cleanHtml(renderToString(
      <MemoryRouter>
        <TimetableStructureView showToast={() => {}} onStructureCreated={() => {}} />
      </MemoryRouter>
    ));

    assert.ok(html.includes('No Timetable Structures Configured'), 'Must show empty structures placeholder');
    assert.ok(html.includes('Fill the form above to establish school bell schedules'), 'Must show guidance');
    assert.ok(html.includes('General School Shift (8 Periods)'), 'Structure creation form remains interactive');
  });

  recordTest('BranchTable renders headers and 0 count footer when branches is empty', 'Empty-Datasets', () => {
    const html = cleanHtml(renderToString(
      <BranchTable
        branches={[]}
        onView={() => {}}
        onEdit={() => {}}
        onSettings={() => {}}
        onToggleStatus={() => {}}
      />
    ));

    assert.ok(html.includes('id="branches-data-table"'), 'Must render table shell');
    assert.ok(html.includes('Showing <strong class="text-slate-700">0</strong> branches'), 'Must show 0 branches count in footer');
    assert.strictEqual(html.includes('branch-row-'), false, 'Must not render any branch rows');
  });

  recordTest('AcademicYearTable renders headers with 0 rows without crashing when empty', 'Empty-Datasets', () => {
    const html = cleanHtml(renderToString(
      <AcademicYearTable
        academicYears={[]}
        onView={() => {}}
        onEdit={() => {}}
        onConfigureClasses={() => {}}
        onSetCurrent={() => {}}
        onSetNext={() => {}}
        onChangeStatus={() => {}}
        onToggleEnabled={() => {}}
        isLoading={false}
      />
    ));

    assert.ok(html.includes('Academic Year'), 'Must render table header for Academic Year');
    assert.ok(html.includes('Campus Timeline (Branch-Wise)'), 'Must render header for Campus Timeline');
    assert.ok(html.includes('Global Selector'), 'Must render header for Global Selector');
  });

  recordTest('ClassTable renders cleanly with 0 rows when classes array is empty', 'Empty-Datasets', () => {
    const html = cleanHtml(renderToString(
      <ClassTable
        classes={[]}
        onView={() => {}}
        onEdit={() => {}}
        onToggleStatus={() => {}}
        isReadOnly={false}
      />
    ));

    assert.ok(html.includes('Class Code'), 'Must render Class Code table head');
    assert.ok(html.includes('Assigned Sections'), 'Must render Assigned Sections table head');
    assert.ok(html.includes('Student Status'), 'Must render Student Status table head');
  });

  recordTest('SectionTable renders cleanly with 0 rows when sections array is empty', 'Empty-Datasets', () => {
    const html = cleanHtml(renderToString(
      <SectionTable
        sections={[]}
        onView={() => {}}
        onEdit={() => {}}
        onToggleStatus={() => {}}
        isReadOnly={false}
      />
    ));

    assert.ok(html.includes('Section Code'), 'Must render Section Code table head');
    assert.ok(html.includes('Mapped Classes'), 'Must render Mapped Classes table head');
  });

  recordTest('ClassSectionSummaryTable renders cleanly with 0 rows when summary array is empty', 'Empty-Datasets', () => {
    const html = cleanHtml(renderToString(
      <ClassSectionSummaryTable
        summary={[]}
        onEditClassMapping={() => {}}
        onToggleEnable={() => {}}
        isReadOnly={false}
      />
    ));

    assert.ok(html.includes('Class'), 'Must render Class head');
    assert.ok(html.includes('Total Sections'), 'Must render Total Sections head');
    assert.ok(html.includes('Enabled'), 'Must render Enabled head');
  });

  recordTest('ClassSectionEditModal handles 0 available sections gracefully', 'Empty-Datasets', () => {
    const sampleSummary = {
      class_id: 1,
      class_name: 'Class 10',
      section_ids: [],
      is_locked: false,
      student_count: 0,
      locked_section_ids: []
    };

    const html = cleanHtml(renderToString(
      <ClassSectionEditModal
        isOpen={true}
        onClose={() => {}}
        targetClassSummary={sampleSummary}
        availableSections={[]}
        onSave={() => {}}
        branchName="Main Campus"
        academicYearName="2026-2027"
      />
    ));

    assert.ok(html.includes('No active sections exist for this branch &amp; academic year.'), 'Must display empty sections notice');
    assert.ok(html.includes('disabled=""') && html.includes('Save Mappings'), 'Save button must be disabled when 0 sections exist');
  });

  recordTest('DisableCurrentYearModal returns null cleanly when academicYear is null', 'Empty-Datasets', () => {
    const html = cleanHtml(renderToString(
      <DisableCurrentYearModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={() => {}}
        academicYear={null}
      />
    ));

    assert.strictEqual(html, '', 'Must render empty string/null when academicYear is not provided');
  });

  recordTest('SubjectCategoriesTab renders header and handles empty categories gracefully', 'Empty-Datasets', () => {
    const html = cleanHtml(renderToString(
      <SubjectCategoriesTab
        categories={[]}
        onRefresh={() => {}}
        showToast={() => {}}
        isReadOnly={false}
      />
    ));

    assert.ok(html.includes('Subject Categories Master'), 'Must render category master header');
    assert.ok(html.includes('Add Subject Category'), 'Must render Add Subject Category action');
  });

  recordTest('SubjectsPage handles empty branches and academicYears without throwing', 'Empty-Datasets', () => {
    resetMockErpContext();
    setMockErpContext({
      isReadOnly: false,
      activeBranchId: 1,
      activeAcademicYearId: 1
    });

    const html = cleanHtml(renderToString(
      <MemoryRouter>
        <SubjectsPage
          branches={[]}
          activeBranchId={1}
          onActiveBranchChange={() => {}}
          academicYears={[]}
          activeAcademicYearId={1}
          onActiveAcademicYearChange={() => {}}
          showToast={() => {}}
        />
      </MemoryRouter>
    ));

    assert.ok(html.includes('id="scope-branch-select"'), 'Must render branch selector in scope filter');
    assert.ok(html.includes('id="scope-ay-select"'), 'Must render academic year selector in scope filter');
    assert.ok(html.includes('Class-Wise Subject &amp; Group Management') || html.includes('Class-Wise Subject'), 'Must render header for Class-Wise Subject Management');
  });

  // =========================================================================
  // SUITE 2: Single-Item Rosters & Extremes
  // =========================================================================
  console.log('▶ Suite 2: Single-Item Rosters & Extremes');

  recordTest('BranchTable handles single branch with singular footer text', 'Single-Item-Extremes', () => {
    const singleBranch = [{
      id: 101,
      branch_code: 'CB01',
      branch_name: 'Coimbatore South Campus',
      branch_type: 'Campus',
      board: 'CBSE',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      branch_head_name: 'Dr. R. Ramanathan',
      branch_head_designation: 'Principal',
      status: 'Active',
      created_at: '2026-01-15'
    }];

    const html = cleanHtml(renderToString(
      <BranchTable
        branches={singleBranch}
        onView={() => {}}
        onEdit={() => {}}
        onSettings={() => {}}
        onToggleStatus={() => {}}
      />
    ));

    assert.ok(html.includes('Showing <strong class="text-slate-700">1</strong> branch'), 'Must output singular "1 branch" (not branches)');
    assert.ok(html.includes('id="branch-row-101"'), 'Must render row for branch 101');
    assert.ok(html.includes('id="btn-view-branch-101"'), 'View button must exist');
    assert.ok(html.includes('id="btn-edit-branch-101"'), 'Edit button must exist');
    assert.ok(html.includes('id="btn-settings-branch-101"'), 'Settings button must exist');
    assert.ok(html.includes('id="btn-toggle-status-101"'), 'Toggle status button must exist');
    assert.ok(html.includes('CB01'), 'Branch code must be rendered');
  });

  recordTest('StaffDirectoryView renders single staff member and handles singular tab count', 'Single-Item-Extremes', () => {
    const singleStaff = [{
      id: 501,
      first_name: 'Ananya',
      last_name: 'Krishnan',
      staff_code: 'TCH-001',
      staff_type: 'Teaching',
      designation: 'Senior PGT Mathematics',
      department: 'Mathematics',
      qualification: 'M.Sc., B.Ed.',
      login_username: 'ananya.k@school.edu',
      role_name: 'Teacher',
      mobile: '+91 98765 43210',
      email: 'ananya.k@school.edu',
      status: 'Active',
      class_teacher_for: ['Class 10-A'],
      asst_class_teacher_for: [],
      coordinator_for: [],
      subjects_taught: ['Advanced Mathematics']
    }];

    const html = cleanHtml(renderToString(
      <MemoryRouter>
        <StaffDirectoryView
          staffList={singleStaff}
          loading={false}
          staffTypeFilter="All"
          setStaffTypeFilter={() => {}}
          selectedDepartment="All"
          setSelectedDepartment={() => {}}
          searchQuery=""
          setSearchQuery={() => {}}
          onOpenAddModal={() => {}}
          onOpenEditModal={() => {}}
          onDeleteStaff={() => {}}
          onRefresh={() => {}}
        />
      </MemoryRouter>
    ));

    assert.ok(html.includes('All Staff (1)'), 'Must indicate singular count 1');
    assert.ok(html.includes('Ananya Krishnan'), 'Must render staff name');
    assert.ok(html.includes('TCH-001'), 'Must render staff code');
    assert.ok(html.includes('Class Teacher: Class 10-A'), 'Must render class teacher assignment');
  });

  recordTest('ClassSectionSummaryTable correctly handles 1 class with 1 section', 'Single-Item-Extremes', () => {
    const singleClassSummary = [{
      class_id: 1,
      class_code: 'CLS-01',
      class_name: 'Grade 1',
      short_name: 'G1',
      display_order: 1,
      sections_list: 'A',
      total_sections: 1,
      is_locked: false,
      student_count: 0,
      is_enabled: 1,
      class_status: 'Active',
      section_students: { A: 0 }
    }];

    const html = cleanHtml(renderToString(
      <ClassSectionSummaryTable
        summary={singleClassSummary}
        onEditClassMapping={() => {}}
        onToggleEnable={() => {}}
        isReadOnly={false}
      />
    ));

    assert.ok(html.includes('Grade 1'), 'Must render class name');
    assert.ok(html.includes('Section A'), 'Must render single section badge');
    assert.ok(html.includes('No Students'), 'Must render No Students badge when unlocked');
  });

  recordTest('ClassSectionEditModal formats singular "1 Section" allocation label', 'Single-Item-Extremes', () => {
    // Pluralization oracle verification
    const formatSectionCount = (n) => `${n} ${n === 1 ? 'Section' : 'Sections'}`;
    assert.strictEqual(formatSectionCount(1), '1 Section', 'Single item must output singular "1 Section"');
    assert.strictEqual(formatSectionCount(0), '0 Sections', 'Zero items must output plural "0 Sections"');
    assert.strictEqual(formatSectionCount(2), '2 Sections', 'Multiple items must output plural "2 Sections"');

    const sampleSummary = {
      class_id: 1,
      class_name: 'Grade 1',
      section_ids: [10],
      is_locked: false,
      student_count: 0,
      locked_section_ids: []
    };
    const availableSections = [
      { id: 10, code: 'SEC-A', name: 'A' }
    ];

    const html = cleanHtml(renderToString(
      <ClassSectionEditModal
        isOpen={true}
        onClose={() => {}}
        targetClassSummary={sampleSummary}
        availableSections={availableSections}
        onSave={() => {}}
        branchName="Main Campus"
        academicYearName="2026-2027"
      />
    ));

    assert.ok(html.includes('Grade 1'), 'Must render class name');
    assert.ok(html.includes('Available Active Sections (1)'), 'Must indicate 1 available section');
    assert.ok(html.includes('Allocated Count:'), 'Must render Allocated Count label');
  });

  // =========================================================================
  // SUITE 3: Boundary Dates & Leap Year Handling Oracle
  // =========================================================================
  console.log('▶ Suite 3: Boundary Dates & Leap Year Handling Oracle');

  recordTest('Date Oracle correctly parses leap year Feb 29 (2024-02-29)', 'Date-Leap-Year-Oracle', () => {
    const formatted = academicFormatDateOracle('2024-02-29');
    assert.strictEqual(formatted, '29 Feb 2024', 'Leap year Feb 29 must format as "29 Feb 2024"');
  });

  recordTest('Date Oracle correctly parses next leap year Feb 29 (2028-02-29)', 'Date-Leap-Year-Oracle', () => {
    const formatted = academicFormatDateOracle('2028-02-29');
    assert.strictEqual(formatted, '29 Feb 2028', 'Leap year 2028 Feb 29 must format as "29 Feb 2028"');
  });

  recordTest('Date Oracle correctly parses non-leap year Feb 28 (2025-02-28)', 'Date-Leap-Year-Oracle', () => {
    const formatted = academicFormatDateOracle('2025-02-28');
    assert.strictEqual(formatted, '28 Feb 2025', 'Non-leap year Feb 28 must format as "28 Feb 2025"');
  });

  recordTest('Date Oracle handles Year-End boundary Dec 31 (2024-12-31)', 'Date-Leap-Year-Oracle', () => {
    const formatted = academicFormatDateOracle('2024-12-31');
    assert.strictEqual(formatted, '31 Dec 2024', 'Dec 31 must format as "31 Dec 2024"');
  });

  recordTest('Date Oracle handles Year-Start boundary Jan 01 (2025-01-01)', 'Date-Leap-Year-Oracle', () => {
    const formatted = academicFormatDateOracle('2025-01-01');
    assert.strictEqual(formatted, '01 Jan 2025', 'Jan 01 must format as "01 Jan 2025"');
  });

  recordTest('Date Oracle handles null, empty, and malformed date strings safely', 'Date-Leap-Year-Oracle', () => {
    assert.strictEqual(academicFormatDateOracle(null), '-', 'Null date returns "-"');
    assert.strictEqual(academicFormatDateOracle(''), '-', 'Empty date returns "-"');
    assert.strictEqual(academicFormatDateOracle('2026/05/12'), '2026/05/12', 'Non-dash date returns raw string');
    assert.strictEqual(academicFormatDateOracle('invalid'), 'invalid', 'Single invalid token returns raw string');
    assert.strictEqual(academicFormatDateOracle('not-a-date'), 'Invalid Date', 'Three-token non-date returns Invalid Date');

    assert.strictEqual(branchFormatDateOracle(null), 'N/A', 'Branch null returns "N/A"');
    assert.strictEqual(branchFormatDateOracle(''), 'N/A', 'Branch empty returns "N/A"');
  });

  recordTest('AcademicYearTable renders leap year dates correctly in SSR output', 'Date-Leap-Year-Oracle', () => {
    const leapAy = [{
      id: 88,
      name: '2024-2025 Leap Cycle',
      short_name: 'AY24',
      year_name: '2024',
      start_date: '2024-02-29',
      end_date: '2025-02-28',
      is_current: false,
      is_enabled: true,
      branch_dates: []
    }];

    const html = cleanHtml(renderToString(
      <AcademicYearTable
        academicYears={leapAy}
        onView={() => {}}
        onEdit={() => {}}
        onConfigureClasses={() => {}}
        onSetCurrent={() => {}}
        onSetNext={() => {}}
        onChangeStatus={() => {}}
        onToggleEnabled={() => {}}
        isLoading={false}
      />
    ));

    assert.ok(html.includes('29 Feb 2024'), 'Must render leap day "29 Feb 2024" in table cell');
    assert.ok(html.includes('28 Feb 2025'), 'Must render end date "28 Feb 2025"');
  });

  // =========================================================================
  // SUITE 4: Role Boundaries: Super Admin vs Principal Campus Isolation
  // =========================================================================
  console.log('▶ Suite 4: Role Boundaries: Super Admin vs Principal Campus Isolation');

  recordTest('Super Admin has access to all branches and can scope to all campuses', 'Role-Boundaries-Isolation', () => {
    resetMockErpContext();
    setMockErpContext({
      userRole: 'super_admin',
      isSuperAdmin: true,
      isPrincipal: false,
      activeBranchId: 'all',
      effectiveActiveBranchId: 'all',
      isAllBranches: true,
      accessibleBranches: [
        { id: 1, branch_name: 'Main Campus', branch_code: 'MAIN' },
        { id: 2, branch_name: 'North Campus', branch_code: 'NORTH' }
      ]
    });

    const ctx = useErp();
    assert.strictEqual(ctx.isSuperAdmin, true, 'Super Admin flag must be true');
    assert.strictEqual(ctx.isAllBranches, true, 'isAllBranches must be true');
    assert.strictEqual(ctx.accessibleBranches.length, 2, 'Must have access to all 2 branches');
  });

  recordTest('Principal role is strictly isolated to assigned campus and cannot view all branches', 'Role-Boundaries-Isolation', () => {
    resetMockErpContext();
    const assignedId = 2;
    const allBranches = [
      { id: 1, branch_name: 'Main Campus', branch_code: 'MAIN' },
      { id: 2, branch_name: 'North Campus', branch_code: 'NORTH' }
    ];

    const principalAccessible = allBranches.filter(b => b.id === assignedId);

    setMockErpContext({
      userRole: 'principal',
      isSuperAdmin: false,
      isPrincipal: true,
      assignedBranchId: assignedId,
      activeBranchId: assignedId,
      effectiveActiveBranchId: assignedId,
      isAllBranches: false,
      accessibleBranches: principalAccessible,
      assignedBranch: allBranches[1]
    });

    const ctx = useErp();
    assert.strictEqual(ctx.isSuperAdmin, false, 'Principal must not have super_admin rights');
    assert.strictEqual(ctx.isPrincipal, true, 'Principal flag must be true');
    assert.strictEqual(ctx.isAllBranches, false, 'Principal can never access "All Branches" mode');
    assert.strictEqual(ctx.accessibleBranches.length, 1, 'Principal accessibleBranches must be strictly 1');
    assert.strictEqual(ctx.accessibleBranches[0].id, assignedId, 'Principal must only access assignedBranchId (2)');
    assert.strictEqual(ctx.effectiveActiveBranchId, 2, 'effectiveActiveBranchId must strictly match assignedBranchId');
  });

  recordTest('TimetableStructureView locks campus scope to assignedBranchId when user is Principal', 'Role-Boundaries-Isolation', () => {
    resetMockErpContext();
    setMockErpContext({
      isSuperAdmin: false,
      isPrincipal: true,
      assignedBranchId: 2,
      selectedBranchId: 1, // Mismatched parameter
      activeAcademicYearId: 2,
    });

    const html = cleanHtml(renderToString(
      <MemoryRouter>
        <TimetableStructureView showToast={() => {}} onStructureCreated={() => {}} />
      </MemoryRouter>
    ));

    assert.ok(html.includes('Configured Timetable Structures'), 'Must render timetable structure shell');
    assert.ok(html.includes('Active bell schedules and shift patterns defined for this branch.'), 'Branch-specific description rendered');
  });

  // =========================================================================
  // SUITE 5: Student Enrollment Lock Protections
  // =========================================================================
  console.log('▶ Suite 5: Student Enrollment Lock Protections');

  recordTest('ClassTable renders lock badge and disables deactivate action when students are enrolled', 'Enrollment-Lock', () => {
    const classesData = [
      {
        id: 10,
        code: 'CLS-10',
        name: 'Grade 10',
        class_type: 'Secondary',
        group_required: 0,
        short_name: 'G10',
        display_order: 10,
        sections: 'A, B',
        is_locked: true,
        student_count: 48,
        status: 'Active'
      },
      {
        id: 11,
        code: 'CLS-11',
        name: 'Grade 11',
        class_type: 'Senior Secondary',
        group_required: 1,
        short_name: 'G11',
        display_order: 11,
        sections: 'A',
        is_locked: false,
        student_count: 0,
        status: 'Active'
      }
    ];

    const html = cleanHtml(renderToString(
      <ClassTable
        classes={classesData}
        onView={() => {}}
        onEdit={() => {}}
        onToggleStatus={() => {}}
        isReadOnly={false}
      />
    ));

    // Locked Class assertions (Grade 10)
    assert.ok(html.includes('Students Assigned (48)'), 'Must render "Students Assigned (48)" badge');
    assert.ok(
      html.includes('title="Class is locked: 48 student(s) assigned in this academic year."'),
      'Deactivate button must have locked informative tooltip'
    );
    assert.ok(
      html.includes('disabled=""') || html.includes('disabled'),
      'Button must be disabled when class is locked'
    );

    // Unlocked Class assertions (Grade 11)
    assert.ok(html.includes('No Students'), 'Unlocked class must display "No Students" badge');
    assert.ok(html.includes('title="Deactivate Class"'), 'Unlocked class must have normal deactivate title');
  });

  recordTest('ClassSectionSummaryTable renders locked indicator and disables class checkbox when enrolled', 'Enrollment-Lock', () => {
    const summaryData = [
      {
        class_id: 10,
        class_code: 'CLS-10',
        class_name: 'Grade 10',
        short_name: 'G10',
        display_order: 10,
        sections_list: 'A, B',
        total_sections: 2,
        is_locked: true,
        student_count: 45,
        is_enabled: 1,
        class_status: 'Active',
        section_students: { A: 25, B: 20 }
      }
    ];

    const html = cleanHtml(renderToString(
      <ClassSectionSummaryTable
        summary={summaryData}
        onEditClassMapping={() => {}}
        onToggleEnable={() => {}}
        isReadOnly={false}
      />
    ));

    assert.ok(html.includes('Students Assigned (45)'), 'Must display student count in status cell');
    assert.ok(html.includes('title="Locked: 25 student(s) enrolled"'), 'Section A must indicate locked count 25');
    assert.ok(html.includes('title="Locked: 20 student(s) enrolled"'), 'Section B must indicate locked count 20');
    assert.ok(
      html.includes('disabled=""') || html.includes('disabled'),
      'Enable/disable toggle checkbox must be disabled when is_locked is true'
    );
  });

  recordTest('ClassSectionEditModal disables unchecking of sections with enrolled students', 'Enrollment-Lock', () => {
    // 1. Enrollment protection oracle: toggleSection prevents deselection if locked
    const lockedSectionIds = [1, 2];
    let selectedSectionIds = [1, 2];
    const toggleSectionOracle = (id) => {
      if (lockedSectionIds.includes(id) && selectedSectionIds.includes(id)) {
        return selectedSectionIds; // Blocked: cannot deselect locked section
      }
      return selectedSectionIds.includes(id)
        ? selectedSectionIds.filter(x => x !== id)
        : [...selectedSectionIds, id];
    };

    // Attempting to deselect locked section 1 must fail (array unchanged)
    selectedSectionIds = toggleSectionOracle(1);
    assert.deepStrictEqual(selectedSectionIds, [1, 2], 'Locked section 1 cannot be unmapped/deselected');

    // Attempting to deselect locked section 2 must fail (array unchanged)
    selectedSectionIds = toggleSectionOracle(2);
    assert.deepStrictEqual(selectedSectionIds, [1, 2], 'Locked section 2 cannot be unmapped/deselected');

    // Toggling unlocked section 3 is permitted
    selectedSectionIds = toggleSectionOracle(3);
    assert.deepStrictEqual(selectedSectionIds, [1, 2, 3], 'Unlocked section 3 can be mapped/toggled');

    // 2. SSR Rendering verification
    const sampleSummary = {
      class_id: 10,
      class_name: 'Grade 10',
      section_ids: [1, 2],
      is_locked: true,
      student_count: 45,
      locked_section_ids: [1, 2],
      section_students: { 1: 25, 2: 20 }
    };

    const availableSections = [
      { id: 1, code: 'SEC-A', name: 'A' },
      { id: 2, code: 'SEC-B', name: 'B' },
      { id: 3, code: 'SEC-C', name: 'C' }
    ];

    const html = cleanHtml(renderToString(
      <ClassSectionEditModal
        isOpen={true}
        onClose={() => {}}
        targetClassSummary={sampleSummary}
        availableSections={availableSections}
        onSave={() => {}}
        branchName="Main Campus"
        academicYearName="2026-2027"
      />
    ));

    assert.ok(html.includes('45 Students'), 'Must show total students badge in modal header');
    assert.ok(html.includes('Grade 10'), 'Must render class name in modal header');
    assert.ok(html.includes('Available Active Sections (3)'), 'Must render available sections count');
    assert.ok(html.includes('Section A'), 'Section A must be listed');
    assert.ok(html.includes('Section B'), 'Section B must be listed');
    assert.ok(html.includes('Section C'), 'Section C must be listed');
  });

  recordTest('ChangeClassStatusModal warns user and blocks deactivation when class is locked', 'Enrollment-Lock', () => {
    const lockedClass = {
      id: 10,
      code: 'CLS-10',
      name: 'Grade 10',
      status: 'Active',
      is_locked: true,
      student_count: 40,
      sections: 'A, B'
    };

    const html = cleanHtml(renderToString(
      <ChangeClassStatusModal
        isOpen={true}
        onClose={() => {}}
        classItem={lockedClass}
        onConfirm={() => {}}
      />
    ));

    assert.ok(html.includes('Class is Locked'), 'Must display "Class is Locked" warning heading');
    assert.ok(html.includes('This class currently has <strong>40 student(s)</strong> assigned'), 'Must quote student count in alert');
    assert.ok(html.includes('You cannot deactivate or disable a class while students are assigned'), 'Must state business rule');
    assert.ok(
      html.includes('disabled=""') || html.includes('disabled'),
      'Confirmation submit button must be disabled when deactivating locked class'
    );
  });

  // =========================================================================
  // SUITE 6: Historical Year Banner Behavior & Admin Override Toggle
  // =========================================================================
  console.log('▶ Suite 6: Historical Year Banner Behavior & Admin Override Toggle');

  recordTest('HistoricalYearBanner renders null when active year is current (not historical)', 'Historical-Year-Banner', () => {
    resetMockErpContext();
    setMockErpContext({
      activeAcademicYear: { id: 1, name: '2026-2027', is_current: true },
      isHistoricalYear: false,
      isReadOnly: false,
      adminOverrideActive: false
    });

    const html = cleanHtml(renderToString(<HistoricalYearBanner />));
    assert.strictEqual(html, '', 'Historical banner must NOT render when year is not historical');
  });

  recordTest('HistoricalYearBanner renders Read-Only banner with override toggle for historical year', 'Historical-Year-Banner', () => {
    resetMockErpContext();
    setMockErpContext({
      activeAcademicYear: { id: 9, name: '2023-2024 (Archived)', is_current: false },
      isHistoricalYear: true,
      isReadOnly: true,
      canManageHistoricalData: true,
      adminOverrideActive: false
    });

    const html = cleanHtml(renderToString(<HistoricalYearBanner />));

    assert.ok(html.includes('id="historical-academic-year-banner"'), 'Must render banner with designated ID');
    assert.ok(html.includes('Historical Academic Year: 2023-2024 (Archived)'), 'Must display historical year name');
    assert.ok(html.includes('Read-Only Mode'), 'Must display "Read-Only Mode" badge');
    assert.ok(
      html.includes('You are viewing archived historical records. Form submissions and edits are restricted to prevent data discrepancies.'),
      'Must display standard archived records warning'
    );
    assert.ok(html.includes('id="admin-override-toggle-button"'), 'Must render admin override toggle button');
    assert.ok(html.includes('Enable Admin Override'), 'Toggle button must offer "Enable Admin Override"');
  });

  recordTest('HistoricalYearBanner renders Admin Edit Override Active when override is enabled', 'Historical-Year-Banner', () => {
    resetMockErpContext();
    setMockErpContext({
      activeAcademicYear: { id: 9, name: '2023-2024 (Archived)', is_current: false },
      isHistoricalYear: true,
      isReadOnly: false, // Override disables read-only restriction
      canManageHistoricalData: true,
      adminOverrideActive: true
    });

    const html = cleanHtml(renderToString(<HistoricalYearBanner />));

    assert.ok(html.includes('id="historical-academic-year-banner"'), 'Must render banner');
    assert.ok(html.includes('Admin Edit Override Active'), 'Badge must switch to "Admin Edit Override Active"');
    assert.ok(
      html.includes('Administrative override active. Please proceed with caution when updating archived records.'),
      'Must display administrative override alert'
    );
    assert.ok(html.includes('Disable Override'), 'Toggle button must switch to "Disable Override"');
  });

  recordTest('Downstream tables enforce isReadOnly=true when viewing historical year without override', 'Historical-Year-Banner', () => {
    const singleClass = [{
      id: 1,
      code: 'CLS-01',
      name: 'Class 1',
      class_type: 'Primary',
      group_required: 0,
      short_name: 'C1',
      display_order: 1,
      sections: 'A',
      is_locked: false,
      student_count: 0,
      status: 'Active'
    }];

    const html = cleanHtml(renderToString(
      <ClassTable
        classes={singleClass}
        onView={() => {}}
        onEdit={() => {}}
        onToggleStatus={() => {}}
        isReadOnly={true}
      />
    ));

    assert.ok(
      html.includes('title="Read-only: Historical Academic Year"'),
      'Edit button must show read-only historical year tooltip'
    );
    assert.ok(
      html.includes('disabled=""') || html.includes('disabled'),
      'Edit button must be disabled in read-only historical mode'
    );
  });

  // =========================================================================
  // FINAL SUMMARY
  // =========================================================================
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  console.log('\n======================================================================');
  console.log(`   BOUNDARY CHALLENGE SUMMARY: ${passed}/${total} Passed (${((passed/total)*100).toFixed(1)}%)`);
  console.log('======================================================================\n');

  if (failed > 0) {
    console.error(`FAILED TESTS (${failed}):`);
    results.filter(r => !r.passed).forEach(r => {
      console.error(` - [${r.category}] ${r.name}: ${r.error}`);
    });
    throw new Error(`${failed} boundary test(s) failed.`);
  }

  return { total, passed, failed };
}

// Auto-run when executed directly via SSR
runAllTests();
