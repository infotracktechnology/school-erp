import { ClassModel } from '../models/ClassModel.js';
import { sutando } from '../config/database.js';

const knex = (table) => sutando.connection().table(table);

function formatClass(c, extra = {}) {
  return {
    ...c,
    name: c.name || c.class_name || `Class ${c.numeric_value || c.id}`,
    class_name: c.class_name || c.name,
    order_index: c.numeric_value || c.id,
    display_order: c.numeric_value || c.id,
    is_enabled: extra.is_enabled !== undefined ? extra.is_enabled : true,
    student_count: extra.student_count !== undefined ? extra.student_count : 0,
    student_status: extra.student_status || (extra.student_count > 0 ? 'Students Assigned' : 'No Students'),
    is_locked: extra.is_locked !== undefined ? extra.is_locked : false,
    status: extra.is_enabled === false ? 'Inactive' : (c.status || 'Active')
  };
}

export const classController = {
  async list(req, res, next) {
    try {
      const { branch_id, academic_year_id, academic_year, include_all, status, search } = req.query;
      const bId = Number(branch_id);
      const ayId = Number(academic_year_id);
      const ayStr = (academic_year || req.query.academic_year_name || '').trim();

      // Base query for classes
      let query = ClassModel.query();
      if (!isNaN(bId) && bId > 0) {
        query = query.where((q) => {
          q.where('branch_id', bId).orWhereNull('branch_id');
        });
      }
      if (search) {
        query = query.where('class_name', 'like', `%${search}%`);
      }
      const rawList = await query.orderBy('numeric_value', 'asc').get();
      let listArray = rawList.all ? rawList.all() : (Array.isArray(rawList) ? rawList : (rawList.items || []));

      // If viewing all branches and duplicate class names exist across branches, deduplicate by class_name or numeric_value
      if (isNaN(bId) || bId <= 0) {
        const seenNames = new Set();
        listArray = listArray.filter((c) => {
          const nameKey = (c.class_name || c.name || `Class ${c.numeric_value || c.id}`).trim().toLowerCase();
          if (seenNames.has(nameKey)) return false;
          seenNames.add(nameKey);
          return true;
        });
      }

      // Resolve academic year row supporting both year_name and name
      let ayRow = null;
      if (ayStr && ayStr !== 'all' && ayStr !== 'undefined') {
        ayRow = await knex('academic_years')
          .where('year_name', ayStr)
          .orWhere('name', ayStr)
          .first();
      } else if (!isNaN(ayId) && ayId > 0 && academic_year_id !== 'all' && academic_year_id !== 'undefined') {
        ayRow = await knex('academic_years').where('id', ayId).first();
      }
      if (!ayRow) {
        ayRow = await knex('academic_years').where('is_current', 1).orWhere('is_active', 1).first();
      }

      const effectiveAyId = ayRow ? Number(ayRow.id) : (ayId || 1);
      const ayNames = [];
      if (ayRow?.year_name) ayNames.push(ayRow.year_name);
      if (ayRow?.name && !ayNames.includes(ayRow.name)) ayNames.push(ayRow.name);
      if (ayStr && !ayNames.includes(ayStr)) ayNames.push(ayStr);
      const effectiveAyStr = ayRow ? (ayRow.year_name || ayRow.name) : (ayStr || '2025-2026');

      // If branch_id is provided, apply academic year class enablement & student counts
      if (!isNaN(bId) && bId > 0) {
        // 1. Fetch enablement settings from academic_year_classes
        const yearClasses = await knex('academic_year_classes')
          .where('branch_id', bId)
          .where((builder) => {
            builder.where('academic_year_id', effectiveAyId);
            if (ayNames.length > 0) builder.orWhereIn('academic_year', ayNames);
          });
        const enableMap = new Map();
        for (const yc of yearClasses) {
          enableMap.set(Number(yc.class_id), Boolean(yc.is_enabled !== 0));
        }

        // 2. Fetch student enrollment counts for this branch and academic year grouped by class_id
        let countQuery = knex('students as s')
          .leftJoin('sections as sec', 's.section_id', 'sec.id')
          .where('s.branch_id', bId);

        if (ayNames.length > 0 || effectiveAyId) {
          countQuery = countQuery.where((builder) => {
            if (ayNames.length > 0) {
              builder.whereIn('s.academic_year', ayNames)
                     .orWhereIn('sec.academic_year', ayNames);
            }
            if (effectiveAyId) {
              builder.orWhere('s.academic_year_id', effectiveAyId)
                     .orWhere('sec.academic_year_id', effectiveAyId);
            }
          });
        }

        const countRows = await countQuery
          .groupBy('s.class_id')
          .select('s.class_id')
          .select(sutando.connection().raw('COUNT(s.id) as count'));

        const countMap = new Map();
        if (Array.isArray(countRows)) {
          for (const cr of countRows) {
            countMap.set(Number(cr.class_id), Number(cr.count || 0));
          }
        }

        const formatted = listArray.map((c) => {
          const json = typeof c.toJSON === 'function' ? c.toJSON() : c;
          const cId = Number(json.id);
          const isEnabled = enableMap.has(cId) ? enableMap.get(cId) : true;
          const studentCount = countMap.has(cId) ? countMap.get(cId) : 0;
          const isLocked = studentCount > 0;
          const studentStatus = isLocked ? 'Students Assigned' : 'No Students';

          return formatClass(json, {
            is_enabled: isEnabled,
            student_count: studentCount,
            student_status: studentStatus,
            is_locked: isLocked,
          });
        });

        // If include_all is not true, filter to only enabled classes for this academic year & branch
        let result = formatted;
        if (include_all !== 'true' && include_all !== true) {
          result = formatted.filter((cls) => cls.is_enabled === true);
        }

        if (status && status !== 'all') {
          result = result.filter((cls) => cls.status?.toLowerCase() === status.toLowerCase());
        }

        return res.json({ success: true, data: result, count: result.length });
      }

      // Default fallback if branch not specified
      const formatted = listArray.map((c) => {
        const json = typeof c.toJSON === 'function' ? c.toJSON() : c;
        return formatClass(json);
      });

      let finalFallback = formatted;
      if (include_all !== 'true' && include_all !== true) {
        finalFallback = formatted.filter((cls) => cls.is_enabled === true);
      }
      if (status && status !== 'all') {
        finalFallback = finalFallback.filter((cls) => cls.status?.toLowerCase() === status.toLowerCase());
      }

      res.json({ success: true, data: finalFallback, count: finalFallback.length });
    } catch (err) {
      next(err);
    }
  },

  async toggleAcademicYearClass(req, res, next) {
    try {
      const { branch_id, academic_year_id, academic_year, class_id, is_enabled } = req.body;
      const bId = Number(branch_id);
      let ayId = Number(academic_year_id);
      let ayStr = (academic_year || '').trim();
      const cId = Number(class_id);
      const enabled = Boolean(is_enabled);

      if (!bId || (!ayId && !ayStr) || !cId) {
        return res.status(400).json({ success: false, message: 'branch_id, academic_year, and class_id are required' });
      }

      if (!ayStr && ayId) {
        const row = await knex('academic_years').where('id', ayId).first();
        if (row) ayStr = row.year_name || row.name;
      } else if (ayStr && !ayId) {
        const row = await knex('academic_years').where('year_name', ayStr).first();
        if (row) ayId = row.id;
      }

      // If attempting to disable (enabled === false), check if class has students assigned
      if (!enabled) {
        const [studentCountResult] = await sutando.connection().raw(`
          SELECT COUNT(*) as count 
          FROM students s 
          LEFT JOIN sections sec ON s.section_id = sec.id 
          WHERE (s.academic_year = ? OR sec.academic_year = ? OR s.academic_year_id = ? OR sec.academic_year_id = ?) 
            AND s.branch_id = ? AND s.class_id = ?
        `, [ayStr, ayStr, ayId, ayId, bId, cId]);
        const count = Number(studentCountResult?.[0]?.count || 0);

        if (count > 0) {
          const cls = await ClassModel.query().find(cId);
          const className = cls?.name || cls?.class_name || `Class ${cId}`;
          return res.status(400).json({
            success: false,
            is_locked: true,
            student_count: count,
            message: `Cannot disable ${className}: ${count} student${count > 1 ? 's are' : ' is'} currently assigned to this class for this academic year. Class is locked.`
          });
        }
      }

      // Upsert into academic_year_classes
      const existing = await knex('academic_year_classes')
        .where('branch_id', bId)
        .where('class_id', cId)
        .where((builder) => {
          if (ayId) builder.where('academic_year_id', ayId);
          if (ayStr) builder.orWhere('academic_year', ayStr);
        })
        .first();

      if (existing) {
        await knex('academic_year_classes')
          .where({ id: existing.id })
          .update({ is_enabled: enabled ? 1 : 0, academic_year: ayStr || existing.academic_year, updated_at: new Date() });
      } else {
        await knex('academic_year_classes').insert({
          branch_id: bId,
          academic_year_id: ayId,
          academic_year: ayStr,
          class_id: cId,
          is_enabled: enabled ? 1 : 0,
          created_at: new Date(),
          updated_at: new Date()
        });
      }

      const updatedRow = await knex('academic_year_classes')
        .where('branch_id', bId)
        .where('class_id', cId)
        .where((builder) => {
          if (ayId) builder.where('academic_year_id', ayId);
          if (ayStr) builder.orWhere('academic_year', ayStr);
        })
        .first();

      res.json({
        success: true,
        data: updatedRow,
        message: `Class ${enabled ? 'enabled' : 'disabled'} successfully for this academic year.`
      });
    } catch (err) {
      next(err);
    }
  },

  async bulkToggleAcademicYearClasses(req, res, next) {
    try {
      const { branch_id, academic_year_id, class_ids, is_enabled } = req.body;
      const bId = Number(branch_id);
      const ayId = Number(academic_year_id);
      const enabled = Boolean(is_enabled);
      const cIds = Array.isArray(class_ids) ? class_ids.map(Number) : [];

      if (!bId || !ayId || cIds.length === 0) {
        return res.status(400).json({ success: false, message: 'branch_id, academic_year_id, and class_ids array are required' });
      }

      let lockedClasses = [];
      for (const cId of cIds) {
        if (!enabled) {
          const [studentCountResult] = await sutando.connection().raw(`
            SELECT COUNT(*) as count 
            FROM students s 
            JOIN sections sec ON s.section_id = sec.id 
            WHERE sec.academic_year_id = ? AND s.branch_id = ? AND s.class_id = ?
          `, [ayId, bId, cId]);
          const count = Number(studentCountResult?.[0]?.count || 0);
          if (count > 0) {
            lockedClasses.push(cId);
            continue; // Skip locked class
          }
        }

        const existing = await knex('academic_year_classes')
          .where({ branch_id: bId, academic_year_id: ayId, class_id: cId })
          .first();

        if (existing) {
          await knex('academic_year_classes')
            .where({ id: existing.id })
            .update({ is_enabled: enabled ? 1 : 0, updated_at: new Date() });
        } else {
          await knex('academic_year_classes').insert({
            branch_id: bId,
            academic_year_id: ayId,
            class_id: cId,
            is_enabled: enabled ? 1 : 0,
            created_at: new Date(),
            updated_at: new Date()
          });
        }
      }

      res.json({
        success: true,
        locked_classes: lockedClasses,
        message: lockedClasses.length > 0
          ? `Updated classes. ${lockedClasses.length} locked class(es) with assigned students were skipped.`
          : `All selected classes ${enabled ? 'enabled' : 'disabled'} successfully.`
      });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const item = await ClassModel.query().find(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Class not found' });
      const json = typeof item.toJSON === 'function' ? item.toJSON() : item;
      res.json({ success: true, data: formatClass(json) });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const payload = { ...req.body };
      if (payload.name && !payload.class_name) payload.class_name = payload.name;
      const item = await ClassModel.query().create(payload);
      res.status(201).json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const item = await ClassModel.query().find(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Class not found' });
      const payload = { ...req.body };
      if (payload.name) payload.class_name = payload.name;
      await item.update(payload);
      res.json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const item = await ClassModel.query().find(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Class not found' });
      res.json({ success: true, data: item, message: 'Status updated' });
    } catch (err) {
      next(err);
    }
  }
};

export default classController;
