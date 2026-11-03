import { Model } from 'sutando';

export class AcademicYear extends Model {
  table = 'academic_years';

  branch() {
    return this.belongsTo('Branch', 'branch_id');
  }

  classes() {
    return this.hasMany('ClassModel', 'academic_year_id');
  }

  students() {
    return this.hasMany('Student', 'academic_year_id');
  }
}

export default AcademicYear;
