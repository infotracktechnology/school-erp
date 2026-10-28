import { initDatabase } from '../config/database.js';

async function migrateSubMenus() {
  try {
    const sutando = initDatabase();
    const conn = sutando.connection();

    console.log('[Migration] Upgrading system_menus for sub-menus...');

    // 1. Add parent_menu_key and is_sub_menu columns if not present
    const [cols] = await conn.raw('DESCRIBE system_menus');
    const colNames = cols.map(c => c.Field);

    if (!colNames.includes('parent_menu_key')) {
      await conn.raw(`ALTER TABLE system_menus ADD COLUMN parent_menu_key VARCHAR(50) NULL AFTER menu_key, ADD INDEX idx_parent_menu (parent_menu_key);`);
      console.log('Added parent_menu_key column.');
    }

    if (!colNames.includes('is_sub_menu')) {
      await conn.raw(`ALTER TABLE system_menus ADD COLUMN is_sub_menu BOOLEAN DEFAULT FALSE AFTER display_order;`);
      console.log('Added is_sub_menu column.');
    }

    // 2. Clear old menu entries and reseed full hierarchy (Parent modules + all Sub-menus)
    console.log('[Migration] Seeding comprehensive parent modules and sub-menus...');

    const fullCatalog = [
      // --- Dashboard ---
      { key: 'dashboard', parent: null, label: 'Dashboard', desc: 'Main Campus Overview & KPI metrics', cat: 'General', icon: 'LayoutDashboard', route: '/dashboard', order: 1, isSub: 0 },

      // --- Anecdotes Module & Sub-menus ---
      { key: 'anecdotes', parent: null, label: 'Anecdotes', desc: 'Behavioral observations & merits hub', cat: 'Academics', icon: 'Star', route: '/anecdotes', order: 2, isSub: 0 },
      { key: 'anecdotes:logs', parent: 'anecdotes', label: '1. Observations Log', desc: 'Daily positive & guidance observation entries', cat: 'Academics', icon: 'BookOpen', route: '/anecdotes/logs', order: 21, isSub: 1 },
      { key: 'anecdotes:reports', parent: 'anecdotes', label: '2. Behavioral Reports', desc: 'Class behavioral matrix & PTM dossier export', cat: 'Academics', icon: 'BarChart3', route: '/anecdotes/reports', order: 22, isSub: 1 },

      // --- Students Directory Module & Sub-menus ---
      { key: 'students', parent: null, label: 'Students', desc: 'Student Information System (SIS)', cat: 'Academics', icon: 'Users', route: '/students', order: 3, isSub: 0 },
      { key: 'students:details', parent: 'students', label: '1. Student Details', desc: 'High density student roster & profile viewer', cat: 'Academics', icon: 'Users', route: '/students/details', order: 31, isSub: 1 },
      { key: 'students:update', parent: 'students', label: '2. Student Update', desc: 'Detailed 14-tab profile & document editor', cat: 'Academics', icon: 'Edit', route: '/students/update', order: 32, isSub: 1 },
      { key: 'students:changes', parent: 'students', label: '3. Class & Section Changes', desc: 'Mid-term section transfer and history', cat: 'Academics', icon: 'ArrowRightLeft', route: '/students/class-section-changes', order: 33, isSub: 1 },
      { key: 'students:promotion', parent: 'students', label: '4. Student Promotion', desc: 'Annual grade promotion & batch rollover', cat: 'Academics', icon: 'TrendingUp', route: '/students/promotion', order: 34, isSub: 1 },
      { key: 'students:groups', parent: 'students', label: '5. Academic Groups', desc: 'Grouping and subject combinations', cat: 'Academics', icon: 'Layers', route: '/students/academic-groups', order: 35, isSub: 1 },

      // --- Staff Management Module & Sub-menus ---
      { key: 'staff', parent: null, label: 'Staff Management', desc: 'Faculty & Administrative Employee directory', cat: 'Administration', icon: 'UserCheck', route: '/staff', order: 4, isSub: 0 },
      { key: 'staff:directory', parent: 'staff', label: '1. Staff Directory', desc: 'Teaching & Non-Teaching employee directory', cat: 'Administration', icon: 'Users', route: '/staff/directory', order: 41, isSub: 1 },
      { key: 'staff:allocations', parent: 'staff', label: '2. Academic Allocations', desc: 'Class Teacher, Coordinator & Subject mappings', cat: 'Administration', icon: 'ShieldCheck', route: '/staff/allocations', order: 42, isSub: 1 },
      { key: 'staff:workload', parent: 'staff', label: '3. Teaching Workload', desc: 'Periods/week distribution & capacity matrix', cat: 'Administration', icon: 'Clock', route: '/staff/workload', order: 43, isSub: 1 },

      // --- Attendance Module & Sub-menus ---
      { key: 'attendance', parent: null, label: 'Attendance', desc: 'Student Attendance & Timing Management', cat: 'Academics', icon: 'CalendarCheck', route: '/attendance', order: 5, isSub: 0 },
      { key: 'attendance:take', parent: 'attendance', label: '1. Take Attendance', desc: 'Fast roll-call attendance marking', cat: 'Academics', icon: 'CheckSquare', route: '/attendance/take_attendance', order: 51, isSub: 1 },
      { key: 'attendance:timings', parent: 'attendance', label: '2. Attendance Time Slots', desc: 'Shift timings, cutoffs, and grace periods', cat: 'Academics', icon: 'Clock', route: '/attendance/timings', order: 52, isSub: 1 },
      { key: 'attendance:mapping', parent: 'attendance', label: '3. Timing Mapping', desc: 'Class and section shift assignment', cat: 'Academics', icon: 'Layers', route: '/attendance/assignments', order: 53, isSub: 1 },
      { key: 'attendance:history', parent: 'attendance', label: '4. Attendance History', desc: 'Historical attendance search and edits', cat: 'Academics', icon: 'History', route: '/attendance/history', order: 54, isSub: 1 },
      { key: 'attendance:reports', parent: 'attendance', label: '5. Attendance Reports', desc: 'Daily, monthly, and absentee analytics', cat: 'Academics', icon: 'BarChart3', route: '/attendance/reports', order: 55, isSub: 1 },

      // --- Academic Calendar ---
      { key: 'calendar', parent: null, label: 'Academic Calendar', desc: 'Events, holidays, schedules, exams calendar', cat: 'General', icon: 'Calendar', route: '/calendar', order: 6, isSub: 0 },

      // --- Timetable ---
      { key: 'timetable', parent: null, label: 'Timetable', desc: 'Weekly schedule & period allocations', cat: 'Academics', icon: 'Clock', route: '/timetable', order: 7, isSub: 0 },

      // --- Academics Config ---
      { key: 'academics', parent: null, label: 'Academic Config', desc: 'Classes, Sections, and Subjects master', cat: 'Academics', icon: 'BookOpen', route: '/academics', order: 8, isSub: 0 },

      // --- Examination Module & Sub-menus ---
      { key: 'examination', parent: null, label: 'Examinations', desc: 'Terms, marks entry, and report cards', cat: 'Academics', icon: 'Award', route: '/examination', order: 9, isSub: 0 },
      { key: 'examination:structure', parent: 'examination', label: '1. Term Structure & Wizard', desc: 'Academic terms, weightages, and grading scale', cat: 'Academics', icon: 'Layers', route: '/examination/term-structure', order: 91, isSub: 1 },

      // --- Communication Module & Sub-menus ---
      { key: 'communication', parent: null, label: 'Communication', desc: 'Homework, notices, announcements & circulars', cat: 'Administration', icon: 'MessageSquare', route: '/communication', order: 10, isSub: 0 },
      { key: 'communication:homework', parent: 'communication', label: '1. Homework', desc: 'Daily subject homework assignments', cat: 'Administration', icon: 'BookOpen', route: '/communication/homework', order: 101, isSub: 1 },
      { key: 'communication:assignment', parent: 'communication', label: '2. Assignments', desc: 'Submission-based project assignments', cat: 'Administration', icon: 'FileCheck2', route: '/communication/assignment', order: 102, isSub: 1 },
      { key: 'communication:announcement', parent: 'communication', label: '3. Announcements', desc: 'School broadcast alerts and notices', cat: 'Administration', icon: 'Bell', route: '/communication/announcement', order: 103, isSub: 1 },
      { key: 'communication:gallery', parent: 'communication', label: '4. Media Gallery', desc: 'School event photos and albums', cat: 'Administration', icon: 'Image', route: '/communication/gallery', order: 104, isSub: 1 },
      { key: 'communication:monitoring', parent: 'communication', label: '5. Monitoring & Stats', desc: 'Teacher homework completion tracking', cat: 'Administration', icon: 'BarChart3', route: '/communication/dashboard', order: 105, isSub: 1 },
      { key: 'communication:audit', parent: 'communication', label: '6. Audit Trail', desc: 'Notification dispatch logs and delivery status', cat: 'Administration', icon: 'History', route: '/communication/audit', order: 106, isSub: 1 },

      // --- Finance & Fees ---
      { key: 'finance', parent: null, label: 'Finance & Fees', desc: 'Fee structures, collections & receipts', cat: 'Finance & Operations', icon: 'CreditCard', route: '/finance', order: 11, isSub: 0 },

      // --- Transport ---
      { key: 'transport', parent: null, label: 'Transport', desc: 'Bus routes, drivers, and transport fee', cat: 'Finance & Operations', icon: 'Bus', route: '/transport', order: 12, isSub: 0 },

      // --- Library ---
      { key: 'library', parent: null, label: 'Library', desc: 'Book catalog, issues, returns & fines', cat: 'Finance & Operations', icon: 'Bookmark', route: '/library', order: 13, isSub: 0 },

      // --- Reports ---
      { key: 'reports', parent: null, label: 'Reports & Analytics', desc: 'Institutional audit and analytical reports', cat: 'Administration', icon: 'BarChart3', route: '/reports', order: 14, isSub: 0 }
    ];

    for (const item of fullCatalog) {
      await conn.raw(`
        INSERT INTO system_menus (menu_key, parent_menu_key, label, description, category, icon, route_path, display_order, is_sub_menu)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
          parent_menu_key = VALUES(parent_menu_key),
          label = VALUES(label),
          description = VALUES(description),
          category = VALUES(category),
          icon = VALUES(icon),
          route_path = VALUES(route_path),
          display_order = VALUES(display_order),
          is_sub_menu = VALUES(is_sub_menu);
      `, [item.key, item.parent, item.label, item.desc, item.cat, item.icon, item.route, item.order, item.isSub]);
    }
    console.log(`[Migration] Seeded ${fullCatalog.length} parent and sub-menus successfully.`);

    // 3. Setup default role sub-menu permissions for Class Teacher (Role 9), Cashier (12), etc.
    // Class Teacher gets:
    // Attendance: take, history, reports
    // Anecdotes: logs, reports
    // Students: details, update
    // Communication: homework, assignment, announcement, gallery
    // Staff: workload
    const classTeacherSubMenus = [
      'dashboard', 'calendar', 'timetable',
      'attendance', 'attendance:take', 'attendance:history', 'attendance:reports',
      'anecdotes', 'anecdotes:logs', 'anecdotes:reports',
      'students', 'students:details', 'students:update',
      'communication', 'communication:homework', 'communication:assignment', 'communication:announcement', 'communication:gallery',
      'staff', 'staff:workload'
    ];

    for (const sm of classTeacherSubMenus) {
      await conn.raw(`
        INSERT INTO role_menu_permissions (branch_id, role_id, target_type, menu_key, can_view, can_create, can_edit, can_delete)
        VALUES (1, 9, 'Teaching', ?, 1, 1, 1, 0)
        ON DUPLICATE KEY UPDATE can_view = 1, can_create = 1, can_edit = 1;
      `, [sm]);
    }

    // Cashier (Role 12) gets:
    // Dashboard, Finance, Calendar
    const cashierMenus = ['dashboard', 'finance', 'calendar'];
    for (const sm of cashierMenus) {
      await conn.raw(`
        INSERT INTO role_menu_permissions (branch_id, role_id, target_type, menu_key, can_view, can_create, can_edit, can_delete)
        VALUES (1, 12, 'Teaching', ?, 1, 1, 1, 0)
        ON DUPLICATE KEY UPDATE can_view = 1, can_create = 1, can_edit = 1;
      `, [sm]);
    }

    // Principal (Role 7) and Super Admin (1) get all
    const allKeys = fullCatalog.map(m => m.key);
    for (const sm of allKeys) {
      await conn.raw(`
        INSERT INTO role_menu_permissions (branch_id, role_id, target_type, menu_key, can_view, can_create, can_edit, can_delete)
        VALUES (1, 1, 'Teaching', ?, 1, 1, 1, 1)
        ON DUPLICATE KEY UPDATE can_view = 1, can_create = 1, can_edit = 1, can_delete = 1;
      `, [sm]);
      await conn.raw(`
        INSERT INTO role_menu_permissions (branch_id, role_id, target_type, menu_key, can_view, can_create, can_edit, can_delete)
        VALUES (1, 7, 'Teaching', ?, 1, 1, 1, 0)
        ON DUPLICATE KEY UPDATE can_view = 1, can_create = 1, can_edit = 1;
      `, [sm]);
    }

    console.log('[Migration] Sub-menus permissions seeded for roles.');
    process.exit(0);
  } catch (err) {
    console.error('[migrateSubMenus Error]:', err);
    process.exit(1);
  }
}

migrateSubMenus();
