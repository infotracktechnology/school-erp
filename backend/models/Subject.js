import { Model } from 'sutando';

export class Subject extends Model {
  table = 'subjects';

  branch() {
    return this.belongsTo('Branch', 'branch_id');
  }
}

export default Subject;
