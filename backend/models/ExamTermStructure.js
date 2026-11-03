import { Model } from 'sutando';

export class ExamTermStructure extends Model {
  table = 'exam_term_structures';

  casts = {
    is_active: 'boolean',
  };

  branch() {
    return this.belongsTo('Branch', 'branch_id');
  }

  academicYear() {
    return this.belongsTo('AcademicYear', 'academic_year_id');
  }

  terms() {
    return this.hasMany('ExamTerm', 'structure_id');
  }

  structureClasses() {
    return this.hasMany('ExamTermStructureClass', 'structure_id');
  }
}

export default ExamTermStructure;