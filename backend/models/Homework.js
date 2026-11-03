import { Model } from 'sutando';

export class Homework extends Model {
  table = 'homework';

  branch() {
    return this.belongsTo('Branch', 'branch_id');
  }
   class() {
    return this.belongsTo('Class', 'class_id');
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

export default Homework;
