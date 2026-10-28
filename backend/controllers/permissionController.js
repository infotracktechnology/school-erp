import { initDatabase } from '../config/database.js';

// Get all available system roles
export const getMasterRoles = async (req, res) => {
  try {
    const sutando = initDatabase();
    const conn = sutando.connection();
    const [roles] = await conn.raw(`
      SELECT 
        r.*,
        COUNT(u.id) as user_count
      FROM roles r
      LEFT JOIN users u ON u.role_id = r.id
      GROUP BY r.id
      ORDER BY r.id ASC
    `);
    res.json({ success: true, data: roles });
  } catch (error) {
    console.error('[getMasterRoles Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new Master Role
export const createRole = async (req, res) => {
  try {
    const sutando = initDatabase();
    const conn = sutando.connection();
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Role name is required.' });
    }

    const trimmedName = name.trim();

    // Check duplicate
    const [existing] = await conn.raw(`SELECT id FROM roles WHERE LOWER(name) = LOWER(?)`, [trimmedName]);
    if (existing && existing.length > 0) {
      return res.status(400).json({ success: false, message: 'A role with this name already exists.' });
    }

    const [result] = await conn.raw(`
      INSERT INTO roles (name, created_at, updated_at)
      VALUES (?, NOW(), NOW())
    `, [trimmedName]);

    const newRoleId = result.insertId;

    // Seed basic default menus for this new role (Dashboard, Calendar, Communication)
    const baseMenus = ['dashboard', 'calendar', 'communication'];
    for (const m of baseMenus) {
      await conn.raw(`
        INSERT INTO role_menu_permissions (branch_id, role_id, target_type, menu_key, can_view, can_create, can_edit, can_delete)
        VALUES (1, ?, 'Teaching', ?, 1, 1, 1, 0)
        ON DUPLICATE KEY UPDATE can_view = 1
      `, [newRoleId, m]);
    }

    res.status(201).json({
      success: true,
      message: 'Role created successfully.',
      data: { id: newRoleId, name: trimmedName }
    });
  } catch (error) {
    console.error('[createRole Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an existing Master Role
export const updateRole = async (req, res) => {
  try {
    const sutando = initDatabase();
    const conn = sutando.connection();
    const { id } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Role name is required.' });
    }

    const trimmedName = name.trim();

    // Prevent renaming core system roles if required, or validate uniqueness
    const [existing] = await conn.raw(`SELECT id FROM roles WHERE LOWER(name) = LOWER(?) AND id != ?`, [trimmedName, id]);
    if (existing && existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Another role with this name already exists.' });
    }

    await conn.raw(`UPDATE roles SET name = ?, updated_at = NOW() WHERE id = ?`, [trimmedName, id]);

    res.json({ success: true, message: 'Role updated successfully.' });
  } catch (error) {
    console.error('[updateRole Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a Master Role
export const deleteRole = async (req, res) => {
  try {
    const sutando = initDatabase();
    const conn = sutando.connection();
    const { id } = req.params;

    // Protected core system roles
    const protectedIds = [1, 2, 4, 5]; // Super Admin, Branch Admin, Student, Parent
    if (protectedIds.includes(parseInt(id, 10))) {
      return res.status(400).json({ success: false, message: 'This core system role cannot be deleted.' });
    }

    // Check if any users or staff are assigned to this role
    const [assignedUsers] = await conn.raw(`SELECT COUNT(*) as cnt FROM users WHERE role_id = ?`, [id]);
    if (assignedUsers[0]?.cnt > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete role. There are ${assignedUsers[0].cnt} user(s) currently assigned to this role.`
      });
    }

    const [assignedStaff] = await conn.raw(`SELECT COUNT(*) as cnt FROM staff WHERE role_id = ?`, [id]);
    if (assignedStaff[0]?.cnt > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete role. There are ${assignedStaff[0].cnt} staff member(s) currently assigned to this role.`
      });
    }

    // Delete role's permissions
    await conn.raw(`DELETE FROM role_menu_permissions WHERE role_id = ?`, [id]);

    // Delete role
    await conn.raw(`DELETE FROM roles WHERE id = ?`, [id]);

    res.json({ success: true, message: 'Role deleted successfully.' });
  } catch (error) {
    console.error('[deleteRole Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get list of all system menus catalog
export const getSystemMenus = async (req, res) => {
  try {
    const sutando = initDatabase();
    const conn = sutando.connection();
    const [menus] = await conn.raw(`SELECT * FROM system_menus WHERE is_active = 1 ORDER BY display_order ASC`);
    res.json({ success: true, data: menus });
  } catch (error) {
    console.error('[getSystemMenus Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Permissions by Specific Master Role (or target_type fallback)
export const getRoleMenuPermissions = async (req, res) => {
  try {
    const sutando = initDatabase();
    const conn = sutando.connection();
    const { branch_id = 1, role_id, target_type = 'Teaching' } = req.query;

    let targetRoleId = role_id ? parseInt(role_id, 10) : null;

    // If no role_id is provided, default to Super Admin (1) or first available role
    // This prevents multiplying system_menus across all 16 roles in the LEFT JOIN!
    if (!targetRoleId) {
      const [firstRole] = await conn.raw(`SELECT id FROM roles ORDER BY id ASC LIMIT 1`);
      targetRoleId = firstRole?.[0]?.id || 1;
    }

    const query = `
      SELECT 
        sm.menu_key,
        sm.parent_menu_key,
        sm.label,
        sm.description,
        sm.category,
        sm.icon,
        sm.route_path,
        sm.is_sub_menu,
        COALESCE(rmp.can_view, 0) as can_view,
        COALESCE(rmp.can_create, 0) as can_create,
        COALESCE(rmp.can_edit, 0) as can_edit,
        COALESCE(rmp.can_delete, 0) as can_delete
      FROM system_menus sm
      LEFT JOIN role_menu_permissions rmp 
        ON sm.menu_key = rmp.menu_key 
        AND rmp.branch_id = ?
        AND rmp.role_id = ?
      WHERE sm.is_active = 1 
      ORDER BY sm.display_order ASC
    `;

    const [rows] = await conn.raw(query, [branch_id, targetRoleId]);

    // Format into Parent-Child Tree hierarchy
    const parents = [];
    const childrenMap = {};

    rows.forEach(r => {
      if (r.parent_menu_key) {
        if (!childrenMap[r.parent_menu_key]) childrenMap[r.parent_menu_key] = [];
        childrenMap[r.parent_menu_key].push(r);
      } else {
        parents.push({ ...r, sub_menus: [] });
      }
    });

    parents.forEach(p => {
      p.sub_menus = childrenMap[p.menu_key] || [];
    });

    res.json({ success: true, role_id: targetRoleId, data: rows, tree: parents });
  } catch (error) {
    console.error('[getRoleMenuPermissions Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Role Menu Permissions (saves by role_id)
export const updateRoleMenuPermissions = async (req, res) => {
  try {
    const sutando = initDatabase();
    const conn = sutando.connection();
    const { branch_id = 1, role_id, target_type = 'Teaching', permissions = [] } = req.body;

    for (const p of permissions) {
      if (role_id) {
        await conn.raw(`
          INSERT INTO role_menu_permissions (branch_id, role_id, target_type, menu_key, can_view, can_create, can_edit, can_delete)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE 
            can_view = VALUES(can_view),
            can_create = VALUES(can_create),
            can_edit = VALUES(can_edit),
            can_delete = VALUES(can_delete)
        `, [
          branch_id,
          role_id,
          target_type,
          p.menu_key,
          p.can_view ? 1 : 0,
          p.can_create ? 1 : 0,
          p.can_edit ? 1 : 0,
          p.can_delete ? 1 : 0
        ]);
      } else {
        await conn.raw(`
          INSERT INTO role_menu_permissions (branch_id, target_type, menu_key, can_view, can_create, can_edit, can_delete)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE 
            can_view = VALUES(can_view),
            can_create = VALUES(can_create),
            can_edit = VALUES(can_edit),
            can_delete = VALUES(can_delete)
        `, [
          branch_id,
          target_type,
          p.menu_key,
          p.can_view ? 1 : 0,
          p.can_create ? 1 : 0,
          p.can_edit ? 1 : 0,
          p.can_delete ? 1 : 0
        ]);
      }
    }

    res.json({ success: true, message: `Role permissions updated successfully.` });
  } catch (error) {
    console.error('[updateRoleMenuPermissions Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Effective Permissions for a Specific Staff Member (Combines Category defaults + Staff overrides)
export const getStaffMenuPermissions = async (req, res) => {
  try {
    const sutando = initDatabase();
    const conn = sutando.connection();
    const { staffId } = req.params;

    // 1. Fetch Staff Info
    const [staffRows] = await conn.raw(`SELECT * FROM staff WHERE id = ?`, [staffId]);
    if (staffRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Staff member not found.' });
    }
    const staff = staffRows[0];

    // 2. Fetch all system menus with Category Defaults AND Staff Specific Overrides
    const [menus] = await conn.raw(`
      SELECT 
        sm.menu_key,
        sm.label,
        sm.description,
        sm.category,
        sm.icon,
        sm.route_path,
        sm.display_order,
        
        -- Category default permissions
        COALESCE(rmp.can_view, 0) as role_can_view,
        COALESCE(rmp.can_create, 0) as role_can_create,
        COALESCE(rmp.can_edit, 0) as role_can_edit,
        COALESCE(rmp.can_delete, 0) as role_can_delete,
        
        -- Specific Staff Override if set
        smp.is_granted as staff_is_granted,
        smp.can_view as staff_can_view,
        smp.can_create as staff_can_create,
        smp.can_edit as staff_can_edit,
        smp.can_delete as staff_can_delete
      FROM system_menus sm
      LEFT JOIN role_menu_permissions rmp 
        ON sm.menu_key = rmp.menu_key 
        AND rmp.branch_id = ? 
        AND rmp.target_type = ?
      LEFT JOIN staff_menu_permissions smp 
        ON sm.menu_key = smp.menu_key 
        AND smp.staff_id = ?
      WHERE sm.is_active = 1
      ORDER BY sm.display_order ASC
    `, [staff.branch_id || 1, staff.staff_type, staff.id]);

    // Calculate effective access state:
    // 'inherited' (no staff override, follows role)
    // 'granted' (explicit staff override allowing access)
    // 'revoked' (explicit staff override blocking access)
    const effectiveMenus = menus.map(m => {
      const hasStaffOverride = m.staff_is_granted !== null && m.staff_is_granted !== undefined;
      let effectiveState = 'inherited';
      let effectiveCanView = Boolean(m.role_can_view);
      let effectiveCanCreate = Boolean(m.role_can_create);
      let effectiveCanEdit = Boolean(m.role_can_edit);
      let effectiveCanDelete = Boolean(m.role_can_delete);

      if (hasStaffOverride) {
        if (m.staff_is_granted === 1) {
          effectiveState = 'granted';
          effectiveCanView = Boolean(m.staff_can_view);
          effectiveCanCreate = Boolean(m.staff_can_create);
          effectiveCanEdit = Boolean(m.staff_can_edit);
          effectiveCanDelete = Boolean(m.staff_can_delete);
        } else {
          effectiveState = 'revoked';
          effectiveCanView = false;
          effectiveCanCreate = false;
          effectiveCanEdit = false;
          effectiveCanDelete = false;
        }
      }

      return {
        ...m,
        override_state: effectiveState, // 'inherited', 'granted', 'revoked'
        effective_can_view: effectiveCanView,
        effective_can_create: effectiveCanCreate,
        effective_can_edit: effectiveCanEdit,
        effective_can_delete: effectiveCanDelete
      };
    });

    res.json({
      success: true,
      staff: {
        id: staff.id,
        staff_code: staff.staff_code,
        name: `${staff.first_name} ${staff.last_name || ''}`.trim(),
        staff_type: staff.staff_type,
        department: staff.department,
        designation: staff.designation
      },
      data: effectiveMenus
    });
  } catch (error) {
    console.error('[getStaffMenuPermissions Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Save Staff Specific Overrides
export const updateStaffMenuPermissions = async (req, res) => {
  try {
    const sutando = initDatabase();
    const conn = sutando.connection();
    const { staffId } = req.params;
    const { overrides = [] } = req.body;

    // Remove existing overrides for this staff member
    await conn.raw(`DELETE FROM staff_menu_permissions WHERE staff_id = ?`, [staffId]);

    // Insert new explicit overrides
    for (const ov of overrides) {
      // If override_state is 'inherited', we don't save an override record (it automatically falls back to category defaults)
      if (ov.override_state === 'granted') {
        await conn.raw(`
          INSERT INTO staff_menu_permissions (staff_id, menu_key, is_granted, can_view, can_create, can_edit, can_delete)
          VALUES (?, ?, 1, ?, ?, ?, ?)
        `, [
          staffId,
          ov.menu_key,
          ov.can_view ? 1 : 0,
          ov.can_create ? 1 : 0,
          ov.can_edit ? 1 : 0,
          ov.can_delete ? 1 : 0
        ]);
      } else if (ov.override_state === 'revoked') {
        await conn.raw(`
          INSERT INTO staff_menu_permissions (staff_id, menu_key, is_granted, can_view, can_create, can_edit, can_delete)
          VALUES (?, ?, 0, 0, 0, 0, 0)
        `, [staffId, ov.menu_key]);
      }
    }

    res.json({ success: true, message: 'Staff permissions updated successfully.' });
  } catch (error) {
    console.error('[updateStaffMenuPermissions Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
