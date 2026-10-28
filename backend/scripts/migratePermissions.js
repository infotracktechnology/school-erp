import { initDatabase } from '../config/database.js';

async function migratePermissions() {
  try {
    const sutando = initDatabase();
    const conn = sutando.connection();

    console.log('[Migration] Creating system_menus, role_menu_permissions, and staff_menu_permissions...');

    // 1. Table: system_menus (Central catalog of all ERP menus and capabilities)
    await conn.raw(`
      CREATE TABLE IF NOT EXISTS system_menus (
        id INT AUTO_INCREMENT PRIMARY KEY,
        menu_key VARCHAR(50) NOT NULL UNIQUE,
        label VARCHAR(100) NOT NULL,
        description VARCHAR(255) NULL,
        category ENUM('Academics', 'Administration', 'Finance & Operations', 'General') DEFAULT 'General',
        icon VARCHAR(50) DEFAULT 'Layers',
        route_path VARCHAR(100) NOT NULL,
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        INDEX idx_menu_key (menu_key)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. Table: role_menu_permissions (Defaults for Teaching vs Non-Teaching)
    await conn.raw(`
      CREATE TABLE IF NOT EXISTS role_menu_permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        branch_id INT NOT NULL DEFAULT 1,
        target_type ENUM('Teaching', 'Non-Teaching') NOT NULL,
        menu_key VARCHAR(50) NOT NULL,
        can_view BOOLEAN DEFAULT TRUE,
        can_create BOOLEAN DEFAULT FALSE,
        can_edit BOOLEAN DEFAULT FALSE,
        can_delete BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_role_menu (branch_id, target_type, menu_key)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. Table: staff_menu_permissions (Individual Staff Overrides)
    await conn.raw(`
      CREATE TABLE IF NOT EXISTS staff_menu_permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        staff_id INT NOT NULL,
        menu_key VARCHAR(50) NOT NULL,
        is_granted BOOLEAN NOT NULL DEFAULT TRUE, -- 1=grant override, 0=deny override
        can_view BOOLEAN DEFAULT TRUE,
        can_create BOOLEAN DEFAULT FALSE,
        can_edit BOOLEAN DEFAULT FALSE,
        can_delete BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_staff_menu (staff_id, menu_key),
        FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('[Migration] Tables created successfully.');

    // 4. Seed system_menus
    await conn.raw(`
      INSERT INTO system_menus (menu_key, label, description, category, icon, route_path, display_order)
      VALUES 
      ('dashboard', 'Dashboard', 'Overview metrics, cards, announcements', 'General', 'LayoutDashboard', '/dashboard', 1),
      ('anecdotes', 'Anecdotes', 'Student behavioral observations, merits, remarks, reports', 'Academics', 'Star', '/anecdotes', 2),
      ('students', 'Students Directory', 'Student database, profiles, roll call, documents', 'Academics', 'Users', '/students', 3),
      ('staff', 'Staff Management', 'Staff directory, teaching allocations, workload', 'Administration', 'UserCheck', '/staff', 4),
      ('attendance', 'Attendance', 'Daily student attendance recording, history & reports', 'Academics', 'CalendarCheck', '/attendance', 5),
      ('calendar', 'Academic Calendar', 'School events, exams, holidays, and milestones', 'General', 'Calendar', '/calendar', 6),
      ('timetable', 'Timetable', 'Weekly periods, timetable generation & schedule', 'Academics', 'Clock', '/timetable', 7),
      ('academics', 'Academic Config', 'Classes, sections, subjects & academic groups', 'Academics', 'BookOpen', '/academics', 8),
      ('examination', 'Examinations', 'Exams setup, schedules, marks entry & report cards', 'Academics', 'Award', '/examination', 9),
      ('communication', 'Communication', 'Homework, assignments, notices, broadcast messages', 'Administration', 'MessageSquare', '/communication', 10),
      ('finance', 'Finance & Fees', 'Fee structures, invoices, fee collection & receipts', 'Finance & Operations', 'CreditCard', '/finance', 11),
      ('transport', 'Transport', 'Buses, routes, vehicle maintenance & tracking', 'Finance & Operations', 'Bus', '/transport', 12),
      ('library', 'Library', 'Book catalog, issues, returns & fine collection', 'Finance & Operations', 'Bookmark', '/library', 13),
      ('reports', 'Reports & Analytics', 'Comprehensive institutional analysis & data export', 'Administration', 'BarChart3', '/reports', 14)
      ON DUPLICATE KEY UPDATE label=VALUES(label), description=VALUES(description), category=VALUES(category), route_path=VALUES(route_path);
    `);
    console.log('[Migration] Seeded system_menus.');

    // 5. Seed Category Defaults for Teaching Staff
    // Teaching gets: dashboard, anecdotes, students (view), attendance, calendar, timetable, examination, communication
    const teachingMenus = [
      { key: 'dashboard', v: 1, c: 0, e: 0, d: 0 },
      { key: 'anecdotes', v: 1, c: 1, e: 1, d: 0 },
      { key: 'students', v: 1, c: 0, e: 0, d: 0 },
      { key: 'attendance', v: 1, c: 1, e: 0, d: 0 },
      { key: 'calendar', v: 1, c: 0, e: 0, d: 0 },
      { key: 'timetable', v: 1, c: 0, e: 0, d: 0 },
      { key: 'examination', v: 1, c: 1, e: 1, d: 0 },
      { key: 'communication', v: 1, c: 1, e: 1, d: 0 },
    ];
    for (const m of teachingMenus) {
      await conn.raw(`
        INSERT INTO role_menu_permissions (branch_id, target_type, menu_key, can_view, can_create, can_edit, can_delete)
        VALUES (1, 'Teaching', ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE can_view=VALUES(can_view), can_create=VALUES(can_create), can_edit=VALUES(can_edit), can_delete=VALUES(can_delete);
      `, [m.key, m.v, m.c, m.e, m.d]);
    }

    // 6. Seed Category Defaults for Non-Teaching Staff
    // Non-Teaching gets: dashboard, communication, calendar (general staff defaults)
    const nonTeachingMenus = [
      { key: 'dashboard', v: 1, c: 0, e: 0, d: 0 },
      { key: 'calendar', v: 1, c: 0, e: 0, d: 0 },
      { key: 'communication', v: 1, c: 1, e: 0, d: 0 }
    ];
    for (const m of nonTeachingMenus) {
      await conn.raw(`
        INSERT INTO role_menu_permissions (branch_id, target_type, menu_key, can_view, can_create, can_edit, can_delete)
        VALUES (1, 'Non-Teaching', ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE can_view=VALUES(can_view), can_create=VALUES(can_create), can_edit=VALUES(can_edit), can_delete=VALUES(can_delete);
      `, [m.key, m.v, m.c, m.e, m.d]);
    }

    // 7. Seed Staff Specific Overrides Examples:
    // Staff id=6 (Ramesh Chandran, Accountant) -> Grant Finance & Fees
    // Staff id=8 (Selvam P, Senior Bus Driver) -> Grant Transport
    // Staff id=9 (Deepa R, Librarian) -> Grant Library
    await conn.raw(`
      INSERT INTO staff_menu_permissions (staff_id, menu_key, is_granted, can_view, can_create, can_edit, can_delete)
      VALUES 
      (6, 'finance', 1, 1, 1, 1, 0),
      (8, 'transport', 1, 1, 1, 0, 0),
      (9, 'library', 1, 1, 1, 1, 0)
      ON DUPLICATE KEY UPDATE is_granted=VALUES(is_granted), can_view=VALUES(can_view), can_create=VALUES(can_create);
    `);
    console.log('[Migration] Seeded role and staff menu permissions.');

    process.exit(0);
  } catch (err) {
    console.error('[Migration Error]:', err);
    process.exit(1);
  }
}

migratePermissions();
