import { Model } from 'sutando';

export class ClassModel extends Model {
  table = 'classes';


  branch() {
    return this.belongsTo('Branch', 'branch_id');
  }

  academicYear() {
    return this.belongsTo('AcademicYear', 'academic_year_id');
  }

  students() {
    return this.hasMany('Student', 'class_id');
  }

  sections() {
    return this.belongsToMany('Section', 'class_sections', 'class_id', 'section_id');
  }
}

export default ClassModel;
