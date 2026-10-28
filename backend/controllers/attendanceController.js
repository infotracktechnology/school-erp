import { sutando } from '../config/database.js';

const conn = () => sutando.connection();
const knex = (table) => conn().table(table);
const raw = (...args) => conn().raw(...args);

async function getSectionFilter(class_id, section_id, section_name, academic_year_id, academic_year) {
  let name = section_name;
  const numSecId = Number(section_id);

  if (!name && section_id && section_id !== 'all') {
    if (isNaN(numSecId)) {
      name = String(section_id).trim();
    } else {
      const directSec = await knex('sections').where('id', numSecId).first();
      if (directSec) {
        if (class_id && Number(directSec.class_id) === Number(class_id)) {
          name = directSec.section_name;
        } else if (numSecId <= 8) {
          const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
          name = letters[numSecId - 1] || directSec.section_name;
        } else {
          name = directSec.section_name;
        }
      } else {
        const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        if (numSecId >= 1 && numSecId <= letters.length) {
          name = letters[numSecId - 1];
        }
      }
    }
  }

  if (name && name !== 'all') {
    let secQuery = knex('sections').where('section_name', name);
    if (class_id && !isNaN(Number(class_id))) {
      secQuery = secQuery.where('class_id', Number(class_id));
    }
    const ayStr = (academic_year || '').trim();
    const ayId = Number(academic_year_id);
    if (ayStr && ayStr !== 'all' && ayStr !== 'undefined') {
      secQuery = secQuery.where((b) => {
        b.where('academic_year', ayStr);
        if (!isNaN(ayId) && ayId > 0) b.orWhere('academic_year_id', ayId);
      });
    } else if (!isNaN(ayId) && ayId > 0 && academic_year_id !== 'all' && academic_year_id !== 'undefined') {
      secQuery = secQuery.where('academic_year_id', ayId);
    }
    const secRows = await secQuery.select('id');
    const secIds = secRows.map(r => r.id);
    if (secIds.length > 0) {
      return { type: 'ids', values: secIds, name };
    }
    return { type: 'name', value: name };
  }

  if (!isNaN(numSecId) && numSecId > 0) {
    return { type: 'ids', values: [numSecId] };
  }

  return null;
}

function applySectionClause(query, secFilter, idCol = 's.section_id', nameCol = 'sec.section_name') {
  if (!secFilter) return query;
  if (secFilter.type === 'ids') {
    return query.whereIn(idCol, secFilter.values);
  }
  if (secFilter.type === 'name') {
    return query.where(nameCol, secFilter.value);
  }
  return query;
}

async function findActiveTimingAssignment({ branch_id, academic_year_id, academic_year, class_id, section_id }) {
  const bId = Number(branch_id) || 1;
  const cId = Number(class_id);
  const sId = section_id && section_id !== 'all' && !isNaN(Number(section_id)) ? Number(section_id) : null;
  const ayStr = (academic_year || '').trim();
  const ayId = Number(academic_year_id);

  if (!cId) return null;

  // 1. Try Section-specific assignment
  if (sId) {
    let q = knex('attendance_assignments as aa')
      .join('attendance_timings as at', 'aa.timing_id', 'at.id')
      .where({
        'aa.branch_id': bId,
        'aa.class_id': cId,
        'aa.section_id': sId,
        'aa.status': 'Active',
        'at.status': 'Active'
      });
    if (ayStr && ayStr !== 'all' && ayStr !== 'undefined') {
      q = q.where(b => {
        b.where('aa.academic_year', ayStr);
        if (!isNaN(ayId) && ayId > 0) b.orWhere('aa.academic_year_id', ayId);
      });
    } else if (!isNaN(ayId) && ayId > 0 && academic_year_id !== 'all' && academic_year_id !== 'undefined') {
      q = q.where('aa.academic_year_id', ayId);
    }
    const secRow = await q.select('at.*', 'aa.id as assignment_id', 'aa.timing_id as assigned_timing_id', 'aa.effective_from', 'aa.effective_to').orderBy('aa.id', 'desc').first();
    if (secRow) return secRow;
  }

  // 2. Try Class-wide assignment (section_id IS NULL)
  let clsQ = knex('attendance_assignments as aa')
    .join('attendance_timings as at', 'aa.timing_id', 'at.id')
    .where({
      'aa.branch_id': bId,
      'aa.class_id': cId,
      'aa.status': 'Active',
      'at.status': 'Active'
    })
    .whereNull('aa.section_id');
  if (ayStr && ayStr !== 'all' && ayStr !== 'undefined') {
    clsQ = clsQ.where(b => {
      b.where('aa.academic_year', ayStr);
      if (!isNaN(ayId) && ayId > 0) b.orWhere('aa.academic_year_id', ayId);
    });
  } else if (!isNaN(ayId) && ayId > 0 && academic_year_id !== 'all' && academic_year_id !== 'undefined') {
    clsQ = clsQ.where('aa.academic_year_id', ayId);
  }
  const clsRow = await clsQ.select('at.*', 'aa.id as assignment_id', 'aa.timing_id as assigned_timing_id', 'aa.effective_from', 'aa.effective_to').orderBy('aa.id', 'desc').first();
  if (clsRow) return clsRow;

  return null;
}

