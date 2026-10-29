import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendToUser } from '../utils/fcmStudent.js';
import { sutando } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const knex = (table) => sutando.connection().table(table);
knex.raw = (...args) => sutando.connection().raw(...args);

// Helper for real-time communication audit logging
const logAudit = async ({ branch_id, academic_year_id, module_name, action, details, user_id = 1, ip_address = '127.0.0.1' }) => {
  try {
    if (!branch_id || !module_name || !action) return;
    await knex('communication_audit_logs').insert({
      branch_id: Number(branch_id),
      academic_year_id: academic_year_id ? Number(academic_year_id) : null,
      module_name,
      action,
      details: details || null,
      user_id: user_id ? Number(user_id) : 1,
      ip_address,
      created_at: new Date(),
      updated_at: new Date()
    });
  } catch (err) {
    console.error('Audit logging failed:', err.message);
  }
};

export const communicationController = {
  async listHomework(req, res, next) {
    try {
      const { branch_id, class_id, section_id, academic_year_id } = req.query;
      let query = knex('homework as h')
        .leftJoin('classes as c', 'h.class_id', 'c.id')
        .leftJoin('sections as s', 'h.section_id', 's.id')
        .leftJoin('subjects as sub', 'h.subject_id', 'sub.id');

      if (branch_id && branch_id !== 'all') query = query.where('h.branch_id', Number(branch_id));
      if (academic_year_id && academic_year_id !== 'all' && !isNaN(Number(academic_year_id))) {
        query = query.where('s.academic_year_id', Number(academic_year_id));
      }
      if (class_id && class_id !== 'all') query = query.where('h.class_id', Number(class_id));
      if (section_id && section_id !== 'all') {
        const secId = Number(section_id);
        if (!isNaN(secId) && secId > 0) {
          query = query.where('h.section_id', secId);
        } else {
          query = query.where('s.section_name', section_id);
        }
      }

      const rows = await query.select(
        'h.*',
        'c.class_name',
        's.section_name',
        sutando.connection().raw('COALESCE(sub.subject_name, h.subject_name) as subject_name')
      ).orderBy('h.id', 'desc');

      const formatted = rows.map(r => {
        let attachmentsObj = null;
        if (r.attachments) {
          try {
            attachmentsObj = typeof r.attachments === 'string' ? JSON.parse(r.attachments) : r.attachments;
          } catch (e) {
            attachmentsObj = null;
          }
        }
        return {
          ...r,
          attachments: attachmentsObj
        };
      });

      res.json({ success: true, data: formatted, homework: formatted });
    } catch (err) {
      next(err);
    }
  },

  async createHomework(req, res, next) {
    try {
      const now = new Date();
      const payload = { ...req.body };
      if (payload.attachments && typeof payload.attachments !== 'string') {
        payload.attachments = JSON.stringify(payload.attachments);
      }
      // Delete any fields not in the table
      delete payload.class_name;
      delete payload.section_name;
      delete payload.created_at;
      delete payload.updated_at;

      const [id] = await knex('homework').insert({
        ...payload,
        created_at: now,
        updated_at: now,
      });

      await logAudit({
        branch_id: payload.branch_id || 1,
        academic_year_id: payload.academic_year_id,
        module_name: 'Homework',
        action: 'Created Homework',
        details: `Created homework '${payload.title || 'Untitled'}' (${payload.subject_name || 'Subject'})`,
        user_id: payload.created_by || 1
      });

              // Send notification to all students of the class/section
        try {
          const studentRows = await knex('students')
            .where('class_id', payload.class_id)
            .andWhere('section_id', payload.section_id)
            .select('id', 'user_id');

          const notifPayload = {
            title: `New Homework: ${payload.title || payload.subject_name || 'Assignment'}`,
            body: payload.description || payload.topic || 'New homework posted for your class.',
            data: { 
              homeworkId: id.toString(),
              type: 'homework'
            },
          };

          // Find target user IDs (prefer student.user_id, fallback to student.id if user_id is null)
          const targetUserIds = studentRows
            .map(row => row.user_id || row.id)
            .filter(Boolean);

          console.log(`[Homework Notification] Targeting ${targetUserIds.length} students for class=${payload.class_id}, section=${payload.section_id}:`, targetUserIds);

          // Fire-and-forget notifications
          Promise.all(
            targetUserIds.map((userId) => sendToUser(userId, notifPayload))
          ).catch(err => console.error('[Homework Notification] Error in batch send:', err));
        } catch (notifErr) {
          console.error('[Homework Notification] Query error:', notifErr);
        }

        res.status(201).json({ success: true, id, message: 'Homework created' });
    } catch (err) {
      next(err);
    }
  },

  async updateHomework(req, res, next) {
    try {
      const { id } = req.params;
      const now = new Date();
      const payload = { ...req.body };
      if (payload.attachments && typeof payload.attachments !== 'string') {
        payload.attachments = JSON.stringify(payload.attachments);
      }
      delete payload.id;
      delete payload.class_name;
      delete payload.section_name;
      delete payload.created_at;
      delete payload.updated_at;

      await knex('homework').where('id', Number(id)).update({
        ...payload,
        updated_at: now
      });

      await logAudit({
        branch_id: payload.branch_id || 1,
        academic_year_id: payload.academic_year_id,
        module_name: 'Homework',
        action: 'Updated Homework',
        details: `Updated homework #${id} - '${payload.title || 'Homework'}'`,
        user_id: payload.created_by || 1
      });

      res.json({ success: true, message: 'Homework updated' });
    } catch (err) {
      next(err);
    }
  },

  async deleteHomework(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await knex('homework').where('id', Number(id)).first();
      await knex('homework').where('id', Number(id)).del();

      if (existing) {
        await logAudit({
          branch_id: existing.branch_id || 1,
          module_name: 'Homework',
          action: 'Deleted Homework',
          details: `Deleted homework #${id} ('${existing.title || 'Untitled'}')`
        });
      }

      res.json({ success: true, message: 'Homework deleted' });
    } catch (err) {
      next(err);
    }
  },

  async listAnnouncements(req, res, next) {
    try {
      const { branch_id, academic_year_id, user_type, priority, status, search } = req.query;
      let query = knex('announcements as an')
        .leftJoin('classes as c', 'an.target_class_id', 'c.id')
        .leftJoin('sections as s', 'an.target_section_id', 's.id');

      if (branch_id && branch_id !== 'all') query = query.where('an.branch_id', Number(branch_id));
      if (academic_year_id && academic_year_id !== 'all' && !isNaN(Number(academic_year_id))) {
        query = query.where('an.academic_year_id', Number(academic_year_id));
      }
      if (user_type && user_type !== 'all') {
        query = query.where('an.user_type', user_type);
      }
      if (priority && priority !== 'all') {
        query = query.where('an.priority', priority);
      }
      if (status && status !== 'all') {
        query = query.where('an.status', status);
      }
      if (search) {
        query = query.where(function() {
          this.where('an.title', 'like', `%${search}%`)
              .orWhere('an.message', 'like', `%${search}%`);
        });
      }

      const rows = await query.select(
        'an.*',
        'c.class_name',
        's.section_name'
      ).orderBy('an.id', 'desc');

      const formatted = rows.map(r => {
        let attachmentsObj = null;
        if (r.attachments) {
          try {
            attachmentsObj = typeof r.attachments === 'string' ? JSON.parse(r.attachments) : r.attachments;
          } catch (e) {
            attachmentsObj = null;
          }
        }
        return {
          ...r,
          attachments: attachmentsObj
        };
      });

      res.json({ success: true, data: formatted, announcements: formatted });
    } catch (err) {
      next(err);
    }
  },

  async uploadAttachment(req, res, next) {
    try {
      const { filename, base64Data } = req.body;
      if (!filename || !base64Data) {
        return res.status(400).json({ success: false, message: 'Missing file data' });
      }

      // Safe clean filename
      const ext = path.extname(filename);
      const safeBase = path.basename(filename, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
      const uniqueName = `${Date.now()}_${safeBase}${ext}`;
      const uploadDir = path.resolve(__dirname, '..', 'uploads', 'homework');
      
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, uniqueName);
      // Strip potential data URL prefix
      const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, '');
      await fs.promises.writeFile(filePath, Buffer.from(cleanBase64, 'base64'));

      const fileUrl = `/uploads/homework/${uniqueName}`;
      res.json({
        success: true,
        url: fileUrl,
        name: filename,
        message: 'File uploaded successfully'
      });
    } catch (err) {
      next(err);
    }
  },

  async createAnnouncement(req, res, next) {
    try {
      const now = new Date();
      const payload = { ...req.body };
      if (payload.attachments && typeof payload.attachments !== 'string') {
        payload.attachments = JSON.stringify(payload.attachments);
      }
      delete payload.class_name;
      delete payload.section_name;

      const [id] = await knex('announcements').insert({
        ...payload,
        created_at: now,
        updated_at: now,
      });

      await logAudit({
        branch_id: payload.branch_id || 1,
        academic_year_id: payload.academic_year_id,
        module_name: 'Announcement',
        action: 'Broadcast Notice',
        details: `Published announcement '${payload.title || 'Untitled'}' to ${payload.user_type || 'Audience'}`,
        user_id: payload.created_by || 1
      });

      res.status(201).json({ success: true, id, message: 'Announcement created successfully' });
    } catch (err) {
      next(err);
    }
  },

  async updateAnnouncement(req, res, next) {
    try {
      const { id } = req.params;
      const now = new Date();
      const payload = { ...req.body };
      if (payload.attachments && typeof payload.attachments !== 'string') {
        payload.attachments = JSON.stringify(payload.attachments);
      }
      delete payload.id;
      delete payload.class_name;
      delete payload.section_name;
      delete payload.created_at;
      delete payload.updated_at;

      await knex('announcements').where('id', Number(id)).update({
        ...payload,
        updated_at: now,
      });

      await logAudit({
        branch_id: payload.branch_id || 1,
        academic_year_id: payload.academic_year_id,
        module_name: 'Announcement',
        action: 'Updated Notice',
        details: `Updated circular #${id} - '${payload.title || 'Announcement'}'`,
        user_id: payload.created_by || 1
      });

      res.json({ success: true, message: 'Announcement updated successfully' });
    } catch (err) {
      next(err);
    }
  },

  async deleteAnnouncement(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await knex('announcements').where('id', Number(id)).first();
      await knex('announcements').where('id', Number(id)).del();

      if (existing) {
        await logAudit({
          branch_id: existing.branch_id || 1,
          academic_year_id: existing.academic_year_id,
          module_name: 'Announcement',
          action: 'Deleted Notice',
          details: `Deleted notice #${id} ('${existing.title || 'Untitled'}')`
        });
      }

      res.json({ success: true, message: 'Announcement deleted successfully' });
    } catch (err) {
      next(err);
    }
  },

  // --- Assignments ---
  async listAssignments(req, res, next) {
    try {
      const { branch_id, class_id, section_id, academic_year_id, submission_type, status, search } = req.query;
      let query = knex('assignments as a')
        .leftJoin('classes as c', 'a.class_id', 'c.id')
        .leftJoin('sections as s', 'a.section_id', 's.id')
        .leftJoin('subjects as sub', 'a.subject_id', 'sub.id');

      if (branch_id && branch_id !== 'all') query = query.where('a.branch_id', Number(branch_id));
      if (academic_year_id && academic_year_id !== 'all' && !isNaN(Number(academic_year_id))) {
        query = query.where('s.academic_year_id', Number(academic_year_id));
      }
      if (class_id && class_id !== 'all') query = query.where('a.class_id', Number(class_id));
      if (section_id && section_id !== 'all') {
        const secId = Number(section_id);
        if (!isNaN(secId) && secId > 0) {
          query = query.where('a.section_id', secId);
        } else {
          query = query.where('s.section_name', section_id);
        }
      }
      if (submission_type && submission_type !== 'all') {
        query = query.where('a.submission_type', submission_type);
      }
      if (status && status !== 'all') {
        query = query.where('a.status', status);
      }
      if (search) {
        query = query.where(function() {
          this.where('a.title', 'like', `%${search}%`)
              .orWhere('a.subject_name', 'like', `%${search}%`);
        });
      }

      const rows = await query.select(
        'a.*',
        'c.class_name',
        's.section_name',
        sutando.connection().raw('COALESCE(sub.subject_name, a.subject_name) as subject_name')
      ).orderBy('a.id', 'desc');

      // Fetch submission counts for each assignment
      const formatted = await Promise.all(rows.map(async (r) => {
        let attachmentsObj = null;
        if (r.attachments) {
          try {
            attachmentsObj = typeof r.attachments === 'string' ? JSON.parse(r.attachments) : r.attachments;
          } catch (e) {
            attachmentsObj = null;
          }
        }

        // Count targeted students
        let targetQuery = knex('students').where('status', 'Active');
        if (r.branch_id) targetQuery = targetQuery.where('branch_id', r.branch_id);
        if (r.class_id) targetQuery = targetQuery.where('class_id', r.class_id);
        if (r.section_id) targetQuery = targetQuery.where('section_id', r.section_id);
        const targetCnt = await targetQuery.select(knex.raw('count(*) as cnt')).first();

        const submittedCnt = await knex('assignment_submissions')
          .where('assignment_id', r.id)
          .whereIn('submission_status', ['Submitted', 'Late Submitted', 'Reviewed', 'Completed'])
          .select(knex.raw('count(*) as cnt'))
          .first();

        return {
          ...r,
          attachments: attachmentsObj,
          total_targeted_students: targetCnt?.cnt || 0,
          submitted_count: submittedCnt?.cnt || 0
        };
      }));

      res.json({ success: true, data: formatted, assignments: formatted });
    } catch (err) {
      next(err);
    }
  },

  async getAssignmentDetails(req, res, next) {
    try {
      const { id } = req.params;
      const assignment = await knex('assignments as a')
        .leftJoin('classes as c', 'a.class_id', 'c.id')
        .leftJoin('sections as s', 'a.section_id', 's.id')
        .where('a.id', Number(id))
        .select('a.*', 'c.class_name', 's.section_name')
        .first();

      if (!assignment) {
        return res.status(404).json({ success: false, message: 'Assignment not found' });
      }

      // Fetch students for this class/section
      let stuQuery = knex('students as st')
        .leftJoin('sections as sec', 'st.section_id', 'sec.id')
        .where('st.class_id', assignment.class_id)
        .where('st.status', 'Active');

      if (assignment.section_id) {
        stuQuery = stuQuery.where('st.section_id', assignment.section_id);
      }

      const students = await stuQuery.select(
        'st.id as student_id',
        sutando.connection().raw("CONCAT(COALESCE(st.first_name, ''), ' ', COALESCE(st.last_name, '')) as student_name"),
        'st.admission_number',
        'st.roll_number',
        'sec.section_name'
      );

      const submissions = await knex('assignment_submissions').where('assignment_id', Number(id));
      const submissionMap = new Map();
      submissions.forEach(sub => submissionMap.set(sub.student_id, sub));

      const rosterWithStatus = students.map(st => {
        const sub = submissionMap.get(st.student_id);
        return {
          student_id: st.student_id,
          student_name: st.student_name.trim() || 'Student',
          admission_number: st.admission_number,
          roll_number: st.roll_number,
          section_name: st.section_name || 'A',
          submission_status: sub ? sub.submission_status : 'Pending',
          submission_file_url: sub?.submission_file_url || null,
          submission_file_name: sub?.submission_file_name || null,
          submission_notes: sub?.submission_notes || null,
          submission_date: sub?.submission_date || null,
          marks_obtained: sub?.marks_obtained !== undefined ? sub.marks_obtained : null,
          grade: sub?.grade || null,
          remarks: sub?.remarks || null,
          feedback: sub?.feedback || null,
          offline_completion_date: sub?.offline_completion_date || null
        };
      });

      res.json({
        success: true,
        assignment,
        submissions: rosterWithStatus
      });
    } catch (err) {
      next(err);
    }
  },

  async createAssignment(req, res, next) {
    try {
      const now = new Date();
      const payload = { ...req.body };
      if (payload.attachments && typeof payload.attachments !== 'string') {
        payload.attachments = JSON.stringify(payload.attachments);
      }
      delete payload.class_name;
      delete payload.section_name;
      delete payload.total_targeted_students;
      delete payload.submitted_count;

      const [id] = await knex('assignments').insert({
        ...payload,
        created_at: now,
        updated_at: now
      });

      await logAudit({
        branch_id: payload.branch_id || 1,
        academic_year_id: payload.academic_year_id,
        module_name: 'Assignment',
        action: 'Created Assignment',
        details: `Published assignment '${payload.title || 'Untitled'}' (${payload.subject_name || 'Subject'})`,
        user_id: payload.created_by || 1
      });

      res.status(201).json({ success: true, id, message: 'Assignment created successfully' });
    } catch (err) {
      next(err);
    }
  },

  async updateAssignment(req, res, next) {
    try {
      const { id } = req.params;
      const now = new Date();
      const payload = { ...req.body };
      if (payload.attachments && typeof payload.attachments !== 'string') {
        payload.attachments = JSON.stringify(payload.attachments);
      }
      delete payload.id;
      delete payload.class_name;
      delete payload.section_name;
      delete payload.total_targeted_students;
      delete payload.submitted_count;
      delete payload.created_at;
      delete payload.updated_at;

      await knex('assignments').where('id', Number(id)).update({
        ...payload,
        updated_at: now
      });

      await logAudit({
        branch_id: payload.branch_id || 1,
        academic_year_id: payload.academic_year_id,
        module_name: 'Assignment',
        action: 'Updated Assignment',
        details: `Updated assignment #${id} - '${payload.title || 'Assignment'}'`,
        user_id: payload.created_by || 1
      });

      res.json({ success: true, message: 'Assignment updated successfully' });
    } catch (err) {
      next(err);
    }
  },

  async deleteAssignment(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await knex('assignments').where('id', Number(id)).first();
      await knex('assignment_submissions').where('assignment_id', Number(id)).del();
      await knex('assignments').where('id', Number(id)).del();

      if (existing) {
        await logAudit({
          branch_id: existing.branch_id || 1,
          academic_year_id: existing.academic_year_id,
          module_name: 'Assignment',
          action: 'Deleted Assignment',
          details: `Deleted assignment #${id} ('${existing.title || 'Untitled'}')`
        });
      }

      res.json({ success: true, message: 'Assignment deleted successfully' });
    } catch (err) {
      next(err);
    }
  },

  async reviewAssignment(req, res, next) {
    try {
      const { assignmentId, studentId } = req.params;
      const { marks_obtained, grade, remarks, feedback, status, reviewed_by } = req.body;
      const now = new Date();

      const existing = await knex('assignment_submissions')
        .where('assignment_id', Number(assignmentId))
        .where('student_id', Number(studentId))
        .first();

      if (existing) {
        await knex('assignment_submissions')
          .where('assignment_id', Number(assignmentId))
          .where('student_id', Number(studentId))
          .update({
            marks_obtained,
            grade,
            remarks,
            feedback,
            submission_status: status || 'Reviewed',
            reviewed_by: reviewed_by || 'Teacher / Staff',
            reviewed_at: now,
            updated_at: now
          });
      } else {
        await knex('assignment_submissions').insert({
          assignment_id: Number(assignmentId),
          student_id: Number(studentId),
          marks_obtained,
          grade,
          remarks,
          feedback,
          submission_status: status || 'Reviewed',
          reviewed_by: reviewed_by || 'Teacher / Staff',
          reviewed_at: now,
          created_at: now,
          updated_at: now
        });
      }

      res.json({ success: true, message: 'Review saved successfully' });
    } catch (err) {
      next(err);
    }
  },

  async submitAssignmentWork(req, res, next) {
    try {
      const { assignmentId } = req.params;
      const { student_id, submission_text, submission_file_url, file_url } = req.body;
      const sId = Number(student_id);
      const aId = Number(assignmentId);
      const now = new Date();

      if (!sId || !aId) {
        return res.status(400).json({ success: false, message: 'student_id and assignmentId are required' });
      }

      const existing = await knex('assignment_submissions')
        .where('assignment_id', aId)
        .where('student_id', sId)
        .first();

      const finalFileUrl = submission_file_url || file_url || null;

      if (existing) {
        await knex('assignment_submissions')
          .where('assignment_id', aId)
          .where('student_id', sId)
          .update({
            submission_status: 'Submitted',
            submission_file_url: finalFileUrl,
            submission_text: submission_text || existing.submission_text || null,
            submitted_at: now,
            updated_at: now
          });
      } else {
        await knex('assignment_submissions').insert({
          assignment_id: aId,
          student_id: sId,
          submission_status: 'Submitted',
          submission_file_url: finalFileUrl,
          submission_text: submission_text || null,
          submitted_at: now,
          created_at: now,
          updated_at: now
        });
      }

      res.json({ success: true, message: 'Assignment submitted successfully' });
    } catch (err) {
      next(err);
    }
  },

  async markOfflineCompletion(req, res, next) {
    try {
      const { assignmentId, studentId } = req.params;
      const { offline_verified_by, offline_completion_date, marks_obtained, grade, remarks } = req.body;
      const now = new Date();

      const existing = await knex('assignment_submissions')
        .where('assignment_id', Number(assignmentId))
        .where('student_id', Number(studentId))
        .first();

      if (existing) {
        await knex('assignment_submissions')
          .where('assignment_id', Number(assignmentId))
          .where('student_id', Number(studentId))
          .update({
            submission_status: 'Completed',
            offline_verified_by: offline_verified_by || 'Teacher / Staff',
            offline_completion_date: offline_completion_date || now.toISOString().split('T')[0],
            marks_obtained,
            grade,
            remarks,
            updated_at: now
          });
      } else {
        await knex('assignment_submissions').insert({
          assignment_id: Number(assignmentId),
          student_id: Number(studentId),
          submission_status: 'Completed',
          offline_verified_by: offline_verified_by || 'Teacher / Staff',
          offline_completion_date: offline_completion_date || now.toISOString().split('T')[0],
          marks_obtained,
          grade,
          remarks,
          created_at: now,
          updated_at: now
        });
      }

      res.json({ success: true, message: 'Offline completion marked successfully' });
    } catch (err) {
      next(err);
    }
  },

  // --- Gallery Albums & Media ---
  async listAlbums(req, res, next) {
    try {
      const { branch_id, academic_year_id, status, search } = req.query;
      let query = knex('gallery_albums as a')
        .leftJoin('classes as c', 'a.target_class_id', 'c.id')
        .leftJoin('sections as s', 'a.target_section_id', 's.id');

      if (branch_id && branch_id !== 'all') query = query.where('a.branch_id', Number(branch_id));
      if (academic_year_id && academic_year_id !== 'all' && !isNaN(Number(academic_year_id))) {
        query = query.where('a.academic_year_id', Number(academic_year_id));
      }
      if (status && status !== 'all') query = query.where('a.status', status);
      if (search) {
        query = query.where(function() {
          this.where('a.album_name', 'like', `%${search}%`)
              .orWhere('a.event_name', 'like', `%${search}%`);
        });
      }

      const rows = await query.select(
        'a.*',
        'c.class_name',
        's.section_name'
      ).orderBy('a.id', 'desc');

      // Fetch media count for each album
      const albumsWithCount = await Promise.all(rows.map(async (alb) => {
        const cnt = await knex('gallery_media').where('album_id', alb.id).select(knex.raw('count(*) as count')).first();
        let totalCount = Number(cnt?.count || 0);
        if (totalCount === 0 && alb.cover_image_url && !alb.cover_image_url.includes('images.unsplash.com')) {
          totalCount = 1;
        }

        let attachmentsObj = null;
        if (alb.attachments) {
          try {
            attachmentsObj = typeof alb.attachments === 'string' ? JSON.parse(alb.attachments) : alb.attachments;
          } catch(e) {
            attachmentsObj = null;
          }
        }
        return {
          ...alb,
          media_count: totalCount,
          attachments: attachmentsObj
        };
      }));

      res.json({ success: true, data: albumsWithCount });
    } catch (err) {
      next(err);
    }
  },

  async getAlbumDetails(req, res, next) {
    try {
      const { id } = req.params;
      const album = await knex('gallery_albums as a')
        .leftJoin('classes as c', 'a.target_class_id', 'c.id')
        .leftJoin('sections as s', 'a.target_section_id', 's.id')
        .where('a.id', Number(id))
        .select('a.*', 'c.class_name', 's.section_name')
        .first();

      if (!album) {
        return res.status(404).json({ success: false, message: 'Album not found' });
      }

      if (album.attachments && typeof album.attachments === 'string') {
        try { album.attachments = JSON.parse(album.attachments); } catch(e) {}
      }

      let media = await knex('gallery_media')
        .where('album_id', Number(id))
        .orderBy('display_order', 'asc')
        .orderBy('id', 'desc');

      // If media is empty but album has a valid cover image or attached photo, auto-insert and return it!
      if (media.length === 0 && album.cover_image_url && !album.cover_image_url.includes('images.unsplash.com')) {
        const fallbackTitle = album.attachments?.image?.name || album.event_name || album.album_name || 'Event Photo';
        try {
          const [insertedId] = await knex('gallery_media').insert({
            album_id: Number(id),
            media_type: 'Photo',
            media_url: album.cover_image_url,
            title: fallbackTitle,
            caption: album.description || '',
            display_order: 1,
            created_at: new Date(),
            updated_at: new Date()
          });
          media = [{
            id: insertedId,
            album_id: Number(id),
            media_type: 'Photo',
            media_url: album.cover_image_url,
            title: fallbackTitle,
            caption: album.description || '',
            display_order: 1
          }];
        } catch (_) {}
      }

      res.json({ success: true, album, media });
    } catch (err) {
      next(err);
    }
  },

  async createAlbum(req, res, next) {
    try {
      const now = new Date();
      const payload = { ...req.body };
      const initialMedia = Array.isArray(payload.initial_media) ? payload.initial_media : [];
      delete payload.initial_media;

      if (payload.attachments && typeof payload.attachments !== 'string') {
        payload.attachments = JSON.stringify(payload.attachments);
      }
      delete payload.class_name;
      delete payload.section_name;
      delete payload.media_count;

      // If no custom cover uploaded or it is still default unsplash placeholder, auto-use the first uploaded media photo as cover!
      if (initialMedia.length > 0 && initialMedia[0]?.media_url) {
        if (!payload.cover_image_url || payload.cover_image_url.includes('images.unsplash.com')) {
          payload.cover_image_url = initialMedia[0].media_url;
        }
      }

      // Collect all media items: initialMedia + cover photo (if custom) + link attachments
      let finalMediaItems = [...initialMedia];
      if (payload.cover_image_url && !payload.cover_image_url.includes('images.unsplash.com')) {
        const hasCoverInMedia = finalMediaItems.some(m => m.media_url === payload.cover_image_url);
        if (!hasCoverInMedia) {
          finalMediaItems.unshift({
            media_type: 'Photo',
            media_url: payload.cover_image_url,
            title: payload.event_name || payload.album_name || 'Cover Photo',
            caption: payload.description || '',
            display_order: 1
          });
        }
      }

      // If attachments has links, include them as media items
      if (payload.attachments) {
        try {
          const parsed = typeof payload.attachments === 'string' ? JSON.parse(payload.attachments) : payload.attachments;
          if (parsed?.links && Array.isArray(parsed.links)) {
            for (const link of parsed.links) {
              if (link?.url && !finalMediaItems.some(m => m.media_url === link.url)) {
                const isVideo = link.url.includes('youtube') || link.url.includes('vimeo') || link.url.endsWith('.mp4');
                finalMediaItems.push({
                  media_type: isVideo ? 'Video' : 'Photo',
                  media_url: link.url,
                  title: link.title || 'Media Link',
                  caption: link.title || '',
                  display_order: finalMediaItems.length + 1
                });
              }
            }
          }
        } catch (_) {}
      }

      const [id] = await knex('gallery_albums').insert({
        ...payload,
        created_at: now,
        updated_at: now
      });

      if (finalMediaItems.length > 0) {
        const rowsToInsert = finalMediaItems.map((m, idx) => ({
          album_id: Number(id),
          media_type: m.media_type || 'Photo',
          media_url: m.media_url,
          title: m.title || null,
          caption: m.caption || null,
          display_order: m.display_order || (idx + 1),
          created_at: now,
          updated_at: now
        }));
        await knex('gallery_media').insert(rowsToInsert);
      }

      await logAudit({
        branch_id: payload.branch_id || 1,
        academic_year_id: payload.academic_year_id,
        module_name: 'Gallery',
        action: 'Created Event Album',
        details: `Created album '${payload.album_name || 'Event Album'}' for event '${payload.event_name || 'Event'}' (${finalMediaItems.length} photos uploaded)`,
        user_id: payload.created_by || 1
      });

      res.status(201).json({ success: true, id, message: 'Gallery album created successfully' });
    } catch (err) {
      next(err);
    }
  },

  async updateAlbum(req, res, next) {
    try {
      const { id } = req.params;
      const now = new Date();
      const payload = { ...req.body };
      const newMedia = Array.isArray(payload.new_media) ? payload.new_media : [];
      delete payload.new_media;
      delete payload.initial_media;

      if (payload.attachments && typeof payload.attachments !== 'string') {
        payload.attachments = JSON.stringify(payload.attachments);
      }
      delete payload.id;
      delete payload.class_name;
      delete payload.section_name;
      delete payload.media_count;
      delete payload.created_at;
      delete payload.updated_at;

      await knex('gallery_albums').where('id', Number(id)).update({
        ...payload,
        updated_at: now
      });

      let rowsToInsert = [];
      if (newMedia.length > 0) {
        rowsToInsert = newMedia.map((m, idx) => ({
          album_id: Number(id),
          media_type: m.media_type || 'Photo',
          media_url: m.media_url,
          title: m.title || null,
          caption: m.caption || null,
          display_order: m.display_order || (idx + 1),
          created_at: now,
          updated_at: now
        }));
      } else {
        // If no newMedia passed, but album currently has 0 media in gallery_media, auto-insert cover photo!
        const existingCount = await knex('gallery_media').where('album_id', Number(id)).count('id as count').first();
        if (Number(existingCount?.count || 0) === 0 && payload.cover_image_url && !payload.cover_image_url.includes('images.unsplash.com')) {
          rowsToInsert.push({
            album_id: Number(id),
            media_type: 'Photo',
            media_url: payload.cover_image_url,
            title: payload.event_name || payload.album_name || 'Cover Photo',
            caption: payload.description || '',
            display_order: 1,
            created_at: now,
            updated_at: now
          });
        }
      }

      if (rowsToInsert.length > 0) {
        await knex('gallery_media').insert(rowsToInsert);
      }

      await logAudit({
        branch_id: payload.branch_id || 1,
        academic_year_id: payload.academic_year_id,
        module_name: 'Gallery',
        action: 'Updated Album',
        details: `Updated album #${id} - '${payload.album_name || 'Album'}'`,
        user_id: payload.created_by || 1
      });

      res.json({ success: true, message: 'Gallery album updated successfully' });
    } catch (err) {
      next(err);
    }
  },

  async deleteAlbum(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await knex('gallery_albums').where('id', Number(id)).first();
      await knex('gallery_media').where('album_id', Number(id)).del();
      await knex('gallery_albums').where('id', Number(id)).del();

      if (existing) {
        await logAudit({
          branch_id: existing.branch_id || 1,
          academic_year_id: existing.academic_year_id,
          module_name: 'Gallery',
          action: 'Deleted Album',
          details: `Deleted album #${id} ('${existing.album_name || 'Untitled'}')`
        });
      }

      res.json({ success: true, message: 'Gallery album deleted successfully' });
    } catch (err) {
      next(err);
    }
  },

  async addMediaToAlbum(req, res, next) {
    try {
      const { albumId } = req.params;
      const { media } = req.body; // array of media items
      const now = new Date();

      if (!Array.isArray(media) || media.length === 0) {
        return res.status(400).json({ success: false, message: 'Media list is required' });
      }

      const rowsToInsert = media.map((m, idx) => ({
        album_id: Number(albumId),
        media_type: m.media_type || 'Photo',
        media_url: m.media_url,
        title: m.title || null,
        caption: m.caption || null,
        display_order: m.display_order || (idx + 1),
        created_at: now,
        updated_at: now
      }));

      await knex('gallery_media').insert(rowsToInsert);
      res.status(201).json({ success: true, message: 'Media added to album successfully' });
    } catch (err) {
      next(err);
    }
  },

  async updateMediaItem(req, res, next) {
    try {
      const { mediaId } = req.params;
      const { media_url, title, caption, media_type } = req.body;
      const now = new Date();

      const updateData = { updated_at: now };
      if (media_url !== undefined) updateData.media_url = media_url;
      if (title !== undefined) updateData.title = title;
      if (caption !== undefined) updateData.caption = caption;
      if (media_type !== undefined) updateData.media_type = media_type;

      await knex('gallery_media').where('id', Number(mediaId)).update(updateData);
      res.json({ success: true, message: 'Media item updated successfully' });
    } catch (err) {
      next(err);
    }
  },

  async deleteMediaItem(req, res, next) {
    try {
      const { mediaId } = req.params;
      await knex('gallery_media').where('id', Number(mediaId)).del();
      res.json({ success: true, message: 'Media deleted successfully' });
    } catch (err) {
      next(err);
    }
  },

  // --- Communication Dashboard & Monitoring ---
  async getDashboardSummary(req, res, next) {
    try {
      const { branch_id, academic_year_id } = req.query;
      const bId = branch_id && branch_id !== 'all' ? Number(branch_id) : null;
      const ayId = academic_year_id && academic_year_id !== 'all' ? Number(academic_year_id) : null;

      // 1. Homework counts
      let hwQ = knex('homework as h')
        .leftJoin('sections as s', 'h.section_id', 's.id');
      if (bId) hwQ = hwQ.where('h.branch_id', bId);
      if (ayId) hwQ = hwQ.where('s.academic_year_id', ayId);
      const hwTotal = await hwQ.clone().select(sutando.connection().raw('count(*) as cnt')).first();
      const hwPublished = await hwQ.clone().where('h.status', 'Published').select(sutando.connection().raw('count(*) as cnt')).first();
      const hwDraft = await hwQ.clone().where('h.status', 'Draft').select(sutando.connection().raw('count(*) as cnt')).first();
      const hwScheduled = await hwQ.clone().where('h.is_scheduled', 1).select(sutando.connection().raw('count(*) as cnt')).first();

      // 2. Assignment counts
      let asgnQ = knex('assignments');
      if (bId) asgnQ = asgnQ.where('branch_id', bId);
      if (ayId) asgnQ = asgnQ.where('academic_year_id', ayId);
      const asgnTotal = await asgnQ.clone().select(sutando.connection().raw('count(*) as cnt')).first();
      const asgnOnline = await asgnQ.clone().where('submission_type', 'Online').select(sutando.connection().raw('count(*) as cnt')).first();
      const asgnOffline = await asgnQ.clone().where('submission_type', 'Offline').select(sutando.connection().raw('count(*) as cnt')).first();
      const asgnScheduled = await asgnQ.clone().where('is_scheduled', 1).select(sutando.connection().raw('count(*) as cnt')).first();

      // 3. Announcement counts
      let annQ = knex('announcements');
      if (bId) annQ = annQ.where('branch_id', bId);
      if (ayId) annQ = annQ.where('academic_year_id', ayId);
      const annTotal = await annQ.clone().select(sutando.connection().raw('count(*) as cnt')).first();
      const annPublished = await annQ.clone().where('status', 'Published').select(sutando.connection().raw('count(*) as cnt')).first();
      const annScheduled = await annQ.clone().where('is_scheduled', 1).select(sutando.connection().raw('count(*) as cnt')).first();

      // 4. Gallery Albums
      let albQ = knex('gallery_albums');
      if (bId) albQ = albQ.where('branch_id', bId);
      if (ayId) albQ = albQ.where('academic_year_id', ayId);
      const albTotal = await albQ.clone().select(sutando.connection().raw('count(*) as cnt')).first();
      const albPublished = await albQ.clone().where('status', 'Published').select(sutando.connection().raw('count(*) as cnt')).first();
      const albScheduled = await albQ.clone().where('is_scheduled', 1).select(sutando.connection().raw('count(*) as cnt')).first();

      res.json({
        success: true,
        homework: {
          total: hwTotal?.cnt || 0,
          published: hwPublished?.cnt || 0,
          draft: hwDraft?.cnt || 0,
          scheduled: hwScheduled?.cnt || 0
        },
        assignment: {
          total: asgnTotal?.cnt || 0,
          online: asgnOnline?.cnt || 0,
          offline: asgnOffline?.cnt || 0,
          scheduled: asgnScheduled?.cnt || 0
        },
        announcement: {
          total: annTotal?.cnt || 0,
          published: annPublished?.cnt || 0,
          scheduled: annScheduled?.cnt || 0,
          urgent: 0
        },
        gallery: {
          total_albums: albTotal?.cnt || 0,
          published: albPublished?.cnt || 0,
          scheduled: albScheduled?.cnt || 0
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async getHomeworkMonitoring(req, res, next) {
    try {
      const { branch_id, academic_year_id } = req.query;
      let query = knex('homework as h')
        .leftJoin('classes as c', 'h.class_id', 'c.id')
        .leftJoin('sections as s', 'h.section_id', 's.id')
        .leftJoin('subjects as sub', 'h.subject_id', 'sub.id');

      if (branch_id && branch_id !== 'all') query = query.where('h.branch_id', Number(branch_id));
      if (academic_year_id && academic_year_id !== 'all' && !isNaN(Number(academic_year_id))) {
        query = query.where('s.academic_year_id', Number(academic_year_id));
      }

      const rows = await query
        .groupBy('h.class_id', 'h.section_id', 'c.class_name', 's.section_name')
        .select(
          'c.class_name',
          's.section_name',
          sutando.connection().raw('COUNT(h.id) as homework_count'),
          sutando.connection().raw("GROUP_CONCAT(DISTINCT COALESCE(sub.subject_name, h.subject_name) SEPARATOR ', ') as subjects_covered")
        )
        .orderBy('c.class_name', 'asc');

      res.json({ success: true, data: rows });
    } catch (err) {
      next(err);
    }
  },

  async getAssignmentMonitoring(req, res, next) {
    try {
      const { branch_id, academic_year_id } = req.query;
      let query = knex('assignments as a')
        .leftJoin('classes as c', 'a.class_id', 'c.id')
        .leftJoin('sections as s', 'a.section_id', 's.id');

      if (branch_id && branch_id !== 'all') query = query.where('a.branch_id', Number(branch_id));
      if (academic_year_id && academic_year_id !== 'all' && !isNaN(Number(academic_year_id))) {
        query = query.where('a.academic_year_id', Number(academic_year_id));
      }

      const rows = await query
        .select('a.id', 'a.title', 'a.due_date', 'a.submission_type', 'a.class_id', 'a.section_id', 'c.class_name', 's.section_name')
        .orderBy('a.id', 'desc')
        .limit(10);

      const formatted = await Promise.all(rows.map(async (asgn) => {
        let stuQ = knex('students').where('status', 'Active');
        if (asgn.class_id) stuQ = stuQ.where('class_id', asgn.class_id);
        if (asgn.section_id) stuQ = stuQ.where('section_id', asgn.section_id);
        const targetCnt = await stuQ.select(sutando.connection().raw('count(*) as cnt')).first();

        const submittedCnt = await knex('assignment_submissions')
          .where('assignment_id', asgn.id)
          .whereIn('submission_status', ['Submitted', 'Late Submitted', 'Reviewed', 'Completed'])
          .select(sutando.connection().raw('count(*) as cnt')).first();

        const reviewedCnt = await knex('assignment_submissions')
          .where('assignment_id', asgn.id)
          .whereIn('submission_status', ['Reviewed', 'Completed'])
          .select(sutando.connection().raw('count(*) as cnt')).first();

        return {
          ...asgn,
          total_targeted_students: targetCnt?.cnt || 0,
          submitted_count: submittedCnt?.cnt || 0,
          reviewed_count: reviewedCnt?.cnt || 0
        };
      }));

      res.json({ success: true, data: formatted });
    } catch (err) {
      next(err);
    }
  },

  // --- Student / Parent Portal Feed Simulation ---
  async getStudentPortalFeed(req, res, next) {
    try {
      const { student_id, academic_year_id } = req.query;
      const sId = Number(student_id);

      if (!sId) {
        return res.status(400).json({ success: false, message: 'student_id is required' });
      }

      // 1. Fetch Student profile with user join for full student name
      const student = await knex('students as st')
        .leftJoin('users as u', 'st.user_id', 'u.id')
        .leftJoin('classes as c', 'st.class_id', 'c.id')
        .leftJoin('sections as s', 'st.section_id', 's.id')
        .leftJoin('branches as b', 'st.branch_id', 'b.id')
        .where('st.id', sId)
        .select(
          'st.*',
          sutando.connection().raw("COALESCE(u.name, CONCAT(COALESCE(st.first_name, ''), ' ', COALESCE(st.last_name, ''))) as full_name"),
          'c.class_name',
          's.section_name',
          'b.branch_name'
        )
        .first();

      if (!student) {
        return res.status(404).json({ success: false, message: 'Student record not found' });
      }

      // Extract first/last name if null
      if (!student.first_name && student.full_name) {
        const parts = student.full_name.trim().split(' ');
        student.first_name = parts[0] || 'Student';
        student.last_name = parts.slice(1).join(' ') || '';
      }
      student.admission_number = student.admission_number || student.admission_no || `#${student.id}`;

      const branchId = student.branch_id;
      const classId = student.class_id;
      const sectionId = student.section_id;
      const studentGender = student.gender || 'Male';

      // 2. Academic Groups the student belongs to
      const groupRows = await knex('academic_group_students')
        .where('student_id', sId)
        .select('academic_group_id');
      const studentGroupIds = new Set(groupRows.map(g => Number(g.academic_group_id)));

      // 2b. Fetch all assigned subjects for the student's class
      let assignedSubjects = [];
      if (classId) {
        assignedSubjects = await knex('class_subjects as cs')
          .where('cs.class_id', classId)
          .where('cs.status', 'Active')
          .select(
            'cs.id',
            'cs.subject_id',
            'cs.subject_name',
            'cs.subject_code',
            'cs.category_name',
            'cs.requirement',
            'cs.display_order'
          )
          .orderBy('cs.display_order', 'asc');
      }

      const now = new Date();

      // 3. Fetch Homework for student's class and section
      let hwQuery = knex('homework as h')
        .leftJoin('subjects as sub', 'h.subject_id', 'sub.id')
        .where('h.branch_id', branchId)
        .where(function() {
          this.where('h.class_id', classId).orWhereNull('h.class_id');
        })
        .where(function() {
          this.where('h.section_id', sectionId).orWhereNull('h.section_id');
        })
        .where(function() {
          this.where('h.is_scheduled', 0)
              .orWhere('h.start_at', '<=', now);
        })
        .select(
          'h.*',
          sutando.connection().raw('COALESCE(sub.subject_name, h.subject_name) as subject_name')
        )
        .orderBy('h.id', 'desc')
        .limit(20);

      const homeworkList = await hwQuery;

      // 4. Fetch Assignments for student's class and section + student's submission status
      let asgnQuery = knex('assignments as a')
        .leftJoin('subjects as sub', 'a.subject_id', 'sub.id')
        .where('a.branch_id', branchId)
        .where(function() {
          this.where('a.class_id', classId).orWhereNull('a.class_id');
        })
        .where(function() {
          this.where('a.section_id', sectionId).orWhereNull('a.section_id');
        })
        .where(function() {
          this.where('a.is_scheduled', 0)
              .orWhere('a.start_at', '<=', now);
        })
        .select(
          'a.*',
          sutando.connection().raw('COALESCE(sub.subject_name, a.subject_name) as subject_name')
        )
        .orderBy('a.id', 'desc')
        .limit(20);

      const assignmentsList = await asgnQuery;

      // Attach student's specific submission record
      const formattedAssignments = await Promise.all(assignmentsList.map(async (asgn) => {
        const sub = await knex('assignment_submissions')
          .where('assignment_id', asgn.id)
          .where('student_id', sId)
          .first();

        let attsObj = null;
        if (asgn.attachments) {
          try { attsObj = typeof asgn.attachments === 'string' ? JSON.parse(asgn.attachments) : asgn.attachments; } catch(e) {}
        }

        return {
          ...asgn,
          attachments: attsObj,
          submission_status: sub ? sub.submission_status : 'Pending',
          marks_obtained: sub?.marks_obtained !== undefined ? sub.marks_obtained : null,
          grade: sub?.grade || null,
          remarks: sub?.remarks || null,
          feedback: sub?.feedback || null,
          submission_file_url: sub?.submission_file_url || null
        };
      }));

      // 5. Fetch Announcements targeted to this student
      let annQuery = knex('announcements as an')
        .where('an.branch_id', branchId)
        .where(function() {
          this.where('an.is_scheduled', 0)
              .orWhere('an.start_at', '<=', now);
        })
        .select('an.*')
        .orderBy('an.id', 'desc');

      const allAnnouncements = await annQuery;

      // Filter announcements matching student
      const matchingAnnouncements = allAnnouncements.filter(ann => {
        const scope = ann.target_audience;
        if (scope === 'All') return true;

        if (scope === 'Class') {
          return Number(ann.target_class_id) === Number(classId);
        }
        if (scope === 'Section') {
          return Number(ann.target_class_id) === Number(classId) && Number(ann.target_section_id) === Number(sectionId);
        }
        if (scope === 'Academic Group') {
          return studentGroupIds.has(Number(ann.target_group_id));
        }
        if (scope === 'Individual') {
          if (ann.target_student_id && Number(ann.target_student_id) === sId) return true;
          if (ann.target_student_ids) {
            try {
              const ids = JSON.parse(ann.target_student_ids);
              if (Array.isArray(ids) && ids.map(Number).includes(sId)) return true;
            } catch(e) {}
          }
          return false;
        }
        if (scope === 'Gender') {
          const matchGender = !ann.target_gender || ann.target_gender.toLowerCase() === studentGender.toLowerCase();
          if (!matchGender) return false;
          if (ann.target_class_ids) {
            try {
              const cIds = JSON.parse(ann.target_class_ids);
              if (Array.isArray(cIds) && cIds.length > 0 && !cIds.map(Number).includes(Number(classId))) return false;
            } catch(e) {}
          }
          return true;
        }
        if (scope === 'Residential') {
          const sResType = student.residential_type || 'Day Scholar';
          const matchRes = !ann.target_residential_type || ann.target_residential_type.toLowerCase() === sResType.toLowerCase();
          if (!matchRes) return false;
          if (ann.target_class_ids) {
            try {
              const cIds = JSON.parse(ann.target_class_ids);
              if (Array.isArray(cIds) && cIds.length > 0 && !cIds.map(Number).includes(Number(classId))) return false;
            } catch(e) {}
          }
          return true;
        }
        return true;
      });

      // 6. Fetch Gallery Albums targeted to this student
      let albQuery = knex('gallery_albums as alb')
        .where('alb.branch_id', branchId)
        .where(function() {
          this.where('alb.is_scheduled', 0)
              .orWhere('alb.start_at', '<=', now);
        })
        .select('alb.*')
        .orderBy('alb.id', 'desc');

      const allAlbums = await albQuery;

      const matchingAlbums = allAlbums.filter(alb => {
        const scope = alb.visibility;
        if (scope === 'All') return true;
        if (scope === 'Class') {
          return Number(alb.target_class_id) === Number(classId);
        }
        if (scope === 'Section') {
          return Number(alb.target_class_id) === Number(classId) && Number(alb.target_section_id) === Number(sectionId);
        }
        if (scope === 'Academic Group') {
          return studentGroupIds.has(Number(alb.target_group_id));
        }
        if (scope === 'Individual') {
          if (alb.target_student_id && Number(alb.target_student_id) === sId) return true;
          if (alb.target_student_ids) {
            try {
              const ids = JSON.parse(alb.target_student_ids);
              if (Array.isArray(ids) && ids.map(Number).includes(sId)) return true;
            } catch(e) {}
          }
          return false;
        }
        if (scope === 'Gender') {
          const matchGender = !alb.target_gender || alb.target_gender.toLowerCase() === studentGender.toLowerCase();
          if (!matchGender) return false;
          if (alb.target_class_ids) {
            try {
              const cIds = JSON.parse(alb.target_class_ids);
              if (Array.isArray(cIds) && cIds.length > 0 && !cIds.map(Number).includes(Number(classId))) return false;
            } catch(e) {}
          }
          return true;
        }
        if (scope === 'Residential') {
          const sResType = student.residential_type || 'Day Scholar';
          const matchRes = !alb.target_residential_type || alb.target_residential_type.toLowerCase() === sResType.toLowerCase();
          if (!matchRes) return false;
          if (alb.target_class_ids) {
            try {
              const cIds = JSON.parse(alb.target_class_ids);
              if (Array.isArray(cIds) && cIds.length > 0 && !cIds.map(Number).includes(Number(classId))) return false;
            } catch(e) {}
          }
          return true;
        }
        return true;
      });

      res.json({
        success: true,
        student,
        assigned_subjects: assignedSubjects,
        homework: homeworkList.map(h => {
          let attsObj = null;
          if (h.attachments) {
            try { attsObj = typeof h.attachments === 'string' ? JSON.parse(h.attachments) : h.attachments; } catch(e) {}
          }
          return { ...h, attachments: attsObj };
        }),
        assignments: formattedAssignments,
        announcements: matchingAnnouncements.map(a => {
          let attsObj = null;
          if (a.attachments) {
            try { attsObj = typeof a.attachments === 'string' ? JSON.parse(a.attachments) : a.attachments; } catch(e) {}
          }
          return { ...a, attachments: attsObj };
        }),
        albums: matchingAlbums.map(alb => {
          let attsObj = null;
          if (alb.attachments) {
            try { attsObj = typeof alb.attachments === 'string' ? JSON.parse(alb.attachments) : alb.attachments; } catch(e) {}
          }
          return { ...alb, attachments: attsObj };
        })
      });
    } catch (err) {
      next(err);
    }
  },

  // --- Audit History Endpoint ---
  async getAuditHistory(req, res, next) {
    try {
      const { branch_id, academic_year_id, module, activity_type, limit = 50 } = req.query;
      let query = knex('communication_audit_logs');

      if (branch_id && branch_id !== 'all') {
        query = query.where('branch_id', Number(branch_id));
      }
      if (academic_year_id && academic_year_id !== 'all' && !isNaN(Number(academic_year_id))) {
        query = query.where(function() {
          this.where('academic_year_id', Number(academic_year_id))
              .orWhereNull('academic_year_id');
        });
      }

      const mod = module || activity_type;
      if (mod && mod !== 'all') {
        query = query.where('module_name', mod);
      }

      const logs = await query
        .orderBy('id', 'desc')
        .limit(Number(limit) || 50);

      const formatted = logs.map(l => ({
        id: l.id,
        branch_id: l.branch_id,
        academic_year_id: l.academic_year_id,
        module_name: l.module_name,
        action: l.action,
        details: l.details,
        user_id: l.user_id,
        ip_address: l.ip_address,
        created_at: l.created_at ? new Date(l.created_at).toLocaleString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
          hour: '2-digit', minute: '2-digit', hour12: true
        }) : new Date().toLocaleString()
      }));

      res.json({ success: true, data: formatted, logs: formatted });
    } catch (err) {
      next(err);
    }
  },

  // --- Live Multi-Module Feeds for All Classes ---
  async getClassModuleFeeds(req, res, next) {
    try {
      const { branch_id, academic_year_id, class_id, module } = req.query;
      const feeds = [];

      // 1. Attendance Feeds
      if (!module || module === 'all' || module === 'attendance') {
        try {
          let attQ = knex('attendance as a')
            .leftJoin('classes as c', 'a.class_id', 'c.id')
            .leftJoin('sections as s', 'a.section_id', 's.id');

          if (branch_id && branch_id !== 'all') attQ = attQ.where('a.branch_id', Number(branch_id));
          if (academic_year_id && academic_year_id !== 'all' && !isNaN(Number(academic_year_id))) {
            attQ = attQ.where('a.academic_year_id', Number(academic_year_id));
          }
          if (class_id && class_id !== 'all') {
            attQ = attQ.where('a.class_id', Number(class_id));
          }

          const attStats = await attQ
            .groupBy('a.date', 'a.class_id', 'a.section_id', 'c.class_name', 's.section_name')
            .select(
              'a.date',
              'a.class_id',
              'a.section_id',
              'c.class_name',
              's.section_name',
              sutando.connection().raw('COUNT(*) as total_students'),
              sutando.connection().raw("SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) as present_count"),
              sutando.connection().raw("SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) as absent_count"),
              sutando.connection().raw("SUM(CASE WHEN a.status LIKE '%Half Day%' THEN 1 ELSE 0 END) as half_day_count"),
              sutando.connection().raw('MAX(a.updated_at) as last_updated')
            )
            .orderBy('a.date', 'desc')
            .orderBy('last_updated', 'desc')
            .limit(15);

          attStats.forEach(item => {
            const pct = item.total_students > 0 ? Math.round((item.present_count / item.total_students) * 100) : 0;
            feeds.push({
              id: `att-${item.date}-${item.class_id}-${item.section_id || 0}`,
              module: 'Attendance',
              title: `${item.class_name || 'Class ' + item.class_id} ${item.section_name ? `(${item.section_name})` : ''} Roll Call Completed`,
              description: `Daily roll-call recorded: ${item.present_count} present, ${item.absent_count} absent out of ${item.total_students} students (${pct}% attendance rate).`,
              class_id: item.class_id,
              class_name: item.class_name || `Class ${item.class_id}`,
              section_name: item.section_name || 'All',
              status: pct >= 90 ? 'High' : (pct >= 75 ? 'Normal' : 'Low Attendance'),
              badge_color: pct >= 90 ? 'emerald' : (pct >= 75 ? 'blue' : 'amber'),
              timestamp: item.last_updated || item.date,
              link: '/attendance/take_attendance'
            });
          });
        } catch (e) {
          console.error('Error fetching attendance feed:', e.message);
        }
      }

      // 2. Homework Feeds
      if (!module || module === 'all' || module === 'homework') {
        try {
          let hwQ = knex('homework as h')
            .leftJoin('classes as c', 'h.class_id', 'c.id')
            .leftJoin('sections as s', 'h.section_id', 's.id')
            .leftJoin('subjects as sub', 'h.subject_id', 'sub.id');

          if (branch_id && branch_id !== 'all') hwQ = hwQ.where('h.branch_id', Number(branch_id));
          if (class_id && class_id !== 'all') hwQ = hwQ.where('h.class_id', Number(class_id));

          const hwList = await hwQ
            .select(
              'h.id',
              'h.title',
              'h.description',
              'h.class_id',
              'h.due_date',
              'h.status',
              'h.created_at',
              'c.class_name',
              's.section_name',
              sutando.connection().raw('COALESCE(sub.subject_name, h.subject_name) as subject_name')
            )
            .orderBy('h.id', 'desc')
            .limit(15);

          hwList.forEach(hw => {
            feeds.push({
              id: `hw-${hw.id}`,
              module: 'Homework',
              title: `${hw.subject_name || 'Subject'}: ${hw.title}`,
              description: hw.description ? (hw.description.length > 90 ? hw.description.substring(0, 90) + '...' : hw.description) : 'Homework task assigned to class roster.',
              class_id: hw.class_id,
              class_name: hw.class_name || `Class ${hw.class_id}`,
              section_name: hw.section_name || 'All Sections',
              status: hw.status || 'Published',
              badge_color: 'indigo',
              due_date: hw.due_date,
              timestamp: hw.created_at,
              link: '/communication/homework'
            });
          });
        } catch (e) {
          console.error('Error fetching homework feed:', e.message);
        }
      }

      // 3. Announcements Feeds
      if (!module || module === 'all' || module === 'announcements') {
        try {
          let annQ = knex('announcements as a')
            .leftJoin('classes as c', 'a.target_class_id', 'c.id')
            .leftJoin('sections as s', 'a.target_section_id', 's.id');

          if (branch_id && branch_id !== 'all') annQ = annQ.where('a.branch_id', Number(branch_id));
          if (class_id && class_id !== 'all') {
            annQ = annQ.where(function() {
              this.where('a.target_audience', 'All')
                  .orWhere('a.target_class_id', Number(class_id));
            });
          }

          const annList = await annQ
            .select(
              'a.id',
              'a.title',
              'a.message',
              'a.target_audience',
              'a.target_class_id as class_id',
              'a.priority',
              'a.status',
              'a.created_at',
              'c.class_name',
              's.section_name'
            )
            .orderBy('a.id', 'desc')
            .limit(12);

          annList.forEach(ann => {
            feeds.push({
              id: `ann-${ann.id}`,
              module: 'Announcements',
              title: ann.title,
              description: ann.message ? (ann.message.length > 90 ? ann.message.substring(0, 90) + '...' : ann.message) : 'Important circular published.',
              class_id: ann.class_id,
              class_name: ann.target_audience === 'All' ? 'All Classes' : (ann.class_name || `Class ${ann.class_id}`),
              section_name: ann.section_name || 'All',
              status: ann.priority || 'Normal',
              badge_color: ann.priority === 'High' || ann.priority === 'Urgent' ? 'rose' : 'amber',
              timestamp: ann.created_at,
              link: '/communication/announcements'
            });
          });
        } catch (e) {
          console.error('Error fetching announcements feed:', e.message);
        }
      }

      // 4. Assignments Feeds
      if (!module || module === 'all' || module === 'assignments') {
        try {
          let asgQ = knex('assignments as a')
            .leftJoin('classes as c', 'a.class_id', 'c.id')
            .leftJoin('sections as s', 'a.section_id', 's.id')
            .leftJoin('subjects as sub', 'a.subject_id', 'sub.id');

          if (branch_id && branch_id !== 'all') asgQ = asgQ.where('a.branch_id', Number(branch_id));
          if (class_id && class_id !== 'all') asgQ = asgQ.where('a.class_id', Number(class_id));

          const asgList = await asgQ
            .select(
              'a.id',
              'a.title',
              'a.due_date',
              'a.submission_type',
              'a.class_id',
              'a.created_at',
              'c.class_name',
              's.section_name',
              sutando.connection().raw('COALESCE(sub.subject_name, a.subject_name) as subject_name')
            )
            .orderBy('a.id', 'desc')
            .limit(10);

          asgList.forEach(asg => {
            feeds.push({
              id: `asg-${asg.id}`,
              module: 'Assignments',
              title: `${asg.subject_name || 'Project'}: ${asg.title}`,
              description: `Assignment mode: ${asg.submission_type || 'Online'}. Due on ${asg.due_date || 'Schedule'}.`,
              class_id: asg.class_id,
              class_name: asg.class_name || `Class ${asg.class_id}`,
              section_name: asg.section_name || 'All',
              status: asg.submission_type || 'Active',
              badge_color: 'sky',
              due_date: asg.due_date,
              timestamp: asg.created_at,
              link: '/communication/assignments'
            });
          });
        } catch (e) {
          console.error('Error fetching assignments feed:', e.message);
        }
      }

      // 5. Examinations Feeds (from exam_term_structures or legacy exams)
      if (!module || module === 'all' || module === 'examinations') {
        try {
          const hasExamMarks = await knex.schema.hasTable('exam_marks_entries');
          if (hasExamMarks) {
            let examMarksQ = knex('exam_marks_entries as em')
              .leftJoin('classes as c', 'em.class_id', 'c.id')
              .leftJoin('subjects as sub', 'em.subject_id', 'sub.id');

            if (branch_id && branch_id !== 'all') examMarksQ = examMarksQ.where('em.branch_id', Number(branch_id));
            if (class_id && class_id !== 'all') examMarksQ = examMarksQ.where('em.class_id', Number(class_id));

            const examMarksSummary = await examMarksQ
              .groupBy('em.class_id', 'em.subject_id', 'c.class_name', 'sub.subject_name')
              .select(
                'em.class_id',
                'em.subject_id',
                'c.class_name',
                'sub.subject_name',
                sutando.connection().raw('COUNT(*) as total_graded'),
                sutando.connection().raw("SUM(CASE WHEN em.status = 'Submitted' THEN 1 ELSE 0 END) as submitted_count"),
                sutando.connection().raw('MAX(em.updated_at) as last_updated')
              )
              .orderBy('last_updated', 'desc')
              .limit(10);

            examMarksSummary.forEach(ex => {
              feeds.push({
                id: `exam-${ex.class_id}-${ex.subject_id}`,
                module: 'Examinations',
                title: `${ex.class_name || 'Class ' + ex.class_id}: ${ex.subject_name || 'Subject'} Marks Recorded`,
                description: `Evaluation in progress: ${ex.submitted_count} student marks recorded and submitted for grading.`,
                class_id: ex.class_id,
                class_name: ex.class_name || `Class ${ex.class_id}`,
                section_name: 'All',
                status: ex.submitted_count >= ex.total_graded ? 'Completed' : 'Evaluation Open',
                badge_color: 'purple',
                timestamp: ex.last_updated,
                link: '/examination'
              });
            });
          }
        } catch (e) {
          // ignore if table doesn't exist
        }
      }

      // Sort all unified feeds chronologically by timestamp (newest first)
      feeds.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

      res.json({
        success: true,
        data: feeds,
        count: feeds.length
      });
    } catch (err) {
      next(err);
    }
  }
};

export default communicationController;

