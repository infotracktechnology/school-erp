import { Model } from 'sutando';

export class TimetableClassMapping extends Model {
  table = 'timetable_class_mappings';

  // updated_at column இல்லாததால்
  static UPDATED_AT = null;

  structure() {
    return this.belongsTo('TimetableStructure', 'structure_id');
  }

  class() {
    return this.belongsTo('ClassModel', 'class_id');
  }

  section() {
    return this.belongsTo('Section', 'section_id');
  }
}

export default TimetableClassMapping;