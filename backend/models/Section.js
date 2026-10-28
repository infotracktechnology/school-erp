import { Model } from 'sutando';

export class Section extends Model {
  table = 'sections';

  branch() {
    return this.belongsTo('Branch', 'branch_id');
  }

  classes() {
    return this.belongsToMany('ClassModel', 'class_sections', 'section_id', 'class_id');
  }

  students() {
    return this.hasMany('Student', 'section_id');
  }
}

export default Section;
