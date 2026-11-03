import { Model } from 'sutando';
// Import your related models (or keep strings if globally registered)
// import Branch from './Branch.js';
// import ClassModel from './ClassModel.js';
// import Section from './Section.js';

export class Student extends Model {
  table = 'students';

  casts = {
    fcm_tokens: 'json',
  };

  // 1. Prefix with "relation" so Sutando registers the relation "branch"
  relationBranch() {
    return this.belongsTo('Branch', 'branch_id');
  }

  relationAcademicYear() {
    return this.belongsTo('AcademicYear', 'academic_year_id');
  }

  // 2. Prefix with "relation" so Sutando registers the relation "class"
  relationClass() {
    return this.belongsTo('ClassModel', 'class_id');
  }

  // 3. Prefix with "relation" so Sutando registers the relation "section"
  relationSection() {
    return this.belongsTo('Section', 'section_id');
  }

  relationAttendances() {
    return this.hasMany('Attendance', 'student_id');
  }
}

export default Student;