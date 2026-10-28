import { sutando } from '../config/database.js';

const knex = (table) => sutando.connection().table(table);

export const studentController = {
  async list(req, res, next) {
    try {
      const {
        branch_id,
        academic_year_id,
        academic_year,
        class_id,
        section_id,
        status,
        search,
        academic_group_id,
        page = 1,
        page_size = 50,
        sort_by = 'first_name',
        sort_order = 'asc'
      } = req.query;

      let query = knex('students as s')
        .leftJoin('student_profiles as sp', 's.user_id', 'sp.user_id')
        .leftJoin('classes as c', 's.class_id', 'c.id')
        .leftJoin('sections as sec', 's.section_id', 'sec.id')
        .leftJoin('parents as p', 's.parent_id', 'p.id')
        .leftJoin('branches as b', 's.branch_id', 'b.id');

      const bId = Number(branch_id);
      if (!isNaN(bId) && bId > 0 && branch_id !== 'all' && branch_id !== 'undefined') {
        query = query.where('s.branch_id', bId);
      }
      const ayString = (academic_year || req.query.academic_year_name || '').trim();
      const ayId = Number(academic_year_id);
      if (ayString && ayString !== 'all' && ayString !== 'undefined') {
        query = query.where((qb) => {
          qb.where('s.academic_year', ayString)
            .orWhere('sec.academic_year', ayString)
            .orWhereExists(function() {
              this.select('id').from('student_promotions')
                .whereRaw('student_promotions.student_id = s.id')
                .andWhere((pb) => {
                  pb.where('student_promotions.to_academic_year', ayString)
                    .orWhere('student_promotions.from_academic_year', ayString);
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
      const cId = Number(class_id);
      if (!isNaN(cId) && cId > 0 && class_id !== 'all' && class_id !== 'undefined') {
        query = query.where('s.class_id', cId);
      }
      const rawSection = section_id || req.query.section_name || req.query.section;
      if (rawSection && rawSection !== 'all' && rawSection !== 'undefined') {
        const secId = Number(rawSection);
        if (!isNaN(secId) && secId > 0) {
          query = query.where('s.section_id', secId);
        } else {
          query = query.where((b) => b.where('sec.section_name', rawSection));
        }
      }
      const gId = Number(academic_group_id);
      if (!isNaN(gId) && gId > 0 && academic_group_id !== 'all' && academic_group_id !== 'undefined') {
        query = query.join('academic_group_students as ags', 's.id', 'ags.student_id')
          .where('ags.academic_group_id', gId);
      }
      if (status && status !== 'all' && status !== 'undefined') {
        query = query.where('s.status', status);
      }
      if (search && search.trim()) {
        const term = `%${search.trim()}%`;
        const numTerm = Number(search.trim());
        query = query.where((builder) => {
          builder
            .where('sp.first_name', 'like', term)
            .orWhere('sp.last_name', 'like', term)
            .orWhere('s.admission_no', 'like', term)
            .orWhere('p.father_name', 'like', term);
          if (!isNaN(numTerm) && numTerm > 0) {
            builder.orWhere('s.id', numTerm);
          }
        });
      }

      // Get count
      const countResult = await query.clone().count('s.id', { as: 'total' });
      const totalCount = typeof countResult === 'number' ? countResult : (countResult[0]?.total ? Number(countResult[0].total) : Number(countResult) || 0);

      // Select fields
      const p = Math.max(1, Number(page));
      const ps = Math.max(1, Number(page_size));
      const offset = (p - 1) * ps;

      const rows = await query
        .select(
          's.id',
          's.school_id',
          's.branch_id',
          's.user_id',
          's.admission_no',
          's.dob',
          's.gender',
          's.class_id',
          's.section_id',
          's.parent_id',
          's.status',
          's.created_at',
          's.updated_at',
          'sp.first_name',
          'sp.last_name',
          'sp.blood_group',
          'sp.address',
          'sp.parent_phone',
          'sp.extra_details',
          'c.class_name',
          'c.numeric_value',
          'sec.section_name',
          'sec.academic_year_id',
          'p.father_name',
          'p.mother_name',
          'p.phone as father_phone',
          'p.email as father_email',
          'b.branch_name'
        )
        .orderBy('s.id', sort_order?.toLowerCase() === 'desc' ? 'desc' : 'asc')
        .limit(ps)
        .offset(offset);

      const formatted = rows.map((r, idx) => {
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
        const fullName = `${fn} ${ln}`.trim() || `Student #${r.id}`;
        return {
          ...extra,
          id: r.id,
          student_id: r.id,
          admission_number: r.admission_no || `ADM-${r.id}`,
          first_name: fn,
          last_name: ln,
          middle_name: extra.middle_name || '',
          full_name: fullName,
          class_id: r.class_id,
          class_name: r.class_name || `Class ${r.class_id}`,
          section_id: r.section_id,
          section_name: r.section_name || 'A',
          academic_year_id: r.academic_year_id || null,
          roll_number: extra.roll_number || r.numeric_value || (idx + 1),
          gender: r.gender || 'Male',
          dob: r.dob,
          blood_group: r.blood_group || 'O+',
          student_mobile: r.parent_phone || r.father_phone || '',
          father_name: r.father_name || extra.father_name || '',
          father_mobile: r.father_phone || extra.father_mobile || '',
          mother_name: r.mother_name || extra.mother_name || '',
          current_status: r.status || 'Active',
          fee_status: 'Paid',
          hostel_status: 'Day Scholar',
          transport_opted: 0,
          branch_name: r.branch_name || 'Main Campus',
          created_at: r.created_at,
          updated_at: r.updated_at,
        };
      });

      const totalPages = Math.ceil(totalCount / ps) || 1;
      res.json({
        success: true,
        data: formatted,
        count: totalCount,
        total: totalCount,
        page: p,
        page_size: ps,
        total_pages: totalPages,
        pagination: {
          total: totalCount,
          total_pages: totalPages,
          page: p,
          page_size: ps,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const r = await knex('students as s')
        .leftJoin('student_profiles as sp', 's.user_id', 'sp.user_id')
        .leftJoin('classes as c', 's.class_id', 'c.id')
        .leftJoin('sections as sec', 's.section_id', 'sec.id')
        .leftJoin('parents as p', 's.parent_id', 'p.id')
        .leftJoin('branches as b', 's.branch_id', 'b.id')
        .where('s.id', req.params.id)
        .select(
          's.*',
          'sp.first_name',
          'sp.last_name',
          'sp.dob as sp_dob',
          'sp.gender as sp_gender',
          'sp.blood_group',
          'sp.address',
          'sp.parent_name',
          'sp.parent_phone',
          'sp.extra_details',
          'c.class_name',
          'sec.section_name',
          'b.branch_name',
          'p.father_name',
          'p.mother_name',
          'p.phone as parent_phone_fallback',
          'p.email as parent_email_fallback'
        )
        .first();

      if (!r) {
        return res.status(404).json({ success: false, message: 'Student not found' });
      }

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
      const studentData = {
        ...extra,
        id: r.id,
        student_id: r.id,
        admission_number: r.admission_no || `ADM-${r.id}`,
        first_name: fn,
        last_name: ln,
        middle_name: extra.middle_name || '',
        full_name: `${fn} ${ln}`.trim() || `Student #${r.id}`,
        class_id: r.class_id,
        section_id: r.section_id,
        roll_number: extra.roll_number || r.id,
        gender: r.gender || 'Male',
        date_of_birth: r.dob,
        blood_group: r.blood_group || 'O+',
        student_mobile: r.parent_phone || r.parent_phone_fallback || '',
        current_status: r.status || 'Active',
        branch_id: r.branch_id,
      };

      res.json({
        success: true,
        data: studentData,
        student: studentData,
        parents: {
          father_name: r.father_name || extra.father_name || '',
          father_mobile: r.parent_phone || r.parent_phone_fallback || extra.father_mobile || '',
          father_email: r.parent_email_fallback || extra.father_email || '',
          mother_name: r.mother_name || extra.mother_name || '',
          ...extra,
        },
        address: {
          current_address: r.address || extra.residential_address || '',
          ...extra,
        },
        current_enrollment: {
          class_id: r.class_id,
          class_name: r.class_name,
          section_id: r.section_id,
          section_name: r.section_name,
        },
        subjects: await knex('student_subjects')
          .where('student_id', r.id)
          .where('status', 'Active')
          .orderBy('id', 'asc'),
      });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const {
        branch_id = 1,
        school_id = 1,
        academic_year_id,
        first_name,
        last_name,
        admission_number,
        admission_no,
        class_id,
        section_id,
        gender = 'Male',
        date_of_birth,
        dob,
        student_mobile,
        blood_group,
        current_status = 'Active',
        status,
      } = req.body;

      const effectiveStatus = status || current_status || 'Active';
      const effectiveDob = date_of_birth || dob || null;
      const effectiveAdmissionNo = admission_number || admission_no || `ADM-${Date.now()}`;
      const now = new Date();

      // Resolve section if needed
      let resolvedSectionId = section_id ? Number(section_id) : null;
      if (resolvedSectionId && class_id) {
        const secRow = await knex('sections').where('id', resolvedSectionId).first();
        if (!secRow || Number(secRow.class_id) !== Number(class_id)) {
          const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
          let targetName = secRow ? secRow.section_name : (letters[resolvedSectionId - 1] || null);
          if (targetName) {
            let secQuery = knex('sections').where('class_id', Number(class_id)).where('section_name', targetName);
            if (academic_year_id) secQuery = secQuery.where('academic_year_id', Number(academic_year_id));
            const matchedSec = await secQuery.first();
            if (matchedSec) resolvedSectionId = matchedSec.id;
          }
        }
      }

      // 1. Insert into users table (table schema: id, name, email, password, role_id, branch_id, status, created_at, updated_at)
      const fullName = `${first_name || ''} ${last_name || ''}`.trim() || 'Student';
      const [userId] = await knex('users').insert({
        name: fullName,
        email: req.body.email || `student_${Date.now()}@campus.edu`,
        password: req.body.password || 'default_password',
        role_id: 4,
        branch_id: Number(branch_id) || 1,
        status: effectiveStatus,
        created_at: now,
        updated_at: now,
      });

      // 2. Insert or link parent if details provided
      let parentId = req.body.parent_id ? Number(req.body.parent_id) : null;
      if (!parentId && (req.body.father_name || req.body.mother_name || req.body.father_mobile || req.body.parent_phone)) {
        const [newParentId] = await knex('parents').insert({
          school_id: Number(school_id) || 1,
          branch_id: Number(branch_id) || 1,
          father_name: req.body.father_name || null,
          mother_name: req.body.mother_name || null,
          phone: req.body.father_mobile || req.body.parent_phone || null,
          email: req.body.father_email || req.body.parent_email || null,
          address: req.body.address || req.body.residential_address || req.body.current_street || null,
          created_at: now,
          updated_at: now,
        });
        parentId = newParentId;
      }

      // Resolve academic_year string
      let academicYearStr = (req.body.academic_year || '').trim();
      let effectiveAyId = academic_year_id ? Number(academic_year_id) : null;
      if (!academicYearStr && effectiveAyId) {
        const ayRow = await knex('academic_years').where('id', effectiveAyId).first();
        if (ayRow) academicYearStr = ayRow.year_name || ayRow.name;
      }
      if (!academicYearStr) {
        const currAy = await knex('academic_years').where('is_current', 1).orWhere('is_active', 1).first();
        if (currAy) {
          academicYearStr = currAy.year_name || currAy.name;
          if (!effectiveAyId) effectiveAyId = currAy.id;
        }
      }

      // 3. Insert into students table
      const [stuId] = await knex('students').insert({
        school_id: Number(school_id) || 1,
        branch_id: Number(branch_id) || 1,
        user_id: userId,
        admission_no: effectiveAdmissionNo,
        class_id: class_id ? Number(class_id) : null,
        section_id: resolvedSectionId,
        parent_id: parentId || null,
        academic_year: academicYearStr,
        academic_year_id: effectiveAyId,
        gender,
        dob: effectiveDob,
        admission_date: req.body.admission_date || now,
        status: effectiveStatus,
        created_at: now,
        updated_at: now,
      });

      // 4. Insert into student_profiles table
      await knex('student_profiles').insert({
        user_id: userId,
        admission_number: effectiveAdmissionNo,
        first_name: first_name || '',
        last_name: last_name || '',
        gender,
        dob: effectiveDob,
        blood_group: blood_group || null,
        address: req.body.address || req.body.residential_address || req.body.current_street || null,
        parent_name: req.body.father_name || req.body.mother_name || req.body.parent_name || null,
        parent_phone: req.body.father_mobile || student_mobile || req.body.parent_phone || null,
        status: effectiveStatus,
        extra_details: JSON.stringify(req.body),
        created_at: now,
        updated_at: now,
      });

      // 5. If academic_year provided, also create initial enrollment record in student_promotions
      if (effectiveAyId || academicYearStr) {
        await knex('student_promotions').insert({
          organization_id: 1,
          branch_id: Number(branch_id) || 1,
          student_id: stuId,
          to_academic_year_id: effectiveAyId,
          to_academic_year: academicYearStr,
          to_class_id: class_id ? Number(class_id) : null,
          to_section_id: resolvedSectionId,
          promotion_status: 'Enrolled',
          remarks: 'Initial Enrollment',
          promoted_by: 'Admin',
          promoted_date: now.toISOString().split('T')[0],
          created_at: now,
          updated_at: now,
        });
      }

      res.status(201).json({ success: true, id: stuId, message: 'Student created successfully' });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const studentId = Number(req.params.id);
      const student = await knex('students').where('id', studentId).first();
      if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

      const now = new Date();
      const body = req.body || {};

      const studentUpdates = { updated_at: now };
      if (body.class_id !== undefined) studentUpdates.class_id = Number(body.class_id) || null;
      if (body.section_id !== undefined) studentUpdates.section_id = Number(body.section_id) || null;
      if (body.gender !== undefined) studentUpdates.gender = body.gender;
      if (body.current_status !== undefined) studentUpdates.status = body.current_status;
      if (body.date_of_birth !== undefined) studentUpdates.dob = body.date_of_birth;
      if (body.admission_number !== undefined) studentUpdates.admission_no = body.admission_number;

      await knex('students').where('id', studentId).update(studentUpdates);

      if (student.user_id) {
        if (body.first_name !== undefined || body.last_name !== undefined) {
          const fn = body.first_name !== undefined ? body.first_name : '';
          const ln = body.last_name !== undefined ? body.last_name : '';
          const fullName = `${fn} ${ln}`.trim();
          if (fullName) {
            await knex('users').where('id', student.user_id).update({ name: fullName, updated_at: now });
          }
        }
        if (body.current_status !== undefined) {
          await knex('users').where('id', student.user_id).update({ status: body.current_status, updated_at: now });
        }

        const existingProfile = await knex('student_profiles').where('user_id', student.user_id).first();
        let currentExtra = {};
        if (existingProfile?.extra_details) {
          try {
            currentExtra = typeof existingProfile.extra_details === 'string'
              ? JSON.parse(existingProfile.extra_details)
              : existingProfile.extra_details;
          } catch (e) {
            currentExtra = {};
          }
        }

        const mergedExtra = {
          ...currentExtra,
          ...(body.extra_details || {}),
          ...body,
        };

        const profileUpdates = {
          updated_at: now,
          extra_details: JSON.stringify(mergedExtra),
        };

        if (body.first_name !== undefined) profileUpdates.first_name = body.first_name;
        if (body.last_name !== undefined) profileUpdates.last_name = body.last_name;
        if (body.gender !== undefined) profileUpdates.gender = body.gender;
        if (body.blood_group !== undefined) profileUpdates.blood_group = body.blood_group;
        if (body.date_of_birth !== undefined) profileUpdates.dob = body.date_of_birth;
        if (body.student_mobile !== undefined) profileUpdates.parent_phone = body.student_mobile;
        if (body.current_status !== undefined) profileUpdates.status = body.current_status;

        await knex('student_profiles').where('user_id', student.user_id).update(profileUpdates);
      }

      if (student.parent_id && (body.father_name || body.mother_name || body.father_mobile || body.parent_phone)) {
        const parentUpdates = { updated_at: now };
        if (body.father_name !== undefined) parentUpdates.father_name = body.father_name;
        if (body.mother_name !== undefined) parentUpdates.mother_name = body.mother_name;
        if (body.father_mobile !== undefined) parentUpdates.phone = body.father_mobile;
        else if (body.parent_phone !== undefined) parentUpdates.phone = body.parent_phone;
        await knex('parents').where('id', student.parent_id).update(parentUpdates);
      }

      res.json({ success: true, message: 'Student updated successfully' });
    } catch (err) {
      next(err);
    }
  },

  async bulkUpdate(req, res, next) {
    try {
      const { items, student_ids, updates } = req.body;
      let count = 0;
      const now = new Date();

      if (Array.isArray(items) && items.length > 0) {
        for (const item of items) {
          const sId = Number(item.id);
          if (!sId) continue;
          const student = await knex('students').where('id', sId).first();
          if (!student) continue;

          const sUpdates = { updated_at: now };
          if (item.gender !== undefined) sUpdates.gender = item.gender;
          if (item.dob !== undefined || item.date_of_birth !== undefined) sUpdates.dob = item.dob || item.date_of_birth;
          if (item.current_status !== undefined) sUpdates.status = item.current_status;
          if (item.admission_number !== undefined) sUpdates.admission_no = item.admission_number;

          await knex('students').where('id', sId).update(sUpdates);

          if (student.user_id) {
            const pUpdates = { updated_at: now };
            if (item.first_name !== undefined) pUpdates.first_name = item.first_name;
            if (item.last_name !== undefined) pUpdates.last_name = item.last_name;
            if (item.gender !== undefined) pUpdates.gender = item.gender;
            if (item.blood_group !== undefined) pUpdates.blood_group = item.blood_group;
            if (item.student_mobile !== undefined) pUpdates.parent_phone = item.student_mobile;
            if (item.current_status !== undefined) pUpdates.status = item.current_status;

            // Fetch and merge extra_details
            const currentProfile = await knex('student_profiles').where('user_id', student.user_id).first();
            let currentExtra = {};
            if (currentProfile && currentProfile.extra_details) {
              try {
                currentExtra = typeof currentProfile.extra_details === 'string'
                  ? JSON.parse(currentProfile.extra_details)
                  : currentProfile.extra_details;
              } catch (e) {
                currentExtra = {};
              }
            }

            const mergedExtra = { ...currentExtra, ...item };
            delete mergedExtra.id;
            delete mergedExtra.class_id;
            delete mergedExtra.section_id;
            pUpdates.extra_details = JSON.stringify(mergedExtra);

            await knex('student_profiles').where('user_id', student.user_id).update(pUpdates);
          }
          count++;
        }
      } else if (Array.isArray(student_ids) && updates) {
        const sUpdates = { updated_at: now };
        if (updates.current_status) sUpdates.status = updates.current_status;
        if (updates.class_id) sUpdates.class_id = updates.class_id;
        if (updates.section_id) sUpdates.section_id = updates.section_id;

        await knex('students').whereIn('id', student_ids).update(sUpdates);
        count = student_ids.length;
      }

      res.json({ success: true, count, message: `Successfully updated ${count} student(s)` });
    } catch (err) {
      next(err);
    }
  },

  async bulkChangeClassSection(req, res, next) {
    try {
      const { branch_id, academic_year_id, student_ids, to_class_id, to_section_id, effective_date, reason, remarks, changed_by } = req.body;
      if (!Array.isArray(student_ids) || student_ids.length === 0 || !to_class_id || !to_section_id || !reason) {
        return res.status(400).json({
          success: false,
          message: 'Missing required parameters: student_ids array, to_class_id, to_section_id, and reason.'
        });
      }
      const now = new Date();
      let movedCount = 0;
      for (const sId of student_ids) {
        const student = await knex('students').where('id', Number(sId)).first();
        if (student) {
          await knex('student_class_section_history').insert({
            organization_id: 1,
            branch_id: branch_id || student.branch_id || 1,
            academic_year_id: academic_year_id || 1,
            student_id: Number(sId),
            from_class_id: student.class_id,
            from_section_id: student.section_id,
            to_class_id: Number(to_class_id),
            to_section_id: Number(to_section_id),
            effective_date: effective_date || now.toISOString().split('T')[0],
            reason: reason,
            remarks: remarks || '',
            changed_by: changed_by || 'Admin',
            created_at: now,
            updated_at: now
          });

          await knex('students').where('id', Number(sId)).update({
            class_id: Number(to_class_id),
            section_id: Number(to_section_id),
            updated_at: now
          });
          movedCount++;
        }
      }
      res.json({ success: true, count: movedCount, message: `Successfully moved ${movedCount} student(s)` });
    } catch (err) {
      next(err);
    }
  },

  async getClassSectionHistory(req, res, next) {
    try {
      const branchId = req.query.branch_id ? Number(req.query.branch_id) : 1;
      const search = (req.query.search || '').trim().toLowerCase();

      let query = knex('student_class_section_history as h')
        .leftJoin('students as s', 'h.student_id', 's.id')
        .leftJoin('student_profiles as sp', 's.user_id', 'sp.user_id')
        .leftJoin('classes as fc', 'h.from_class_id', 'fc.id')
        .leftJoin('sections as fs', 'h.from_section_id', 'fs.id')
        .leftJoin('classes as tc', 'h.to_class_id', 'tc.id')
        .leftJoin('sections as ts', 'h.to_section_id', 'ts.id');

      if (!isNaN(branchId) && branchId > 0 && req.query.branch_id !== 'all') {
        query = query.where('h.branch_id', branchId);
      }

      if (req.query.academic_year_id && req.query.academic_year_id !== 'all' && !isNaN(Number(req.query.academic_year_id))) {
        query = query.where('h.academic_year_id', Number(req.query.academic_year_id));
      }

      if (search) {
        const term = `%${search}%`;
        query = query.where(b => {
          b.where('sp.first_name', 'like', term)
           .orWhere('sp.last_name', 'like', term)
           .orWhere('s.admission_no', 'like', term)
           .orWhere('h.reason', 'like', term);
        });
      }

      const rows = await query
        .select(
          'h.id',
          'h.student_id',
          'h.from_class_id',
          'h.from_section_id',
          'h.to_class_id',
          'h.to_section_id',
          'h.effective_date',
          'h.reason',
          'h.remarks',
          'h.changed_by',
          'h.created_at',
          's.admission_no as admission_number',
          'sp.first_name',
          'sp.last_name',
          'fc.class_name as from_class_name',
          'fs.section_name as from_section_name',
          'tc.class_name as to_class_name',
          'ts.section_name as to_section_name'
        )
        .orderBy('h.id', 'desc')
        .limit(200);

      const formatted = rows.map(r => {
        const fullName = `${r.first_name || ''} ${r.last_name || ''}`.trim() || `Student #${r.student_id}`;
        return {
          ...r,
          student_name: fullName,
          from_class_name: r.from_class_name || (r.from_class_id ? `Class ${r.from_class_id}` : 'N/A'),
          from_section_name: r.from_section_name || 'A',
          to_class_name: r.to_class_name || (r.to_class_id ? `Class ${r.to_class_id}` : 'N/A'),
          to_section_name: r.to_section_name || 'A'
        };
      });

      res.json({ success: true, data: formatted });
    } catch (err) {
      next(err);
    }
  },

  async promote(req, res, next) {
    try {
      const { branch_id, from_academic_year_id, to_academic_year_id, promotions } = req.body;
      if (!branch_id || !from_academic_year_id || !to_academic_year_id || !Array.isArray(promotions) || promotions.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid promotion payload. Please provide branch_id, from_academic_year_id, to_academic_year_id, and students list.'
        });
      }

      // Validate that to_class_id are all enabled in target academic year and branch
      const targetClassIds = [...new Set(promotions.map(p => Number(p.to_class_id)))];
      const disabledClasses = await knex('academic_year_classes as ayc')
        .join('classes as c', 'ayc.class_id', 'c.id')
        .where('ayc.branch_id', Number(branch_id))
        .where('ayc.academic_year_id', Number(to_academic_year_id))
        .whereIn('ayc.class_id', targetClassIds)
        .where('ayc.is_enabled', 0)
        .select('c.class_name');
      
      if (disabledClasses.length > 0) {
        const classNames = disabledClasses.map(c => c.class_name || `Class #${c.id}`).join(', ');
        return res.status(400).json({
          success: false,
          message: `Target Class (${classNames}) is disabled for the target academic year in this branch. Please enable the class in Academic Year Settings before proceeding with promotion.`
        });
      }

      let successCount = 0;
      const now = new Date();
      const promotedDate = now.toISOString().split('T')[0];

      for (const p of promotions) {
        const studentId = Number(p.student_id);
        const status = p.promotion_status || 'Promoted';

        await knex('student_promotions').insert({
          organization_id: 1,
          branch_id: Number(branch_id),
          student_id: studentId,
          from_academic_year_id: Number(from_academic_year_id),
          to_academic_year_id: Number(to_academic_year_id),
          from_class_id: Number(p.from_class_id),
          from_section_id: Number(p.from_section_id),
          to_class_id: Number(p.to_class_id),
          to_section_id: Number(p.to_section_id),
          result: p.result || 'Passed',
          promotion_status: status,
          academic_group_id: p.academic_group_id ? Number(p.academic_group_id) : null,
          remarks: p.remarks || '',
          promoted_by: 'Super Admin',
          promoted_date: promotedDate,
          created_at: now,
          updated_at: now
        });

        // Update student's class and section
        if (status === 'Promoted' || status === 'Detained' || status === 'Passed') {
          await knex('students').where('id', studentId).update({
            class_id: Number(p.to_class_id),
            section_id: Number(p.to_section_id),
            updated_at: now
          });
        }
        successCount++;
      }

      res.json({
        success: true,
        message: `Successfully processed promotions for ${successCount} student(s)`,
        processed_count: successCount
      });
    } catch (err) {
      next(err);
    }
  },

  async getPromotionHistory(req, res, next) {
    try {
      const branchId = req.query.branch_id ? Number(req.query.branch_id) : 1;
      const search = (req.query.search || '').trim().toLowerCase();

      let query = knex('student_promotions as sp')
        .leftJoin('students as s', 'sp.student_id', 's.id')
        .leftJoin('student_profiles as prof', 's.user_id', 'prof.user_id')
        .leftJoin('academic_years as fay', 'sp.from_academic_year_id', 'fay.id')
        .leftJoin('academic_years as tay', 'sp.to_academic_year_id', 'tay.id')
        .leftJoin('classes as fc', 'sp.from_class_id', 'fc.id')
        .leftJoin('sections as fs', 'sp.from_section_id', 'fs.id')
        .leftJoin('classes as tc', 'sp.to_class_id', 'tc.id')
        .leftJoin('sections as ts', 'sp.to_section_id', 'ts.id');

      if (!isNaN(branchId) && branchId > 0 && req.query.branch_id !== 'all') {
        query = query.where('sp.branch_id', branchId);
      }

      if (req.query.academic_year_id && req.query.academic_year_id !== 'all' && !isNaN(Number(req.query.academic_year_id))) {
        const ayId = Number(req.query.academic_year_id);
        query = query.where(b => {
          b.where('sp.from_academic_year_id', ayId)
           .orWhere('sp.to_academic_year_id', ayId);
        });
      }

      if (search) {
        const term = `%${search}%`;
        query = query.where(b => {
          b.where('prof.first_name', 'like', term)
           .orWhere('prof.last_name', 'like', term)
           .orWhere('s.admission_no', 'like', term)
           .orWhere('sp.promotion_status', 'like', term);
        });
      }

      const rows = await query
        .select(
          'sp.*',
          's.admission_no as admission_number',
          'prof.first_name',
          'prof.last_name',
          'fay.year_name as from_year_name',
          'tay.year_name as to_year_name',
          'fc.class_name as from_class_name',
          'fs.section_name as from_section_name',
          'tc.class_name as to_class_name',
          'ts.section_name as to_section_name'
        )
        .orderBy('sp.id', 'desc')
        .limit(200);

      const formatted = rows.map(r => {
        const fullName = `${r.first_name || ''} ${r.last_name || ''}`.trim() || `Student #${r.student_id}`;
        return {
          ...r,
          student_name: fullName,
          from_class_name: r.from_class_name || (r.from_class_id ? `Class ${r.from_class_id}` : 'N/A'),
          from_section_name: r.from_section_name || 'A',
          to_class_name: r.to_class_name || (r.to_class_id ? `Class ${r.to_class_id}` : 'N/A'),
          to_section_name: r.to_section_name || 'A'
        };
      });

      res.json({ success: true, data: formatted });
    } catch (err) {
      next(err);
    }
  },

  async getStudentSubjects(req, res, next) {
    try {
      const studentId = req.params.id;
      const subjects = await knex('student_subjects')
        .where('student_id', studentId)
        .where('status', 'Active')
        .orderBy('id', 'asc');
      res.json({ success: true, data: subjects });
    } catch (err) {
      next(err);
    }
  },

  async updateStudentSubjects(req, res, next) {
    try {
      const studentId = req.params.id;
      const { subjects, academic_year_id } = req.body;
      if (!Array.isArray(subjects)) {
        return res.status(400).json({ success: false, message: 'subjects must be an array' });
      }

      const student = await knex('students').where('id', studentId).first();
      if (!student) {
        return res.status(404).json({ success: false, message: 'Student not found' });
      }

      const branchId = student.branch_id || 1;
      const ayId = academic_year_id || student.academic_year_id || 2;
      const classId = student.class_id;
      const now = new Date();

      // Deactivate or replace current subjects for this student and academic year
      await knex('student_subjects')
        .where('student_id', studentId)
        .where('academic_year_id', ayId)
        .del();

      for (const s of subjects) {
        await knex('student_subjects').insert({
          branch_id: branchId,
          academic_year_id: ayId,
          student_id: studentId,
          class_id: classId,
          subject_id: s.subject_id || null,
          class_subject_id: s.class_subject_id || null,
          subject_name: s.subject_name || s.name,
          subject_code: s.subject_code || s.code,
          subject_type: s.subject_type || 'Core',
          is_language: Boolean(s.is_language),
          language_level: s.language_level || null,
          enrollment_type: s.enrollment_type || 'Compulsory',
          status: 'Active',
          created_at: now,
          updated_at: now
        });
      }

      const updated = await knex('student_subjects')
        .where('student_id', studentId)
        .where('status', 'Active')
        .orderBy('id', 'asc');

      res.json({ success: true, message: 'Subjects updated successfully', data: updated });
    } catch (err) {
      next(err);
    }
  },

  async getSectionSubjectMapping(req, res, next) {
    try {
      const { branch_id, academic_year_id, class_id, section_id } = req.query;
      if (!class_id) {
        return res.status(400).json({ success: false, message: 'class_id is required' });
      }

      const branchId = Number(branch_id) || 1;
      const ayId = Number(academic_year_id) || 2;
      const classId = Number(class_id);

      // 1. Get class subjects
      const subjects = await knex('class_subjects')
        .where('branch_id', branchId)
        .where('academic_year_id', ayId)
        .where('class_id', classId)
        .where('status', 'Active')
        .orderBy('display_order', 'asc');

      // 2. Get students in this class/section
      let stuQuery = knex('students as s')
        .leftJoin('student_profiles as sp', 's.user_id', 'sp.user_id')
        .where('s.class_id', classId)
        .where('s.branch_id', branchId)
        .where('s.status', 'Active');

      if (section_id && section_id !== 'all' && !isNaN(Number(section_id))) {
        stuQuery = stuQuery.where('s.section_id', Number(section_id));
      }

      const students = await stuQuery.select(
        's.id',
        's.admission_no',
        's.class_id',
        's.section_id',
        'sp.first_name',
        'sp.last_name',
        's.gender'
      ).orderBy('s.id', 'asc');

      // 3. Get existing student_subjects mappings for these students
      const studentIds = students.map(s => s.id);
      const studentSubjects = studentIds.length > 0 
        ? await knex('student_subjects')
            .whereIn('student_id', studentIds)
            .where('academic_year_id', ayId)
            .where('status', 'Active')
        : [];

      // Group mappings by student_id
      const mappingByStudent = {};
      for (const m of studentSubjects) {
        if (!mappingByStudent[m.student_id]) {
          mappingByStudent[m.student_id] = [];
        }
        mappingByStudent[m.student_id].push(m);
      }

      const formattedStudents = students.map(st => {
        const enrolled = mappingByStudent[st.id] || [];
        const enrolledCodes = enrolled.map(e => e.subject_code);
        return {
          id: st.id,
          student_id: st.id,
          admission_number: st.admission_no,
          full_name: `${st.first_name || ''} ${st.last_name || ''}`.trim() || `Student #${st.id}`,
          class_id: st.class_id,
          section_id: st.section_id,
          enrolled_subjects: enrolled,
          enrolled_subject_codes: enrolledCodes
        };
      });

      res.json({
        success: true,
        data: {
          subjects,
          students: formattedStudents,
          total_students: formattedStudents.length
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async bulkAssignSectionSubjects(req, res, next) {
    try {
      const { branch_id, academic_year_id, class_id, assignments } = req.body;
      if (!Array.isArray(assignments)) {
        return res.status(400).json({ success: false, message: 'assignments must be an array of { student_id, subject_codes }' });
      }

      const branchId = Number(branch_id) || 1;
      const ayId = Number(academic_year_id) || 2;
      const classId = Number(class_id);
      const now = new Date();

      // Fetch class subjects for quick lookup
      const classSubjects = await knex('class_subjects')
        .where('class_id', classId)
        .where('academic_year_id', ayId);

      const subLookup = {};
      for (const cs of classSubjects) {
        subLookup[cs.subject_code] = cs;
      }

      for (const assign of assignments) {
        const stuId = assign.student_id;
        const codes = Array.isArray(assign.subject_codes) ? assign.subject_codes : [];

        // Clear existing for this student in this academic year
        await knex('student_subjects')
          .where('student_id', stuId)
          .where('academic_year_id', ayId)
          .del();

        // Insert new selected subjects
        for (const code of codes) {
          const cs = subLookup[code];
          if (cs) {
            await knex('student_subjects').insert({
              branch_id: branchId,
              academic_year_id: ayId,
              student_id: stuId,
              class_id: classId,
              subject_id: cs.subject_id,
              class_subject_id: cs.id,
              subject_name: cs.subject_name,
              subject_code: cs.subject_code,
              subject_type: cs.subject_type,
              is_language: cs.is_language,
              language_level: cs.language_level,
              enrollment_type: cs.requirement,
              status: 'Active',
              created_at: now,
              updated_at: now
            });
          }
        }
      }

      res.json({ success: true, message: `Successfully updated subject assignments for ${assignments.length} students` });
    } catch (err) {
      next(err);
    }
  }
};

export default studentController;
