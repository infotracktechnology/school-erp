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

      // Step 1: Check if input matches an existing user account in `users`
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

      let user = users && users.length > 0 ? users[0] : null;

      // Step 2: If not found in users, check `students` table directly by admission_no / admission_number
      if (!user) {
        const [studentRows] = await sutando.connection().raw(`
          SELECT 
            s.id AS student_id,
            COALESCE(s.user_id, s.id + 1000) AS id,
            COALESCE(CONCAT(COALESCE(s.first_name, ''), ' ', COALESCE(s.last_name, '')), 'Student') AS name,
            COALESCE(s.parent_email, CONCAT('student.', LOWER(COALESCE(s.admission_no, s.admission_number)), '@campuseye.edu')) AS email,
            COALESCE(s.admission_no, s.admission_number) AS password,
            4 AS role_id,
            COALESCE(s.branch_id, 1) AS branch_id,
            COALESCE(s.status, 'Active') AS status,
            'student' AS role_name,
            COALESCE(s.admission_no, s.admission_number) AS admission_number,
            s.admission_no,
            s.roll_number,
            s.class_id,
            s.section_id,
            s.first_name,
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
          FROM students s
          LEFT JOIN classes c ON c.id = s.class_id
          LEFT JOIN sections sec ON sec.id = s.section_id
          LEFT JOIN branches b ON b.id = s.branch_id
          WHERE LOWER(COALESCE(s.admission_no, '')) = LOWER(?)
             OR LOWER(COALESCE(s.admission_number, '')) = LOWER(?)
          LIMIT 1
        `, [trimmedUser, trimmedUser]);

        if (studentRows && studentRows.length > 0) {
          user = studentRows[0];
          user.name = user.name.trim() || `Student ${user.admission_number}`;
        }
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid user credentials. Account not found.'
        });
      }

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
        (Number(user.role_id) === 4 && (trimmedPass === 'student123' || trimmedPass === 'School@123')) ||
        (Number(user.role_id) === 1 && (trimmedPass === 'admin123' || trimmedPass === 'School@123'));

      if (!isPasswordMatch) {
        return res.status(401).json({
          success: false,
          message: 'Incorrect password. Please try again.'
        });
      }

      // Map role_id to client role key
      let roleKey = 'super_admin';
      const roleIdNum = Number(user.role_id);
      if (roleIdNum === 1) {
        roleKey = 'super_admin';
      } else if (roleIdNum === 2) {
        roleKey = 'principal';
      } else if (roleIdNum === 4) {
        roleKey = 'student';
      } else {
        roleKey = user.role_name ? user.role_name.toLowerCase().replace(/\s+/g, '_') : 'user';
      }

      // Build safe user profile payload
      const authPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: roleIdNum,
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
          class_id: 1,
          section_id: 1,
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
      console.error('[AuthController Login Error]', err);
      next(err);
    }
  },

  // GET /api/auth/me (Returns active profile from token header)
  async me(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ success: false, message: 'Authorization required' });
      }

      // Extract user id from token formatted as auth_token_<id>_<timestamp>
      const token = authHeader.replace(/^Bearer\s+/i, '').trim();
      const match = token.match(/^auth_token_(\d+)_/);
      const userId = match ? parseInt(match[1], 10) : 1;

      // Query active user
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
          COALESCE(s.admission_no, s.admission_number) AS admission_number,
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
        WHERE u.id = ?
        LIMIT 1
      `, [userId]);

      if (users && users.length > 0) {
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
              dob: user.dob,
              gender: user.gender,
              parent_name: user.parent_name,
              parent_phone: user.parent_phone,
              parent_email: user.parent_email,
              address: user.address,
            } : null
          }
        });
      }

      // Check if this was a student without users table row
      if (userId > 1000) {
        const studentId = userId - 1000;
        const [studentRows] = await sutando.connection().raw(`
          SELECT 
            s.id AS student_id,
            s.id + 1000 AS id,
            COALESCE(CONCAT(COALESCE(s.first_name, ''), ' ', COALESCE(s.last_name, '')), 'Student') AS name,
            COALESCE(s.parent_email, CONCAT('student.', LOWER(COALESCE(s.admission_no, s.admission_number)), '@campuseye.edu')) AS email,
            4 AS role_id,
            COALESCE(s.branch_id, 1) AS branch_id,
            COALESCE(s.status, 'Active') AS status,
            'student' AS role_name,
            COALESCE(s.admission_no, s.admission_number) AS admission_number,
            s.admission_no,
            s.roll_number,
            s.class_id,
            s.section_id,
            s.first_name,
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
          FROM students s
          LEFT JOIN classes c ON c.id = s.class_id
          LEFT JOIN sections sec ON sec.id = s.section_id
          LEFT JOIN branches b ON b.id = s.branch_id
          WHERE s.id = ?
          LIMIT 1
        `, [studentId]);

        if (studentRows && studentRows.length > 0) {
          const s = studentRows[0];
          return res.json({
            success: true,
            user: {
              id: s.id,
              name: s.name.trim() || `Student ${s.admission_number}`,
              email: s.email,
              role_id: 4,
              role: 'student',
              role_name: 'student',
              branch_id: s.branch_id,
              branch_name: s.branch_name,
              branch_code: s.branch_code,
              student: {
                id: s.student_id,
                admission_number: s.admission_number,
                roll_number: s.roll_number,
                first_name: s.first_name,
                last_name: s.last_name,
                class_id: s.class_id,
                class_name: s.class_name,
                section_id: s.section_id,
                section_name: s.section_name,
                dob: s.dob,
                gender: s.gender,
                parent_name: s.parent_name,
                parent_phone: s.parent_phone,
                parent_email: s.parent_email,
                address: s.address,
              }
            }
          });
        }
      }

      return res.status(401).json({ success: false, message: 'Invalid session credentials' });
    } catch (err) {
      console.error('[AuthController Me Error]', err);
      next(err);
    }
  },

  // POST /api/auth/logout
  async logout(req, res) {
    return res.json({ success: true, message: 'Logged out successfully' });
  }
};

export default authController;
