import { Model } from 'sutando';

export class AcademicGroup extends Model {
  table = 'academic_groups';

  branch() {
    return this.belongsTo('Branch', 'branch_id');
  }

  academicYear() {
    return this.belongsTo('AcademicYear', 'academic_year_id');
  }

  // Pivot mapping records
  groupStudents() {
    return this.hasMany('AcademicGroupStudent', 'academic_group_id');
  }

  // Direct Many-to-Many relationship with Student model
  students() {
    return this.belongsToMany(
      'Student',
      'academic_group_students',
      'academic_group_id',
      'student_id'
    );
  }
}

export default AcademicGroup;