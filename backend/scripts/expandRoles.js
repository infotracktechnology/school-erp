import { initDatabase } from '../config/database.js';

async function expandRoles() {
  try {
    const sutando = initDatabase();
    const conn = sutando.connection();

    console.log('[Migration] Expanding roles and checking schema...');

    // 1. Ensure staff_id column exists on users table
    const [userCols] = await conn.raw('DESCRIBE users');
    const hasStaffId = userCols.some(c => c.Field === 'staff_id');
    if (!hasStaffId) {
      await conn.raw(`ALTER TABLE users ADD COLUMN staff_id INT NULL AFTER branch_id, ADD INDEX idx_user_staff (staff_id)`);
      console.log('[Migration] Added staff_id to users table.');
    }

    // 2. Insert all Master Roles into roles table
    const masterRoles = [
      { id: 1, name: 'Super Admin' },
      { id: 2, name: 'Branch Admin' },
      { id: 3, name: 'Teacher' },
      { id: 4, name: 'Student' },
      { id: 5, name: 'Parent' },
      { id: 6, name: 'Accountant' },
      { id: 7, name: 'Principal' },
      { id: 8, name: 'Class Coordinator' },
      { id: 9, name: 'Class Teacher' },
      { id: 10, name: 'Assistant Class Teacher' },
      { id: 11, name: 'Subject Teacher' },
      { id: 12, name: 'Cashier' },
      { id: 13, name: 'Front Office' },
      { id: 14, name: 'Librarian' },
      { id: 15, name: 'Transport Incharge' },
      { id: 16, name: 'Examination Incharge' }
    ];

    for (const r of masterRoles) {
      await conn.raw(`
        INSERT INTO roles (id, name, created_at, updated_at)
        VALUES (?, ?, NOW(), NOW())
        ON DUPLICATE KEY UPDATE name = VALUES(name);
      `, [r.id, r.name]);
    }
    console.log('[Migration] All 16 Master Roles synchronized.');

    // 3. Setup Default Menu Permissions for Master Roles
    // Mapping default menus per role
    const roleMenuMap = {
      // Principal (id=7): Complete overview except system admin settings
      7: ['dashboard', 'anecdotes', 'students', 'staff', 'attendance', 'calendar', 'timetable', 'academics', 'examination', 'communication', 'reports'],
      
      // Class Coordinator (id=8)
      8: ['dashboard', 'anecdotes', 'students', 'attendance', 'calendar', 'timetable', 'examination', 'communication', 'reports'],

      // Class Teacher (id=9)
      9: ['dashboard', 'anecdotes', 'students', 'attendance', 'calendar', 'timetable', 'examination', 'communication'],

      // Assistant Class Teacher (id=10)
      10: ['dashboard', 'anecdotes', 'students', 'attendance', 'calendar', 'communication'],

      // Subject Teacher (id=11 & id=3)
      11: ['dashboard', 'anecdotes', 'attendance', 'calendar', 'examination', 'communication'],
      3: ['dashboard', 'anecdotes', 'attendance', 'calendar', 'examination', 'communication'],

      // Accountant (id=6)
      6: ['dashboard', 'finance', 'calendar', 'communication', 'reports'],

      // Cashier (id=12)
      12: ['dashboard', 'finance', 'calendar'],

      // Front Office (id=13)
      13: ['dashboard', 'students', 'calendar', 'communication'],

      // Librarian (id=14)
      14: ['dashboard', 'library', 'calendar'],

      // Transport Incharge (id=15)
      15: ['dashboard', 'transport', 'calendar'],

      // Examination Incharge (id=16)
      16: ['dashboard', 'examination', 'timetable', 'academics', 'calendar', 'reports']
    };

    for (const [roleId, menus] of Object.entries(roleMenuMap)) {
      for (const menuKey of menus) {
        await conn.raw(`
          INSERT INTO role_menu_permissions (branch_id, target_type, menu_key, can_view, can_create, can_edit, can_delete)
          VALUES (1, 'Teaching', ?, 1, 1, 1, 0)
          ON DUPLICATE KEY UPDATE can_view=1;
        `, [menuKey]);
      }
    }
    console.log('[Migration] Role default menu mappings seeded.');

    process.exit(0);
  } catch (err) {
    console.error('[expandRoles Error]:', err);
    process.exit(1);
  }
}

expandRoles();
