import { sutando } from '../config/database.js';

const knex = (table) => sutando.connection().table(table);

export const academicGroupController = {
  async list(req, res, next) {
    try {
      const { branch_id, academic_year_id, status, search } = req.query;
      let query = knex('academic_groups');

      if (branch_id && branch_id !== 'all' && branch_id !== 'undefined' && !isNaN(Number(branch_id))) {
        query = query.where('branch_id', Number(branch_id));
      }
      if (academic_year_id && academic_year_id !== 'all' && academic_year_id !== 'undefined' && !isNaN(Number(academic_year_id))) {
        query = query.where('academic_year_id', Number(academic_year_id));
      }
      if (status && status !== 'all') {
        query = query.where('status', status);
      }
      if (search && search.trim()) {
        const term = `%${search.trim()}%`;
        query = query.where((builder) => {
          builder.where('name', 'like', term).orWhere('code', 'like', term);
        });
      }

      const groups = await query.select('*').orderBy('id', 'asc');

      // Fetch student counts for each group
      let counts = [];
      try {
        const rawRes = await sutando.connection().raw('SELECT academic_group_id, COUNT(student_id) as total FROM academic_group_students GROUP BY academic_group_id');
        counts = rawRes[0] || [];
      } catch (e) {
        counts = [];
      }

      const countMap = {};
      counts.forEach((c) => {
        countMap[c.academic_group_id] = Number(c.total) || 0;
      });

      const formatted = groups.map((g) => ({
        ...g,
        student_count: countMap[g.id] || 0,
        members_count: countMap[g.id] || 0,
      }));

      res.json({ success: true, data: formatted });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const group = await knex('academic_groups').where('id', req.params.id).first();
      if (!group) return res.status(404).json({ success: false, message: 'Academic group not found' });

      const members = await knex('academic_group_students as ags')
        .join('students as s', 'ags.student_id', 's.id')
        .leftJoin('student_profiles as sp', 's.user_id', 'sp.user_id')
        .leftJoin('classes as c', 's.class_id', 'c.id')
        .leftJoin('sections as sec', 's.section_id', 'sec.id')
        .where('ags.academic_group_id', group.id)
        .select(
          's.id',
          's.admission_no as admission_number',
          'sp.first_name',
          'sp.last_name',
          'c.name as class_name',
          'sec.name as section_name'
        );

      res.json({ success: true, data: { ...group, student_count: members.length, members } });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const { branch_id = 1, academic_year_id = 3, name, code, description, status = 'Active' } = req.body;
      if (!name) return res.status(400).json({ success: false, message: 'Group name is required' });

      const now = new Date();
      const [newId] = await knex('academic_groups').insert({
        branch_id: Number(branch_id) || 1,
        academic_year_id: Number(academic_year_id) || 3,
        name,
        code: code || null,
        description: description || null,
        status: status || 'Active',
        created_at: now,
        updated_at: now,
      });

      const group = await knex('academic_groups').where('id', newId).first();
      res.status(201).json({ success: true, data: { ...group, student_count: 0, members_count: 0 }, message: 'Academic group created successfully' });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, code, description, status, branch_id, academic_year_id } = req.body;
      const group = await knex('academic_groups').where('id', id).first();
      if (!group) return res.status(404).json({ success: false, message: 'Academic group not found' });

      const updates = { updated_at: new Date() };
      if (name !== undefined) updates.name = name;
      if (code !== undefined) updates.code = code;
      if (description !== undefined) updates.description = description;
      if (status !== undefined) updates.status = status;
      if (branch_id !== undefined) updates.branch_id = Number(branch_id);
      if (academic_year_id !== undefined) updates.academic_year_id = Number(academic_year_id);

      await knex('academic_groups').where('id', id).update(updates);
      const updated = await knex('academic_groups').where('id', id).first();
      res.json({ success: true, data: updated, message: 'Academic group updated successfully' });
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await knex('academic_groups').where('id', id).update({ status, updated_at: new Date() });
      res.json({ success: true, message: 'Status updated successfully' });
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await knex('academic_group_students').where('academic_group_id', id).del();
      await knex('academic_groups').where('id', id).del();
      res.json({ success: true, message: 'Academic group deleted successfully' });
    } catch (err) {
      next(err);
    }
  },

  async assignStudents(req, res, next) {
    try {
      const groupId = Number(req.params.id);
      const { student_ids, student_id } = req.body;
      const ids = Array.isArray(student_ids) ? student_ids : (student_id ? [student_id] : []);

      for (const sId of ids) {
        const numSid = Number(sId);
        if (!numSid) continue;
        const exists = await knex('academic_group_students')
          .where({ academic_group_id: groupId, student_id: numSid })
          .first();
        if (!exists) {
          await knex('academic_group_students').insert({
            academic_group_id: groupId,
            student_id: numSid,
            created_at: new Date(),
          });
        }
      }

      res.json({ success: true, message: 'Students assigned to academic group successfully' });
    } catch (err) {
      next(err);
    }
  },

  async removeStudents(req, res, next) {
    try {
      const groupId = Number(req.params.id);
      const { student_ids, student_id } = req.body;
      const ids = Array.isArray(student_ids) ? student_ids : (student_id ? [student_id] : []);

      if (ids.length > 0) {
        await knex('academic_group_students')
          .where('academic_group_id', groupId)
          .whereIn('student_id', ids.map(Number))
          .del();
      }

      res.json({ success: true, message: 'Students removed from academic group successfully' });
    } catch (err) {
      next(err);
    }
  }
};

export default academicGroupController;
