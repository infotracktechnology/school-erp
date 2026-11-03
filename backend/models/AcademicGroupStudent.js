import { Model } from 'sutando';

export class AcademicGroupStudent extends Model {
  table = 'academic_group_students';

  group() {
    return this.belongsTo('AcademicGroup', 'academic_group_id');
  }

  student() {
    return this.belongsTo('Student', 'student_id');
  }
}

export default AcademicGroupStudent;