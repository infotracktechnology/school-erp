import { initDatabase } from '../config/database.js';

export const getStaffList = async (req, res) => {
  try {
    const sutando = initDatabase();
    const conn = sutando.connection();

    const {
      branch_id,
      staff_type, // 'Teaching', 'Non-Teaching'
      department,
      status,
      search,
      page = 1,
      limit = 50
    } = req.query;

    let query = `
      SELECT 
        s.*,
        b.branch_name,
        r.name as role_name,
        u.email as login_username
      FROM staff s
      LEFT JOIN branches b ON s.branch_id = b.id
      LEFT JOIN roles r ON s.role_id = r.id
      LEFT JOIN users u ON s.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (branch_id) {
      query += ` AND s.branch_id = ?`;
      params.push(branch_id);
    }
    if (staff_type && staff_type !== 'All') {
      query += ` AND s.staff_type = ?`;
      params.push(staff_type);
    }
    if (department && department !== 'All') {
      query += ` AND s.department = ?`;
      params.push(department);
    }
    if (status && status !== 'All') {
      query += ` AND s.status = ?`;
      params.push(status);
    }
    if (search && search.trim()) {
      query += ` AND (
        s.first_name LIKE ? OR 
        s.last_name LIKE ? OR 
        s.staff_code LIKE ? OR 
        s.mobile LIKE ? OR 
        s.designation LIKE ? OR
        s.qualification LIKE ?
      )`;
      const sTerm = `%${search.trim()}%`;
      params.push(sTerm, sTerm, sTerm, sTerm, sTerm, sTerm);
    }

    query += ` ORDER BY s.staff_type ASC, s.first_name ASC`;

    const [staffRows] = await conn.raw(query, params);

    // If there are staff rows, attach their academic roles from staff_allocations
    if (staffRows.length > 0) {
      const staffIds = staffRows.map(st => st.id);
      const placeholders = staffIds.map(() => '?').join(',');

      const [allocations] = await conn.raw(`
        SELECT 
          sa.*,
          c.class_name,
          sec.section_name,
          sub.name as subject_name
        FROM staff_allocations sa
        LEFT JOIN classes c ON sa.class_id = c.id
        LEFT JOIN sections sec ON sa.section_id = sec.id
        LEFT JOIN subjects sub ON sa.subject_id = sub.id
        WHERE sa.staff_id IN (${placeholders})
        ORDER BY sa.allocation_type ASC
      `, staffIds);

      // Group allocations by staff_id
      const allocMap = {};
      for (const a of allocations) {
        if (!allocMap[a.staff_id]) allocMap[a.staff_id] = [];
        allocMap[a.staff_id].push(a);
      }

      staffRows.forEach(st => {
        st.allocations = allocMap[st.id] || [];
        st.class_teacher_for = st.allocations
          .filter(a => a.allocation_type === 'Class Teacher')
          .map(a => `${a.class_name || 'Class ' + a.class_id} - ${a.section_name || ''}`);
        st.asst_class_teacher_for = st.allocations
          .filter(a => a.allocation_type === 'Assistant Class Teacher')
          .map(a => `${a.class_name || 'Class ' + a.class_id} - ${a.section_name || ''}`);
        st.coordinator_for = st.allocations
          .filter(a => a.allocation_type === 'Class Coordinator')
          .map(a => `${a.class_name || 'Class ' + a.class_id}`);
        st.subjects_taught = st.allocations
          .filter(a => a.allocation_type === 'Subject Teacher')
          .map(a => `${a.subject_name || 'Subject'} (${a.class_name || ''}-${a.section_name || ''})`);
      });
    }

    // Counts by staff_type
    let statsQuery = `
      SELECT 
        COUNT(*) as total_staff,
        SUM(CASE WHEN staff_type = 'Teaching' THEN 1 ELSE 0 END) as teaching_staff,
        SUM(CASE WHEN staff_type = 'Non-Teaching' THEN 1 ELSE 0 END) as non_teaching_staff,
        SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active_staff
      FROM staff WHERE 1=1
    `;
    const statsParams = [];
    if (branch_id) {
      statsQuery += ` AND branch_id = ?`;
      statsParams.push(branch_id);
    }
    const [statsRows] = await conn.raw(statsQuery, statsParams);

    res.json({
      success: true,
      stats: statsRows[0] || { total_staff: 0, teaching_staff: 0, non_teaching_staff: 0, active_staff: 0 },
      data: staffRows
    });
  } catch (error) {
    console.error('[getStaffList Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createStaff = async (req, res) => {
  try {
    const sutando = initDatabase();
    const conn = sutando.connection();

    const {
      branch_id = 1,
      staff_code,
      first_name,
      last_name,
      staff_type = 'Teaching',
      department,
      designation,
      gender,
      date_of_birth,
      date_of_joining,
      mobile,
      alternate_phone,
      email,
      blood_group,
      aadhaar_number,
      qualification,
      experience_years = 0,
      employment_type = 'Permanent',
      status = 'Active',
      address_line,
      city,
      pincode,
      bank_name,
      bank_account_number,
      ifsc_code,
      pan_number,
      // ERP User Login Creation Fields
      create_login = false,
      login_role_id = 3,
      login_email,
      login_password,
      // Direct Menu Access Overrides
      custom_menu_permissions = []
    } = req.body;

    if (!first_name || !mobile || !department || !designation) {
      return res.status(400).json({ success: false, message: 'First name, mobile, department, and designation are required.' });
    }

    // Auto-generate staff_code if not supplied
    let finalCode = staff_code;
    if (!finalCode) {
      const prefix = staff_type === 'Teaching' ? 'TCH' : 'NT';
      const [maxCode] = await conn.raw(`SELECT COUNT(*) as cnt FROM staff WHERE staff_type = ?`, [staff_type]);
      finalCode = `${prefix}-${String((maxCode[0]?.cnt || 0) + 1).padStart(3, '0')}`;
    }

    const [result] = await conn.raw(`
      INSERT INTO staff (
        branch_id, staff_code, first_name, last_name, staff_type, department, designation,
        gender, date_of_birth, date_of_joining, mobile, alternate_phone, email,
        blood_group, aadhaar_number, qualification, experience_years, employment_type,
        status, address_line, city, pincode, bank_name, bank_account_number, ifsc_code, pan_number
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      branch_id, finalCode, first_name, last_name || null, staff_type, department, designation,
      gender || 'Other', date_of_birth || null, date_of_joining || new Date().toISOString().slice(0, 10),
      mobile, alternate_phone || null, email || null,
      blood_group || null, aadhaar_number || null, qualification || null, experience_years || 0,
      employment_type, status, address_line || null, city || null, pincode || null,
      bank_name || null, bank_account_number || null, ifsc_code || null, pan_number || null
    ]);

    const newStaffId = result.insertId;
    let createdUserId = null;

    // Optional: Create ERP User Login Account
    if (create_login) {
      const userEmail = (login_email && login_email.trim()) ? login_email.trim() : email || `${finalCode.toLowerCase()}@school.edu`;
      const plainPassword = login_password || 'School@123';
      const fullName = `${first_name} ${last_name || ''}`.trim();

      const [userResult] = await conn.raw(`
        INSERT INTO users (name, email, password, role_id, branch_id, staff_id, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, 'active', NOW(), NOW())
      `, [fullName, userEmail, plainPassword, login_role_id || 3, branch_id, newStaffId]);

      createdUserId = userResult.insertId;

      // Link user_id and role_id back on staff table
      await conn.raw(`UPDATE staff SET user_id = ?, role_id = ? WHERE id = ?`, [createdUserId, login_role_id, newStaffId]);
    }

    // Optional: Direct Menu Access Permissions
    if (custom_menu_permissions && custom_menu_permissions.length > 0) {
      for (const cp of custom_menu_permissions) {
        if (cp.menu_key) {
          await conn.raw(`
            INSERT INTO staff_menu_permissions (staff_id, menu_key, is_granted, can_view, can_create, can_edit, can_delete)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
              is_granted = VALUES(is_granted),
              can_view = VALUES(can_view),
              can_create = VALUES(can_create),
              can_edit = VALUES(can_edit),
              can_delete = VALUES(can_delete)
          `, [
            newStaffId,
            cp.menu_key,
            cp.is_granted !== undefined ? (cp.is_granted ? 1 : 0) : 1,
            cp.can_view ? 1 : 0,
            cp.can_create ? 1 : 0,
            cp.can_edit ? 1 : 0,
            cp.can_delete ? 1 : 0
          ]);
        }
      }
    }

    res.status(201).json({
      success: true,
      message: 'Staff member created successfully.' + (createdUserId ? ' ERP User Account also created.' : ''),
      staff_id: newStaffId,
      staff_code: finalCode,
      user_id: createdUserId
    });
  } catch (error) {
    console.error('[createStaff Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const sutando = initDatabase();
    const conn = sutando.connection();
    const { id } = req.params;

    const fields = [
      'first_name', 'last_name', 'staff_type', 'department', 'designation',
      'gender', 'date_of_birth', 'date_of_joining', 'mobile', 'alternate_phone', 'email',
      'blood_group', 'aadhaar_number', 'qualification', 'experience_years', 'employment_type',
      'status', 'address_line', 'city', 'pincode', 'bank_name', 'bank_account_number', 'ifsc_code', 'pan_number'
    ];

    const updates = [];
    const params = [];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`);
        params.push(req.body[field]);
      }
    });

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields provided for update.' });
    }

    params.push(id);
    await conn.raw(`UPDATE staff SET ${updates.join(', ')} WHERE id = ?`, params);

    res.json({ success: true, message: 'Staff updated successfully.' });
  } catch (error) {
    console.error('[updateStaff Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const sutando = initDatabase();
    const conn = sutando.connection();
    const { id } = req.params;

    await conn.raw(`DELETE FROM staff WHERE id = ?`, [id]);
    res.json({ success: true, message: 'Staff deleted successfully.' });
  } catch (error) {
    console.error('[deleteStaff Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllocations = async (req, res) => {
  try {
    const sutando = initDatabase();
    const conn = sutando.connection();
    const { branch_id = 1, class_id, section_id, allocation_type } = req.query;

    let query = `
      SELECT 
        sa.*,
        s.first_name,
        s.last_name,
        s.staff_code,
        s.department,
        s.designation,
        c.class_name,
        sec.section_name,
        sub.name as subject_name
      FROM staff_allocations sa
      JOIN staff s ON sa.staff_id = s.id
      LEFT JOIN classes c ON sa.class_id = c.id
      LEFT JOIN sections sec ON sa.section_id = sec.id
      LEFT JOIN subjects sub ON sa.subject_id = sub.id
      WHERE 1=1
    `;
    const params = [];

    if (branch_id) {
      query += ` AND sa.branch_id = ?`;
      params.push(branch_id);
    }
    if (class_id) {
      query += ` AND sa.class_id = ?`;
      params.push(class_id);
    }
    if (section_id) {
      query += ` AND sa.section_id = ?`;
      params.push(section_id);
    }
    if (allocation_type) {
      query += ` AND sa.allocation_type = ?`;
      params.push(allocation_type);
    }

    query += ` ORDER BY c.numeric_value ASC, sec.section_name ASC, sa.allocation_type ASC`;

    const [rows] = await conn.raw(query, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('[getAllocations Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createOrUpdateAllocation = async (req, res) => {
  try {
    const sutando = initDatabase();
    const conn = sutando.connection();
    const {
      branch_id = 1,
      academic_year_id = 2,
      staff_id,
      allocation_type, // 'Class Teacher', 'Assistant Class Teacher', 'Class Coordinator', 'Subject Teacher'
      class_id,
      section_id = null,
      subject_id = null,
      weekly_periods = 0
    } = req.body;

    if (!staff_id || !allocation_type || !class_id) {
      return res.status(400).json({ success: false, message: 'staff_id, allocation_type, and class_id are required.' });
    }

    // For Class Teacher and Assistant Class Teacher, each section can only have one primary teacher
    if (allocation_type === 'Class Teacher' || allocation_type === 'Assistant Class Teacher') {
      if (!section_id) {
        return res.status(400).json({ success: false, message: 'Section is required for Class Teacher allocation.' });
      }
      // Replace existing allocation for this section if exists
      await conn.raw(`
        DELETE FROM staff_allocations 
        WHERE branch_id = ? AND academic_year_id = ? AND class_id = ? AND section_id = ? AND allocation_type = ?
      `, [branch_id, academic_year_id, class_id, section_id, allocation_type]);
    }

    if (allocation_type === 'Class Coordinator') {
      // One coordinator per class
      await conn.raw(`
        DELETE FROM staff_allocations 
        WHERE branch_id = ? AND academic_year_id = ? AND class_id = ? AND allocation_type = 'Class Coordinator'
      `, [branch_id, academic_year_id, class_id]);
    }

    const [insertResult] = await conn.raw(`
      INSERT INTO staff_allocations (branch_id, academic_year_id, staff_id, allocation_type, class_id, section_id, subject_id, weekly_periods)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [branch_id, academic_year_id, staff_id, allocation_type, class_id, section_id, subject_id, weekly_periods]);

    res.status(201).json({ success: true, message: 'Academic allocation saved.', id: insertResult.insertId });
  } catch (error) {
    console.error('[createOrUpdateAllocation Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAllocation = async (req, res) => {
  try {
    const sutando = initDatabase();
    const conn = sutando.connection();
    const { id } = req.params;

    await conn.raw(`DELETE FROM staff_allocations WHERE id = ?`, [id]);
    res.json({ success: true, message: 'Allocation removed successfully.' });
  } catch (error) {
    console.error('[deleteAllocation Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWorkloadSummary = async (req, res) => {
  try {
    const sutando = initDatabase();
    const conn = sutando.connection();
    const { branch_id = 1 } = req.query;

    const [teachers] = await conn.raw(`
      SELECT 
        s.id,
        s.staff_code,
        s.first_name,
        s.last_name,
        s.department,
        s.designation,
        COUNT(sa.id) as total_assignments,
        SUM(CASE WHEN sa.allocation_type = 'Class Teacher' THEN 1 ELSE 0 END) as is_class_teacher,
        SUM(CASE WHEN sa.allocation_type = 'Assistant Class Teacher' THEN 1 ELSE 0 END) as is_asst_class_teacher,
        SUM(CASE WHEN sa.allocation_type = 'Class Coordinator' THEN 1 ELSE 0 END) as is_coordinator,
        SUM(CASE WHEN sa.allocation_type = 'Subject Teacher' THEN 1 ELSE 0 END) as subjects_count,
        COALESCE(SUM(sa.weekly_periods), 0) as total_weekly_periods
      FROM staff s
      LEFT JOIN staff_allocations sa ON s.id = sa.staff_id
      WHERE s.staff_type = 'Teaching' AND s.branch_id = ? AND s.status = 'Active'
      GROUP BY s.id
      ORDER BY total_weekly_periods DESC, s.first_name ASC
    `, [branch_id]);

    res.json({ success: true, data: teachers });
  } catch (error) {
    console.error('[getWorkloadSummary Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update credentials for a single staff member
export const updateStaffCredentials = async (req, res) => {
  try {
    const sutando = initDatabase();
    const conn = sutando.connection();
    const { id } = req.params;
    const { username, password, role_id } = req.body;

    const [staffRows] = await conn.raw(`SELECT * FROM staff WHERE id = ?`, [id]);
    if (!staffRows || staffRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Staff member not found.' });
    }
    const staff = staffRows[0];

    // Check if user account already linked
    let userId = staff.user_id;
    if (!userId) {
      const [userRows] = await conn.raw(`SELECT id FROM users WHERE staff_id = ?`, [id]);
      if (userRows && userRows.length > 0) userId = userRows[0].id;
    }

    const finalRoleId = role_id ? parseInt(role_id, 10) : (staff.role_id || 9);
    const finalUsername = username ? username.trim() : (staff.email || `${staff.staff_code || 'staff'}@school.edu`);
    const finalPassword = password ? password.trim() : 'School@123';

    if (userId) {
      await conn.raw(`
        UPDATE users SET 
          email = ?, 
          password = ?, 
          role_id = ?,
          name = ?
        WHERE id = ?
      `, [finalUsername, finalPassword, finalRoleId, `${staff.first_name} ${staff.last_name || ''}`.trim(), userId]);
    } else {
      const [userResult] = await conn.raw(`
        INSERT INTO users (branch_id, name, email, password, role_id, staff_id, status)
        VALUES (?, ?, ?, ?, ?, ?, 'Active')
      `, [staff.branch_id || 1, `${staff.first_name} ${staff.last_name || ''}`.trim(), finalUsername, finalPassword, finalRoleId, staff.id]);
      userId = userResult.insertId;
    }

    await conn.raw(`UPDATE staff SET user_id = ?, role_id = ? WHERE id = ?`, [userId, finalRoleId, id]);

    res.json({
      success: true,
      message: 'Credentials updated successfully.',
      data: { staff_id: id, user_id: userId, username: finalUsername, role_id: finalRoleId }
    });
  } catch (error) {
    console.error('[updateStaffCredentials Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Bulk update credentials for multiple staff members
export const bulkUpdateStaffCredentials = async (req, res) => {
  try {
    const sutando = initDatabase();
    const conn = sutando.connection();
    const { staff_ids = [], password_pattern = 'mobile', custom_password = '', username_pattern = 'keep', role_id } = req.body;

    if (!Array.isArray(staff_ids) || staff_ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select at least one staff member.' });
    }

    let updatedCount = 0;
    for (const sId of staff_ids) {
      const [staffRows] = await conn.raw(`SELECT * FROM staff WHERE id = ?`, [sId]);
      if (!staffRows || staffRows.length === 0) continue;
      const staff = staffRows[0];

      // Determine password
      let pwd = 'School@123';
      if (password_pattern === 'mobile' && staff.mobile) {
        pwd = String(staff.mobile).trim();
      } else if (password_pattern === 'dob' && staff.date_of_birth) {
        // DOB format DDMMYYYY
        const d = new Date(staff.date_of_birth);
        if (!isNaN(d.getTime())) {
          const day = String(d.getDate()).padStart(2, '0');
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const year = d.getFullYear();
          pwd = `${day}${month}${year}`;
        }
      } else if (password_pattern === 'custom' && custom_password) {
        pwd = custom_password.trim();
      } else if (password_pattern === 'default') {
        pwd = 'School@123';
      }

      // Determine username
      let username = staff.email ? staff.email.trim() : `${staff.staff_code || 'staff'}@school.edu`;
      if (username_pattern === 'email' && staff.email) {
        username = staff.email.trim();
      } else if (username_pattern === 'code' && staff.staff_code) {
        username = staff.staff_code.trim();
      } else if (username_pattern === 'mobile' && staff.mobile) {
        username = String(staff.mobile).trim();
      }

      const targetRoleId = role_id ? parseInt(role_id, 10) : (staff.role_id || 9);

      // Check if user exists
      let userId = staff.user_id;
      if (!userId) {
        const [userRows] = await conn.raw(`SELECT id FROM users WHERE staff_id = ?`, [sId]);
        if (userRows && userRows.length > 0) userId = userRows[0].id;
      }

      if (userId) {
        let updateSql = `UPDATE users SET password = ?`;
        const updateParams = [pwd];
        if (username_pattern !== 'keep') {
          updateSql += `, email = ?`;
          updateParams.push(username);
        }
        if (role_id) {
          updateSql += `, role_id = ?`;
          updateParams.push(targetRoleId);
        }
        updateSql += ` WHERE id = ?`;
        updateParams.push(userId);
        await conn.raw(updateSql, updateParams);
      } else {
        const [userResult] = await conn.raw(`
          INSERT INTO users (branch_id, name, email, password, role_id, staff_id, status)
          VALUES (?, ?, ?, ?, ?, ?, 'Active')
        `, [staff.branch_id || 1, `${staff.first_name} ${staff.last_name || ''}`.trim(), username, pwd, targetRoleId, staff.id]);
        userId = userResult.insertId;
      }

      await conn.raw(`UPDATE staff SET user_id = ?, role_id = ? WHERE id = ?`, [userId, targetRoleId, sId]);
      updatedCount++;
    }

    res.json({
      success: true,
      message: `Credentials successfully updated for ${updatedCount} staff member(s).`
    });
  } catch (error) {
    console.error('[bulkUpdateStaffCredentials Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
