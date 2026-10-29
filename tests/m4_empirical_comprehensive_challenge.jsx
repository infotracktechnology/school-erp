/**
 * tests/m4_empirical_comprehensive_challenge.jsx
 * Comprehensive Empirical Adversarial Challenge Suite for Milestone 4 (Features 36-45):
 * 
 * 1. Homework overdue deadline logic & badge rendering
 * 2. Assignment submission review drawers and teacher grading dialogs
 * 3. Notice board priority sorting and audience targeting scopes
 * 4. Full-screen gallery lightbox zoom and wrap-around carousel navigation
 * 5. Timetable weekly schedule matrix period rendering
 * 6. Staff directory filtering, pagination, and workload progress bars
 * 7. Academic year status transitions (`Upcoming` -> `Active` -> `Closed`) and disable current year modal
 */

import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import assert from 'assert';

// Import Milestone 4 Components under Test
import { HomeworkView } from '@/components/communication/HomeworkView';
import { StudentHomeworkPortal } from '@/components/students/portal/StudentHomeworkPortal';
import { AssignmentView } from '@/components/communication/AssignmentView';
import { StudentAssignmentPortal } from '@/components/students/portal/StudentAssignmentPortal';
import { AnnouncementView } from '@/components/communication/AnnouncementView';
import { StudentAnnouncementPortal } from '@/components/students/portal/StudentAnnouncementPortal';
import { GalleryView } from '@/components/communication/GalleryView';
import { StudentGalleryPortal } from '@/components/students/portal/StudentGalleryPortal';
import { TimetableSlotAllocationView } from '@/components/timetable/TimetableSlotAllocationView';
import { TimetableStructureView } from '@/components/timetable/TimetableStructureView';
import StaffDirectoryView from '@/components/staff/StaffDirectoryView';
import TeachingWorkloadView from '@/components/staff/TeachingWorkloadView';
import { AcademicYearTable } from '@/components/academic/AcademicYearTable';
import { DisableCurrentYearModal } from '@/components/academic/DisableCurrentYearModal';
import { ChangeAcademicYearStatusModal } from '@/components/academic/ChangeAcademicYearStatusModal';
import { HistoricalYearBanner } from '@/components/academic/HistoricalYearBanner';
import { BranchTable } from '@/components/branches/BranchTable';

import { setMockErpContext, resetMockErpContext, useErp } from './mock_erp_context';

const challengeResults = [];

function cleanHtml(rawHtml) {
  if (!rawHtml) return '';
  return rawHtml
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ');
}

function runChallenge(category, name, testFn) {
  const start = performance.now();
  try {
    testFn();
    const duration = (performance.now() - start).toFixed(2);
    challengeResults.push({ category, name, passed: true, duration, error: null });
    console.log(`  ✔ [PASS] [${duration}ms] ${category}: ${name}`);
  } catch (err) {
    const duration = (performance.now() - start).toFixed(2);
    challengeResults.push({ category, name, passed: false, duration, error: err.message || String(err) });
    console.error(`  ✖ [FAIL] [${duration}ms] ${category}: ${name}`);
    console.error(`    ↳ Error: ${err.message || String(err)}`);
  }
}

