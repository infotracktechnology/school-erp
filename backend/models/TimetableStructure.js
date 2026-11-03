import { Model } from 'sutando';

export class TimetableStructure extends Model {
  table = 'timetable_structures';

  // JSON மற்றும் Boolean வகைகளுக்கான Casts
  casts = {
    working_days: 'json',
    is_active: 'boolean',
  };

  branch() {
    return this.belongsTo('Branch', 'branch_id');
  }

  academicYear() {
    return this.belongsTo('AcademicYear', 'academic_year_id');
  }

  periods() {
    return this.hasMany('TimetablePeriod', 'structure_id');
  }

  classMappings() {
    return this.hasMany('TimetableClassMapping', 'structure_id');
  }
}

export default TimetableStructure;