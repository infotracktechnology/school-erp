import { Model } from 'sutando';

export class TimetableSubjectMapping extends Model {
  table = 'timetable_subject_mappings';

  casts = {
    weekly_periods: 'integer',
  };

  branch() {
    return this.belongsTo('Branch', 'branch_id');
  }

  academicYear() {
    return this.belongsTo('AcademicYear', 'academic_year_id');
  }

  class() {
    return this.belongsTo('Class', 'class_id');
  }

  section() {
    return this.belongsTo('Section', 'section_id');
  }

  subject() {
    return this.belongsTo('Subject', 'subject_id');
  }

  teacher() {
    return this.belongsTo('Teacher', 'teacher_id');
  }
}

export default TimetableSubjectMapping;