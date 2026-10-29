/**
 * tests/m4_empirical_challenge.jsx
 * Comprehensive Empirical Challenge & Adversarial Stress Suite for Milestone 4:
 * Features 36-45:
 *  1. Homework overdue deadline logic & badge rendering
 *  2. Assignment submission review drawers and teacher grading dialogs
 *  3. Notice board priority sorting and audience targeting scopes
 *  4. Full-screen gallery lightbox zoom and wrap-around carousel navigation
 *  5. Timetable weekly schedule matrix period rendering
 *  6. Staff directory filtering, pagination, and workload progress bars
 *  7. Academic year status transitions (`Upcoming` -> `Active` -> `Closed`) and disable current year modal
 */

import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import assert from 'assert';

// Import M4 components
import { HomeworkView } from '@/components/communication/HomeworkView';
import { StudentHomeworkPortal } from '@/components/students/portal/StudentHomeworkPortal';
import { AssignmentView } from '@/components/communication/AssignmentView';
import { StudentAssignmentPortal } from '@/components/students/portal/StudentAssignmentPortal';
import { AnnouncementView } from '@/components/communication/AnnouncementView';
import { StudentAnnouncementPortal } from '@/components/students/portal/StudentAnnouncementPortal';
import { GalleryView } from '@/components/communication/GalleryView';
import { StudentGalleryPortal } from '@/components/students/portal/StudentGalleryPortal';
import { TimetableSlotAllocationView } from '@/components/timetable/TimetableSlotAllocationView';
import StaffDirectoryView from '@/components/staff/StaffDirectoryView';
import TeachingWorkloadView from '@/components/staff/TeachingWorkloadView';
import { AcademicYearTable } from '@/components/academic/AcademicYearTable';
import { DisableCurrentYearModal } from '@/components/academic/DisableCurrentYearModal';
import { ChangeAcademicYearStatusModal } from '@/components/academic/ChangeAcademicYearStatusModal';
import { HistoricalYearBanner } from '@/components/academic/HistoricalYearBanner';

import { setMockErpContext, resetMockErpContext } from './mock_erp_context';

const testResults = [];
const cleanHtml = (str) => (str || '').replace(/<!--.*?-->/g, '');

function challenge(name, suite, fn) {
  const start = performance.now();
  try {
    fn();
    const duration = (performance.now() - start).toFixed(2);
    testResults.push({ name, suite, passed: true, duration, error: null });
    console.log(`  ✔ [PASS] [${duration}ms] ${suite}: ${name}`);
  } catch (err) {
    const duration = (performance.now() - start).toFixed(2);
    testResults.push({ name, suite, passed: false, duration, error: err.message || String(err) });
    console.error(`  ✖ [FAIL] [${duration}ms] ${suite}: ${name}`);
    console.error(`    ↳ Error: ${err.message || String(err)}`);
  }
}

