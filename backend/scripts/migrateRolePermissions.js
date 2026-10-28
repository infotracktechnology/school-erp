import { initDatabase } from '../config/database.js';

async function migrateRolePermissions() {
  try {
    const sutando = initDatabase();
    const conn = sutando.connection();

    console.log('[Migration] Updating role_menu_permissions to support role_id...');

    // 1. Check if role_id exists on role_menu_permissions
    const [cols] = await conn.raw('DESCRIBE role_menu_permissions');
    const hasRoleId = cols.some(c => c.Field === 'role_id');
    if (!hasRoleId) {
      await conn.raw(`
        ALTER TABLE role_menu_permissions 
        ADD COLUMN role_id INT NULL AFTER branch_id,
        ADD INDEX idx_role_id (role_id);
      `);
      console.log('[Migration] Added role_id to role_menu_permissions.');
    }

    // 2. Clear old broad type entries and insert Role-Specific defaults for all 16 roles
    const roleMenuBlueprint = {
      // 1: Super Admin -> All menus
      1: ['dashboard', 'anecdotes', 'students', 'staff', 'attendance', 'calendar', 'timetable', 'academics', 'examination', 'communication', 'finance', 'transport', 'library', 'reports'],
      // 2: Branch Admin -> All menus within branch
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
    console.log('[Migration] Seeded role-specific menu permissions.');

    // 3. Retroactively sync existing 10 staff members to have a linked user account!
    const [staffList] = await conn.raw(`SELECT * FROM staff WHERE user_id IS NULL OR role_id IS NULL`);
    console.log(`[Migration] Found ${staffList.length} unlinked staff members. Auto-generating user accounts...`);

    for (const st of staffList) {
      let assignedRoleId = 3; // default Teacher
      if (st.designation?.toLowerCase().includes('accountant')) assignedRoleId = 6;
      else if (st.designation?.toLowerCase().includes('cashier')) assignedRoleId = 12;
      else if (st.designation?.toLowerCase().includes('librarian')) assignedRoleId = 14;
      else if (st.designation?.toLowerCase().includes('driver') || st.department?.toLowerCase().includes('transport')) assignedRoleId = 15;
      else if (st.designation?.toLowerCase().includes('front desk') || st.designation?.toLowerCase().includes('reception')) assignedRoleId = 13;
      else if (st.staff_type === 'Teaching') assignedRoleId = 9; // Class Teacher default

      const userEmail = st.email || `${st.staff_code.toLowerCase()}@campuseye.com`;
      const fullName = `${st.first_name} ${st.last_name || ''}`.trim();

      // Check if user already exists with this email
      const [existingUser] = await conn.raw(`SELECT id FROM users WHERE email = ?`, [userEmail]);
      let uId;
      if (existingUser.length > 0) {
        uId = existingUser[0].id;
        await conn.raw(`UPDATE users SET staff_id = ?, role_id = ? WHERE id = ?`, [st.id, assignedRoleId, uId]);
      } else {
        const [uResult] = await conn.raw(`
          INSERT INTO users (name, email, password, role_id, branch_id, staff_id, status, created_at, updated_at)
          VALUES (?, ?, 'School@123', ?, ?, ?, 'active', NOW(), NOW())
        `, [fullName, userEmail, assignedRoleId, st.branch_id || 1, st.id]);
        uId = uResult.insertId;
      }

      await conn.raw(`UPDATE staff SET user_id = ?, role_id = ? WHERE id = ?`, [uId, assignedRoleId, st.id]);
      console.log(`Linked Staff: ${st.staff_code} (${fullName}) -> User ID: ${uId} -> Role ID: ${assignedRoleId}`);
    }

    console.log('[Migration] All staff-user-role links synchronized successfully.');
    process.exit(0);
  } catch (err) {
    console.error('[Migration Error]:', err);
    process.exit(1);
  }
}

migrateRolePermissions();
