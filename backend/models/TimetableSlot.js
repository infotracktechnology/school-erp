import { Model } from 'sutando';

export class TimetableSlot extends Model {
  table = 'timetable_slots';

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

  period() {
    return this.belongsTo('TimetablePeriod', 'period_id');
  }

  subject() {
    return this.belongsTo('Subject', 'subject_id');
  }

  teacher() {
    return this.belongsTo('Teacher', 'teacher_id'); // அல்லது 'Staff' / 'User'
  }
}

export default TimetableSlot;