import { sutando } from '../config/database.js';

export const calendarController = {
  // GET /api/calendar/events
  async getEvents(req, res, next) {
    try {
      const conn = sutando.connection();
      const { 
        branch_id = 1, 
        academic_year_id = 2, 
        event_type, 
        month, 
        year, 
        class_id,
        section_id
      } = req.query;

      let query = `
        SELECT 
          id, branch_id, academic_year_id, title, description, event_type,
          DATE_FORMAT(start_date, '%Y-%m-%d') as start_date,
          DATE_FORMAT(end_date, '%Y-%m-%d') as end_date,
          is_holiday, school_closed, applicable_to, applicable_classes, applicable_sections,
          attachments, color_code, is_published, created_at
        FROM academic_calendar_events
        WHERE branch_id = ? AND academic_year_id = ?
      `;
      const params = [Number(branch_id), Number(academic_year_id)];

      if (event_type && event_type !== 'all') {
        query += ' AND event_type = ?';
        params.push(event_type);
      }

      if (month && year) {
        query += ' AND (MONTH(start_date) = ? OR MONTH(end_date) = ?) AND (YEAR(start_date) = ? OR YEAR(end_date) = ?)';
        params.push(Number(month), Number(month), Number(year), Number(year));
      }

      query += ' ORDER BY start_date ASC';

      const [events] = await conn.raw(query, params);

      // Parse applicable_classes and applicable_sections JSON if needed
      const formatted = events.map(e => {
        let classes = [];
        if (e.applicable_classes) {
          try {
            classes = typeof e.applicable_classes === 'string' ? JSON.parse(e.applicable_classes) : e.applicable_classes;
          } catch (err) {
            classes = [];
          }
        }
        let sections = [];
        if (e.applicable_sections) {
          try {
            sections = typeof e.applicable_sections === 'string' ? JSON.parse(e.applicable_sections) : e.applicable_sections;
          } catch (err) {
            sections = [];
          }
        }
        let attachments = [];
        if (e.attachments) {
          try {
            attachments = typeof e.attachments === 'string' ? JSON.parse(e.attachments) : e.attachments;
          } catch (err) {
            attachments = [];
          }
        }
        return {
          ...e,
          is_holiday: Boolean(e.is_holiday),
          school_closed: Boolean(e.school_closed),
          is_published: Boolean(e.is_published),
          applicable_classes: classes,
          applicable_sections: sections,
          attachments: Array.isArray(attachments) ? attachments : []
        };
      });

      // Filter by class_id and section_id if requested (used for student view)
      let finalEvents = formatted;
      if (class_id && class_id !== 'all') {
        const clsId = Number(class_id);
        const secId = section_id ? Number(section_id) : null;
        finalEvents = formatted.filter(e => {
          if (e.applicable_to === 'all') return true;
          const matchClass = Array.isArray(e.applicable_classes) && e.applicable_classes.includes(clsId);
          if (!matchClass) return false;
          // If event has specific sections defined and student has section_id
          if (Array.isArray(e.applicable_sections) && e.applicable_sections.length > 0 && secId) {
            return e.applicable_sections.includes(secId);
          }
          return true;
        });
      }

      res.json({
        success: true,
        data: finalEvents
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/calendar/events
  async createEvent(req, res, next) {
    try {
      const conn = sutando.connection();
      const {
        branch_id = 1,
        academic_year_id = 2,
        title,
        description = '',
        event_type = 'school_event',
        start_date,
        end_date,
        is_holiday = false,
        school_closed = false,
        applicable_to = 'all',
        applicable_classes = [],
        applicable_sections = [],
        attachments = [],
        color_code
      } = req.body;

      if (!title || !start_date) {
        return res.status(400).json({ success: false, message: 'Title and start date are required.' });
      }

      const effEndDate = end_date || start_date;
      const isHol = is_holiday || event_type === 'public_holiday' || event_type === 'school_holiday';
      const isClosed = school_closed || event_type === 'public_holiday' || event_type === 'school_holiday';

      // Default color codes by event_type
      let defaultColor = color_code;
      if (!defaultColor) {
        switch (event_type) {
          case 'public_holiday': defaultColor = '#ef4444'; break;
          case 'school_holiday': defaultColor = '#f97316'; break;
          case 'exam': defaultColor = '#8b5cf6'; break;
          case 'academic_milestone': defaultColor = '#10b981'; break;
          default: defaultColor = '#3b82f6'; break;
        }
      }

      const classesJson = Array.isArray(applicable_classes) ? JSON.stringify(applicable_classes) : null;
      const sectionsJson = Array.isArray(applicable_sections) ? JSON.stringify(applicable_sections) : null;
      const attachmentsJson = Array.isArray(attachments) ? JSON.stringify(attachments) : null;

      await conn.raw(`
        INSERT INTO academic_calendar_events (
          branch_id, academic_year_id, title, description, event_type,
          start_date, end_date, is_holiday, school_closed, applicable_to,
          applicable_classes, applicable_sections, attachments, color_code, is_published
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        branch_id,
        academic_year_id,
        title.trim(),
        description ? description.trim() : null,
        event_type,
        start_date,
        effEndDate,
        isHol ? 1 : 0,
        isClosed ? 1 : 0,
        applicable_to,
        classesJson,
        sectionsJson,
        attachmentsJson,
        defaultColor,
        1
      ]);

      res.json({ success: true, message: 'Calendar event created successfully!' });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/calendar/events/:id
  async updateEvent(req, res, next) {
    try {
      const conn = sutando.connection();
      const { id } = req.params;
      const {
        title,
        description,
        event_type,
        start_date,
        end_date,
        is_holiday,
        school_closed,
        applicable_to,
        applicable_classes,
        applicable_sections,
        attachments,
        color_code
      } = req.body;

      const effEndDate = end_date || start_date;
      const isHol = is_holiday || event_type === 'public_holiday' || event_type === 'school_holiday';
      const isClosed = school_closed || event_type === 'public_holiday' || event_type === 'school_holiday';
      const classesJson = Array.isArray(applicable_classes) ? JSON.stringify(applicable_classes) : null;
      const sectionsJson = Array.isArray(applicable_sections) ? JSON.stringify(applicable_sections) : null;
      const attachmentsJson = Array.isArray(attachments) ? JSON.stringify(attachments) : (attachments !== undefined ? JSON.stringify([]) : null);

      await conn.raw(`
        UPDATE academic_calendar_events SET
          title = COALESCE(?, title),
          description = ?,
          event_type = COALESCE(?, event_type),
          start_date = COALESCE(?, start_date),
          end_date = COALESCE(?, end_date),
          is_holiday = ?,
          school_closed = ?,
          applicable_to = COALESCE(?, applicable_to),
          applicable_classes = ?,
          applicable_sections = ?,
          attachments = COALESCE(?, attachments),
          color_code = COALESCE(?, color_code),
          updated_at = NOW()
        WHERE id = ?
      `, [
        title ? title.trim() : null,
        description !== undefined ? description : null,
        event_type,
        start_date,
        effEndDate,
        isHol ? 1 : 0,
        isClosed ? 1 : 0,
        applicable_to,
        classesJson,
        sectionsJson,
        attachmentsJson,
        color_code,
        id
      ]);

      res.json({ success: true, message: 'Calendar event updated successfully!' });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/calendar/events/:id
  async deleteEvent(req, res, next) {
    try {
      const conn = sutando.connection();
      const { id } = req.params;
      await conn.raw('DELETE FROM academic_calendar_events WHERE id = ?', [id]);
      res.json({ success: true, message: 'Event deleted successfully.' });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/calendar/upcoming
  async getUpcoming(req, res, next) {
    try {
      const conn = sutando.connection();
      const { branch_id = 1, academic_year_id = 2, class_id, section_id } = req.query;

      let query = `
        SELECT 
          id, title, description, event_type,
          DATE_FORMAT(start_date, '%Y-%m-%d') as start_date,
          DATE_FORMAT(end_date, '%Y-%m-%d') as end_date,
          is_holiday, school_closed, applicable_to, applicable_classes, applicable_sections,
          attachments, color_code
        FROM academic_calendar_events
        WHERE branch_id = ? AND academic_year_id = ? AND end_date >= CURDATE()
        ORDER BY start_date ASC
        LIMIT 10
      `;
      const [events] = await conn.raw(query, [Number(branch_id), Number(academic_year_id)]);

      const formatted = events.map(e => {
        let classes = [];
        if (e.applicable_classes) {
          try { classes = JSON.parse(e.applicable_classes); } catch (err) {}
        }
        let sections = [];
        if (e.applicable_sections) {
          try { sections = JSON.parse(e.applicable_sections); } catch (err) {}
        }
        let attachments = [];
        if (e.attachments) {
          try { attachments = JSON.parse(e.attachments); } catch (err) {}
        }
        return {
          ...e,
          is_holiday: Boolean(e.is_holiday),
          school_closed: Boolean(e.school_closed),
          applicable_classes: classes,
          applicable_sections: sections,
          attachments: Array.isArray(attachments) ? attachments : []
        };
      });

      let finalEvents = formatted;
      if (class_id && class_id !== 'all') {
        const clsId = Number(class_id);
        const secId = section_id ? Number(section_id) : null;
        finalEvents = formatted.filter(e => {
          if (e.applicable_to === 'all') return true;
          const matchClass = Array.isArray(e.applicable_classes) && e.applicable_classes.includes(clsId);
          if (!matchClass) return false;
          if (Array.isArray(e.applicable_sections) && e.applicable_sections.length > 0 && secId) {
            return e.applicable_sections.includes(secId);
          }
          return true;
        });
      }

      res.json({ success: true, data: finalEvents });
    } catch (err) {
      next(err);
    }
  }
};
