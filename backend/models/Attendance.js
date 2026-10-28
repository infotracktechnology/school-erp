import { Model } from 'sutando';

export class Attendance extends Model {
  table = 'attendance';

  student() {
    return this.belongsTo('Student', 'student_id');
  }
}

export default Attendance;