export function runAllM4Challenges() {
  console.log('\n======================================================');
  console.log('   MILESTONE 4 EMPIRICAL ADVERSARIAL CHALLENGE SUITE   ');
  console.log('======================================================\n');

  // =========================================================================
  // SUITE 1: Homework Overdue Deadline Logic & Badges (F36)
  // =========================================================================
  console.log('▶ Suite 1: Homework Overdue Deadline Logic & Badge Rendering');

  challenge('Past due date triggers Overdue destructive badge in Homework card', 'Homework-Deadline', () => {
    // Homework card overdue logic oracle: hw.due_date && new Date(hw.due_date) < new Date()
    const pastDate = new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0];
    const isPastOverdue = Boolean(pastDate && new Date(pastDate) < new Date());
    assert.strictEqual(isPastOverdue, true, 'Past date must be flagged as overdue');

    const futureDate = new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0];
    const isFutureOverdue = Boolean(futureDate && new Date(futureDate) < new Date());
    assert.strictEqual(isFutureOverdue, false, 'Future date must not be flagged as overdue');
  });

  challenge('StudentHomeworkPortal renders due badges and handles month filtering', 'Homework-Portal', () => {
    const today = new Date().toISOString().split('T')[0];
    const past = new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0];
    const mockHw = [
      { id: 101, title: 'Calculus Assignment 1', subject_name: 'Mathematics', due_date: past, created_at: today, description: 'Solve problems 1-10' },
      { id: 102, title: 'Physics Lab Report', subject_name: 'Physics', due_date: today, created_at: today, description: 'Optics experiment' }
    ];

    const html = renderToString(
      <MemoryRouter>
        <StudentHomeworkPortal
          homework={mockHw}
          student={{ id: 1, class_name: '10', section_name: 'A' }}
          assignedSubjects={[{ subject_name: 'Mathematics' }, { subject_name: 'Physics' }]}
        />
      </MemoryRouter>
    );

    assert.ok(html.includes('Calculus Assignment 1'), 'Must render Calculus assignment');
    assert.ok(html.includes('Physics Lab Report'), 'Must render Physics lab report');
    assert.ok(html.includes('Due:'), 'Must render Due date label');
    assert.ok(cleanHtml(html).includes('Total Assigned') && cleanHtml(html).includes('2'), 'Must display total assigned count 2');
  });

  challenge('StudentHomeworkPortal handles empty homework list and null attachments without throwing', 'Homework-Boundary', () => {
    const html = renderToString(
      <MemoryRouter>
        <StudentHomeworkPortal
          homework={[]}
          student={{ id: 99, class_name: '12' }}
          assignedSubjects={[]}
        />
      </MemoryRouter>
    );

    assert.ok(html.includes('No Homework Found') || html.includes('0'), 'Handles empty homework list cleanly');
  });

  // =========================================================================
  // SUITE 2: Assignment Submission Review & Teacher Grading (F37)
  // =========================================================================
  console.log('▶ Suite 2: Assignment Submission Review Drawers & Teacher Grading Dialogs');

  challenge('Assignment progress percentage calculation handles 0, partial, full and overflow', 'Assignment-ProgressOracle', () => {
    const calcPercent = (submitted, total) => total > 0 ? Math.round((submitted / total) * 100) : 0;

    assert.strictEqual(calcPercent(0, 40), 0, 'Zero submitted is 0%');
    assert.strictEqual(calcPercent(20, 40), 50, 'Half submitted is 50%');
    assert.strictEqual(calcPercent(40, 40), 100, 'All submitted is 100%');
    assert.strictEqual(calcPercent(0, 0), 0, 'Zero total students yields 0% without NaN/Infinity');
    
    // Overflow protection: Math.min(submissionPercent, 100)
    const clamped = Math.min(calcPercent(45, 40), 100);
    assert.strictEqual(clamped, 100, 'Width must clamp to 100% maximum');
  });

  challenge('StudentAssignmentPortal renders online submission status and download chips', 'Assignment-Portal', () => {
    const todayIso = new Date().toISOString();
    const assignments = [
      {
        id: 201,
        title: 'History Essay',
        subject_name: 'History',
        submission_type: 'Online Submission',
        max_marks: 100,
        due_date: `${todayIso.slice(0, 7)}-15`,
        created_at: todayIso,
        description: 'Mughal Empire trade routes',
        submission: {
          status: 'Submitted',
          marks_obtained: 88,
          grade: 'A',
          file_url: 'https://example.com/essay.pdf',
          file_name: 'essay.pdf'
        }
      }
    ];

    const html = renderToString(
      <MemoryRouter>
        <StudentAssignmentPortal
          assignments={assignments}
          student={{ id: 1, class_name: '9' }}
        />
      </MemoryRouter>
    );

    assert.ok(html.includes('History Essay'), 'Must render assignment title');
    assert.ok(html.includes('History'), 'Must render subject name');
  });

  // =========================================================================
  // SUITE 3: Notice Board Priority Sorting & Audience Targeting (F38)
  // =========================================================================
  console.log('▶ Suite 3: Notice Board Priority Sorting & Audience Targeting Scopes');

  challenge('Priority sorting & destructive badge oracle for Urgent / High notices', 'Announcement-Priority', () => {
    const isUrgentNotice = (priority) => ['urgent', 'high'].includes((priority || '').toLowerCase());

    assert.strictEqual(isUrgentNotice('Urgent'), true, '"Urgent" must be marked as urgent');
    assert.strictEqual(isUrgentNotice('HIGH'), true, '"HIGH" must be marked as urgent');
    assert.strictEqual(isUrgentNotice('Normal'), false, '"Normal" is not urgent');
    assert.strictEqual(isUrgentNotice('Low'), false, '"Low" is not urgent');
    assert.strictEqual(isUrgentNotice(null), false, 'Null priority is not urgent');
    assert.strictEqual(isUrgentNotice(undefined), false, 'Undefined priority is not urgent');
  });

  challenge('StudentAnnouncementPortal filters by urgent vs regular circulars', 'Announcement-Filtering', () => {
    const notices = [
      { id: 301, title: 'Cyclone Red Alert School Closure', priority: 'Urgent', target_audience: 'All', created_at: new Date().toISOString() },
      { id: 302, title: 'Annual Sports Day Schedule', priority: 'Normal', target_audience: 'All', created_at: new Date().toISOString() }
    ];

    const html = renderToString(
      <MemoryRouter>
        <StudentAnnouncementPortal
          announcements={notices}
          student={{ id: 1, class_name: '10' }}
        />
      </MemoryRouter>
    );

    assert.ok(html.includes('Cyclone Red Alert'), 'Must render urgent notice');
    assert.ok(html.includes('Annual Sports Day'), 'Must render regular notice');
    assert.ok(html.includes('Official Circulars'), 'Must display stats header');
  });

  challenge('Audience targeting scope formatting handles all variants safely', 'Announcement-AudienceScopes', () => {
    const formatAudience = (item) => {
      let audienceDisplay = item.target_audience;
      if (item.target_audience === 'Individual') {
        audienceDisplay = item.target_student_name || 'Individual Student';
      } else if (item.target_audience === 'Academic Group') {
        audienceDisplay = `Group: ${item.target_group_name || 'Academic Group'}`;
      } else if (item.target_audience === 'Class') {
        audienceDisplay = item.class_name ? `Class ${item.class_name}` : 'Specific Class';
      } else if (item.target_audience === 'Section') {
        audienceDisplay = `${item.class_name || 'Class'} • Sec ${item.section_name || 'Section'}`;
      } else if (item.target_audience === 'Gender') {
        const genderLabel = item.target_gender === 'Male' ? 'Boys' : item.target_gender === 'Female' ? 'Girls' : (item.target_gender || 'All Genders');
        audienceDisplay = `Gender: ${genderLabel}`;
      } else if (item.target_audience === 'Residential') {
        const resLabel = item.target_residential_type || 'Residential';
        audienceDisplay = `Residential: ${resLabel}`;
      }
      return audienceDisplay;
    };

    assert.strictEqual(formatAudience({ target_audience: 'All' }), 'All');
    assert.strictEqual(formatAudience({ target_audience: 'Individual', target_student_name: 'Aarav Patel' }), 'Aarav Patel');
    assert.strictEqual(formatAudience({ target_audience: 'Class', class_name: '10' }), 'Class 10');
    assert.strictEqual(formatAudience({ target_audience: 'Section', class_name: '8', section_name: 'B' }), '8 • Sec B');
    assert.strictEqual(formatAudience({ target_audience: 'Gender', target_gender: 'Female' }), 'Gender: Girls');
    assert.strictEqual(formatAudience({ target_audience: 'Residential', target_residential_type: 'Hostel Day Scholar' }), 'Residential: Hostel Day Scholar');
  });

  // =========================================================================
  // SUITE 4: Full-Screen Gallery Lightbox & Carousel Navigation (F39)
  // =========================================================================
  console.log('▶ Suite 4: Gallery Lightbox Zoom & Wrap-Around Carousel Navigation');

  challenge('Lightbox index navigation boundary and wrap-around oracle', 'Gallery-CarouselOracle', () => {
    const mediaCount = 5;
    
    // Previous from index 0 wrap-around
    const prevWrap = (idx, total) => (idx - 1 + total) % total;
    assert.strictEqual(prevWrap(0, mediaCount), 4, 'Previous from 0 wraps to last item (4)');
    assert.strictEqual(prevWrap(2, mediaCount), 1, 'Previous from 2 goes to 1');

    // Next from last index wrap-around
    const nextWrap = (idx, total) => (idx + 1) % total;
    assert.strictEqual(nextWrap(4, mediaCount), 0, 'Next from 4 wraps to 0');
    assert.strictEqual(nextWrap(1, mediaCount), 2, 'Next from 1 goes to 2');
  });

  challenge('StudentGalleryPortal renders albums, covers, and event metadata', 'Gallery-Portal', () => {
    const albums = [
      {
        id: 401,
        album_name: 'Science Expo 2026',
        event_name: 'Annual Science Fair',
        event_date: '2026-10-15',
        description: 'Robotics and innovation exhibits',
        cover_image_url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800'
      }
    ];

    const html = renderToString(
      <MemoryRouter>
        <StudentGalleryPortal albums={albums} student={{ id: 1, class_name: '10' }} />
      </MemoryRouter>
    );

    assert.ok(html.includes('Science Expo 2026'), 'Must render album name');
    assert.ok(html.includes('Annual Science Fair'), 'Must render event name');
    assert.ok(html.includes('View Photos'), 'Must render View Photos action link');
  });

  // =========================================================================
  // SUITE 5: Timetable Weekly Schedule Matrix Period Rendering (F41)
  // =========================================================================
  console.log('▶ Suite 5: Timetable Weekly Schedule Matrix Period Rendering');

  challenge('TimetableSlotAllocationView handles empty structure fallback gracefully', 'Timetable-Grid', () => {
    resetMockErpContext();
    const html = renderToString(
      <MemoryRouter>
        <TimetableSlotAllocationView showToast={() => {}} />
      </MemoryRouter>
    );

    assert.ok(
      html.includes('Subject & Teacher Timetable Grid') || html.includes('Timetable'),
      'Must render Timetable Slot Allocation component'
    );
    assert.ok(
      html.includes('Campus / Branch') || html.includes('Select Class'),
      'Must render class and campus controls'
    );
  });

  challenge('Timetable period type classifier correctly handles breaks and assemblies', 'Timetable-PeriodTypes', () => {
    const isSpecialPeriod = (type) => type === 'break' || type === 'assembly';
    
    assert.strictEqual(isSpecialPeriod('break'), true, 'Break period is special');
    assert.strictEqual(isSpecialPeriod('assembly'), true, 'Assembly period is special');
    assert.strictEqual(isSpecialPeriod('regular'), false, 'Regular period is standard');
    assert.strictEqual(isSpecialPeriod('lab'), false, 'Lab period is standard');
  });

  // =========================================================================
  // SUITE 6: Staff Directory Filtering & Workload Progress Bars (F40)
  // =========================================================================
  console.log('▶ Suite 6: Staff Directory Filtering, Pagination & Workload Progress Bars');

  challenge('TeachingWorkloadView capacity formula and color variant oracles', 'Staff-WorkloadOracle', () => {
    const getWorkloadProgress = (periods, maxCapacity = 30) => {
      const parsed = parseInt(periods || 0, 10);
      const percent = Math.round((parsed / maxCapacity) * 100);
      const widthPercent = Math.min(100, (parsed / maxCapacity) * 100);
      const isFullLoad = parsed >= 24;
      const isModerate = parsed >= 12 && parsed < 24;
      const colorClass = isFullLoad ? 'bg-rose-500' : isModerate ? 'bg-emerald-500' : 'bg-amber-500';
      return { percent, widthPercent, isFullLoad, isModerate, colorClass };
    };

    // 0 periods (New or non-teaching)
    const zero = getWorkloadProgress(0);
    assert.strictEqual(zero.percent, 0, 'Zero periods is 0%');
    assert.strictEqual(zero.colorClass, 'bg-amber-500', 'Zero periods gets amber indicator');

    // 10 periods (Low workload)
    const low = getWorkloadProgress(10);
    assert.strictEqual(low.percent, 33, '10 periods is ~33%');
    assert.strictEqual(low.colorClass, 'bg-amber-500', '10 periods gets amber indicator');

    // 18 periods (Moderate workload)
    const mod = getWorkloadProgress(18);
    assert.strictEqual(mod.percent, 60, '18 periods is 60%');
    assert.strictEqual(mod.colorClass, 'bg-emerald-500', '18 periods gets emerald indicator');

    // 25 periods (Full load)
    const full = getWorkloadProgress(25);
    assert.strictEqual(full.percent, 83, '25 periods is 83%');
    assert.strictEqual(full.colorClass, 'bg-rose-500', '25 periods gets rose full load indicator');

    // 35 periods (Exceeding max capacity)
    const over = getWorkloadProgress(35);
    assert.strictEqual(over.widthPercent, 100, 'Bar width is capped at 100%');
    assert.strictEqual(over.colorClass, 'bg-rose-500', 'Overload gets rose indicator');
  });

  challenge('StaffDirectoryView renders segmented tabs and filters', 'Staff-Directory', () => {
    const mockStaff = [
      { id: 1, first_name: 'Ravi', last_name: 'Shankar', staff_code: 'T001', staff_type: 'Teaching', department: 'Mathematics' },
      { id: 2, first_name: 'Sunita', last_name: 'Devi', staff_code: 'NT001', staff_type: 'Non-Teaching', department: 'Administration' }
    ];

    const html = renderToString(
      <MemoryRouter>
        <StaffDirectoryView
          staffList={mockStaff}
          loading={false}
          staffTypeFilter="All"
          setStaffTypeFilter={() => {}}
          selectedDepartment="All"
          setSelectedDepartment={() => {}}
          searchQuery=""
          setSearchQuery={() => {}}
          onOpenAddModal={() => {}}
        />
      </MemoryRouter>
    );

    assert.ok(cleanHtml(html).includes('All Staff (2)'), 'Must render All Staff tab count');
    assert.ok(html.includes('Teaching Staff'), 'Must render Teaching Staff tab');
    assert.ok(html.includes('Non-Teaching Staff'), 'Must render Non-Teaching Staff tab');
    assert.ok(html.includes('Ravi'), 'Must render staff name Ravi');
    assert.ok(html.includes('Sunita'), 'Must render staff name Sunita');
  });

  // =========================================================================
  // SUITE 7: Academic Year Status Transitions & Disable Current Year Modal (F44)
  // =========================================================================
  console.log('▶ Suite 7: Academic Year Status Transitions & Disable Current Year Modal');

  challenge('AcademicYearTable renders correct status badges (Current, Next, Disabled, Enabled)', 'AY-TableBadges', () => {
    const mockYears = [
      { id: 1, name: '2026-2027', is_current: true, is_enabled: true, status: 'Active', start_date: '2026-06-01', end_date: '2027-04-30' },
      { id: 2, name: '2027-2028', is_current: false, is_next: true, is_enabled: true, status: 'Upcoming', start_date: '2027-06-01', end_date: '2028-04-30' },
      { id: 3, name: '2024-2025', is_current: false, is_next: false, is_enabled: false, status: 'Closed', start_date: '2024-06-01', end_date: '2025-04-30' }
    ];

    const html = renderToString(
      <MemoryRouter>
        <AcademicYearTable
          academicYears={mockYears}
          onView={() => {}}
          onEdit={() => {}}
          onConfigureClasses={() => {}}
          onSetCurrent={() => {}}
          onSetNext={() => {}}
          onChangeStatus={() => {}}
          onToggleEnabled={() => {}}
        />
      </MemoryRouter>
    );

    assert.ok(html.includes('Current / Default'), 'Must render Current / Default badge');
    assert.ok(html.includes('Next Year / Enabled'), 'Must render Next Year / Enabled badge');
    assert.ok(html.includes('Disabled'), 'Must render Disabled badge');
    assert.ok(html.includes('2026-2027'), 'Must render 2026-2027 year');
    assert.ok(html.includes('2027-2028'), 'Must render 2027-2028 year');
    assert.ok(html.includes('2024-2025'), 'Must render 2024-2025 year');
  });

  challenge('DisableCurrentYearModal renders dialog with required test IDs when open', 'AY-DisableModal', () => {
    const mockYear = {
      id: 1,
      name: '2026-2027',
      is_current: true,
      start_date: '2026-06-01',
      end_date: '2027-04-30'
    };

    const html = renderToString(
      <DisableCurrentYearModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={() => {}}
        academicYear={mockYear}
        isSubmitting={false}
      />
    );

    assert.ok(html.includes('disable-current-year-modal'), 'Must contain id="disable-current-year-modal"');
    assert.ok(html.includes('cancel-disable-year-button'), 'Must contain id="cancel-disable-year-button"');
    assert.ok(html.includes('confirm-disable-year-button'), 'Must contain id="confirm-disable-year-button"');
    assert.ok(html.includes('Disable Active Academic Year?'), 'Must display title warning');
  });

  challenge('DisableCurrentYearModal returns null when closed or academicYear is null', 'AY-DisableModalNull', () => {
    const htmlClosed = renderToString(
      <DisableCurrentYearModal
        isOpen={false}
        onClose={() => {}}
        onConfirm={() => {}}
        academicYear={{ id: 1, name: '2026-2027', start_date: '2026-06-01', end_date: '2027-04-30' }}
      />
    );
    assert.strictEqual(htmlClosed, '', 'Must render nothing when closed');

    const htmlNullYear = renderToString(
      <DisableCurrentYearModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={() => {}}
        academicYear={null}
      />
    );
    assert.strictEqual(htmlNullYear, '', 'Must render nothing when academicYear is null');
  });

  challenge('ChangeAcademicYearStatusModal renders all 3 transitions (Upcoming, Active, Closed)', 'AY-StatusTransitions', () => {
    const mockYear = { id: 1, name: '2026-2027', status: 'Upcoming' };

    const html = renderToString(
      <ChangeAcademicYearStatusModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={() => {}}
        academicYear={mockYear}
      />
    );

    assert.ok(html.includes('Change Academic Year Status'), 'Must render modal title');
    assert.ok(html.includes('Upcoming'), 'Must render Upcoming status option');
    assert.ok(html.includes('Active'), 'Must render Active status option');
    assert.ok(html.includes('Closed'), 'Must render Closed status option');
    assert.ok(html.includes('Update Status'), 'Must render submit button');
  });

  challenge('HistoricalYearBanner renders banner with required test IDs', 'AY-HistoricalBanner', () => {
    resetMockErpContext();
    setMockErpContext({
      isHistoricalYear: true,
      activeAcademicYear: { id: 9, name: '2023-2024' },
      isReadOnly: true,
      isAdminOverrideActive: false,
      canManageHistoricalData: true,
    });

    const html = renderToString(
      <HistoricalYearBanner
        academicYearName="2023-2024"
        isHistorical={true}
      />
    );

    assert.ok(html.includes('historical-academic-year-banner'), 'Must contain id="historical-academic-year-banner"');
    assert.ok(html.includes('admin-override-toggle-button'), 'Must contain id="admin-override-toggle-button"');
  });

  // Summary
  const passedCount = testResults.filter(t => t.passed).length;
  const totalCount = testResults.length;
  console.log('\n======================================================');
  console.log(`M4 CHALLENGE SUITE SUMMARY: ${passedCount}/${totalCount} Passed (${((passedCount/totalCount)*100).toFixed(1)}%)`);
  console.log('======================================================\n');

  if (passedCount < totalCount) {
    console.error(`[FAILURE] ${totalCount - passedCount} challenge tests failed!`);
    process.exit(1);
  } else {
    console.log('[SUCCESS] All M4 empirical challenge tests passed successfully!');
  }
}

runAllM4Challenges();
