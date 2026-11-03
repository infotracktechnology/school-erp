import { Model } from 'sutando';

export class ExamTermStructureClass extends Model {
  table = 'exam_term_structure_classes';

  // updated_at column இல்லாததால்
  static UPDATED_AT = null;

  structure() {
    return this.belongsTo('ExamTermStructure', 'structure_id');
  }

  class() {
    return this.belongsTo('ClassModel', 'class_id');
  }
}

export default ExamTermStructureClass;