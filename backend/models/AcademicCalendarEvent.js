import { Model } from 'sutando';

export class AcademicCalendarEvent extends Model {
  table = 'academic_calendar_events';

  casts = {
    is_holiday: 'boolean',
    school_closed: 'boolean',
    is_published: 'boolean',
    applicable_classes: 'json',
    applicable_sections: 'json',
    attachments: 'json',
    start_date: 'date',
    end_date: 'date',
  };

  branch() {
    return this.belongsTo('Branch', 'branch_id');
  }

  academicYear() {
    return this.belongsTo('AcademicYear', 'academic_year_id');
  }

  creator() {
    return this.belongsTo('Users', 'created_by');
  }
}

export default AcademicCalendarEvent;