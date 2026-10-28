import { Model } from 'sutando';

export class Communication extends Model {
  table = 'communications';

  branch() {
    return this.belongsTo('Branch', 'branch_id');
  }
}

export default Communication;
