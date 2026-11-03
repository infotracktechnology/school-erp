import { Model } from 'sutando';

export class ExamTerm extends Model {
  table = 'exam_terms';

  casts = {
    weightage_percent: 'float',
    is_selected: 'boolean',
    display_order: 'integer',
    from_date: 'date',
    to_date: 'date',
  };

  structure() {
    return this.belongsTo('ExamTermStructure', 'structure_id');
  }
}

export default ExamTerm;