import { sutando } from '../config/database.js';

export const timetableController = {
  // ── 1. Structures: List, Create, Update, Delete ──
  async getStructures(req, res, next) {
    try {
      const conn = sutando.connection();
      const { branch_id = 1, academic_year_id = 2 } = req.query;

      const [structures] = await conn.raw(`
        SELECT * FROM timetable_structures 
        WHERE branch_id = ? AND academic_year_id = ?
        ORDER BY id DESC
      `, [branch_id, academic_year_id]);

      for (const st of structures) {
        if (typeof st.working_days === 'string') {
          try { st.working_days = JSON.parse(st.working_days); } catch (e) { st.working_days = []; }
        }

        // Fetch periods
        const [periods] = await conn.raw(`
          SELECT * FROM timetable_periods 
          WHERE structure_id = ? 
          ORDER BY display_order ASC, start_time ASC
        `, [st.id]);
        st.periods = periods;

        // Fetch mapped classes
        const [mappings] = await conn.raw(`
          SELECT m.*, c.class_name, sec.section_name 
          FROM timetable_class_mappings m
          LEFT JOIN classes c ON c.id = m.class_id
          LEFT JOIN sections sec ON sec.id = m.section_id
          WHERE m.structure_id = ?
        `, [st.id]);
        st.classes = mappings;
      }

      res.json({ success: true, data: structures });
    } catch (err) {
      next(err);
    }
  },

  async createStructure(req, res, next) {
    try {
      const conn = sutando.connection();
      const { 
        branch_id = 1, 
        academic_year_id = 2, 
        name, 
        working_days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], 
        periods = [] 
      } = req.body;

      if (!name?.trim()) {
        return res.status(400).json({ success: false, message: 'Structure name is required.' });
      }

      const [result] = await conn.raw(`
        INSERT INTO timetable_structures (branch_id, academic_year_id, name, working_days, is_active)
        VALUES (?, ?, ?, ?, 1)
      `, [branch_id, academic_year_id, name.trim(), JSON.stringify(working_days)]);

      const structureId = result.insertId;

      // Insert Periods
      if (Array.isArray(periods) && periods.length > 0) {
        let order = 1;
        for (const p of periods) {
          await conn.raw(`
            INSERT INTO timetable_periods (structure_id, period_name, period_type, start_time, end_time, display_order)
            VALUES (?, ?, ?, ?, ?, ?)
          `, [
            structureId,
            p.period_name || `Period ${order}`,
            p.period_type || 'teaching',
            p.start_time || '09:00',
            p.end_time || '09:45',
            order++
          ]);
        }
      }

      res.json({ success: true, message: 'Timetable structure created successfully!', id: structureId });
    } catch (err) {
      next(err);
    }
  },

  async deleteStructure(req, res, next) {
    try {
      const conn = sutando.connection();
      const { id } = req.params;
      await conn.raw('DELETE FROM timetable_structures WHERE id = ?', [id]);
      res.json({ success: true, message: 'Structure deleted successfully.' });
    } catch (err) {
      next(err);
    }
  },

  // ── 2. Class & Section Mapping ──
  async saveClassMappings(req, res, next) {
    try {
      const conn = sutando.connection();
      const { structure_id, mappings = [] } = req.body;

      if (!structure_id) {
        return res.status(400).json({ success: false, message: 'structure_id is required.' });
      }

      // Remove existing mapping for these classes or structure
      await conn.raw('DELETE FROM timetable_class_mappings WHERE structure_id = ?', [structure_id]);

      for (const m of mappings) {
        await conn.raw(`
          INSERT INTO timetable_class_mappings (structure_id, class_id, section_id)
          VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE structure_id = VALUES(structure_id)
        `, [structure_id, m.class_id, m.section_id || null]);
      }

      res.json({ success: true, message: 'Classes mapped to timetable structure successfully!' });
    } catch (err) {
      next(err);
    }
  },

  async unassignClass(req, res, next) {
    try {
      const conn = sutando.connection();
      const { structure_id, class_id } = req.body;

      if (!class_id) {
        return res.status(400).json({ success: false, message: 'class_id is required.' });
      }

      if (structure_id) {
        await conn.raw('DELETE FROM timetable_class_mappings WHERE structure_id = ? AND class_id = ?', [structure_id, class_id]);
      } else {
        await conn.raw('DELETE FROM timetable_class_mappings WHERE class_id = ?', [class_id]);
      }

      res.json({ success: true, message: 'Class unassigned successfully.' });
    } catch (err) {
      next(err);
    }
  },

  // ── 2.1 Get Subjects for a Class with Teacher & Weekly Periods Mapping ──
  async getClassSubjectMappings(req, res, next) {
    try {
      const conn = sutando.connection();
      const { branch_id = 1, academic_year_id = 2, class_id, section_id } = req.query;

      if (!class_id) {
        return res.status(400).json({ success: false, message: 'class_id is required.' });
      }

      const secId = (!section_id || section_id === 'all') ? 0 : Number(section_id);

      // 1. Fetch Subjects defined for this Class
      const [subjects] = await conn.raw(`
        SELECT cs.id as subject_id, cs.class_id, cs.subject_name, cs.subject_code, 
               cs.short_name, cs.category_name, cs.subject_type, cs.weekly_periods as default_weekly_periods,
               cs.teacher_id as default_teacher_id
        FROM class_subjects cs
        WHERE cs.class_id = ?
        ORDER BY cs.display_order ASC, cs.id ASC
      `, [class_id]);

      // 2. Fetch existing mappings in timetable_subject_mappings
      const [existingMappings] = await conn.raw(`
        SELECT * FROM timetable_subject_mappings 
        WHERE class_id = ? AND section_id = ?
      `, [class_id, secId]);

      const mapBySubject = {};
      existingMappings.forEach(m => { mapBySubject[m.subject_id] = m; });

      // 3. Fetch Teachers list
      const [teachers] = await conn.raw(`
        SELECT u.id, u.name, u.email, r.name as role_name 
        FROM users u 
        LEFT JOIN roles r ON r.id = u.role_id 
        WHERE u.status = 'Active' AND (u.role_id IN (1, 2, 3) OR u.role_id IS NULL)
        ORDER BY u.name ASC
      `);

      const result = subjects.map(s => {
        const m = mapBySubject[s.subject_id] || {};
        return {
          subject_id: s.subject_id,
          class_id: s.class_id,
          subject_name: s.subject_name,
          subject_code: s.subject_code,
          short_name: s.short_name,
          category_name: s.category_name,
          teacher_id: m.teacher_id !== undefined ? m.teacher_id : (s.default_teacher_id || null),
          weekly_periods: m.weekly_periods !== undefined ? m.weekly_periods : (s.default_weekly_periods || 5),
          preferred_room: m.preferred_room || ''
        };
      });

      res.json({
        success: true,
        data: {
          class_id: Number(class_id),
          section_id: secId,
          subjects: result,
          teachers
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // ── 2.2 Save Subjects Mapping for Class ──
  async saveClassSubjectMappings(req, res, next) {
    try {
      const conn = sutando.connection();
      const { branch_id = 1, academic_year_id = 2, class_id, section_id, subjects = [] } = req.body;

      if (!class_id || !Array.isArray(subjects)) {
        return res.status(400).json({ success: false, message: 'class_id and subjects array are required.' });
      }

      const secId = (!section_id || section_id === 'all') ? 0 : Number(section_id);

      for (const item of subjects) {
        await conn.raw(`
          INSERT INTO timetable_subject_mappings (
            branch_id, academic_year_id, class_id, section_id, subject_id, teacher_id, weekly_periods, preferred_room
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            teacher_id = VALUES(teacher_id),
            weekly_periods = VALUES(weekly_periods),
            preferred_room = VALUES(preferred_room),
            updated_at = NOW()
        `, [
          branch_id,
          academic_year_id,
          class_id,
          secId,
          item.subject_id,
          item.teacher_id || null,
          Number(item.weekly_periods || 5),
          item.preferred_room || null
        ]);
      }

      res.json({ success: true, message: 'Class subject timetable mapping saved successfully!' });
    } catch (err) {
      next(err);
    }
  },

  // ── 3. Weekly Timetable Grid & Slots Allocation ──
  async getWeeklyTimetable(req, res, next) {
    try {
      const conn = sutando.connection();
      const { branch_id = 1, academic_year_id = 2, class_id, section_id } = req.query;

      if (!class_id) {
        return res.status(400).json({ success: false, message: 'class_id is required.' });
      }

      // Find which structure is mapped to this class
      const [mapping] = await conn.raw(`
        SELECT structure_id FROM timetable_class_mappings 
        WHERE class_id = ? ${section_id && section_id !== 'all' ? 'AND (section_id = ? OR section_id IS NULL)' : ''}
        LIMIT 1
      `, section_id && section_id !== 'all' ? [class_id, section_id] : [class_id]);

      let structureId = mapping[0]?.structure_id;
      let structure = null;
      let periods = [];

      if (structureId) {
        const [stRows] = await conn.raw('SELECT * FROM timetable_structures WHERE id = ?', [structureId]);
        structure = stRows[0] || null;
        if (structure && typeof structure.working_days === 'string') {
          try { structure.working_days = JSON.parse(structure.working_days); } catch (e) { structure.working_days = []; }
        }

        const [pRows] = await conn.raw(`
          SELECT * FROM timetable_periods WHERE structure_id = ? ORDER BY display_order ASC, start_time ASC
        `, [structureId]);
        periods = pRows;
      }

      // Fetch all class subjects
      const [subjects] = await conn.raw(`
        SELECT id, subject_name, subject_code, short_name 
        FROM class_subjects 
        WHERE class_id = ? 
        ORDER BY display_order ASC, id ASC
      `, [class_id]);

      // Fetch configured subject mappings (to get default teacher and room for auto-fill)
      const secId = (!section_id || section_id === 'all') ? 0 : Number(section_id);
      const [subjectMappings] = await conn.raw(`
        SELECT subject_id, teacher_id, weekly_periods, preferred_room
        FROM timetable_subject_mappings
        WHERE class_id = ? AND (section_id = ? OR section_id = 0)
      `, [class_id, secId]);

      // Fetch teachers/staff
      const [teachers] = await conn.raw(`
        SELECT id, name, email FROM users WHERE status = 'Active' ORDER BY name ASC
      `);

      // Fetch existing slots
      let slotQuery = `
        SELECT ts.*, cs.subject_name, u.name as teacher_name
        FROM timetable_slots ts
        LEFT JOIN class_subjects cs ON cs.id = ts.subject_id
        LEFT JOIN users u ON u.id = ts.teacher_id
        WHERE ts.class_id = ?
      `;
      const slotParams = [class_id];
      if (section_id && section_id !== 'all') {
        slotQuery += ' AND ts.section_id = ?';
        slotParams.push(section_id);
      } else {
        slotQuery += ' AND ts.section_id = 0';
      }
      const [slots] = await conn.raw(slotQuery, slotParams);

      res.json({
        success: true,
        data: {
          structure,
          periods,
          subjects,
          subjectMappings,
          teachers,
          slots
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async saveSlot(req, res, next) {
    try {
      const conn = sutando.connection();
      const { 
        branch_id = 1, 
        academic_year_id = 2, 
        class_id, 
        section_id, 
        period_id, 
        day_of_week, 
        subject_id, 
        teacher_id, 
        room_name 
      } = req.body;

      if (!class_id || !period_id || !day_of_week) {
        return res.status(400).json({ success: false, message: 'class_id, period_id, and day_of_week are required.' });
      }

      // ── Conflict Check: Is Teacher already busy at the same day & period? ──
      if (teacher_id) {
        const [conflict] = await conn.raw(`
          SELECT ts.*, c.class_name, sec.section_name 
          FROM timetable_slots ts
          LEFT JOIN classes c ON c.id = ts.class_id
          LEFT JOIN sections sec ON sec.id = ts.section_id
          WHERE ts.teacher_id = ? AND ts.day_of_week = ? AND ts.period_id = ? 
            AND (ts.class_id != ? OR (ts.section_id != ? AND ts.section_id IS NOT NULL))
          LIMIT 1
        `, [teacher_id, day_of_week, period_id, class_id, section_id || 0]);

        if (conflict.length > 0) {
          const conf = conflict[0];
          return res.status(409).json({
            success: false,
            message: `Teacher Conflict! This teacher is already allocated to ${conf.class_name || 'Class'} ${conf.section_name ? `(${conf.section_name})` : ''} on ${day_of_week}.`
          });
        }
      }

      // Upsert slot
      const secId = (!section_id || section_id === 'all') ? 0 : Number(section_id);

      await conn.raw(`
        INSERT INTO timetable_slots (
          branch_id, academic_year_id, class_id, section_id, period_id, day_of_week, subject_id, teacher_id, room_name
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          subject_id = VALUES(subject_id),
          teacher_id = VALUES(teacher_id),
          room_name = VALUES(room_name),
          updated_at = NOW()
      `, [
        branch_id, 
        academic_year_id, 
        class_id, 
        secId, 
        period_id, 
        day_of_week, 
        subject_id || null, 
        teacher_id || null, 
        room_name || null
      ]);

      res.json({ success: true, message: 'Timetable slot updated successfully!' });
    } catch (err) {
      next(err);
    }
  },

  async clearSlot(req, res, next) {
    try {
      const conn = sutando.connection();
      const { class_id, section_id, period_id, day_of_week } = req.body;
      const secId = (!section_id || section_id === 'all') ? 0 : Number(section_id);

      await conn.raw(
        'DELETE FROM timetable_slots WHERE class_id = ? AND section_id = ? AND period_id = ? AND day_of_week = ?',
        [class_id, secId, period_id, day_of_week]
      );

      res.json({ success: true, message: 'Slot cleared successfully.' });
    } catch (err) {
      next(err);
    }
  }
};
