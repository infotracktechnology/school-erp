import { sutando } from '../config/database.js';

const knex = (table) => sutando.connection().table(table);

function formatRow(r) {
  return {
    ...r,
    is_language: Boolean(r.is_language),
    practical_applicable: Boolean(r.practical_applicable),
    exam_applicable: Boolean(r.exam_applicable),
    gradebook_applicable: Boolean(r.gradebook_applicable),
    reportcard_applicable: Boolean(r.reportcard_applicable),
    attendance_applicable: Boolean(r.attendance_applicable),
    homework_applicable: Boolean(r.homework_applicable),
    assignment_applicable: Boolean(r.assignment_applicable),
    timetable_applicable: Boolean(r.timetable_applicable),
    promotion_applicable: Boolean(r.promotion_applicable),
  };
}

export const classSubjectController = {
  async list(req, res, next) {
    try {
      const {
        branch_id,
        academic_year_id,
        board,
        class_id,
        group_id,
        category_name,
        subject_type,
        status,
        search
      } = req.query;

      let query = knex('class_subjects as cs')
        .leftJoin('classes as c', 'cs.class_id', 'c.id')
        .leftJoin('academic_groups as ag', 'cs.group_id', 'ag.id');

      if (branch_id && branch_id !== 'all' && !isNaN(Number(branch_id))) {
        query = query.where('cs.branch_id', Number(branch_id));
      }
      if (academic_year_id && academic_year_id !== 'all' && !isNaN(Number(academic_year_id))) {
        query = query.where('cs.academic_year_id', Number(academic_year_id));
      }
      if (board && board !== 'all' && board !== 'All Boards') {
        query = query.where('cs.board', board);
      }
      if (class_id && class_id !== 'all' && !isNaN(Number(class_id))) {
        query = query.where('cs.class_id', Number(class_id));
      }
      if (group_id && group_id !== 'all' && !isNaN(Number(group_id))) {
        query = query.where('cs.group_id', Number(group_id));
      }
      if (category_name && category_name !== 'all') {
        query = query.where('cs.category_name', category_name);
      }
      if (subject_type && subject_type !== 'all') {
        query = query.where('cs.subject_type', subject_type);
      }
      if (status && status !== 'all') {
        query = query.where('cs.status', status);
      }
      if (search && search.trim()) {
        const term = `%${search.trim()}%`;
        query = query.where((b) => {
          b.where('cs.subject_name', 'like', term)
            .orWhere('cs.subject_code', 'like', term)
            .orWhere('cs.short_name', 'like', term);
        });
      }

      const rows = await query
        .select(
          'cs.*',
          'c.class_name',
          'c.name as class_alt_name',
          'ag.name as group_name',
          'ag.code as group_code'
        )
        .orderBy('cs.display_order', 'asc')
        .orderBy('cs.id', 'asc');

      const formatted = rows.map((r) => ({
        ...formatRow(r),
        class_name: r.class_name || r.class_alt_name || `Class ${r.class_id}`,
      }));

      res.json({ success: true, data: formatted });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const {
        branch_id,
        academic_year_id,
        board = 'CBSE',
        class_id,
        group_id,
        subject_id,
        subject_name,
        subject_code,
        short_name,
        category_name = 'General',
        subject_type = 'Academic',
        is_language = false,
        language_name,
        language_level = 'First Language',
        requirement = 'Compulsory',
        elective_group_name,
        elective_min_count = 1,
        elective_max_count = 1,
        practical_applicable = false,
        theory_periods = 5,
        practical_periods = 0,
        weekly_periods = 5,
        exam_applicable = true,
        gradebook_applicable = true,
        reportcard_applicable = true,
        attendance_applicable = true,
        homework_applicable = true,
        assignment_applicable = true,
        timetable_applicable = true,
        promotion_applicable = true,
        pass_marks = 35,
        max_marks = 100,
        credits = 4,
        display_order = 1,
        status = 'Active',
        description,
      } = req.body;

      if (!subject_name || !subject_code) {
        return res.status(400).json({ success: false, message: 'Subject name and code are required' });
      }
      if (!class_id) {
        return res.status(400).json({ success: false, message: 'Class is required' });
      }

      const now = new Date();
      const payload = {
        branch_id: Number(branch_id) || 1,
        academic_year_id: academic_year_id ? Number(academic_year_id) : null,
        board,
        class_id: Number(class_id),
        group_id: group_id ? Number(group_id) : null,
        subject_id: subject_id ? Number(subject_id) : null,
        subject_name: subject_name.trim(),
        subject_code: subject_code.trim().toUpperCase(),
        short_name: short_name ? short_name.trim() : null,
        category_name,
        subject_type,
        is_language: Boolean(is_language),
        language_name: is_language ? language_name : null,
        language_level: is_language ? language_level : null,
        requirement,
        elective_group_name: requirement === 'Elective' ? elective_group_name : null,
        elective_min_count: Number(elective_min_count) || 1,
        elective_max_count: Number(elective_max_count) || 1,
        practical_applicable: Boolean(practical_applicable),
        theory_periods: Number(theory_periods) || 0,
        practical_periods: Number(practical_periods) || 0,
        weekly_periods: Number(weekly_periods) || 5,
        exam_applicable: exam_applicable !== false,
        gradebook_applicable: gradebook_applicable !== false,
        reportcard_applicable: reportcard_applicable !== false,
        attendance_applicable: attendance_applicable !== false,
        homework_applicable: homework_applicable !== false,
        assignment_applicable: assignment_applicable !== false,
        timetable_applicable: timetable_applicable !== false,
        promotion_applicable: promotion_applicable !== false,
        pass_marks: Number(pass_marks) || 35,
        max_marks: Number(max_marks) || 100,
        credits: Number(credits) || 4,
        display_order: Number(display_order) || 1,
        status,
        description: description || null,
        created_at: now,
        updated_at: now,
      };

      const [newId] = await knex('class_subjects').insert(payload);
      const inserted = await knex('class_subjects').where('id', newId).first();

      // Automatically enroll all active students of this class into this subject
      try {
        const studentsOfClass = await knex('students')
          .where('class_id', Number(class_id))
          .where('branch_id', Number(branch_id) || 1)
          .where('status', 'Active');

        for (const stu of studentsOfClass) {
          const stuAyId = academic_year_id ? Number(academic_year_id) : stu.academic_year_id;
          const [exists] = await knex('student_subjects')
            .where('student_id', stu.id)
            .where('subject_code', payload.subject_code)
            .where('academic_year_id', stuAyId);

          if (!exists) {
            await knex('student_subjects').insert({
              branch_id: Number(branch_id) || 1,
              academic_year_id: stuAyId,
              student_id: stu.id,
              class_id: Number(class_id),
              subject_id: subject_id ? Number(subject_id) : null,
              class_subject_id: newId,
              subject_name: payload.subject_name,
              subject_code: payload.subject_code,
              subject_type: payload.subject_type,
              is_language: payload.is_language,
              language_level: payload.language_level,
              enrollment_type: payload.requirement,
              status: 'Active',
              created_at: now,
              updated_at: now
            });
          }
        }
      } catch (enrollErr) {
        console.warn('Auto student subject enrollment notice:', enrollErr.message);
      }

      res.status(201).json({ success: true, data: formatRow(inserted), message: 'Class subject created and assigned to students successfully' });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await knex('class_subjects').where('id', id).first();
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Class subject not found' });
      }

      const updates = { ...req.body, updated_at: new Date() };
      delete updates.id;
      delete updates.created_at;
      delete updates.class_name;
      delete updates.class_alt_name;
      delete updates.group_name;
      delete updates.group_code;

      await knex('class_subjects').where('id', id).update(updates);
      const updated = await knex('class_subjects').where('id', id).first();

      res.json({ success: true, data: formatRow(updated), message: 'Class subject updated successfully' });
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await knex('class_subjects').where('id', id).update({
        status,
        updated_at: new Date(),
      });
      res.json({ success: true, message: 'Subject status updated successfully' });
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await knex('class_subjects').where('id', id).del();
      res.json({ success: true, message: 'Subject mapping deleted successfully' });
    } catch (err) {
      next(err);
    }
  },

  async copy(req, res, next) {
    try {
      const {
        branch_id,
        academic_year_id,
        source_class_id,
        source_group_id,
        target_class_id,
        target_group_id,
        subject_ids,
        mode = 'selected'
      } = req.body;

      if (!target_class_id) {
        return res.status(400).json({ success: false, message: 'Target class is required' });
      }

      let sourceQuery = knex('class_subjects')
        .where('class_id', Number(source_class_id));

      if (source_group_id) {
        sourceQuery = sourceQuery.where('group_id', Number(source_group_id));
      }
      if (Array.isArray(subject_ids) && subject_ids.length > 0 && mode === 'selected') {
        sourceQuery = sourceQuery.whereIn('id', subject_ids.map(Number));
      }

      const sources = await sourceQuery.select('*');
      if (sources.length === 0) {
        return res.status(400).json({ success: false, message: 'No subjects found to copy from the source class' });
      }

      const now = new Date();
      let copiedCount = 0;

      for (const s of sources) {
        // Check if subject with same code already exists in target
        const exists = await knex('class_subjects')
          .where({
            branch_id: Number(branch_id) || s.branch_id,
            class_id: Number(target_class_id),
            group_id: target_group_id ? Number(target_group_id) : null,
            subject_code: s.subject_code,
          })
          .first();

        if (!exists) {
          const newRow = {
            ...s,
            id: undefined,
            branch_id: Number(branch_id) || s.branch_id,
            academic_year_id: academic_year_id ? Number(academic_year_id) : s.academic_year_id,
            class_id: Number(target_class_id),
            group_id: target_group_id ? Number(target_group_id) : null,
            created_at: now,
            updated_at: now,
          };
          delete newRow.id;
          await knex('class_subjects').insert(newRow);
          copiedCount++;
        }
      }

      res.json({
        success: true,
        copied_count: copiedCount,
        message: `Successfully copied ${copiedCount} subjects to the target class.`
      });
    } catch (err) {
      next(err);
    }
  },

  async assign(req, res, next) {
    try {
      const { branch_id, academic_year_id, class_id, subject_ids } = req.body;
      const bId = Number(branch_id) || 1;
      const cId = Number(class_id);
      const ids = Array.isArray(subject_ids) ? subject_ids.map(Number) : [];

      if (!cId || ids.length === 0) {
        return res.status(400).json({ success: false, message: 'Class and subject IDs are required' });
      }

      const masterSubjects = await knex('subjects').whereIn('id', ids).select('*');
      const now = new Date();
      let assignedCount = 0;

      for (const ms of masterSubjects) {
        const sName = ms.subject_name || ms.name;
        const sCode = ms.subject_code || ms.code || `SUB${ms.id}`;
        const sType = ms.type || ms.subject_type || 'Core';

        const exists = await knex('class_subjects')
          .where({ branch_id: bId, class_id: cId, subject_code: sCode })
          .first();

        if (!exists) {
          await knex('class_subjects').insert({
            branch_id: bId,
            academic_year_id: academic_year_id ? Number(academic_year_id) : null,
            class_id: cId,
            subject_id: ms.id,
            subject_name: sName,
            subject_code: sCode,
            category_name: 'General',
            subject_type: sType === 'Core' || sType === 'Academic' ? 'Academic' : 'Non-Academic',
            requirement: 'Compulsory',
            weekly_periods: 5,
            created_at: now,
            updated_at: now,
          });
          assignedCount++;
        }
      }

      res.json({
        success: true,
        assigned_count: assignedCount,
        message: `Successfully assigned ${assignedCount} subjects to class.`
      });
    } catch (err) {
      next(err);
    }
  }
};

export default classSubjectController;
