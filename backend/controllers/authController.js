import { sutando } from '../config/database.js';

export const authController = {
  // POST /api/auth/login
  async login(req, res, next) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username / Email / Admission No and Password are required.'
        });
      }

      const trimmedUser = username.trim();
      const trimmedPass = password.trim();

      // Check users table by email, admin alias, name, OR through joined student admission_number / admission_no / roll_number
      const isPlainAdmin = trimmedUser.toLowerCase() === 'admin';
      const [users] = await sutando.connection().raw(`
        SELECT 
          u.id, 
          u.name, 
          u.email, 
          u.password, 
          u.role_id, 
          u.branch_id,
          u.status,
          r.name AS role_name,
          s.id AS student_id,
          COALESCE(s.admission_no, s.admission_number) AS admission_number,
          s.admission_no,
          s.roll_number,
          s.class_id,
          s.section_id,
          COALESCE(s.first_name, u.name) AS first_name,
          s.last_name,
          s.gender,
          COALESCE(s.dob, s.date_of_birth) AS dob,
          s.parent_name,
          s.parent_phone,
          s.parent_email,
          s.address,
          COALESCE(c.name, c.class_name) AS class_name,
          COALESCE(sec.name, sec.section_name) AS section_name,
          b.branch_name,
          b.branch_code
        FROM users u
        LEFT JOIN roles r ON r.id = u.role_id
        LEFT JOIN students s ON s.user_id = u.id
        LEFT JOIN classes c ON c.id = s.class_id
        LEFT JOIN sections sec ON sec.id = s.section_id
        LEFT JOIN branches b ON b.id = u.branch_id
        WHERE (
          LOWER(u.email) = LOWER(?)
          OR (? = 1 AND u.id = 1)
          OR LOWER(u.name) = LOWER(?)
          OR LOWER(COALESCE(s.admission_no, '')) = LOWER(?)
          OR LOWER(COALESCE(s.admission_number, '')) = LOWER(?)
          OR (s.roll_number = ? AND u.role_id = 4)
        )
        LIMIT 1
      `, [trimmedUser, isPlainAdmin ? 1 : 0, trimmedUser, trimmedUser, trimmedUser, trimmedUser]);

      if (!users || users.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid user credentials. Account not found.'
        });
      }

      const user = users[0];

      // Check user status
      if (user.status && user.status.toLowerCase() === 'inactive') {
        return res.status(403).json({
          success: false,
          message: 'This user account is inactive. Please contact your school administrator.'
        });
      }

      // Password verification:
      // Matches users.password directly OR admission_no OR standard passwords (student123, School@123, admin123)
      const isPasswordMatch = 
        user.password === trimmedPass || 
        (user.admission_number && user.admission_number.toLowerCase() === trimmedPass.toLowerCase()) ||
        (user.admission_no && user.admission_no.toLowerCase() === trimmedPass.toLowerCase()) ||
        (user.role_id === 4 && (trimmedPass === 'student123' || trimmedPass === 'School@123')) ||
        (user.role_id === 1 && (trimmedPass === 'admin123' || trimmedPass === 'School@123'));

      if (!isPasswordMatch) {
        return res.status(401).json({
          success: false,
          message: 'Incorrect password. Please try again.'
        });
      }

      // Map role_id to client role key
      let roleKey = 'super_admin';
      if (user.role_id === 1) {
        roleKey = 'super_admin';
      } else if (user.role_id === 2) {
        roleKey = 'principal';
      } else if (user.role_id === 4) {
        roleKey = 'student';
      } else {
        roleKey = user.role_name ? user.role_name.toLowerCase().replace(/\s+/g, '_') : 'user';
      }

      // Build safe user profile payload
      const authPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
        role: roleKey,
        role_name: user.role_name,
        branch_id: user.branch_id,
        branch_name: user.branch_name,
        branch_code: user.branch_code,
        student: user.student_id ? {
          id: user.student_id,
          admission_number: user.admission_number,
          roll_number: user.roll_number,
          first_name: user.first_name,
          last_name: user.last_name,
          class_id: user.class_id,
          class_name: user.class_name,
          section_id: user.section_id,
          section_name: user.section_name,
          dob: user.dob,
          gender: user.gender,
          parent_name: user.parent_name,
          parent_phone: user.parent_phone,
          parent_email: user.parent_email,
          address: user.address,
        } : {
          id: 1,
          admission_number: 'ADM-ADMIN-PREVIEW',
          roll_number: '001',
          first_name: user.name,
          last_name: '(Admin Mode)',
          class_name: 'Administration',
          section_name: 'Staff Preview',
          dob: '2000-01-01',
          gender: 'Not Specified',
          parent_name: 'Administrative Office',
          parent_phone: '+91 9876543210',
          parent_email: user.email,
          address: 'Main Campus Admin Block',
        }
      };

      return res.json({
        success: true,
        message: `Welcome back, ${user.name}!`,
        user: authPayload,
        token: `auth_token_${user.id}_${Date.now()}` // Client session token
      });
    } catch (err) {
      console.error('[AuthController.login] Error:', err);
      next(err);
    }
  },

  // GET /api/auth/me
  async me(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      const userId = req.query.user_id;

      if (!userId && !authHeader) {
        return res.status(401).json({
          success: false,
          message: 'Not authenticated'
        });
      }

      const targetId = userId || (authHeader ? authHeader.split('_')[2] : null);

      if (!targetId) {
        return res.status(401).json({
          success: false,
          message: 'Invalid session token'
        });
      }

      const [users] = await sutando.connection().raw(`
        SELECT 
          u.id, 
          u.name, 
          u.email, 
          u.role_id, 
          u.branch_id,
          u.status,
          r.name AS role_name,
          s.id AS student_id,
          COALESCE(s.admission_number, s.admission_no) AS admission_number,
          s.admission_no,
          s.roll_number,
          s.class_id,
          s.section_id,
          s.first_name,
          s.last_name,
          s.gender,
          s.dob,
          s.date_of_birth,
          s.parent_name,
          s.parent_phone,
          s.parent_email,
          s.address,
          COALESCE(c.name, c.class_name) AS class_name,
          COALESCE(sec.name, sec.section_name) AS section_name,
          b.branch_name,
          b.branch_code
        FROM users u
        LEFT JOIN roles r ON r.id = u.role_id
        LEFT JOIN students s ON s.user_id = u.id
        LEFT JOIN classes c ON c.id = s.class_id
        LEFT JOIN sections sec ON sec.id = s.section_id
        LEFT JOIN branches b ON b.id = u.branch_id
        WHERE u.id = ?
        LIMIT 1
      `, [targetId]);

      if (!users || users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User session expired or user not found.'
        });
      }

      const user = users[0];
      let roleKey = 'super_admin';
      if (user.role_id === 1) roleKey = 'super_admin';
      else if (user.role_id === 2) roleKey = 'principal';
      else if (user.role_id === 4) roleKey = 'student';
      else roleKey = user.role_name ? user.role_name.toLowerCase().replace(/\s+/g, '_') : 'user';

      return res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role_id: user.role_id,
          role: roleKey,
          role_name: user.role_name,
          branch_id: user.branch_id,
          branch_name: user.branch_name,
          branch_code: user.branch_code,
          student: user.student_id ? {
            id: user.student_id,
            admission_number: user.admission_number,
            roll_number: user.roll_number,
            first_name: user.first_name,
            last_name: user.last_name,
            class_id: user.class_id,
            class_name: user.class_name,
            section_id: user.section_id,
            section_name: user.section_name,
            dob: user.dob || user.date_of_birth,
            gender: user.gender,
            parent_name: user.parent_name,
            parent_phone: user.parent_phone,
            parent_email: user.parent_email,
            address: user.address,
          } : null
        }
      });
    } catch (err) {
      next(err);
    }
  }
};
