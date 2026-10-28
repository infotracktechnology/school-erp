import { Model } from 'sutando';

export class Organization extends Model {
  table = 'organizations';

  branches() {
    return this.hasMany('Branch', 'organization_id');
  }
}

export default Organization;
