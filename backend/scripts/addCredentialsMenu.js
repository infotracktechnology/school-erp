import { initDatabase } from '../config/database.js';

async function run() {
  const db = initDatabase();
  const conn = db.connection();

  const [existing] = await conn.raw("SELECT * FROM system_menus WHERE menu_key = 'staff:credentials'");
  if (existing.length === 0) {
    await conn.raw(`
      INSERT INTO system_menus (menu_key, parent_menu_key, label, description, category, icon, route_path, is_sub_menu, display_order, is_active)
      VALUES ('staff:credentials', 'staff', '4. Bulk Reset Credentials', 'Batch reset staff passwords and usernames using mobile, DOB or default formulas', 'Academic', 'Key', '/staff/credentials', 1, 19, 1)
    `);
    console.log('Inserted staff:credentials into system_menus');

    for (const bId of [1, 2]) {
      for (const rId of [1, 2]) {
        await conn.raw(`
          INSERT INTO role_menu_permissions (branch_id, role_id, target_type, menu_key, can_view, can_create, can_edit, can_delete)
          VALUES (?, ?, 'Teaching', 'staff:credentials', 1, 1, 1, 1)
          ON DUPLICATE KEY UPDATE can_view = 1, can_create = 1, can_edit = 1, can_delete = 1
        `, [bId, rId]);
      }
    }
    console.log('Granted permissions for staff:credentials to roles 1 and 2 in branches 1 and 2');
  } else {
    console.log('staff:credentials already exists');
  }
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
