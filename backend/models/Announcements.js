import { Model } from 'sutando';

export class Announcements extends Model {
  table = 'announcements';

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

export default Announcements;
