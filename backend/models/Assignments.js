import { Model } from 'sutando';

export class Assignments extends Model {
  table = 'assignments';

  branch() {
    return this.belongsTo('Branch', 'branch_id');
  }
   class() {
    return this.belongsTo('ClassModel', 'class_id');
  }
  section() {
    return this.belongsTo('Section', 'section_id');
  }
  subject() {
    return this.belongsTo('Subject', 'subject_id');
  }
  studentlits(){
    return [];
  }
}

export default Assignments;
