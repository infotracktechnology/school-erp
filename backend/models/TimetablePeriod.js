import { Model } from 'sutando';

export class TimetablePeriod extends Model {
  table = 'timetable_periods';

  casts = {
    display_order: 'integer',
  };

  structure() {
    return this.belongsTo('TimetableStructure', 'structure_id');
  }

  slots() {
    return this.hasMany('TimetableSlot', 'period_id');
  }
}

export default TimetablePeriod;