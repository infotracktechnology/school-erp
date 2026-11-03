import { sutando } from '../config/database.js';

export const anecdoteController = {
  // 1. Get Anecdotes with Filters (Class, Section, Student, Category, Sentiment)
  async getAnecdotes(req, res) {
    try {
      const conn = sutando.connection();
      const {
        branch_id,
        academic_year_id,
        class_id,
        section_id,
        student_id,
        category,
        sentiment,
        is_visible_to_parent,
        search,
        limit = 100,
        offset = 0
      } = req.query;

      let query = `
        SELECT 
          a.id,
          a.branch_id,
          a.academic_year_id,
          a.student_id,
          a.class_id,
          a.section_id,
          a.created_by_user_id,
          DATE_FORMAT(a.incident_date, '%Y-%m-%d') as incident_date,
          a.category,
          a.sentiment,
          a.title,
          a.observation_text,
          a.is_visible_to_parent,
          a.attachments,
          a.created_at,
          a.updated_at,
          s.admission_number,
          CONCAT(COALESCE(s.first_name, ''), ' ', COALESCE(s.last_name, '')) AS student_name,
          s.roll_number,
          c.class_name,
          sec.section_name,
          u.name AS recorded_by_name
        FROM student_anecdotes a
        JOIN students s ON a.student_id = s.id
        LEFT JOIN classes c ON a.class_id = c.id
        LEFT JOIN sections sec ON a.section_id = sec.id
        LEFT JOIN users u ON a.created_by_user_id = u.id`;
      const params = [];

      if (branch_id && branch_id !== 'all' && branch_id !== '0') {
        query += ` AND a.branch_id = ?`;
        params.push(Number(branch_id));
      }
      if (academic_year_id && academic_year_id !== 'all') {
        query += ` AND a.academic_year_id = ?`;
        params.push(Number(academic_year_id));
      }
      if (class_id && class_id !== 'all') {
        query += ` AND a.class_id = ?`;
        params.push(Number(class_id));
      }
      if (section_id && section_id !== 'all') {
        query += ` AND a.section_id = ?`;
        params.push(Number(section_id));
      }
      if (student_id) {
        query += ` AND a.student_id = ?`;
        params.push(Number(student_id));
      }
      if (category && category !== 'all') {
        query += ` AND a.category = ?`;
        params.push(category);
      }
      if (sentiment && sentiment !== 'all') {
        query += ` AND a.sentiment = ?`;
        params.push(sentiment);
      }
      if (is_visible_to_parent !== undefined && is_visible_to_parent !== '') {
        query += ` AND a.is_visible_to_parent = ?`;
        params.push(is_visible_to_parent === 'true' || is_visible_to_parent === true ? 1 : 0);
      }
      if (search) {
        query += ` AND (a.title LIKE ? OR a.observation_text LIKE ? OR s.first_name LIKE ? OR s.last_name LIKE ? OR s.admission_number LIKE ?)`;
        const q = `%${search}%`;
        params.push(q, q, q, q, q);
      }

      query += ` ORDER BY a.incident_date DESC, a.created_at DESC LIMIT ? OFFSET ?`;
      params.push(Number(limit), Number(offset));

      const [rows] = await conn.raw(query, params);

      const parsedRows = (rows || []).map(r => ({
        ...r,
        student_name: (r.student_name || '').trim() || `Student #${r.student_id}`,
        attachments: typeof r.attachments === 'string' ? JSON.parse(r.attachments || '[]') : (r.attachments || []),
        is_visible_to_parent: Boolean(r.is_visible_to_parent)
      }));

      return res.json({
        success: true,
        count: parsedRows.length,
        data: parsedRows
      });
    } catch (error) {
      console.error('Error fetching anecdotes:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  // 2. Create a new Student Anecdote
  async createAnecdote(req, res) {
    try {
      const conn = sutando.connection();
      const {
        branch_id,
        academic_year_id,
        student_id,
        class_id,
        section_id,
        incident_date,
        category = 'Behavioral',
        sentiment = 'Positive',
        title,
        observation_text,
        is_visible_to_parent = false,
        attachments = []
      } = req.body;

      if (!student_id || !title || !observation_text || !incident_date) {
        return res.status(400).json({
          success: false,
          error: 'Student, Title, Date, and Observation notes are required.'
        });
      }

      let targetClassId = class_id;
      let targetSectionId = section_id;
      let targetBranchId = branch_id;

      if (!targetClassId || !targetSectionId || !targetBranchId) {
        const [studentRows] = await conn.raw(
          'SELECT branch_id, class_id, section_id FROM students WHERE id = ?',
          [Number(student_id)]
        );
        if (studentRows && studentRows.length > 0) {
          targetBranchId = targetBranchId || studentRows[0].branch_id;
          targetClassId = targetClassId || studentRows[0].class_id;
          targetSectionId = targetSectionId || studentRows[0].section_id;
        }
      }

      const created_by_user_id = req.user?.id || 1;

      const [result] = await conn.raw(
        `INSERT INTO student_anecdotes 
         (branch_id, academic_year_id, student_id, class_id, section_id, created_by_user_id, incident_date, category, sentiment, title, observation_text, is_visible_to_parent, attachments)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          Number(targetBranchId) || 1,
          Number(academic_year_id) || 2,
          Number(student_id),
          Number(targetClassId) || 1,
          Number(targetSectionId) || 1,
          Number(created_by_user_id),
          incident_date,
          category,
          sentiment,
          title,
          observation_text,
          is_visible_to_parent ? 1 : 0,
          JSON.stringify(attachments || [])
        ]
      );

      return res.status(201).json({
        success: true,
        message: 'Student anecdotal record created successfully.',
        anecdote_id: result?.insertId
      });
    } catch (error) {
      console.error('Error creating anecdote:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  // 3. Update an Anecdote
  async updateAnecdote(req, res) {
    try {
      const conn = sutando.connection();
      const { id } = req.params;
      const {
        incident_date,
        category,
        sentiment,
        title,
        observation_text,
        is_visible_to_parent,
        attachments
      } = req.body;

      const [existing] = await conn.raw('SELECT * FROM student_anecdotes WHERE id = ?', [Number(id)]);
      if (!existing || existing.length === 0) {
        return res.status(404).json({ success: false, error: 'Anecdote record not found.' });
      }

      await conn.raw(
        `UPDATE student_anecdotes SET
          incident_date = COALESCE(?, incident_date),
          category = COALESCE(?, category),
          sentiment = COALESCE(?, sentiment),
          title = COALESCE(?, title),
          observation_text = COALESCE(?, observation_text),
          is_visible_to_parent = COALESCE(?, is_visible_to_parent),
          attachments = COALESCE(?, attachments)
        WHERE id = ?`,
        [
          incident_date || null,
          category || null,
          sentiment || null,
          title || null,
          observation_text || null,
          is_visible_to_parent !== undefined ? (is_visible_to_parent ? 1 : 0) : null,
          attachments ? JSON.stringify(attachments) : null,
          Number(id)
        ]
      );

      return res.json({
        success: true,
        message: 'Anecdotal record updated successfully.'
      });
    } catch (error) {
      console.error('Error updating anecdote:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  // 4. Delete an Anecdote
  async deleteAnecdote(req, res) {
    try {
      const conn = sutando.connection();
      const { id } = req.params;
      const [result] = await conn.raw('DELETE FROM student_anecdotes WHERE id = ?', [Number(id)]);
      if (!result || result.affectedRows === 0) {
        return res.status(404).json({ success: false, error: 'Anecdote record not found.' });
      }

      return res.json({
        success: true,
        message: 'Anecdotal record deleted successfully.'
      });
    } catch (error) {
      console.error('Error deleting anecdote:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  // 5. Get Student Timeline (for Student Profile or Parent Portal)
  async getStudentTimeline(req, res) {
    try {
      const conn = sutando.connection();
      const { student_id } = req.params;
      const { is_parent_view } = req.query;

      let query = `
        SELECT 
          a.id,
          a.branch_id,
          a.academic_year_id,
          a.student_id,
          a.class_id,
          a.section_id,
          a.created_by_user_id,
          DATE_FORMAT(a.incident_date, '%Y-%m-%d') as incident_date,
          a.category,
          a.sentiment,
          a.title,
          a.observation_text,
          a.is_visible_to_parent,
          a.attachments,
          a.created_at,
          u.name AS recorded_by_name
        FROM student_anecdotes a
        LEFT JOIN users u ON a.created_by_user_id = u.id
        WHERE a.student_id = ?
      `;
      const params = [Number(student_id)];

      if (is_parent_view === 'true' || is_parent_view === true) {
        query += ` AND a.is_visible_to_parent = 1`;
      }

      query += ` ORDER BY a.incident_date DESC, a.created_at DESC`;

      const [rows] = await conn.raw(query, params);

      const parsedRows = (rows || []).map(r => ({
        ...r,
        attachments: typeof r.attachments === 'string' ? JSON.parse(r.attachments || '[]') : (r.attachments || []),
        is_visible_to_parent: Boolean(r.is_visible_to_parent)
      }));

      return res.json({
        success: true,
        count: parsedRows.length,
        data: parsedRows
      });
    } catch (error) {
      console.error('Error fetching student anecdote timeline:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  // 6. Reports: Summary & Analytics Distribution
  async getReportsSummary(req, res) {
    try {
      const conn = sutando.connection();
      const { branch_id, academic_year_id, class_id, section_id, start_date, end_date } = req.query;

      let whereClause = 'WHERE 1=1';
      const params = [];

      if (branch_id && branch_id !== 'all' && branch_id !== '0') {
        whereClause += ' AND a.branch_id = ?';
        params.push(Number(branch_id));
      }
      if (academic_year_id && academic_year_id !== 'all') {
        whereClause += ' AND a.academic_year_id = ?';
        params.push(Number(academic_year_id));
      }
      if (class_id && class_id !== 'all') {
        whereClause += ' AND a.class_id = ?';
        params.push(Number(class_id));
      }
      if (section_id && section_id !== 'all') {
        whereClause += ' AND a.section_id = ?';
        params.push(Number(section_id));
      }
      if (start_date) {
        whereClause += ' AND a.incident_date >= ?';
        params.push(start_date);
      }
      if (end_date) {
        whereClause += ' AND a.incident_date <= ?';
        params.push(end_date);
      }

      // 1. Overall counts
      const [totalCountRows] = await conn.raw(`SELECT COUNT(*) as total FROM student_anecdotes a ${whereClause}`, params);
      const total = totalCountRows[0]?.total || 0;

      // 2. Sentiment distribution
      const [sentimentRows] = await conn.raw(`
        SELECT sentiment, COUNT(*) as count 
        FROM student_anecdotes a 
        ${whereClause} 
        GROUP BY sentiment
      `, params);

      // 3. Category distribution
      const [categoryRows] = await conn.raw(`
        SELECT category, COUNT(*) as count 
        FROM student_anecdotes a 
        ${whereClause} 
        GROUP BY category
        ORDER BY count DESC
      `, params);

      // 4. Top Recognized Students
      const [topStudents] = await conn.raw(`
        SELECT 
          s.id,
          CONCAT(COALESCE(s.first_name, ''), ' ', COALESCE(s.last_name, '')) as student_name,
          s.admission_number,
          c.class_name,
          sec.section_name,
          SUM(CASE WHEN a.sentiment = 'Positive' THEN 1 ELSE 0 END) as positive_count,
          SUM(CASE WHEN a.sentiment = 'Needs Improvement' THEN 1 ELSE 0 END) as guidance_count,
          COUNT(a.id) as total_anecdotes
        FROM student_anecdotes a
        JOIN students s ON a.student_id = s.id
        LEFT JOIN classes c ON a.class_id = c.id
        LEFT JOIN sections sec ON a.section_id = sec.id
        ${whereClause}
        GROUP BY s.id, s.first_name, s.last_name, s.admission_number, c.class_name, sec.section_name
        ORDER BY positive_count DESC, total_anecdotes DESC
        LIMIT 5
      `, params);

      return res.json({
        success: true,
        data: {
          total,
          sentiments: sentimentRows || [],
          categories: categoryRows || [],
          top_students: (topStudents || []).map(st => ({
            ...st,
            student_name: (st.student_name || '').trim() || `Student #${st.id}`
          }))
        }
      });
    } catch (error) {
      console.error('Error fetching reports summary:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  // 7. Reports: Class & Section Matrix (Per-student breakdown)
  async getClassMatrixReport(req, res) {
    try {
      const conn = sutando.connection();
      const { branch_id, academic_year_id, class_id, section_id, start_date, end_date } = req.query;

      let whereClause = 'WHERE 1=1';
      const params = [];

      if (branch_id && branch_id !== 'all' && branch_id !== '0') {
        whereClause += ' AND s.branch_id = ?';
        params.push(Number(branch_id));
      }
      if (class_id && class_id !== 'all') {
        whereClause += ' AND s.class_id = ?';
        params.push(Number(class_id));
      }
      if (section_id && section_id !== 'all') {
        whereClause += ' AND s.section_id = ?';
        params.push(Number(section_id));
      }

      let anecdoteDateFilter = '';
      const anecdoteParams = [];
      if (academic_year_id && academic_year_id !== 'all') {
        anecdoteDateFilter += ' AND a.academic_year_id = ?';
        anecdoteParams.push(Number(academic_year_id));
      }
      if (start_date) {
        anecdoteDateFilter += ' AND a.incident_date >= ?';
        anecdoteParams.push(start_date);
      }
      if (end_date) {
        anecdoteDateFilter += ' AND a.incident_date <= ?';
        anecdoteParams.push(end_date);
      }

      const query = `
        SELECT 
          s.id as student_id,
          CONCAT(COALESCE(s.first_name, ''), ' ', COALESCE(s.last_name, '')) as student_name,
          s.admission_number,
          s.roll_number,
          c.class_name,
          sec.section_name,
          COUNT(a.id) as total_anecdotes,
          SUM(CASE WHEN a.sentiment = 'Positive' THEN 1 ELSE 0 END) as positive_count,
          SUM(CASE WHEN a.sentiment = 'Neutral' THEN 1 ELSE 0 END) as neutral_count,
          SUM(CASE WHEN a.sentiment = 'Needs Improvement' THEN 1 ELSE 0 END) as guidance_count,
          MAX(a.incident_date) as last_observation_date
        FROM students s
        LEFT JOIN classes c ON s.class_id = c.id
        LEFT JOIN sections sec ON s.section_id = sec.id
        LEFT JOIN student_anecdotes a ON s.id = a.student_id ${anecdoteDateFilter}
        ${whereClause}
        GROUP BY s.id, s.first_name, s.last_name, s.admission_number, s.roll_number, c.class_name, sec.section_name
        ORDER BY s.roll_number ASC, s.first_name ASC
      `;

      const [rows] = await conn.raw(query, [...anecdoteParams, ...params]);

      const formatted = (rows || []).map(r => ({
        ...r,
        student_name: (r.student_name || '').trim() || `Student #${r.student_id}`,
        total_anecdotes: Number(r.total_anecdotes || 0),
        positive_count: Number(r.positive_count || 0),
        neutral_count: Number(r.neutral_count || 0),
        guidance_count: Number(r.guidance_count || 0),
        last_observation_date: r.last_observation_date ? new Date(r.last_observation_date).toISOString().split('T')[0] : null
      }));

      return res.json({
        success: true,
        count: formatted.length,
        data: formatted
      });
    } catch (error) {
      console.error('Error fetching class matrix report:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  // 8. Reports: Student Individual Dossier (Single Student Complete Profile)
  async getStudentDossier(req, res) {
    try {
      const conn = sutando.connection();
      const { student_id } = req.params;

      // 1. Student metadata
      const [studentRows] = await conn.raw(`
        SELECT 
          s.id,
          CONCAT(COALESCE(s.first_name, ''), ' ', COALESCE(s.last_name, '')) as student_name,
          s.admission_number,
          s.roll_number,
          s.gender,
          s.date_of_birth,
          c.class_name,
          sec.section_name,
          b.branch_name,
          b.branch_code
        FROM students s
        LEFT JOIN classes c ON s.class_id = c.id
        LEFT JOIN sections sec ON s.section_id = sec.id
        LEFT JOIN branches b ON s.branch_id = b.id
        WHERE s.id = ?
      `, [Number(student_id)]);

      if (!studentRows || studentRows.length === 0) {
        return res.status(404).json({ success: false, error: 'Student not found.' });
      }

      const student = {
        ...studentRows[0],
        student_name: (studentRows[0].student_name || '').trim() || `Student #${student_id}`
      };

      // 2. All Anecdotes for this student
      const [anecdotes] = await conn.raw(`
        SELECT 
          a.id,
          DATE_FORMAT(a.incident_date, '%Y-%m-%d') as incident_date,
          a.category,
          a.sentiment,
          a.title,
          a.observation_text,
          a.is_visible_to_parent,
          u.name as recorded_by_name
        FROM student_anecdotes a
        LEFT JOIN users u ON a.created_by_user_id = u.id
        WHERE a.student_id = ?
        ORDER BY a.incident_date DESC, a.created_at DESC
      `, [Number(student_id)]);

      // 3. Metrics calculation
      const positiveCount = (anecdotes || []).filter(a => a.sentiment === 'Positive').length;
      const neutralCount = (anecdotes || []).filter(a => a.sentiment === 'Neutral').length;
      const guidanceCount = (anecdotes || []).filter(a => a.sentiment === 'Needs Improvement').length;

      return res.json({
        success: true,
        data: {
          student,
          summary: {
            total: (anecdotes || []).length,
            positive: positiveCount,
            neutral: neutralCount,
            guidance: guidanceCount
          },
          records: anecdotes || []
        }
      });
    } catch (error) {
      console.error('Error fetching student dossier:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};

export default anecdoteController;
