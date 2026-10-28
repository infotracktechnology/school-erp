import { initDatabase } from '../config/database.js';

async function fixUniqueKey() {
  try {
    const sutando = initDatabase();
    const conn = sutando.connection();

    console.log('[Migration] Dropping old uq_role_menu and recreating with role_id...');

    await conn.raw(`ALTER TABLE role_menu_permissions DROP INDEX uq_role_menu;`);
    await conn.raw(`
      ALTER TABLE role_menu_permissions 
      ADD UNIQUE KEY uq_branch_role_menu (branch_id, role_id, menu_key);
    `);

    // Clean old rows with null role_id
    await conn.raw(`DELETE FROM role_menu_permissions WHERE role_id IS NULL;`);

    // Seed role-specific permissions
    const roleMenuBlueprint = {
      // 1: Super Admin -> All menus
      1: ['dashboard', 'anecdotes', 'students', 'staff', 'attendance', 'calendar', 'timetable', 'academics', 'examination', 'communication', 'finance', 'transport', 'library', 'reports'],
      // 2: Branch Admin -> All menus
      2: ['dashboard', 'anecdotes', 'students', 'staff', 'attendance', 'calendar', 'timetable', 'academics', 'examination', 'communication', 'finance', 'transport', 'library', 'reports'],
      // 7: Principal
      7: ['dashboard', 'anecdotes', 'students', 'staff', 'attendance', 'calendar', 'timetable', 'academics', 'examination', 'communication', 'reports'],
      // 8: Class Coordinator
      8: ['dashboard', 'anecdotes', 'students', 'attendance', 'calendar', 'timetable', 'examination', 'communication', 'reports'],
      // 9: Class Teacher
      9: ['dashboard', 'anecdotes', 'students', 'attendance', 'calendar', 'timetable', 'examination', 'communication'],
      // 10: Assistant Class Teacher
      10: ['dashboard', 'anecdotes', 'students', 'attendance', 'calendar', 'communication'],
      // 11 / 3: Subject Teacher
      11: ['dashboard', 'anecdotes', 'attendance', 'calendar', 'examination', 'communication'],
      3: ['dashboard', 'anecdotes', 'attendance', 'calendar', 'examination', 'communication'],
      // 16: Examination Incharge
      16: ['dashboard', 'examination', 'timetable', 'academics', 'calendar', 'reports'],
      // 6: Accountant
      6: ['dashboard', 'finance', 'calendar', 'communication', 'reports'],
      // 12: Cashier
      12: ['dashboard', 'finance', 'calendar'],
      // 13: Front Office
      13: ['dashboard', 'students', 'calendar', 'communication'],
      // 14: Librarian
      14: ['dashboard', 'library', 'calendar'],
      // 15: Transport Incharge
      15: ['dashboard', 'transport', 'calendar']
    };

    for (const [roleId, menus] of Object.entries(roleMenuBlueprint)) {
      const rId = parseInt(roleId, 10);
      for (const menuKey of menus) {
        await conn.raw(`
          INSERT INTO role_menu_permissions (branch_id, role_id, target_type, menu_key, can_view, can_create, can_edit, can_delete)
          VALUES (1, ?, 'Teaching', ?, 1, 1, 1, 0)
          ON DUPLICATE KEY UPDATE can_view = 1, can_create = 1, can_edit = 1;
        `, [rId, menuKey]);
      }
    }
    console.log('[Migration] Successfully seeded role-specific permissions!');

    process.exit(0);
  } catch (err) {
    console.error('[fixUniqueKey Error]:', err);
    process.exit(1);
  }
}

fixUniqueKey();
