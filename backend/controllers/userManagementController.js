import { sutando } from '../config/database.js';

export const userManagementController = {
  // GET /api/admin/users
  async getUsers(req, res, next) {
    try {
      const { role_id, branch_id, search, status } = req.query;

      let query = `
        SELECT 
          u.id,
          u.name,
          u.email,
          u.role_id,
          r.name AS role_name,
          u.branch_id,
          COALESCE(b.branch_name, 'All Campuses') AS branch_name,
          b.branch_code,
          u.status,
          u.created_at,
          u.updated_at
        FROM users u
        LEFT JOIN roles r ON r.id = u.role_id
        LEFT JOIN branches b ON b.id = u.branch_id
        WHERE u.role_id IN (1, 2, 3, 6) -- Administrative & Staff roles (Super Admin, Branch Admin, Teacher, Accountant)
      `;

      const params = [];

      if (role_id) {
        query += ` AND u.role_id = ?`;
        params.push(role_id);
      }

      if (branch_id && branch_id !== 'all') {
        query += ` AND (u.branch_id = ? OR (u.role_id = 1 AND ? = 'all'))`;
        params.push(branch_id, branch_id);
      }

      if (status) {
        query += ` AND u.status = ?`;
        params.push(status);
      }

      if (search) {
        query += ` AND (u.name LIKE ? OR u.email LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
      }

      query += ` ORDER BY u.id DESC`;

      const [users] = await sutando.connection().raw(query, params);

      // Fetch summary statistics scoped by branch if specified
      let statsQuery = `
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN role_id = 1 THEN 1 ELSE 0 END) as super_admins,
          SUM(CASE WHEN role_id = 2 THEN 1 ELSE 0 END) as branch_admins,
          SUM(CASE WHEN role_id = 6 THEN 1 ELSE 0 END) as accountants,
          SUM(CASE WHEN role_id = 3 THEN 1 ELSE 0 END) as teachers,
          SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active_count
        FROM users
        WHERE role_id IN (1, 2, 3, 6)
      `;
      const statsParams = [];
      if (branch_id && branch_id !== 'all') {
        statsQuery += ` AND (branch_id = ?)`;
        statsParams.push(branch_id);
      }

      const [stats] = await sutando.connection().raw(statsQuery, statsParams);

      return res.json({
        success: true,
        data: users,
        stats: stats[0] || {}
      });
    } catch (err) {
      console.error('[UserManagementController.getUsers] Error:', err);
      next(err);
    }
  },

  // POST /api/admin/users
  async createUser(req, res, next) {
    try {
      const { name, email, password, role_id, branch_id, status = 'Active' } = req.body;

      if (!name || !email || !password || !role_id) {
        return res.status(400).json({
          success: false,
          message: 'Full Name, Email, Password, and Role are required.'
        });
      }

      const trimmedEmail = email.trim().toLowerCase();
      const trimmedName = name.trim();
      const trimmedPass = password.trim();
      const roleIdNum = Number(role_id);

      // Super Admin (1), Branch Admin / Principal (2), Accountant (6)
      const allowedRoles = [1, 2, 6];
      if (!allowedRoles.includes(roleIdNum)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role selected. Only administrative roles can be created here.'
        });
      }

      // Check if email already exists
      const [existing] = await sutando.connection().raw(
        'SELECT id FROM users WHERE LOWER(email) = ? LIMIT 1',
        [trimmedEmail]
      );

      if (existing && existing.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'A user account with this email address already exists.'
        });
      }

      // If Super Admin, branch_id is either null or 1
      const effectiveBranchId = roleIdNum === 1 ? null : (branch_id ? Number(branch_id) : 1);

      const [result] = await sutando.connection().raw(`
        INSERT INTO users (name, email, password, role_id, branch_id, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [trimmedName, trimmedEmail, trimmedPass, roleIdNum, effectiveBranchId, status]);

      return res.status(201).json({
        success: true,
        message: 'Administrative user created successfully!',
        userId: result.insertId
      });
    } catch (err) {
      console.error('[UserManagementController.createUser] Error:', err);
      next(err);
    }
  },

  // PUT /api/admin/users/:id
  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { name, email, role_id, branch_id, status } = req.body;

      // Check if user exists
      const [existing] = await sutando.connection().raw(
        'SELECT id, role_id FROM users WHERE id = ?',
        [id]
      );

      if (!existing || existing.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found.'
        });
      }

      // Check email uniqueness if email updated
      if (email) {
        const [conflict] = await sutando.connection().raw(
          'SELECT id FROM users WHERE LOWER(email) = ? AND id != ? LIMIT 1',
          [email.trim().toLowerCase(), id]
        );
        if (conflict && conflict.length > 0) {
          return res.status(409).json({
            success: false,
            message: 'Email address is already in use by another user.'
          });
        }
      }

      const roleIdNum = role_id ? Number(role_id) : existing[0].role_id;
      const effectiveBranchId = roleIdNum === 1 ? null : (branch_id ? Number(branch_id) : null);

      await sutando.connection().raw(`
        UPDATE users
        SET 
          name = COALESCE(?, name),
          email = COALESCE(?, email),
          role_id = COALESCE(?, role_id),
          branch_id = ?,
          status = COALESCE(?, status),
          updated_at = NOW()
        WHERE id = ?
      `, [
        name ? name.trim() : null,
        email ? email.trim().toLowerCase() : null,
        roleIdNum,
        effectiveBranchId,
        status,
        id
      ]);

      return res.json({
        success: true,
        message: 'User updated successfully!'
      });
    } catch (err) {
      console.error('[UserManagementController.updateUser] Error:', err);
      next(err);
    }
  },

  // PATCH /api/admin/users/:id/password
  async resetPassword(req, res, next) {
    try {
      const { id } = req.params;
      const { password } = req.body;

      if (!password || password.trim().length < 4) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 4 characters long.'
        });
      }

      await sutando.connection().raw(`
        UPDATE users
        SET password = ?, updated_at = NOW()
        WHERE id = ?
      `, [password.trim(), id]);

      return res.json({
        success: true,
        message: 'User password reset successfully!'
      });
    } catch (err) {
      console.error('[UserManagementController.resetPassword] Error:', err);
      next(err);
    }
  },

  // DELETE /api/admin/users/:id
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      // Prevent deleting the primary super administrator (id: 1)
      if (Number(id) === 1) {
        return res.status(403).json({
          success: false,
          message: 'Primary System Administrator cannot be deleted.'
        });
      }

      await sutando.connection().raw('DELETE FROM users WHERE id = ?', [id]);

      return res.json({
        success: true,
        message: 'User removed successfully.'
      });
    } catch (err) {
      console.error('[UserManagementController.deleteUser] Error:', err);
      next(err);
    }
  }
};