export const attendanceController = {
  async list(req, res, next) {
    try {
      const { branch_id, academic_year_id, academic_year, date, class_id, section_id } = req.query;
      let query = knex('attendance as a')
        .leftJoin('students as s', 'a.student_id', 's.id')
        .leftJoin('student_profiles as sp', 's.user_id', 'sp.user_id')
        .leftJoin('sections as sec', 's.section_id', 'sec.id');

      if (branch_id && branch_id !== 'all' && !isNaN(Number(branch_id))) {
        query = query.where('a.branch_id', Number(branch_id));
      }
      const ayStr = (academic_year || req.query.academic_year_name || '').trim();
      const ayId = Number(academic_year_id);
      if (ayStr && ayStr !== 'all' && ayStr !== 'undefined') {
        query = query.where((b) => {
          b.where('a.academic_year', ayStr)
            .orWhere('s.academic_year', ayStr)
            .orWhere('sec.academic_year', ayStr);
        });
      } else if (!isNaN(ayId) && ayId > 0 && academic_year_id !== 'all' && academic_year_id !== 'undefined') {
        query = query.where((b) => {
          b.where('a.academic_year_id', ayId)
            .orWhere('sec.academic_year_id', ayId);
        });
      }
      if (date) {
        query = query.where('a.date', date);
      }
      if (class_id && class_id !== 'all' && !isNaN(Number(class_id))) {
        query = query.where('s.class_id', Number(class_id));
      }
      if (section_id && section_id !== 'all') {
        if (!isNaN(Number(section_id))) {
          query = query.where('s.section_id', Number(section_id));
        } else {
          query = query.where('sec.section_name', section_id);
        }
      }

      const rows = await query.select(
        'a.id',
        'a.branch_id',
        'a.student_id',
        'a.date',
        'a.status',
        's.admission_no as admission_number',
        'sp.first_name',
        'sp.last_name'
      );

      res.json({ success: true, data: rows, attendances: rows });
    } catch (err) {
      next(err);
    }
  },

  async markAttendance(req, res, next) {
    try {
      const { branch_id = 1, date, records } = req.body;
      const now = new Date();

      if (Array.isArray(records)) {
        for (const r of records) {
          const sId = Number(r.student_id || r.id);
          const status = r.status || 'Present';
          const existing = await knex('attendance')
            .where({ student_id: sId, date })
            .first();

          if (existing) {
            await knex('attendance')
              .where('id', existing.id)
              .update({ status, updated_at: now });
          } else {
            await knex('attendance').insert({
              branch_id,
              student_id: sId,
              date,
              status,
              created_at: now,
              updated_at: now,
            });
          }
        }
      }
      res.json({ success: true, message: 'Attendance recorded successfully' });
    } catch (err) {
      next(err);
    }
  },

  async checkExisting(req, res, next) {
    try {
      const { branch_id, academic_year_id, class_id, section_id, section_name, date } = req.query;
      const secFilter = await getSectionFilter(class_id, section_id, section_name, academic_year_id);

      let query = knex('attendance as a')
        .leftJoin('students as s', 'a.student_id', 's.id')
        .leftJoin('sections as sec', 's.section_id', 'sec.id')
        .where('a.date', date);

      if (branch_id && branch_id !== 'all' && !isNaN(Number(branch_id))) {
        query = query.where('a.branch_id', Number(branch_id));
      }
      if (class_id && class_id !== 'all' && !isNaN(Number(class_id))) {
        query = query.where('s.class_id', Number(class_id));
      }
      query = applySectionClause(query, secFilter, 's.section_id');

      const rows = await query.select('a.id');
      const exists = rows.length > 0;
      res.json({ success: true, exists, count: rows.length });
    } catch (err) {
      next(err);
    }
  },

  async getTimings(req, res, next) {
    try {
      const { branch_id, academic_year_id, academic_year } = req.query;
      let query = knex('attendance_timings');
      if (branch_id && branch_id !== 'all' && !isNaN(Number(branch_id))) {
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
      const rows = await query.select('*').orderBy('id', 'asc');
      res.json({ success: true, timings: rows, data: rows });
    } catch (err) {
      next(err);
    }
  },

  async createTiming(req, res, next) {
    try {
      const {
        branch_id = 1,
        academic_year_id,
        academic_year,
        name,
        session_1_name = 'Morning Session',
        session_2_name = 'Afternoon Session',
        is_second_session = true,
        morning_start_time = '08:30',
        morning_end_time = '12:30',
        afternoon_start_time = '13:30',
        afternoon_end_time = '16:00',
        start_time,
        end_time,
        grace_period = 0,
        status = 'Active',
        description = ''
      } = req.body;
      const now = new Date();
      const isSecond = Boolean(is_second_session);

      let effectiveAyStr = (academic_year || '').trim();
      let effectiveAyId = Number(academic_year_id) || null;
      if (!effectiveAyStr && effectiveAyId) {
        const ayRow = await knex('academic_years').where('id', effectiveAyId).first();
        if (ayRow) effectiveAyStr = ayRow.year_name || ayRow.name;
      }
      if (!effectiveAyStr) {
        const curr = await knex('academic_years').where('is_current', 1).orWhere('is_active', 1).first();
        if (curr) {
          effectiveAyStr = curr.year_name || curr.name;
          if (!effectiveAyId) effectiveAyId = curr.id;
        }
      }

      const [id] = await knex('attendance_timings').insert({
        branch_id: Number(branch_id) || 1,
        academic_year_id: effectiveAyId,
        academic_year: effectiveAyStr,
        name,
        session_1_name: session_1_name || 'Morning Session',
        session_2_name: isSecond ? (session_2_name || 'Afternoon Session') : '',
        is_second_session: isSecond ? 1 : 0,
        start_time: morning_start_time || start_time || '08:30',
        end_time: isSecond ? (afternoon_end_time || end_time || '16:00') : (morning_end_time || '12:30'),
        morning_start_time: morning_start_time || '08:30',
        morning_end_time: morning_end_time || '12:30',
        afternoon_start_time: isSecond ? (afternoon_start_time || '13:30') : null,
        afternoon_end_time: isSecond ? (afternoon_end_time || '16:00') : null,
        grace_period: Number(grace_period || 0),
        status,
        description,
        created_at: now,
        updated_at: now,
      });
      const timing = await knex('attendance_timings').where('id', id).first();
      res.status(201).json({ success: true, timing, data: timing });
    } catch (err) {
      next(err);
    }
  },

  async updateTiming(req, res, next) {
    try {
      const { id } = req.params;
      const {
        name,
        session_1_name,
        session_2_name,
        is_second_session,
        morning_start_time,
        morning_end_time,
        afternoon_start_time,
        afternoon_end_time,
        start_time,
        end_time,
        grace_period,
        status,
        description,
        academic_year,
        academic_year_id
      } = req.body;
      const updates = { updated_at: new Date() };
      if (name !== undefined) updates.name = name;
      if (session_1_name !== undefined) updates.session_1_name = session_1_name;
      if (session_2_name !== undefined) updates.session_2_name = session_2_name;
      if (is_second_session !== undefined) updates.is_second_session = is_second_session ? 1 : 0;
      if (morning_start_time !== undefined) {
        updates.morning_start_time = morning_start_time;
        updates.start_time = morning_start_time;
      } else if (start_time !== undefined) {
        updates.start_time = start_time;
        updates.morning_start_time = start_time;
      }
      if (morning_end_time !== undefined) updates.morning_end_time = morning_end_time;
      if (afternoon_start_time !== undefined) updates.afternoon_start_time = afternoon_start_time;
      if (afternoon_end_time !== undefined) {
        updates.afternoon_end_time = afternoon_end_time;
        updates.end_time = afternoon_end_time;
      } else if (end_time !== undefined) {
        updates.end_time = end_time;
        updates.afternoon_end_time = end_time;
      }
      if (grace_period !== undefined) updates.grace_period = grace_period;
      if (status !== undefined) updates.status = status;
      if (description !== undefined) updates.description = description;
      if (academic_year !== undefined) updates.academic_year = academic_year;
      if (academic_year_id !== undefined) updates.academic_year_id = Number(academic_year_id);

      await knex('attendance_timings').where('id', id).update(updates);
      const timing = await knex('attendance_timings').where('id', id).first();
      res.json({ success: true, timing, data: timing });
    } catch (err) {
      next(err);
    }
  },

  async toggleTimingStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await knex('attendance_timings').where('id', id).update({ status, updated_at: new Date() });
      res.json({ success: true, message: 'Timing status updated' });
    } catch (err) {
      next(err);
    }
  },

  async getAssignments(req, res, next) {
    try {
      const { branch_id, academic_year_id, academic_year } = req.query;
      let query = knex('attendance_assignments as aa')
        .leftJoin('attendance_timings as at', 'aa.timing_id', 'at.id')
        .leftJoin('classes as c', 'aa.class_id', 'c.id')
        .leftJoin('sections as s', 'aa.section_id', 's.id');

      if (branch_id && branch_id !== 'all' && !isNaN(Number(branch_id))) {
        query = query.where('aa.branch_id', Number(branch_id));
      }
      const ayStr = (academic_year || req.query.academic_year_name || '').trim();
      const ayId = Number(academic_year_id);
      if (ayStr && ayStr !== 'all' && ayStr !== 'undefined') {
        query = query.where((b) => {
          b.where('aa.academic_year', ayStr);
          if (!isNaN(ayId) && ayId > 0) b.orWhere('aa.academic_year_id', ayId);
        });
      } else if (!isNaN(ayId) && ayId > 0 && academic_year_id !== 'all' && academic_year_id !== 'undefined') {
        query = query.where('aa.academic_year_id', ayId);
      }

      const rows = await query.select(
        'aa.*',
        'aa.timing_id as attendance_timing_id',
        'at.name as timing_name',
        'at.morning_start_time',
        'at.morning_end_time',
        'at.afternoon_start_time',
        'at.afternoon_end_time',
        'at.start_time',
        'at.end_time',
        'c.class_name as class_name',
        's.section_name as section_name'
      );
      res.json({ success: true, assignments: rows, data: rows });
    } catch (err) {
      next(err);
    }
  },

  async createAssignment(req, res, next) {
    try {
      const {
        branch_id = 1,
        academic_year_id,
        academic_year,
        timing_id,
        attendance_timing_id,
        class_id,
        section_id,
        effective_from,
        effective_to,
        status = 'Active'
      } = req.body;
      const now = new Date();
      const effectiveTimingId = timing_id || attendance_timing_id;

      let effectiveAyStr = (academic_year || '').trim();
      let effectiveAyId = Number(academic_year_id) || null;
      if (!effectiveAyStr && effectiveAyId) {
        const ayRow = await knex('academic_years').where('id', effectiveAyId).first();
        if (ayRow) effectiveAyStr = ayRow.year_name || ayRow.name;
      }
      if (!effectiveAyStr) {
        const curr = await knex('academic_years').where('is_current', 1).orWhere('is_active', 1).first();
        if (curr) {
          effectiveAyStr = curr.year_name || curr.name;
          if (!effectiveAyId) effectiveAyId = curr.id;
        }
      }

      const [id] = await knex('attendance_assignments').insert({
        branch_id: Number(branch_id) || 1,
        academic_year_id: effectiveAyId,
        academic_year: effectiveAyStr,
        timing_id: effectiveTimingId,
        class_id,
        section_id: section_id === 'all' ? null : section_id,
        effective_from: effective_from || now.toISOString().split('T')[0],
        effective_to: effective_to || null,
        status,
        created_at: now,
        updated_at: now,
      });
      const assignment = await knex('attendance_assignments').where('id', id).first();
      res.status(201).json({ success: true, assignment, data: assignment });
    } catch (err) {
      next(err);
    }
  },

  async toggleAssignmentStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await knex('attendance_assignments').where('id', id).update({ status, updated_at: new Date() });
      res.json({ success: true, message: 'Assignment status updated' });
    } catch (err) {
      next(err);
    }
  },

  async deleteAssignment(req, res, next) {
    try {
      const { id } = req.params;
      await knex('attendance_assignments').where('id', id).del();
      res.json({ success: true, message: 'Assignment deleted' });
    } catch (err) {
      next(err);
    }
  },

  async getStudentsToMark(req, res, next) {
    try {
      const { branch_id, academic_year_id, academic_year, class_id, section_id, section_name, date, timing_id } = req.query;
      if (!branch_id || !class_id) {
        return res.status(400).json({ error: 'Branch and Class are required' });
      }

      const effDate = date || new Date().toISOString().split('T')[0];
      const secFilter = await getSectionFilter(class_id, section_id, section_name, academic_year_id, academic_year);

      let query = knex('students as s')
        .leftJoin('student_profiles as sp', 's.user_id', 'sp.user_id')
        .leftJoin('classes as c', 's.class_id', 'c.id')
        .leftJoin('sections as sec', 's.section_id', 'sec.id')
        .leftJoin('parents as p', 's.parent_id', 'p.id')
        .leftJoin('attendance as att', function () {
          this.on('att.student_id', '=', 's.id')
            .andOnVal('att.date', '=', effDate);
        });

      if (branch_id && branch_id !== 'all' && !isNaN(Number(branch_id))) {
        query = query.where('s.branch_id', Number(branch_id));
      }
      if (class_id && class_id !== 'all' && !isNaN(Number(class_id))) {
        query = query.where('s.class_id', Number(class_id));
      }
      query = applySectionClause(query, secFilter, 's.section_id');

      const ayStr = (academic_year || req.query.academic_year_name || '').trim();
      const ayId = Number(academic_year_id);
      if (ayStr && ayStr !== 'all' && ayStr !== 'undefined') {
        query = query.where((qb) => {
          qb.where('s.academic_year', ayStr)
            .orWhere('sec.academic_year', ayStr)
            .orWhereExists(function() {
              this.select('id').from('student_promotions')
                .whereRaw('student_promotions.student_id = s.id')
                .andWhere((pb) => {
                  pb.where('student_promotions.to_academic_year', ayStr)
                    .orWhere('student_promotions.from_academic_year', ayStr);
                });
            });
        });
      } else if (!isNaN(ayId) && ayId > 0 && academic_year_id !== 'all' && academic_year_id !== 'undefined') {
        query = query.where((qb) => {
          qb.where('sec.academic_year_id', ayId)
            .orWhere('s.academic_year_id', ayId)
            .orWhereExists(function() {
              this.select('id').from('student_promotions')
                .whereRaw('student_promotions.student_id = s.id')
                .andWhere((pb) => {
                  pb.where('student_promotions.to_academic_year_id', ayId)
                    .orWhere('student_promotions.from_academic_year_id', ayId);
                });
            });
        });
      }

      query = query.where('s.status', 'Active');

      const rawRows = await query.select(
        's.id as student_id',
        's.admission_no as admission_number',
        'sp.first_name',
        'sp.last_name',
        's.gender as student_gender',
        'sp.gender as profile_gender',
        's.status as enrollment_status',
        's.status as current_status',
        'sp.extra_details',
        'c.class_name',
        'c.numeric_value',
        'sec.section_name',
        'p.father_name as parent_father_name',
        'sp.parent_name as profile_parent_name',
        'p.phone as parent_phone',
        'sp.parent_phone as profile_parent_phone',
        'p.mother_name',
        'att.id as attendance_id',
        'att.status as marked_status',
        'att.morning_status as marked_morning_status',
        'att.afternoon_status as marked_afternoon_status',
        'att.remarks as marked_remarks',
        'att.custom_remark as marked_custom_remark'
      ).orderBy('s.id', 'asc');

      const rows = rawRows.map((r, idx) => {
        let extra = {};
        if (r.extra_details) {
          try {
            extra = typeof r.extra_details === 'string' ? JSON.parse(r.extra_details) : r.extra_details;
          } catch (e) {
            extra = {};
          }
        }
        const fn = r.first_name || '';
        const ln = r.last_name || '';
        const fullName = `${fn} ${ln}`.trim() || `Student #${r.student_id}`;
        return {
          ...extra,
          student_id: r.student_id,
          id: r.student_id,
          admission_number: r.admission_number || `ADM-${r.student_id}`,
          first_name: fn,
          last_name: ln,
          full_name: fullName,
          class_name: r.class_name || `Class ${r.student_id}`,
          section_name: r.section_name || '',
          roll_number: extra.roll_number || r.numeric_value || (idx + 1),
          gender: r.student_gender || r.profile_gender || extra.gender || 'Male',
          father_name: r.parent_father_name || r.profile_parent_name || extra.father_name || 'Parent',
          father_mobile: r.parent_phone || r.profile_parent_phone || extra.father_mobile || '',
          mother_name: r.mother_name || extra.mother_name || '',
          student_photo: null,
          enrollment_status: r.enrollment_status,
          current_status: r.current_status,
          attendance_id: r.attendance_id,
          marked_status: r.marked_status,
          marked_morning_status: r.marked_morning_status || r.marked_status,
          marked_afternoon_status: r.marked_afternoon_status || r.marked_status,
          marked_remarks: r.marked_remarks,
          marked_custom_remark: r.marked_custom_remark,
        };
      });

      // Check if an active attendance timing schedule is mapped to this class/section
      const timingAssignment = await findActiveTimingAssignment({
        branch_id,
        academic_year_id,
        academic_year: ayStr,
        class_id,
        section_id: (secFilter?.type === 'ids' && secFilter.values.length === 1) ? secFilter.values[0] : section_id
      });

      res.json({
        success: true,
        has_timing_mapping: Boolean(timingAssignment),
        timing: timingAssignment || null,
        students: rows,
        data: rows
      });
    } catch (err) {
      next(err);
    }
  },

  async submitAttendance(req, res, next) {
    try {
      const {
        branch_id = 1,
        academic_year_id = 3,
        academic_year,
        class_id,
        section_id,
        attendance_date,
        date,
        timing_id = 1,
        attendance_timing_id,
        submitted_by = 'Teacher',
        updated_by,
        is_edit = false,
        records = []
      } = req.body;

      const effectiveDate = attendance_date || date || new Date().toISOString().split('T')[0];
      const effectiveUpdatedBy = updated_by || submitted_by;
      const now = new Date();

      let effectiveAyStr = (academic_year || '').trim();
      let effectiveAyId = Number(academic_year_id) || 1;
      if (!effectiveAyStr && effectiveAyId) {
        const ayRow = await knex('academic_years').where('id', effectiveAyId).first();
        if (ayRow) effectiveAyStr = ayRow.year_name || ayRow.name;
      }
      if (!effectiveAyStr) {
        const curr = await knex('academic_years').where('is_current', 1).orWhere('is_active', 1).first();
        if (curr) {
          effectiveAyStr = curr.year_name || curr.name;
          effectiveAyId = curr.id;
        }
      }

      // Check whether timing is mapped to this class/section
      const timingAssignment = await findActiveTimingAssignment({
        branch_id,
        academic_year_id: effectiveAyId,
        academic_year: effectiveAyStr,
        class_id,
        section_id
      });

      if (!timingAssignment) {
        return res.status(400).json({
          success: false,
          error: 'Cannot record attendance: No active attendance timing schedule is mapped to this class/section for the current academic year. Please map attendance timings in "Class & Section Timing Mapping" before taking attendance.'
        });
      }

      const effectiveTimingId = timingAssignment.assigned_timing_id || timingAssignment.id;

      if (!records || records.length === 0) {
        return res.status(400).json({ error: 'No attendance records provided' });
      }

      const absentStudents = [];

      for (const rec of records) {
        const studentId = Number(rec.student_id || rec.id);
        const newStatus = rec.status || 'Present';
        const remarks = rec.remarks || null;
        const customRemark = rec.custom_remark || null;

        const existing = await knex('attendance')
          .where({
            student_id: studentId,
            date: effectiveDate
          })
          .first();

        const morningStatus = rec.morning_status || rec.morning || newStatus;
        const afternoonStatus = rec.afternoon_status || rec.afternoon || newStatus;

        // Compute overall status when morning & afternoon are provided
        let effectiveStatus = rec.status;
        if (morningStatus && afternoonStatus) {
          if (morningStatus === 'Present' && afternoonStatus === 'Present') {
            effectiveStatus = 'Present';
          } else if (morningStatus === 'Absent' && afternoonStatus === 'Absent') {
            effectiveStatus = 'Absent';
          } else if (morningStatus === 'Leave' && afternoonStatus === 'Leave') {
            effectiveStatus = 'Leave';
          } else if (morningStatus === 'Late' && afternoonStatus === 'Late') {
            effectiveStatus = 'Late';
          } else if (
            (morningStatus === 'Absent' && (afternoonStatus === 'Present' || afternoonStatus === 'Late')) ||
            (afternoonStatus === 'Absent' && (morningStatus === 'Present' || morningStatus === 'Late'))
          ) {
            effectiveStatus = 'Half Day';
          } else if (
            (morningStatus === 'Leave' && (afternoonStatus === 'Present' || afternoonStatus === 'Late')) ||
            (afternoonStatus === 'Leave' && (morningStatus === 'Present' || morningStatus === 'Late'))
          ) {
            effectiveStatus = 'Half Day';
          } else {
            effectiveStatus = rec.status || 'Half Day';
          }
        } else {
          effectiveStatus = newStatus;
        }

        if (existing) {
          await knex('attendance')
            .where('id', existing.id)
            .update({
              status: effectiveStatus,
              morning_status: morningStatus,
              afternoon_status: afternoonStatus,
              remarks,
              custom_remark: customRemark,
              class_id: class_id || existing.class_id,
              section_id: section_id || existing.section_id,
              academic_year: effectiveAyStr || existing.academic_year,
              academic_year_id: effectiveAyId || existing.academic_year_id,
              timing_id: effectiveTimingId,
              updated_by: effectiveUpdatedBy,
              updated_at: now
            });
        } else {
          await knex('attendance').insert({
            branch_id: Number(branch_id) || 1,
            academic_year: effectiveAyStr,
            academic_year_id: effectiveAyId,
            class_id: class_id ? Number(class_id) : null,
            section_id: section_id ? Number(section_id) : null,
            timing_id: effectiveTimingId,
            student_id: studentId,
            date: effectiveDate,
            status: effectiveStatus,
            morning_status: morningStatus,
            afternoon_status: afternoonStatus,
            remarks,
            custom_remark: customRemark,
            submitted_by,
            updated_by: effectiveUpdatedBy,
            created_at: now,
            updated_at: now
          });
        }

        if (effectiveStatus === 'Absent') {
          const st = await knex('students as s')
            .leftJoin('student_profiles as sp', 's.user_id', 'sp.user_id')
            .leftJoin('classes as c', 's.class_id', 'c.id')
            .leftJoin('sections as sec', 's.section_id', 'sec.id')
            .leftJoin('parents as p', 's.parent_id', 'p.id')
            .where('s.id', studentId)
            .select(
              's.id as student_id',
              's.admission_no as admission_number',
              'sp.first_name',
              'sp.last_name',
              'c.class_name',
              'sec.section_name',
              'p.father_name as parent_father_name',
              'sp.parent_name as profile_parent_name',
              'p.phone as parent_phone',
              'sp.parent_phone as profile_parent_phone',
              'p.mother_name'
            )
            .first();
          if (st) {
            absentStudents.push({
              ...st,
              father_name: st.parent_father_name || st.profile_parent_name || 'Parent',
              father_mobile: st.parent_phone || st.profile_parent_phone || ''
            });
          }
        }
      }

      res.json({
        success: true,
        message: 'Attendance submitted successfully',
        absent_count: absentStudents.length,
        absent_students: absentStudents
      });
    } catch (err) {
      next(err);
    }
  },

  async getHistory(req, res, next) {
    try {
      const { branch_id, academic_year_id, academic_year, date, class_id, section_id } = req.query;
      const bId = branch_id && branch_id !== 'all' ? Number(branch_id) : 1;

      let whereConditions = ['a.branch_id = ?'];
      let bindings = [bId];

      if (date) {
        whereConditions.push('a.date = ?');
        bindings.push(date);
      }
      if (class_id && class_id !== 'all') {
        whereConditions.push('COALESCE(a.class_id, st.class_id) = ?');
        bindings.push(Number(class_id));
      }
      if (section_id && section_id !== 'all') {
        if (!isNaN(Number(section_id))) {
          whereConditions.push('COALESCE(a.section_id, st.section_id) = ?');
          bindings.push(Number(section_id));
        } else {
          whereConditions.push('sec.section_name = ?');
          bindings.push(section_id);
        }
      }

      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

      const sql = `
        SELECT 
          a.date as attendance_date,
          COALESCE(a.class_id, st.class_id) as class_id,
          c.class_name,
          COALESCE(a.section_id, st.section_id) as section_id,
          sec.section_name,
          a.timing_id as attendance_timing_id,
          a.timing_id,
          COALESCE(at.name, 'Regular Schedule') as timing_name,
          COALESCE(at.start_time, '08:30') as start_time,
          COALESCE(at.end_time, '12:30') as end_time,
          COUNT(a.id) as total_students,
          CAST(SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS SIGNED) as present_count,
          CAST(SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) AS SIGNED) as absent_count,
          CAST(SUM(CASE WHEN a.status = 'Leave' THEN 1 ELSE 0 END) AS SIGNED) as leave_count,
          CAST(SUM(CASE WHEN a.status = 'Late' THEN 1 ELSE 0 END) AS SIGNED) as late_count,
          COALESCE(MAX(a.submitted_by), 'Super Admin') as submitted_by,
          MAX(a.created_at) as submitted_at
        FROM attendance a
        LEFT JOIN students st ON a.student_id = st.id
        LEFT JOIN classes c ON c.id = COALESCE(a.class_id, st.class_id)
        LEFT JOIN sections sec ON sec.id = COALESCE(a.section_id, st.section_id)
        LEFT JOIN attendance_timings at ON at.id = a.timing_id
        ${whereClause}
        GROUP BY 
          a.date, 
          COALESCE(a.class_id, st.class_id), 
          c.class_name, 
          COALESCE(a.section_id, st.section_id), 
          sec.section_name, 
          a.timing_id, 
          at.name, 
          at.start_time, 
          at.end_time
        ORDER BY a.date DESC, c.class_name ASC, sec.section_name ASC
      `;

      const [rows] = await sutando.connection().raw(sql, bindings);
      const history = (rows || []).map(r => {
        const total = Number(r.total_students || 0);
        const present = Number(r.present_count || 0);
        return {
          ...r,
          total_students: total,
          present_count: present,
          absent_count: Number(r.absent_count || 0),
          leave_count: Number(r.leave_count || 0),
          late_count: Number(r.late_count || 0),
          attendance_percentage: total > 0 ? Math.round((present / total) * 100) : 0
        };
      });

      res.json({ success: true, history, data: history });
    } catch (err) {
      next(err);
    }
  },

  async getRecordDetails(req, res, next) {
    try {
      const { branch_id, class_id, section_id, section_name, date, timing_id } = req.query;
      const effDate = date || new Date().toISOString().split('T')[0];
      const bId = branch_id && branch_id !== 'all' ? Number(branch_id) : 1;

      let whereSql = ['a.branch_id = ?', 'a.date = ?'];
      let bindings = [bId, effDate];

      if (class_id && class_id !== 'all') {
        whereSql.push('COALESCE(a.class_id, st.class_id) = ?');
        bindings.push(Number(class_id));
      }
      if (section_id && section_id !== 'all') {
        if (!isNaN(Number(section_id))) {
          whereSql.push('COALESCE(a.section_id, st.section_id) = ?');
          bindings.push(Number(section_id));
        } else {
          whereSql.push('sec.section_name = ?');
          bindings.push(section_id);
        }
      }
      if (timing_id && timing_id !== 'all' && timing_id !== 'undefined') {
        whereSql.push('a.timing_id = ?');
        bindings.push(Number(timing_id));
      }

      const sql = `
        SELECT 
          a.id as record_id,
          a.id,
          a.date as attendance_date,
          a.status,
          a.remarks,
          a.custom_remark,
          a.timing_id,
          st.id as student_id,
          st.admission_no as admission_number,
          st.roll_number,
          sp.first_name,
          sp.last_name,
          sp.extra_details,
          c.class_name,
          sec.section_name
        FROM attendance a
        LEFT JOIN students st ON a.student_id = st.id
        LEFT JOIN student_profiles sp ON st.user_id = sp.user_id
        LEFT JOIN classes c ON c.id = COALESCE(a.class_id, st.class_id)
        LEFT JOIN sections sec ON sec.id = COALESCE(a.section_id, st.section_id)
        WHERE ${whereSql.join(' AND ')}
        ORDER BY st.id ASC
      `;

      const [rows] = await sutando.connection().raw(sql, bindings);
      const mappedRecords = (rows || []).map((r, idx) => {
        let extra = {};
        if (r.extra_details) {
          try {
            extra = typeof r.extra_details === 'string' ? JSON.parse(r.extra_details) : r.extra_details;
          } catch(e) {}
        }
        return {
          ...r,
          record_id: r.record_id || r.id,
          roll_number: r.roll_number || extra.roll_number || (idx + 1),
          first_name: r.first_name || '',
          last_name: r.last_name || ''
        };
      });

      // Get audits for these records
      const attIds = mappedRecords.map(r => r.record_id);
      let audits = [];
      if (attIds.length > 0) {
        const [auditRows] = await sutando.connection().raw(`
          SELECT 
            au.id,
            au.attendance_id,
            au.student_id,
            au.previous_status,
            au.new_status,
            au.reason,
            au.changed_by,
            au.changed_at,
            COALESCE(sp.first_name, '') as first_name,
            COALESCE(sp.last_name, '') as last_name,
            s.admission_no as admission_number
          FROM attendance_audits au
          LEFT JOIN students s ON au.student_id = s.id
          LEFT JOIN student_profiles sp ON s.user_id = sp.user_id
          WHERE au.attendance_id IN (${attIds.map(() => '?').join(',')})
          ORDER BY au.changed_at DESC
        `, attIds);
        audits = auditRows || [];
      }

      const summary = {
        total: mappedRecords.length,
        present: mappedRecords.filter((r) => r.status === 'Present').length,
        absent: mappedRecords.filter((r) => r.status === 'Absent').length,
        leave: mappedRecords.filter((r) => r.status === 'Leave').length,
        late: mappedRecords.filter((r) => r.status === 'Late').length,
      };

      res.json({ success: true, summary, records: mappedRecords, audits, data: { summary, records: mappedRecords, audits } });
    } catch (err) {
      next(err);
    }
  },

  async updateSingleRecord(req, res, next) {
    try {
      const { record_id, new_status, reason, changed_by = 'Super Admin' } = req.body;
      if (!record_id) {
        return res.status(400).json({ success: false, error: 'Record ID is required' });
      }
      if (!reason || !reason.trim()) {
        return res.status(400).json({ success: false, error: 'Mandatory reason is required to update attendance.' });
      }

      const attRecord = await knex('attendance').where('id', record_id).first();
      if (!attRecord) {
        return res.status(404).json({ success: false, error: 'Attendance record not found' });
      }

      const previousStatus = attRecord.status;

      await knex('attendance').where('id', record_id).update({
        status: new_status,
        updated_by: changed_by,
        updated_at: new Date()
      });

      await knex('attendance_audits').insert({
        attendance_id: record_id,
        student_id: attRecord.student_id,
        previous_status: previousStatus,
        new_status: new_status,
        reason: reason.trim(),
        changed_by,
        changed_at: new Date()
      });

      res.json({ success: true, message: 'Attendance record updated and audit logged' });
    } catch (err) {
      next(err);
    }
  },

  async getMonthlyReport(req, res, next) {
    try {
      const { branch_id, academic_year_id, class_id, section_id, section_name, month } = req.query;
      const targetMonth = month || new Date().toISOString().slice(0, 7);
      const secFilter = await getSectionFilter(class_id, section_id, section_name, academic_year_id);

      let studentQuery = knex('students as s')
        .leftJoin('student_profiles as sp', 's.user_id', 'sp.user_id')
        .leftJoin('classes as c', 's.class_id', 'c.id')
        .leftJoin('sections as sec', 's.section_id', 'sec.id')
        .where('s.status', 'Active');

      if (branch_id && branch_id !== 'all') studentQuery = studentQuery.where('s.branch_id', Number(branch_id));
      if (class_id && class_id !== 'all') studentQuery = studentQuery.where('s.class_id', Number(class_id));
      studentQuery = applySectionClause(studentQuery, secFilter, 's.section_id');

      const students = await studentQuery.select(
        's.id as student_id',
        's.admission_no as admission_number',
        'sp.first_name',
        'sp.last_name',
        'c.class_name',
        'sec.section_name'
      ).orderBy('s.id', 'asc');

      const sIds = students.map((st) => st.student_id);
      let attendanceRecords = [];
      if (sIds.length > 0) {
        attendanceRecords = await knex('attendance')
          .whereIn('student_id', sIds)
          .where('date', 'like', `${targetMonth}%`)
          .select('student_id', 'date', 'status', 'remarks');
      }

      res.json({ success: true, students, attendance: attendanceRecords, data: { students, attendance: attendanceRecords } });
    } catch (err) {
      next(err);
    }
  },

  async getAbsentReport(req, res, next) {
    try {
      const { branch_id, academic_year_id, from_date, to_date, class_id, section_id, section_name } = req.query;
      const secFilter = await getSectionFilter(class_id, section_id, section_name, academic_year_id);

      let query = knex('attendance as a')
        .leftJoin('students as s', 'a.student_id', 's.id')
        .leftJoin('student_profiles as sp', 's.user_id', 'sp.user_id')
        .leftJoin('classes as c', 's.class_id', 'c.id')
        .leftJoin('sections as sec', 's.section_id', 'sec.id')
        .leftJoin('parents as p', 's.parent_id', 'p.id')
        .where('a.status', 'Absent');

      if (branch_id && branch_id !== 'all') query = query.where('a.branch_id', Number(branch_id));
      if (from_date) query = query.where('a.date', '>=', from_date);
      if (to_date) query = query.where('a.date', '<=', to_date);
      if (class_id && class_id !== 'all') query = query.where('s.class_id', Number(class_id));
      query = applySectionClause(query, secFilter, 's.section_id');

      const rawRows = await query.select(
        'a.id',
        'a.date',
        'a.status',
        'a.remarks',
        's.id as student_id',
        's.admission_no as admission_number',
        'sp.first_name',
        'sp.last_name',
        'c.class_name',
        'sec.section_name',
        'p.father_name as parent_father_name',
        'sp.parent_name as profile_parent_name',
        'p.phone as parent_phone',
        'sp.parent_phone as profile_parent_phone'
      ).orderBy('a.date', 'desc');

      const rows = rawRows.map((r) => ({
        ...r,
        father_name: r.parent_father_name || r.profile_parent_name || 'Parent',
        father_mobile: r.parent_phone || r.profile_parent_phone || '',
      }));

      res.json({ success: true, absent_records: rows, data: rows });
    } catch (err) {
      next(err);
    }
  },

  async getSummary(req, res, next) {
    try {
      const { branch_id, date } = req.query;
      const effDate = date || new Date().toISOString().split('T')[0];

      let query = knex('attendance as a').where('a.date', effDate);
      if (branch_id && branch_id !== 'all') query = query.where('a.branch_id', Number(branch_id));

      const rows = await query.select('a.status');
      const total = rows.length;
      const present = rows.filter((r) => r.status === 'Present').length;
      const absent = rows.filter((r) => r.status === 'Absent').length;
      const leave = rows.filter((r) => r.status === 'Leave').length;
      const late = rows.filter((r) => r.status === 'Late').length;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

      res.json({ success: true, total, present, absent, leave, late, percentage });
    } catch (err) {
      next(err);
    }
  },

  async resolveTiming(req, res, next) {
    try {
      const { branch_id, academic_year_id, academic_year, class_id, section_id } = req.query;
      const timing = await findActiveTimingAssignment({
        branch_id,
        academic_year_id,
        academic_year: academic_year || req.query.academic_year_name,
        class_id,
        section_id
      });

      const mapped = Boolean(timing);
      res.json({
        success: true,
        mapped,
        has_timing_mapping: mapped,
        timing: timing || null,
        data: timing || null,
        message: mapped
          ? 'Timing mapped successfully'
          : 'No active attendance timing schedule is mapped to this class/section.'
      });
    } catch (err) {
      next(err);
    }
  },

  async getRemarks(req, res, next) {
    try {
      res.json({
        success: true,
        remarks: [
          { id: 1, name: 'Medical Leave', text: 'Medical Leave', code: 'MED', status: 'Active' },
          { id: 2, name: 'Family Function', text: 'Family Function', code: 'FAM', status: 'Active' },
          { id: 3, name: 'Late Arrival with Permission', text: 'Late Arrival with Permission', code: 'LATE_P', status: 'Active' },
          { id: 4, name: 'Disciplinary Absence', text: 'Disciplinary Absence', code: 'DISC', status: 'Active' },
          { id: 5, name: 'Sports / Inter-school Event', text: 'Sports / Inter-school Event', code: 'SPORTS', status: 'Active' }
        ]
      });
    } catch (err) {
      next(err);
    }
  },

  // -------------------------------------------------------------
  // REPORTS ENGINE
  // -------------------------------------------------------------

  async getDailyReport(req, res, next) {
    try {
      const { branch_id, academic_year_id, academic_year, date } = req.query;
      const effDate = date || new Date().toISOString().split('T')[0];
      const bId = branch_id && branch_id !== 'all' ? Number(branch_id) : 1;
      const ayStr = (academic_year || req.query.academic_year_name || '').trim();
      const ayId = Number(academic_year_id);

      let classQuery = knex('classes as c')
        .join('sections as sec', function() {
          this.on('c.id', '=', 'sec.class_id')
              .andOn('c.branch_id', '=', 'sec.branch_id');
        })
        .where('c.branch_id', bId)
        .where('sec.branch_id', bId)
        .where('c.status', 'Active')
        .where('sec.status', 'Active');

      if (ayStr && ayStr !== 'all' && ayStr !== 'undefined') {
        classQuery = classQuery.where((b) => {
          b.where('c.academic_year', ayStr).orWhere('sec.academic_year', ayStr);
        });
      } else if (!isNaN(ayId) && ayId > 0 && academic_year_id !== 'all') {
        classQuery = classQuery.where('sec.academic_year_id', ayId);
      }

      const classSections = await classQuery.select(
        'c.id as class_id',
        'c.class_name',
        'sec.id as section_id',
        'sec.section_name'
      ).orderBy('c.numeric_value', 'asc').orderBy('sec.section_name', 'asc');

      let totalStudents = 0;
      let totalPresent = 0;
      let totalAbsent = 0;
      let totalLeave = 0;
      let totalLate = 0;

      const reportClasses = [];

      for (const cs of classSections) {
        let enrolledCount = 0;
        try {
          const cnt = await knex('students')
            .where({
              branch_id: bId,
              class_id: cs.class_id,
              section_id: cs.section_id,
              status: 'Active'
            })
            .count();
          enrolledCount = Number(cnt || 0);
        } catch (e) {
          enrolledCount = 0;
        }

        const attRows = await knex('attendance as a')
          .leftJoin('students as s', 'a.student_id', 's.id')
          .where('a.branch_id', bId)
          .where('a.date', effDate)
          .where((qb) => {
            qb.where((b) => {
              b.where('a.class_id', cs.class_id).andWhere('a.section_id', cs.section_id);
            }).orWhere((b) => {
              b.where('s.class_id', cs.class_id).andWhere('s.section_id', cs.section_id);
            });
          })
          .select('a.status');

        const effectiveEnrolled = Math.max(enrolledCount, attRows.length);
        const presentCount = attRows.filter((r) => r.status === 'Present').length;
        const absentCount = attRows.filter((r) => r.status === 'Absent').length;
        const leaveCount = attRows.filter((r) => r.status === 'Leave').length;
        const lateCount = attRows.filter((r) => r.status === 'Late').length;
        const totalMarked = attRows.length;
        const isCompleted = totalMarked > 0 && effectiveEnrolled > 0 && totalMarked >= effectiveEnrolled;
        const attendancePercentage = effectiveEnrolled > 0
          ? Math.round((presentCount / effectiveEnrolled) * 100)
          : (totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 0);

        totalStudents += effectiveEnrolled;
        totalPresent += presentCount;
        totalAbsent += absentCount;
        totalLeave += leaveCount;
        totalLate += lateCount;

        reportClasses.push({
          class_id: cs.class_id,
          class_name: cs.class_name,
          section_id: cs.section_id,
          section_name: cs.section_name,
          total_enrolled: effectiveEnrolled,
          present_count: presentCount,
          absent_count: absentCount,
          leave_count: leaveCount,
          late_count: lateCount,
          attendance_percentage: attendancePercentage,
          is_completed: isCompleted
        });
      }

      const overallPercentage = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;

      res.json({
        success: true,
        date: effDate,
        total_students: totalStudents,
        present_count: totalPresent,
        absent_count: totalAbsent,
        leave_count: totalLeave,
        late_count: totalLate,
        attendance_percentage: overallPercentage,
        classes: reportClasses,
        data: {
          date: effDate,
          total_students: totalStudents,
          present_count: totalPresent,
          absent_count: totalAbsent,
          leave_count: totalLeave,
          late_count: totalLate,
          attendance_percentage: overallPercentage,
          classes: reportClasses
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async getStudentWiseReport(req, res, next) {
    try {
      const { branch_id, academic_year_id, academic_year, class_id, section_id, date_from, date_to } = req.query;
      const bId = branch_id && branch_id !== 'all' ? Number(branch_id) : 1;
      const ayStr = (academic_year || req.query.academic_year_name || '').trim();
      const ayId = Number(academic_year_id);

      let studentQuery = knex('students as s')
        .leftJoin('student_profiles as sp', 's.user_id', 'sp.user_id')
        .leftJoin('classes as c', 's.class_id', 'c.id')
        .leftJoin('sections as sec', 's.section_id', 'sec.id')
        .where('s.branch_id', bId)
        .where('s.status', 'Active');

      if (class_id && class_id !== 'all') {
        studentQuery = studentQuery.where('s.class_id', Number(class_id));
      }
      if (section_id && section_id !== 'all') {
        if (!isNaN(Number(section_id))) {
          studentQuery = studentQuery.where('s.section_id', Number(section_id));
        } else {
          studentQuery = studentQuery.where('sec.section_name', section_id);
        }
      }
      if (ayStr && ayStr !== 'all' && ayStr !== 'undefined') {
        studentQuery = studentQuery.where('s.academic_year', ayStr);
      } else if (!isNaN(ayId) && ayId > 0 && academic_year_id !== 'all') {
        studentQuery = studentQuery.where('s.academic_year_id', ayId);
      }

      const students = await studentQuery.select(
        's.id as student_id',
        's.admission_no as admission_number',
        'sp.first_name',
        'sp.last_name',
        'sp.extra_details',
        'c.class_name',
        'c.numeric_value',
        'sec.section_name'
      ).orderBy('s.id', 'asc');

      const sIds = students.map((s) => s.student_id);
      let attendanceRows = [];
      if (sIds.length > 0) {
        let attQuery = knex('attendance').whereIn('student_id', sIds);
        if (date_from) attQuery = attQuery.where('date', '>=', date_from);
        if (date_to) attQuery = attQuery.where('date', '<=', date_to);
        attendanceRows = await attQuery.select('student_id', 'status', 'date');
      }

      const attMap = {};
      for (const r of attendanceRows) {
        if (!attMap[r.student_id]) attMap[r.student_id] = [];
        attMap[r.student_id].push(r);
      }

      const rows = students.map((st, idx) => {
        let extra = {};
        if (st.extra_details) {
          try {
            extra = typeof st.extra_details === 'string' ? JSON.parse(st.extra_details) : st.extra_details;
          } catch (e) {}
        }
        const records = attMap[st.student_id] || [];
        const presentDays = records.filter((r) => r.status === 'Present').length;
        const halfDays = records.filter((r) => r.status === 'Half Day').length;
        const absentDays = records.filter((r) => r.status === 'Absent').length;
        const leaveDays = records.filter((r) => r.status === 'Leave').length;
        const lateDays = records.filter((r) => r.status === 'Late').length;
        const workingDays = records.length;
        const effectivePresent = presentDays + (halfDays * 0.5);
        const attendancePercentage = workingDays > 0 ? Math.round((effectivePresent / workingDays) * 100) : 100;

        return {
          student_id: st.student_id,
          id: st.student_id,
          admission_number: st.admission_number,
          first_name: st.first_name || '',
          last_name: st.last_name || '',
          student_name: `${st.first_name || ''} ${st.last_name || ''}`.trim() || `Student #${st.student_id}`,
          class_name: st.class_name || 'Class 1',
          section_name: st.section_name || 'A',
          roll_number: extra.roll_number || st.numeric_value || (idx + 1),
          working_days: workingDays,
          present_days: presentDays,
          half_days: halfDays,
          absent_days: absentDays,
          leave_days: leaveDays,
          late_days: lateDays,
          attendance_percentage: attendancePercentage
        };
      });

      res.json({ success: true, students: rows, data: rows });
    } catch (err) {
      next(err);
    }
  },

  async getStudentIndividualReport(req, res, next) {
    try {
      const { date_from, date_to } = req.query;
      const studentId = Number(req.params.studentId || req.query.student_id);

      if (!studentId) {
        return res.status(400).json({ error: 'Student ID is required' });
      }

      let student = await knex('students as s')
        .leftJoin('student_profiles as sp', 's.user_id', 'sp.user_id')
        .leftJoin('classes as c', 's.class_id', 'c.id')
        .leftJoin('sections as sec', 's.section_id', 'sec.id')
        .leftJoin('parents as p', 's.parent_id', 'p.id')
        .where('s.id', studentId)
        .select(
          's.id as student_id',
          's.admission_no as admission_number',
          raw('COALESCE(sp.first_name, s.first_name) as first_name'),
          raw('COALESCE(sp.last_name, s.last_name) as last_name'),
          'sp.extra_details',
          'c.class_name',
          'sec.section_name',
          'p.father_name',
          'p.phone as father_phone'
        )
        .first();

      if (!student) {
        student = await knex('students as s')
          .leftJoin('student_profiles as sp', 's.user_id', 'sp.user_id')
          .leftJoin('classes as c', 's.class_id', 'c.id')
          .leftJoin('sections as sec', 's.section_id', 'sec.id')
          .leftJoin('parents as p', 's.parent_id', 'p.id')
          .where('s.user_id', studentId)
          .select(
            's.id as student_id',
            's.admission_no as admission_number',
            raw('COALESCE(sp.first_name, s.first_name) as first_name'),
            raw('COALESCE(sp.last_name, s.last_name) as last_name'),
            'sp.extra_details',
            'c.class_name',
            'sec.section_name',
            'p.father_name',
            'p.phone as father_phone'
          )
          .first();
      }

      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      let extra = {};
      if (student.extra_details) {
        try {
          extra = typeof student.extra_details === 'string' ? JSON.parse(student.extra_details) : student.extra_details;
        } catch (e) {}
      }

      const resolvedStudentId = student.student_id;
      let attQuery = knex('attendance as a')
        .leftJoin('attendance_timings as at', 'a.timing_id', 'at.id')
        .where('a.student_id', resolvedStudentId);
      if (date_from) attQuery = attQuery.where('a.date', '>=', date_from);
      if (date_to) attQuery = attQuery.where('a.date', '<=', date_to);

      const records = await attQuery
        .select(
          'a.id',
          'a.date as attendance_date',
          'a.status',
          raw('COALESCE(a.morning_status, a.status) as morning_status'),
          raw('COALESCE(a.afternoon_status, a.status) as afternoon_status'),
          'at.session_1_name',
          'at.session_2_name',
          'at.is_second_session',
          'a.remarks',
          'a.custom_remark',
          'a.submitted_by',
          'a.created_at'
        )
        .orderBy('a.date', 'desc');

      const totalDays = records.length;
      const present = records.filter((r) => r.status === 'Present').length;
      const halfDay = records.filter((r) => r.status === 'Half Day').length;
      const absent = records.filter((r) => r.status === 'Absent').length;
      const leave = records.filter((r) => r.status === 'Leave').length;
      const late = records.filter((r) => r.status === 'Late').length;
      const effectivePresent = present + (halfDay * 0.5);
      const attendancePercentage = totalDays > 0 ? Math.round((effectivePresent / totalDays) * 100) : 100;

      const studentData = {
        id: student.student_id,
        first_name: student.first_name || '',
        last_name: student.last_name || '',
        admission_number: student.admission_number || '',
        class_name: student.class_name || '',
        section_name: student.section_name || '',
        roll_number: extra.roll_number || 1,
        father_name: student.father_name || '',
        father_phone: student.father_phone || ''
      };

      const summary = {
        total_days: totalDays,
        present,
        half_day: halfDay,
        absent,
        leave,
        late,
        attendance_percentage: attendancePercentage
      };

      res.json({
        success: true,
        student: studentData,
        summary,
        records,
        data: { student: studentData, summary, records }
      });
    } catch (err) {
      next(err);
    }
  },

  async getConsecutiveAbsentReport(req, res, next) {
    try {
      const { branch_id, min_days = 3, class_id, section_id } = req.query;
      const threshold = Number(min_days) || 3;
      const bId = branch_id && branch_id !== 'all' ? Number(branch_id) : 1;

      let q = knex('attendance as a')
        .join('students as s', 'a.student_id', 's.id')
        .leftJoin('student_profiles as sp', 's.user_id', 'sp.user_id')
        .leftJoin('classes as c', 's.class_id', 'c.id')
        .leftJoin('sections as sec', 's.section_id', 'sec.id')
        .leftJoin('parents as p', 's.parent_id', 'p.id')
        .where('a.branch_id', bId)
        .where('a.status', 'Absent');

      if (class_id && class_id !== 'all') q = q.where('s.class_id', Number(class_id));

      const absentees = await q
        .select(
          's.id as student_id',
          's.admission_no as admission_number',
          'sp.first_name',
          'sp.last_name',
          'sp.extra_details',
          'c.class_name',
          'sec.section_name',
          'p.father_name',
          'p.phone as father_phone',
          'a.date'
        )
        .orderBy('s.id', 'asc')
        .orderBy('a.date', 'desc');

      const studentMap = {};
      for (const r of absentees) {
        if (!studentMap[r.student_id]) studentMap[r.student_id] = { info: r, dates: [] };
        studentMap[r.student_id].dates.push(r.date);
      }

      const results = [];
      for (const [sId, data] of Object.entries(studentMap)) {
        if (data.dates.length >= threshold) {
          let extra = {};
          if (data.info.extra_details) {
            try {
              extra = typeof data.info.extra_details === 'string' ? JSON.parse(data.info.extra_details) : data.info.extra_details;
            } catch (e) {}
          }
          results.push({
            student_id: Number(sId),
            roll_number: extra.roll_number || 1,
            admission_number: data.info.admission_number,
            student_name: `${data.info.first_name || ''} ${data.info.last_name || ''}`.trim(),
            class_name: data.info.class_name,
            section_name: data.info.section_name,
            from_date: data.dates[data.dates.length - 1],
            to_date: data.dates[0],
            consecutive_days: data.dates.length,
            father_name: data.info.father_name || 'Parent',
            father_mobile: data.info.father_phone || ''
          });
        }
      }

      res.json({ success: true, consecutive_absent_students: results, data: results });
    } catch (err) {
      next(err);
    }
  },

  async getConsecutiveLeaveReport(req, res, next) {
    try {
      const { branch_id, min_days = 2, class_id, section_id } = req.query;
      const threshold = Number(min_days) || 2;
      const bId = branch_id && branch_id !== 'all' ? Number(branch_id) : 1;

      let q = knex('attendance as a')
        .join('students as s', 'a.student_id', 's.id')
        .leftJoin('student_profiles as sp', 's.user_id', 'sp.user_id')
        .leftJoin('classes as c', 's.class_id', 'c.id')
        .leftJoin('sections as sec', 's.section_id', 'sec.id')
        .where('a.branch_id', bId)
        .where('a.status', 'Leave');

      if (class_id && class_id !== 'all') q = q.where('s.class_id', Number(class_id));

      const leaveRecords = await q
        .select(
          's.id as student_id',
          's.admission_no as admission_number',
          'sp.first_name',
          'sp.last_name',
          'sp.extra_details',
          'c.class_name',
          'sec.section_name',
          'a.date'
        )
        .orderBy('s.id', 'asc')
        .orderBy('a.date', 'desc');

      const studentMap = {};
      for (const r of leaveRecords) {
        if (!studentMap[r.student_id]) studentMap[r.student_id] = { info: r, dates: [] };
        studentMap[r.student_id].dates.push(r.date);
      }

      const results = [];
      for (const [sId, data] of Object.entries(studentMap)) {
        if (data.dates.length >= threshold) {
          let extra = {};
          if (data.info.extra_details) {
            try {
              extra = typeof data.info.extra_details === 'string' ? JSON.parse(data.info.extra_details) : data.info.extra_details;
            } catch (e) {}
          }
          results.push({
            student_id: Number(sId),
            roll_number: extra.roll_number || 1,
            admission_number: data.info.admission_number,
            student_name: `${data.info.first_name || ''} ${data.info.last_name || ''}`.trim(),
            class_name: data.info.class_name,
            section_name: data.info.section_name,
            from_date: data.dates[data.dates.length - 1],
            to_date: data.dates[0],
            consecutive_days: data.dates.length
          });
        }
      }

      res.json({ success: true, consecutive_leave_students: results, data: results });
    } catch (err) {
      next(err);
    }
  },

  async getConsecutiveLateReport(req, res, next) {
    try {
      const { branch_id, min_days = 2, class_id, section_id } = req.query;
      const threshold = Number(min_days) || 2;
      const bId = branch_id && branch_id !== 'all' ? Number(branch_id) : 1;

      let q = knex('attendance as a')
        .join('students as s', 'a.student_id', 's.id')
        .leftJoin('student_profiles as sp', 's.user_id', 'sp.user_id')
        .leftJoin('classes as c', 's.class_id', 'c.id')
        .leftJoin('sections as sec', 's.section_id', 'sec.id')
        .where('a.branch_id', bId)
        .where('a.status', 'Late');

      if (class_id && class_id !== 'all') q = q.where('s.class_id', Number(class_id));

      const lateRecords = await q
        .select(
          's.id as student_id',
          's.admission_no as admission_number',
          'sp.first_name',
          'sp.last_name',
          'sp.extra_details',
          'c.class_name',
          'sec.section_name',
          'a.date'
        )
        .orderBy('s.id', 'asc')
        .orderBy('a.date', 'desc');

      const studentMap = {};
      for (const r of lateRecords) {
        if (!studentMap[r.student_id]) studentMap[r.student_id] = { info: r, dates: [] };
        studentMap[r.student_id].dates.push(r.date);
      }

      const results = [];
      for (const [sId, data] of Object.entries(studentMap)) {
        if (data.dates.length >= threshold) {
          let extra = {};
          if (data.info.extra_details) {
            try {
              extra = typeof data.info.extra_details === 'string' ? JSON.parse(data.info.extra_details) : data.info.extra_details;
            } catch (e) {}
          }
          results.push({
            student_id: Number(sId),
            roll_number: extra.roll_number || 1,
            admission_number: data.info.admission_number,
            student_name: `${data.info.first_name || ''} ${data.info.last_name || ''}`.trim(),
            class_name: data.info.class_name,
            section_name: data.info.section_name,
            from_date: data.dates[data.dates.length - 1],
            to_date: data.dates[0],
            consecutive_days: data.dates.length
          });
        }
      }

      res.json({ success: true, consecutive_late_students: results, data: results });
    } catch (err) {
      next(err);
    }
  },

  async getFrequentAbsenceReport(req, res, next) {
    try {
      const { branch_id, date_from, date_to, class_id, section_id, sort_by } = req.query;
      const bId = branch_id && branch_id !== 'all' ? Number(branch_id) : 1;

      let query = knex('attendance as a')
        .join('students as s', 'a.student_id', 's.id')
        .leftJoin('student_profiles as sp', 's.user_id', 'sp.user_id')
        .leftJoin('classes as c', 's.class_id', 'c.id')
        .leftJoin('sections as sec', 's.section_id', 'sec.id')
        .where('a.branch_id', bId);

      if (date_from) query = query.where('a.date', '>=', date_from);
      if (date_to) query = query.where('a.date', '<=', date_to);
      if (class_id && class_id !== 'all') query = query.where('s.class_id', Number(class_id));

      const records = await query.select(
        's.id as student_id',
        's.admission_no as admission_number',
        'sp.first_name',
        'sp.last_name',
        'sp.extra_details',
        'c.class_name',
        'sec.section_name',
        'a.status'
      );

      const map = {};
      for (const r of records) {
        if (!map[r.student_id]) {
          let extra = {};
          if (r.extra_details) {
            try {
              extra = typeof r.extra_details === 'string' ? JSON.parse(r.extra_details) : r.extra_details;
            } catch (e) {}
          }
          map[r.student_id] = {
            student_id: r.student_id,
            admission_number: r.admission_number,
            student_name: `${r.first_name || ''} ${r.last_name || ''}`.trim(),
            class_name: r.class_name,
            section_name: r.section_name,
            roll_number: extra.roll_number || 1,
            total_days: 0,
            present_days: 0,
            absent_days: 0
          };
        }
        map[r.student_id].total_days++;
        if (r.status === 'Present') map[r.student_id].present_days++;
        if (r.status === 'Absent') map[r.student_id].absent_days++;
      }

      let results = Object.values(map)
        .filter((s) => s.absent_days > 0)
        .map((s) => ({
          ...s,
          working_days: s.total_days,
          attendance_percentage: s.total_days > 0 ? Math.round((s.present_days / s.total_days) * 100) : 0
        }));

      if (sort_by === 'lowest_attendance') {
        results.sort((a, b) => a.attendance_percentage - b.attendance_percentage);
      } else {
        results.sort((a, b) => b.absent_days - a.absent_days);
      }

      res.json({ success: true, frequent_absence_students: results, data: results });
    } catch (err) {
      next(err);
    }
  },

  async getLateStudentsReport(req, res, next) {
    try {
      const { branch_id, date_from, date_to, class_id, section_id } = req.query;
      const bId = branch_id && branch_id !== 'all' ? Number(branch_id) : 1;

      let query = knex('attendance as a')
        .join('students as s', 'a.student_id', 's.id')
        .leftJoin('student_profiles as sp', 's.user_id', 'sp.user_id')
        .leftJoin('classes as c', 's.class_id', 'c.id')
        .leftJoin('sections as sec', 's.section_id', 'sec.id')
        .where('a.branch_id', bId);

      if (date_from) query = query.where('a.date', '>=', date_from);
      if (date_to) query = query.where('a.date', '<=', date_to);
      if (class_id && class_id !== 'all') query = query.where('s.class_id', Number(class_id));

      const records = await query.select(
        's.id as student_id',
        's.admission_no as admission_number',
        'sp.first_name',
        'sp.last_name',
        'sp.extra_details',
        'c.class_name',
        'sec.section_name',
        'a.status',
        'a.date'
      );

      const map = {};
      for (const r of records) {
        if (!map[r.student_id]) {
          let extra = {};
          if (r.extra_details) {
            try {
              extra = typeof r.extra_details === 'string' ? JSON.parse(r.extra_details) : r.extra_details;
            } catch (e) {}
          }
          map[r.student_id] = {
            student_id: r.student_id,
            admission_number: r.admission_number,
            student_name: `${r.first_name || ''} ${r.last_name || ''}`.trim(),
            class_name: r.class_name,
            section_name: r.section_name,
            roll_number: extra.roll_number || 1,
            total_days: 0,
            present_days: 0,
            late_days: 0,
            latest_late_date: null
          };
        }
        map[r.student_id].total_days++;
        if (r.status === 'Present') map[r.student_id].present_days++;
        if (r.status === 'Late') {
          map[r.student_id].late_days++;
          if (!map[r.student_id].latest_late_date || r.date > map[r.student_id].latest_late_date) {
            map[r.student_id].latest_late_date = r.date;
          }
        }
      }

      const results = Object.values(map)
        .filter((s) => s.late_days > 0)
        .map((s) => ({
          ...s,
          working_days: s.total_days,
          attendance_percentage: s.total_days > 0 ? Math.round(((s.present_days + s.late_days) / s.total_days) * 100) : 100
        }))
        .sort((a, b) => b.late_days - a.late_days);

      res.json({ success: true, late_students: results, data: results });
    } catch (err) {
      next(err);
    }
  },

  async getLowAttendanceReport(req, res, next) {
    try {
      const { branch_id, threshold = 75, class_id, section_id } = req.query;
      const cutoff = Number(threshold) || 75;
      const bId = branch_id && branch_id !== 'all' ? Number(branch_id) : 1;

      let query = knex('students as s')
        .leftJoin('student_profiles as sp', 's.user_id', 'sp.user_id')
        .leftJoin('classes as c', 's.class_id', 'c.id')
        .leftJoin('sections as sec', 's.section_id', 'sec.id')
        .leftJoin('parents as p', 's.parent_id', 'p.id')
        .where('s.branch_id', bId)
        .where('s.status', 'Active');

      if (class_id && class_id !== 'all') query = query.where('s.class_id', Number(class_id));

      const students = await query.select(
        's.id as student_id',
        's.admission_no as admission_number',
        'sp.first_name',
        'sp.last_name',
        'sp.extra_details',
        'c.class_name',
        'sec.section_name',
        'p.father_name',
        'p.phone as father_phone'
      );

      const sIds = students.map((s) => s.student_id);
      let attRecords = [];
      if (sIds.length > 0) {
        attRecords = await knex('attendance').whereIn('student_id', sIds).select('student_id', 'status');
      }

      const map = {};
      for (const r of attRecords) {
        if (!map[r.student_id]) map[r.student_id] = { total: 0, present: 0, absent: 0 };
        map[r.student_id].total++;
        if (r.status === 'Present') map[r.student_id].present++;
        if (r.status === 'Absent') map[r.student_id].absent++;
      }

      const results = [];
      for (const st of students) {
        let extra = {};
        if (st.extra_details) {
          try {
            extra = typeof st.extra_details === 'string' ? JSON.parse(st.extra_details) : st.extra_details;
          } catch (e) {}
        }
        const stats = map[st.student_id] || { total: 0, present: 0, absent: 0 };
        const pct = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 100;

        if (pct < cutoff && stats.total > 0) {
          results.push({
            student_id: st.student_id,
            roll_number: extra.roll_number || 1,
            admission_number: st.admission_number,
            first_name: st.first_name || '',
            last_name: st.last_name || '',
            student_name: `${st.first_name || ''} ${st.last_name || ''}`.trim(),
            class_name: st.class_name,
            section_name: st.section_name,
            parent_name: st.father_name || 'Parent',
            father_name: st.father_name || 'Parent',
            father_mobile: st.father_phone || '',
            parent_contact: st.father_phone || '',
            absent_days: stats.absent,
            attendance_percentage: pct
          });
        }
      }

      res.json({ success: true, low_attendance_students: results, data: results });
    } catch (err) {
      next(err);
    }
  },

  async getCompletionStats(req, res, next) {
    try {
      const { branch_id, date } = req.query;
      const effDate = date || new Date().toISOString().split('T')[0];
      const bId = branch_id && branch_id !== 'all' ? Number(branch_id) : 1;

      let total = 0;
      try {
        const cnt = await knex('classes').where('branch_id', bId).where('status', 'Active').count();
        total = Number(cnt || 0);
      } catch (e) {
        total = 0;
      }
      const markedClasses = await knex('attendance').where('branch_id', bId).where('date', effDate).distinct('class_id');
      const completed = markedClasses.length;
      const pending = Math.max(0, total - completed);
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      res.json({
        success: true,
        completion_stats: {
          total_classes: total,
          completed_classes: completed,
          pending_classes: pending,
          completion_percentage: percentage
        }
      });
    } catch (err) {
      next(err);
    }
  }
};

export default attendanceController;