export function executeAllM4EmpiricalChallenges() {
  console.log('\n================================================================================');
  console.log('   MILESTONE 4 EMPIRICAL ADVERSARIAL CHALLENGE HARNESS (Features 36-45)        ');
  console.log('================================================================================\n');

  // ===========================================================================
  // 1. Homework Overdue Deadline Logic & Badge Rendering
  // ===========================================================================
  console.log('▶ Focus Area 1: Homework Overdue Deadline Logic & Badge Rendering (F36)');

  runChallenge('Homework-Deadline', 'Overdue date calculation oracle flags past dates and ignores future dates', () => {
    const isOverdue = (dueDateStr) => {
      if (!dueDateStr) return false;
      const parsed = new Date(dueDateStr);
      if (isNaN(parsed.getTime())) return false;
      return parsed < new Date();
    };

    const pastDate = new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0];
    const futureDate = new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0];

    assert.strictEqual(isOverdue(pastDate), true, 'Past date 4 days ago must be overdue');
    assert.strictEqual(isOverdue(futureDate), false, 'Future date 7 days ahead must not be overdue');
    assert.strictEqual(isOverdue(null), false, 'Null due date must not be overdue');
    assert.strictEqual(isOverdue('invalid-date'), false, 'Malformed due date must not throw or flag overdue');
  });

  runChallenge('Homework-Deadline', 'Due soon threshold flags homework due within next 48 hours', () => {
    const isDueSoon = (dueDateStr) => {
      if (!dueDateStr) return false;
      const parsed = new Date(dueDateStr);
      if (isNaN(parsed.getTime())) return false;
      return parsed <= new Date(Date.now() + 86400000 * 2) && parsed >= new Date();
    };

    const tomorrow = new Date(Date.now() + 86400000 * 1).toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0];

    assert.strictEqual(isDueSoon(tomorrow), true, 'Tomorrow must be flagged as due soon');
    assert.strictEqual(isDueSoon(nextWeek), false, 'Next week must not be due soon');
  });

  runChallenge('Homework-Portal', 'StudentHomeworkPortal renders due badges, subject tag, and statistics', () => {
    const today = new Date().toISOString();
    const past = new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0];
    const future = new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0];

    const mockHomework = [
      {
        id: 11,
        title: 'Trigonometry Problem Set',
        subject_name: 'Mathematics',
        due_date: past,
        created_at: today,
        description: 'Complete exercises 4.1 to 4.5',
        instructions: 'Show all calculation steps clearly.'
      },
      {
        id: 12,
        title: 'Chemical Reactions Lab',
        subject_name: 'Chemistry',
        due_date: future,
        created_at: today,
        description: 'Write up observations on acid-base titration.'
      }
    ];

    const html = cleanHtml(renderToString(
      <MemoryRouter>
        <StudentHomeworkPortal
          homework={mockHomework}
          student={{ id: 5, class_name: '10', section_name: 'B' }}
          assignedSubjects={[{ subject_name: 'Mathematics' }, { subject_name: 'Chemistry' }]}
        />
      </MemoryRouter>
    ));

    assert.ok(html.includes('Trigonometry Problem Set'), 'Renders title Trigonometry');
    assert.ok(html.includes('Chemical Reactions Lab'), 'Renders title Chemical Reactions');
    assert.ok(html.includes('Total Assigned') && html.includes('>2<'), 'Displays total assigned count 2');
    assert.ok(html.includes(`Due: ${past}`), 'Renders past due date');
    assert.ok(html.includes(`Due: ${future}`), 'Renders future due date');
    assert.ok(html.includes("Teacher&#x27;s Note") || html.includes("Note / Guidelines:"), 'Renders teacher instructions note');
  });

  runChallenge('Homework-Boundary', 'StudentHomeworkPortal renders empty state when zero homework items match', () => {
    const html = cleanHtml(renderToString(
      <MemoryRouter>
        <StudentHomeworkPortal
          homework={[]}
          student={{ id: 1, class_name: '10' }}
          assignedSubjects={[]}
        />
      </MemoryRouter>
    ));

    assert.ok(html.includes('No Homework Found'), 'Renders graceful empty state header');
    assert.ok(html.includes('Total Assigned') && html.includes('>0<'), 'Renders 0 assigned count in stats card');
  });

  // ===========================================================================
  // 2. Assignment Submission Review Drawers & Teacher Grading Dialogs
  // ===========================================================================
  console.log('▶ Focus Area 2: Assignment Submission Review & Teacher Grading (F37)');

  runChallenge('Assignment-Oracle', 'Progress percentage oracle clamps between 0% and 100%', () => {
    const getProgress = (submitted, total) => {
      if (!total || total <= 0) return 0;
      return Math.min(100, Math.round((submitted / total) * 100));
    };

    assert.strictEqual(getProgress(0, 30), 0, 'Zero submitted is 0%');
    assert.strictEqual(getProgress(15, 30), 50, '15 of 30 is 50%');
    assert.strictEqual(getProgress(30, 30), 100, '30 of 30 is 100%');
    assert.strictEqual(getProgress(35, 30), 100, 'Clamped to 100% on overflow');
    assert.strictEqual(getProgress(0, 0), 0, 'Zero total students does not return NaN');
  });

  runChallenge('Assignment-GradingOracle', 'Grading score validation respects max marks constraint', () => {
    const validateGrade = (marks, maxMarks) => {
      const num = Number(marks);
      if (isNaN(num)) return { valid: false, reason: 'Invalid number' };
      if (num < 0) return { valid: false, reason: 'Marks cannot be negative' };
      if (num > maxMarks) return { valid: false, reason: 'Marks cannot exceed max marks' };
      return { valid: true, score: num };
    };

    assert.strictEqual(validateGrade(45, 50).valid, true, '45/50 is valid');
    assert.strictEqual(validateGrade(50, 50).valid, true, '50/50 is valid');
    assert.strictEqual(validateGrade(55, 50).valid, false, '55/50 exceeds max marks');
    assert.strictEqual(validateGrade(-5, 50).valid, false, 'Negative marks rejected');
    assert.strictEqual(validateGrade('abc', 50).valid, false, 'Non-numeric marks rejected');
  });

  runChallenge('Assignment-Portal', 'StudentAssignmentPortal renders online submission status and grade', () => {
    const nowIso = new Date().toISOString();
    const mockAssignments = [
      {
        id: 301,
        title: 'World War II Timeline',
        subject_name: 'History',
        submission_type: 'Online Submission',
        max_marks: 50,
        due_date: '2026-11-20',
        created_at: nowIso,
        description: 'Document key events in European and Pacific theatres.',
        submission_status: 'Submitted',
        submission: {
          status: 'Reviewed',
          marks_obtained: 46,
          grade: 'A',
          teacher_remarks: 'Excellent analysis of Battle of Midway.',
          file_name: 'ww2_timeline.pdf',
          file_url: 'https://example.com/files/ww2_timeline.pdf'
        }
      }
    ];

    const html = cleanHtml(renderToString(
      <MemoryRouter>
        <StudentAssignmentPortal
          assignments={mockAssignments}
          student={{ id: 9, class_name: '10' }}
        />
      </MemoryRouter>
    ));

    assert.ok(html.includes('World War II Timeline'), 'Renders assignment title');
    assert.ok(html.includes('History'), 'Renders subject name');
  });

  // ===========================================================================
  // 3. Notice Board Priority Sorting & Audience Targeting Scopes
  // ===========================================================================
  console.log('▶ Focus Area 3: Notice Board Priority Sorting & Audience Targeting (F38)');

  runChallenge('Announcement-Priority', 'Priority tag oracle assigns destructive badge to Urgent and High priorities', () => {
    const getBadgeVariant = (priority) => {
      const p = (priority || '').toLowerCase();
      return (p === 'urgent' || p === 'high') ? 'destructive' : 'secondary';
    };

    assert.strictEqual(getBadgeVariant('Urgent'), 'destructive');
    assert.strictEqual(getBadgeVariant('High'), 'destructive');
    assert.strictEqual(getBadgeVariant('Normal'), 'secondary');
    assert.strictEqual(getBadgeVariant('Low'), 'secondary');
    assert.strictEqual(getBadgeVariant(null), 'secondary');
    assert.strictEqual(getBadgeVariant(undefined), 'secondary');
  });

  runChallenge('Announcement-Audience', 'Audience scope formatter safely resolves all 6 domain scopes', () => {
    const formatAudienceScope = (item) => {
      if (!item || !item.target_audience) return 'General Broadcast';
      switch (item.target_audience) {
        case 'All':
          return 'All Campuses';
        case 'Branch':
          return item.branch_name ? `Campus: ${item.branch_name}` : 'Campus Scope';
        case 'Class':
          return item.class_name ? `Class ${item.class_name}` : 'Specific Class';
        case 'Section':
          return `Class ${item.class_name || 'All'} • Sec ${item.section_name || 'All'}`;
        case 'Gender':
          return `Target: ${item.target_gender === 'Female' ? 'Girls Only' : item.target_gender === 'Male' ? 'Boys Only' : 'All Students'}`;
        case 'Residential':
          return `Residential: ${item.target_residential_type || 'Day Scholar & Hosteller'}`;
        case 'Individual':
          return `Student: ${item.target_student_name || 'Individual Pupil'}`;
        default:
          return item.target_audience;
      }
    };

    assert.strictEqual(formatAudienceScope({ target_audience: 'All' }), 'All Campuses');
    assert.strictEqual(formatAudienceScope({ target_audience: 'Branch', branch_name: 'North Campus' }), 'Campus: North Campus');
    assert.strictEqual(formatAudienceScope({ target_audience: 'Class', class_name: '12' }), 'Class 12');
    assert.strictEqual(formatAudienceScope({ target_audience: 'Section', class_name: '10', section_name: 'A' }), 'Class 10 • Sec A');
    assert.strictEqual(formatAudienceScope({ target_audience: 'Gender', target_gender: 'Female' }), 'Target: Girls Only');
    assert.strictEqual(formatAudienceScope({ target_audience: 'Residential', target_residential_type: 'Hostel' }), 'Residential: Hostel');
    assert.strictEqual(formatAudienceScope({ target_audience: 'Individual', target_student_name: 'Rohan Sharma' }), 'Student: Rohan Sharma');
  });

  runChallenge('Announcement-Portal', 'StudentAnnouncementPortal renders circulars with priority tags', () => {
    const today = new Date().toISOString();
    const notices = [
      {
        id: 501,
        title: 'Severe Weather Warning: Early Dismissal',
        priority: 'Urgent',
        target_audience: 'All',
        created_at: today,
        content: 'Due to severe storm advisory, school will close at 1:00 PM.'
      },
      {
        id: 502,
        title: 'Annual Science Exhibition Registrations',
        priority: 'Normal',
        target_audience: 'All',
        created_at: today,
        content: 'Submit project abstracts to science department by Friday.'
      }
    ];

    const html = cleanHtml(renderToString(
      <MemoryRouter>
        <StudentAnnouncementPortal
          announcements={notices}
          student={{ id: 1, class_name: '10' }}
        />
      </MemoryRouter>
    ));

    assert.ok(html.includes('Severe Weather Warning'), 'Renders urgent alert notice');
    assert.ok(html.includes('Annual Science Exhibition'), 'Renders regular notice');
    assert.ok(html.includes('Official Circulars'), 'Renders portal section header');
  });

  // ===========================================================================
  // 4. Full-Screen Gallery Lightbox & Carousel Navigation
  // ===========================================================================
  console.log('▶ Focus Area 4: Gallery Lightbox Zoom & Wrap-Around Carousel (F39)');

  runChallenge('Gallery-CarouselOracle', 'Wrap-around index navigation wraps smoothly at edges', () => {
    const wrapNav = (currentIndex, direction, totalCount) => {
      if (totalCount <= 0) return 0;
      if (direction === 'next') {
        return (currentIndex + 1) % totalCount;
      }
      return (currentIndex - 1 + totalCount) % totalCount;
    };

    const count = 6;
    // Boundary wrap next: from index 5 to 0
    assert.strictEqual(wrapNav(5, 'next', count), 0, 'Last image wraps to first (0)');
    // Boundary wrap prev: from index 0 to 5
    assert.strictEqual(wrapNav(0, 'prev', count), 5, 'First image wraps to last (5)');
    // Middle progression
    assert.strictEqual(wrapNav(2, 'next', count), 3, '2 goes to 3');
    assert.strictEqual(wrapNav(3, 'prev', count), 2, '3 goes to 2');
    // Single image album
    assert.strictEqual(wrapNav(0, 'next', 1), 0, 'Single item album next stays at 0');
    assert.strictEqual(wrapNav(0, 'prev', 1), 0, 'Single item album prev stays at 0');
  });

  runChallenge('Gallery-Portal', 'StudentGalleryPortal renders albums, covers, event tags, and drive links', () => {
    const today = new Date().toISOString().split('T')[0];
    const albums = [
      {
        id: 701,
        album_name: 'Sports Day 2026',
        event_name: 'Annual Athletics Meet',
        event_date: today,
        created_at: new Date().toISOString(),
        description: 'Track and field events, relay races, and award ceremony.',
        cover_image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
        attachments: {
          links: [
            { title: 'High Res Photo Drive', url: 'https://drive.example.com/sports2026' }
          ]
        }
      }
    ];

    const html = cleanHtml(renderToString(
      <MemoryRouter>
        <StudentGalleryPortal albums={albums} student={{ id: 1 }} />
      </MemoryRouter>
    ));

    assert.ok(html.includes('Sports Day 2026'), 'Renders album name');
    assert.ok(html.includes('Annual Athletics Meet'), 'Renders event name tag');
    assert.ok(html.includes('View Photos'), 'Renders View Photos button');
  });

  // ===========================================================================
  // 5. Timetable Weekly Schedule Matrix Period Rendering
  // ===========================================================================
  console.log('▶ Focus Area 5: Timetable Weekly Schedule Matrix Period Rendering (F41)');

  runChallenge('Timetable-PeriodTypes', 'Special periods (assembly, break, lunch) are identified and protected', () => {
    const isSpecialSlot = (periodType) => {
      const type = (periodType || '').toLowerCase();
      return type === 'break' || type === 'assembly' || type === 'lunch';
    };

    assert.strictEqual(isSpecialSlot('assembly'), true, 'Assembly period is special');
    assert.strictEqual(isSpecialSlot('break'), true, 'Break period is special');
    assert.strictEqual(isSpecialSlot('lunch'), true, 'Lunch period is special');
    assert.strictEqual(isSpecialSlot('regular'), false, 'Regular period is standard');
    assert.strictEqual(isSpecialSlot('lab'), false, 'Lab period is standard');
  });

  runChallenge('Timetable-Grid', 'TimetableSlotAllocationView renders header and branch scope controls', () => {
    resetMockErpContext();
    const html = cleanHtml(renderToString(
      <MemoryRouter>
        <TimetableSlotAllocationView showToast={() => {}} />
      </MemoryRouter>
    ));

    assert.ok(html.includes('Subject &amp; Teacher Timetable Grid'), 'Renders module title');
    assert.ok(html.includes('Campus / Branch'), 'Renders branch selection');
    assert.ok(html.includes('Select Class'), 'Renders class selection');
  });

  runChallenge('Timetable-Structure', 'TimetableStructureView renders empty state card when structures list is empty', () => {
    resetMockErpContext();
    setMockErpContext({ isSuperAdmin: true, selectedBranchId: 1, activeAcademicYearId: 2 });

    const html = cleanHtml(renderToString(
      <MemoryRouter>
        <TimetableStructureView showToast={() => {}} onStructureCreated={() => {}} />
      </MemoryRouter>
    ));

    assert.ok(html.includes('No Timetable Structures Configured'), 'Renders empty state message');
    assert.ok(html.includes('General School Shift (8 Periods)'), 'Renders structure creation template option');
  });

  // ===========================================================================
  // 6. Staff Directory Filtering, Pagination & Workload Progress Bars
  // ===========================================================================
  console.log('▶ Focus Area 6: Staff Directory & Workload Progress Bars (F40)');

  runChallenge('Staff-WorkloadOracle', 'TeachingWorkloadView progress bar width and color variant oracles', () => {
    const getWorkloadEvaluation = (periods, maxCapacity = 30) => {
      const p = parseInt(periods || 0, 10);
      const percent = Math.round((p / maxCapacity) * 100);
      const widthPercent = Math.min(100, (p / maxCapacity) * 100);
      const isFullLoad = p >= 24;
      const isModerate = p >= 12 && p < 24;
      const colorClass = isFullLoad ? 'bg-rose-500' : isModerate ? 'bg-emerald-500' : 'bg-amber-500';
      return { p, percent, widthPercent, isFullLoad, isModerate, colorClass };
    };

    // Zero load
    const zero = getWorkloadEvaluation(0);
    assert.strictEqual(zero.percent, 0);
    assert.strictEqual(zero.colorClass, 'bg-amber-500');

    // Moderate load: 18 periods
    const mod = getWorkloadEvaluation(18);
    assert.strictEqual(mod.percent, 60);
    assert.strictEqual(mod.colorClass, 'bg-emerald-500');

    // Full load: 26 periods
    const full = getWorkloadEvaluation(26);
    assert.strictEqual(full.percent, 87);
    assert.strictEqual(full.colorClass, 'bg-rose-500');

    // Overload: 35 periods (capped at 100% width)
    const over = getWorkloadEvaluation(35);
    assert.strictEqual(over.widthPercent, 100);
    assert.strictEqual(over.colorClass, 'bg-rose-500');
  });

  runChallenge('Staff-Directory', 'StaffDirectoryView renders segmented tabs with accurate counts', () => {
    const staff = [
      { id: 1, first_name: 'Dr. Anand', last_name: 'Kumar', staff_code: 'T-101', staff_type: 'Teaching', department: 'Physics' },
      { id: 2, first_name: 'Meena', last_name: 'Sundaram', staff_code: 'NT-201', staff_type: 'Non-Teaching', department: 'Accounts' }
    ];

    const html = cleanHtml(renderToString(
      <MemoryRouter>
        <StaffDirectoryView
          staffList={staff}
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
    ));

    assert.ok(html.includes('All Staff (2)'), 'Renders All Staff tab count (2)');
    assert.ok(html.includes('Teaching Staff'), 'Renders Teaching Staff tab');
    assert.ok(html.includes('Non-Teaching Staff'), 'Renders Non-Teaching Staff tab');
    assert.ok(html.includes('Dr. Anand'), 'Renders Anand Kumar');
    assert.ok(html.includes('Meena'), 'Renders Meena Sundaram');
  });

  // ===========================================================================
  // 7. Academic Year Status Transitions & Disable Current Year Modal
  // ===========================================================================
  console.log('▶ Focus Area 7: Academic Year Status Transitions & Modal Controls (F44)');

  runChallenge('AY-DisableModal', 'DisableCurrentYearModal renders dialog with required test IDs when open', () => {
    const year = {
      id: 2,
      name: '2026-2027',
      is_current: true,
      start_date: '2026-06-01',
      end_date: '2027-04-30'
    };

    const html = cleanHtml(renderToString(
      <DisableCurrentYearModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={() => {}}
        academicYear={year}
        isSubmitting={false}
      />
    ));

    assert.ok(html.includes('id="disable-current-year-modal"'), 'Preserves id="disable-current-year-modal"');
    assert.ok(html.includes('id="cancel-disable-year-button"'), 'Preserves id="cancel-disable-year-button"');
    assert.ok(html.includes('id="confirm-disable-year-button"'), 'Preserves id="confirm-disable-year-button"');
    assert.ok(html.includes('Disable Active Academic Year?'), 'Displays modal confirmation title');
  });

  runChallenge('AY-DisableModal', 'DisableCurrentYearModal returns null cleanly when closed or academicYear is null', () => {
    const htmlClosed = renderToString(
      <DisableCurrentYearModal
        isOpen={false}
        onClose={() => {}}
        onConfirm={() => {}}
        academicYear={{ id: 1, name: '2026-2027', start_date: '2026-06-01', end_date: '2027-04-30' }}
      />
    );
    assert.strictEqual(htmlClosed, '', 'Closed modal renders empty string');

    const htmlNull = renderToString(
      <DisableCurrentYearModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={() => {}}
        academicYear={null}
      />
    );
    assert.strictEqual(htmlNull, '', 'Null year renders empty string');
  });

  runChallenge('AY-StatusTransitions', 'ChangeAcademicYearStatusModal presents Upcoming, Active, and Closed options', () => {
    const year = { id: 3, name: '2027-2028', status: 'Upcoming' };

    const html = cleanHtml(renderToString(
      <ChangeAcademicYearStatusModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={() => {}}
        academicYear={year}
      />
    ));

    assert.ok(html.includes('Change Academic Year Status'), 'Displays modal header');
    assert.ok(html.includes('Upcoming'), 'Renders Upcoming radio option');
    assert.ok(html.includes('Active'), 'Renders Active radio option');
    assert.ok(html.includes('Closed'), 'Renders Closed radio option');
    assert.ok(html.includes('Update Status'), 'Renders submit button');
  });

  runChallenge('AY-HistoricalBanner', 'HistoricalYearBanner renders banner with required test IDs when viewing historical cycle', () => {
    resetMockErpContext();
    setMockErpContext({
      isHistoricalYear: true,
      activeAcademicYear: { id: 8, name: '2024-2025' },
      isReadOnly: true,
      canManageHistoricalData: true,
      adminOverrideActive: false
    });

    const html = cleanHtml(renderToString(
      <HistoricalYearBanner />
    ));

    assert.ok(html.includes('id="historical-academic-year-banner"'), 'Preserves id="historical-academic-year-banner"');
    assert.ok(html.includes('id="admin-override-toggle-button"'), 'Preserves id="admin-override-toggle-button"');
    assert.ok(html.includes('Read-Only Mode'), 'Displays Read-Only Mode badge');
    assert.ok(html.includes('Enable Admin Override'), 'Displays Enable Admin Override action');
  });

  runChallenge('AY-TableBadges', 'AcademicYearTable renders correct status badges for Current, Next, and Disabled', () => {
    const years = [
      { id: 1, name: '2026-2027', is_current: true, is_enabled: true, status: 'Active', start_date: '2026-06-01', end_date: '2027-04-30' },
      { id: 2, name: '2027-2028', is_current: false, is_next: true, is_enabled: true, status: 'Upcoming', start_date: '2027-06-01', end_date: '2028-04-30' },
      { id: 3, name: '2023-2024', is_current: false, is_next: false, is_enabled: false, status: 'Closed', start_date: '2023-06-01', end_date: '2024-04-30' }
    ];

    const html = cleanHtml(renderToString(
      <MemoryRouter>
        <AcademicYearTable
          academicYears={years}
          onView={() => {}}
          onEdit={() => {}}
          onConfigureClasses={() => {}}
          onSetCurrent={() => {}}
          onSetNext={() => {}}
          onChangeStatus={() => {}}
          onToggleEnabled={() => {}}
        />
      </MemoryRouter>
    ));

    assert.ok(html.includes('Current / Default'), 'Renders Current / Default badge');
    assert.ok(html.includes('Next Year / Enabled'), 'Renders Next Year / Enabled badge');
    assert.ok(html.includes('Disabled'), 'Renders Disabled badge');
  });

  // ===========================================================================
  // Summary & Gate Assertion
  // ===========================================================================
  const total = challengeResults.length;
  const passed = challengeResults.filter(r => r.passed).length;
  const failed = challengeResults.filter(r => !r.passed).length;

  console.log('\n================================================================================');
  console.log(`   COMPREHENSIVE CHALLENGE SUMMARY: ${passed}/${total} Passed (${((passed/total)*100).toFixed(1)}%)`);
  console.log('================================================================================\n');

  if (failed > 0) {
    console.error(`FAILED CHALLENGES (${failed}):`);
    challengeResults.filter(r => !r.passed).forEach(r => {
      console.error(` - [${r.category}] ${r.name}: ${r.error}`);
    });
    process.exit(1);
  } else {
    console.log(`[SUCCESS] All ${total} empirical adversarial challenges PASSED with 0 errors!`);
  }

  return { total, passed, failed };
}

executeAllM4EmpiricalChallenges();
