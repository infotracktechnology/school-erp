import { Section } from '../models/Section.js';
import { sutando } from '../config/database.js';

const knex = (table) => sutando.connection().table(table);

function formatSection(s, studentCount = 0) {
  const count = Number(studentCount || 0);
  const isLocked = count > 0;
  return {
    ...s,
    name: s.name || s.section_name || 'A',
    section_name: s.section_name || s.name,
    status: s.is_enabled === 0 ? 'Inactive' : (s.status || 'Active'),
    is_enabled: s.is_enabled !== 0,
    student_count: count,
    is_locked: isLocked,
    student_status: isLocked ? 'Students Assigned' : 'No Students'
  };
}

export const sectionController = {
  async list(req, res, next) {
    try {
      const { branch_id, academic_year_id, academic_year, class_id } = req.query;
      let query = Section.query();
      if (branch_id && branch_id !== 'all') {
        query = query.where('branch_id', Number(branch_id));
      }
      const ayStr = (academic_year || req.query.academic_year_name || '').trim();
      const ayId = Number(academic_year_id);
      if (ayStr && ayStr !== 'all' && ayStr !== 'undefined') {
        query = query.where((b) => {
          b.where('academic_year', ayStr);
          if (!isNaN(ayId) && ayId > 0) b.orWhere('academic_year_id', ayId);
        });
      } else if (!isNaN(ayId) && ayId > 0 && academic_year_id !== 'all' && academic_year_id !== 'undefined') {
        query = query.where('academic_year_id', ayId);
      }
      if (class_id && class_id !== 'all') {
        query = query.where('class_id', Number(class_id));
      }

      const rawList = await query.orderBy('section_name', 'asc').get();
      const listArray = rawList.all ? rawList.all() : (Array.isArray(rawList) ? rawList : []);

      // Query student counts grouped by section_id
      const [countRows] = await sutando.connection().raw(`
        SELECT section_id, COUNT(*) as count 
        FROM students 
        WHERE section_id IS NOT NULL 
        GROUP BY section_id
      `);
      const countMap = new Map();
      if (Array.isArray(countRows)) {
        for (const cr of countRows) {
          countMap.set(Number(cr.section_id), Number(cr.count || 0));
        }
      }

      const formatted = listArray.map((s) => {
        const json = typeof s.toJSON === 'function' ? s.toJSON() : s;
        const count = countMap.get(Number(json.id)) || 0;
        return formatSection(json, count);
      });
      res.json({ success: true, data: formatted });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const item = await Section.query().find(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Section not found' });
      const json = typeof item.toJSON === 'function' ? item.toJSON() : item;
      const [countResult] = await sutando.connection().raw('SELECT COUNT(*) as count FROM students WHERE section_id = ?', [Number(req.params.id)]);
      const count = Number(countResult?.[0]?.count || 0);
      res.json({ success: true, data: formatSection(json, count) });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const payload = { ...req.body };
      if (payload.name && !payload.section_name) payload.section_name = payload.name;
      if (!payload.academic_year && payload.academic_year_id) {
        const ayRow = await knex('academic_years').where('id', Number(payload.academic_year_id)).first();
        if (ayRow) payload.academic_year = ayRow.year_name || ayRow.name;
      }
      const item = await Section.query().create(payload);
      res.status(201).json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const item = await Section.query().find(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Section not found' });

      const payload = { ...req.body };
      if (payload.name) payload.section_name = payload.name;

      // Section Locking Rule: If disabling section, verify no students are assigned
      if (payload.is_enabled === 0 || payload.is_enabled === false || payload.status === 'Inactive') {
        const [countResult] = await sutando.connection().raw('SELECT COUNT(*) as count FROM students WHERE section_id = ?', [Number(req.params.id)]);
        const count = Number(countResult?.[0]?.count || 0);
        if (count > 0) {
          return res.status(400).json({
            success: false,
            is_locked: true,
            student_count: count,
            message: `Cannot disable Section ${item.section_name}: ${count} student${count > 1 ? 's are' : ' is'} currently assigned to this class and section. Section is locked.`
          });
        }
      }

      await item.update(payload);
      res.json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const item = await Section.query().find(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Section not found' });

      const { status, is_enabled } = req.body;
      if (status === 'Inactive' || is_enabled === 0 || is_enabled === false) {
        const [countResult] = await sutando.connection().raw('SELECT COUNT(*) as count FROM students WHERE section_id = ?', [Number(req.params.id)]);
        const count = Number(countResult?.[0]?.count || 0);
        if (count > 0) {
          return res.status(400).json({
            success: false,
            is_locked: true,
            student_count: count,
            message: `Cannot disable Section ${item.section_name}: ${count} student${count > 1 ? 's are' : ' is'} currently assigned to this class and section. Section is locked.`
          });
        }
      }

      const updateData = {};
      if (status !== undefined) updateData.status = status;
      if (is_enabled !== undefined) updateData.is_enabled = is_enabled ? 1 : 0;
      await item.update(updateData);

      res.json({ success: true, data: item, message: 'Section status updated' });
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const item = await Section.query().find(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Section not found' });

      // Section Locking Rule: Cannot delete if students are assigned
      const [countResult] = await sutando.connection().raw('SELECT COUNT(*) as count FROM students WHERE section_id = ?', [Number(req.params.id)]);
      const count = Number(countResult?.[0]?.count || 0);
      if (count > 0) {
        return res.status(400).json({
          success: false,
          is_locked: true,
          student_count: count,
          message: `Cannot delete Section ${item.section_name}: ${count} student${count > 1 ? 's are' : ' is'} currently assigned to this class and section. Section is locked.`
        });
      }

      await item.delete();
      res.json({ success: true, message: 'Section deleted successfully.' });
    } catch (err) {
      next(err);
    }
  }
};

export default sectionController;
