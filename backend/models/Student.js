import { Model } from 'sutando';

export class Student extends Model {
  table = 'students';

  casts = {
    fcm_tokens: 'json',
  };

  branch() {
    return this.belongsTo('Branch', 'branch_id');
  }

  academicYear() {
    return this.belongsTo('AcademicYear', 'academic_year_id');
  }

  classmodel() {
    return this.belongsTo('ClassModel', 'class_id');
  }

  section() {
    return this.belongsTo('Section', 'section_id');
  }

  attendances() {
    return this.hasMany('Attendance', 'student_id');
  }
}

export default Student;
